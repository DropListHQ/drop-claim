import { ActionType } from 'typesafe-actions';
import * as actions from './actions'
import { TDropStep } from 'types'

export type TClaims = {[address: string]: { index: number, address: string, proof: string[], tokenId: string}}

export interface DropState {
  step: TDropStep,
  loading: boolean,
  chainId: number | null,
  tokenAddress: string | null,
  tokenId: string | null,
  amount: string | null,
  allowedAddressList: string[],
  title: string,
  dropAddress: string,
  proof: string[],
  index: number,
  hash: null | string,
  claims: TClaims,
  logoURL: string | null,
  maxSupply: string | null
}



export type DropActions = ActionType<typeof actions>;