
import { Dispatch } from 'redux';
import * as actionsDrop from './actions';
import * as actionsToken from '../token/actions';
import { DropActions } from './types';
import { TokenActions } from '../token/types';
import { getIPFSData, getERC1155TokenData } from 'data/api'
import { ethers } from 'ethers'
import { ERC1155Contract } from 'abi'
import { DropInterfaceERC1155, DropFactoryInterface } from '@drop-protocol/drop-sdk'
 import contracts from 'configs/contracts'
import { hexlifyIpfsHash } from 'helpers'

const ipfsGatewayUrl = 'https://gateway.pinata.cloud/ipfs/'

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
  const { chainId, tokenAddress, claims, title, logoURL, description } = data
  const contractData = contracts[chainId]

  const type = 'erc1155'

	const factoryAddress = contractData.factory
	const templateAddress = contractData[type]

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

  if (factoryAddress) {
    const factoryContractInstance = new ethers.Contract(factoryAddress, DropFactoryInterface, provider)
    dropAddress = await factoryContractInstance.getDrop(hexlifyIpfsHash(ipfs))
    dispatch(actionsDrop.setDropAddress(dropAddress))
  }

  dispatch(actionsDrop.setTitle(title))
  dispatch(actionsDrop.setDescription(description))
  dispatch(actionsDrop.setClaims(claims))
  dispatch(actionsDrop.setLogoURL(logoURL))

  if (claims[userAddress]) {
    const { amount, tokenId, proof, index } = claims[userAddress]
    const { name, image, description } = await getTokenData(provider, tokenAddress, tokenId)
    dispatch(actionsToken.setImage(redefineURL(image)))
    dispatch(actionsToken.setName(name))
    dispatch(actionsToken.setDescription(description))
    dispatch(actionsDrop.setAmount(amount))
    dispatch(actionsDrop.setTokenId(tokenId))
    dispatch(actionsDrop.setProof(proof))
    dispatch(actionsDrop.setIndex(index))
    if (dropAddress) {
      const dropContractInstance = new ethers.Contract(dropAddress, DropInterfaceERC1155, provider)
      
      const isClaimed = await dropContractInstance.isClaimed(index)
      console.log({ isClaimed })
      if (isClaimed) {
        dispatch(actionsDrop.setLoading(false))
        return dispatch(actionsDrop.setStep('claiming_finished'))
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
    contractInstance.on('ClaimedERC1155', (index: number, account: string, tokenId: string, amount: string, event: any) => { 
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
  address: string,
  tokenId: string,
  dropAddress: string,
  merkleProof: string[],
) {
  try {
    const contractInstanceProvider = new ethers.Contract(dropAddress, DropInterfaceERC1155, provider)
    dispatch(actionsDrop.setStep('claiming_process'))
    const hash = await claimTokens(provider, index, amount, address, tokenId, dropAddress, merkleProof)
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

const claimTokens = async (
  provider: any,
	index: number,
  amount: string,
  address: string,
  tokenId: string,
  dropAddress: string,
  merkleProof: string[],
) => {
  const signer = await provider.getSigner()
  const contractInstanceSigner = new ethers.Contract(dropAddress, DropInterfaceERC1155, signer)
  const result = await contractInstanceSigner.claim(index, address, tokenId, amount, merkleProof)
  const { hash } = result
  return hash
}