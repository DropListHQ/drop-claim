
import { Dispatch } from 'redux';
import * as actionsDrop from './actions';
import * as actionsToken from '../token/actions';


import { DropActions } from './types';
import { TokenActions } from '../token/types';
import { getIPFSData, getERC1155TokenData } from 'data/api'
import { ethers } from 'ethers'
import { ERC1155Contract, RetroDropContract, RetroDropFactory } from 'abi'
const ipfsGatewayUrl = 'https://gateway.pinata.cloud/ipfs/'
const { REACT_APP_FACTORY_ADDRESS, REACT_APP_TEMPLATE_ADDRESS } = process.env

export async function getData(
	dispatch: Dispatch<DropActions> & Dispatch<TokenActions>,
  provider: any,
	ipfs: string,
  userChainId: number,
  userAddress: string,
  history: any
) {
  dispatch(actionsDrop.setLoading(true))
  const { data } = await getIPFSData.get(ipfs)
  const { chainId, tokenAddress, claims, title, logoURL } = data
  const allowedAddressList = Object.keys(claims)
  dispatch(actionsDrop.setChainId(chainId))
  dispatch(actionsDrop.setTokenAddress(tokenAddress))
  dispatch(actionsDrop.setAllowedAddressList(allowedAddressList))
  
  

  if (chainId !== userChainId) {
    dispatch(actionsDrop.setLoading(false))
    return dispatch(actionsDrop.setStep('change_network'))
  }

  // if (!allowedAddressList.includes(userAddress)) {
  //   dispatch(actionsDrop.setLoading(false))
  //   return dispatch(actionsDrop.setStep('not_allowed'))
  // }

  let dropAddress: string = '' 

  if (REACT_APP_FACTORY_ADDRESS) {
    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ipfs))
    const factoryContractInstance = new ethers.Contract(REACT_APP_FACTORY_ADDRESS, RetroDropFactory, provider)
    dropAddress = await factoryContractInstance.predictDropAddress(REACT_APP_TEMPLATE_ADDRESS, salt)
    console.log({ dropAddress })
    dispatch(actionsDrop.setDropAddress(dropAddress))
  }

  dispatch(actionsDrop.setTitle(title))
  dispatch(actionsDrop.setClaims(claims))
  dispatch(actionsDrop.setLogoURL(logoURL))

  if (claims[userAddress]) {
    const { amount, tokenId, proof, index, maxSupply } = claims[userAddress]
    const { name, image, description } = await getTokenData(provider, tokenAddress, tokenId)
    dispatch(actionsToken.setImage(redefineURL(image)))
    dispatch(actionsToken.setName(name))
    dispatch(actionsToken.setDescription(description))
    dispatch(actionsDrop.setAmount(amount))
    dispatch(actionsDrop.setTokenId(tokenId))
    dispatch(actionsDrop.setProof(proof))
    dispatch(actionsDrop.setIndex(index))
    dispatch(actionsDrop.setMaxSupply(maxSupply))
    if (dropAddress) {
      const dropContractInstance = new ethers.Contract(dropAddress, RetroDropContract, provider)
      const isClaimed = await dropContractInstance.isClaimed(index)
      if (isClaimed) {
        dispatch(actionsDrop.setLoading(false))
        return dispatch(actionsDrop.setStep('claiming_finished'))
      }
      const claimStarted = await dropContractInstance.claimStartedForToken(tokenId)
      console.log({ claimStarted })
      if (claimStarted) {
        const tokensLeft = await dropContractInstance.tokensLeft(tokenId)
        if (tokensLeft < Number(amount)) {
          dispatch(actionsDrop.setLoading(false))
          // return dispatch(actionsDrop.setStep('no_tokens_left'))
          return history.push('/campaign-finished')
        }
      }
    }
  }

  dispatch(actionsDrop.setLoading(false))
  dispatch(actionsDrop.setStep('initial'))
}



type TTokenData = { name: string, image: string, description: string }
type TGetTokenData = (provider: any, tokenAddress: string, tokenId: string) => Promise<TTokenData>

const getTokenData: TGetTokenData = async (provider, tokenAddress, tokenId ) => {
  try {
    const contractInstance = await new ethers.Contract(tokenAddress, ERC1155Contract, provider)
    let actualUrl = await contractInstance.uri(tokenId)
    actualUrl = redefineURL(actualUrl)
    const tokenData = await getERC1155TokenData(actualUrl, tokenId)
    return tokenData.data
  } catch (e) {
    return { name: '', image: '', description: '' }
  }
}

const redefineURL = (url: string) => {
  if (url.startsWith('ipfs://')) {
    const urlParts = url.split('/')
    return `${ipfsGatewayUrl}/${urlParts[urlParts.length - 1]}`
  } else {
    return url
  }
}

const checkReceipt = async function (contractInstance: any, currentIndex: number): Promise<string> {
  return new Promise((resolve, reject) => {
    contractInstance.on('Claimed', (index: number, tokenId: string, amount: string, account: string, event: any) => { 
      if (currentIndex === Number(index)) {
        const { transactionHash } = event
        resolve(transactionHash)
      }
    })
  })
}

// const checkReceipt = async function (provider: any, hash: string): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     const interval = setInterval(async function () {
//       const receipt = await provider.getTransactionReceipt(hash)     
//       if (receipt && receipt.confirmations != null && receipt.confirmations > 0) {
//         clearInterval(interval)
//         resolve(true)
//       }
//     }, 3000)
//   })
// }

export async function claim(
	dispatch: Dispatch<DropActions> & Dispatch<TokenActions>,
  provider: any,
	index: number,
  amount: string,
  maxSupply: string,
  address: string,
  tokenId: string,
  dropAddress: string,
  merkleProof: string[],
) {
  console.log({ index, tokenId, amount, maxSupply, address, merkleProof })
  try {
    const signer = await provider.getSigner()
    const contractInstanceSigner = new ethers.Contract(dropAddress, RetroDropContract, signer)
    const contractInstanceProvider = new ethers.Contract(dropAddress, RetroDropContract, provider)
    console.log(contractInstanceSigner.claim)
    const result = await contractInstanceSigner.claim(index, tokenId, amount, maxSupply, address, merkleProof)
    dispatch(actionsDrop.setStep('claiming_process'))
    const { hash } = result
    dispatch(actionsDrop.setHash(hash))
    const updatedHash = await checkReceipt(contractInstanceProvider, index)
    if (updatedHash) {
      dispatch(actionsDrop.setHash(updatedHash))
      dispatch(actionsDrop.setStep('claiming_finished'))
    }
  } catch (err) {
    console.log(err)
  }
}