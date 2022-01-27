import { ERC1155Contract } from 'abi'
import { getERC1155TokenData } from 'data/api'
import { ethers } from 'ethers'
import { IPFSRedefineUrl } from 'helpers'

type TTokenERC1155Data = { name: string, image: string, description: string }
type TGetTokenERC1155Data = (provider: any, tokenAddress: string, tokenId: string) => Promise<TTokenERC1155Data>


const getTokenData: TGetTokenERC1155Data = async (provider, tokenAddress, tokenId ) => {
  try {
    const contractInstance = await new ethers.Contract(tokenAddress, ERC1155Contract, provider)
    let actualUrl = await contractInstance.uri(tokenId)
    actualUrl = IPFSRedefineUrl(actualUrl)
    const tokenData = await getERC1155TokenData(actualUrl, tokenId)
    return tokenData.data
  } catch (e) {
    return { name: '', image: '', description: '' }
  }
}

export default getTokenData