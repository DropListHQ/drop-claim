import React, { FC, ReactElement } from 'react'
import { TokenImage } from 'components/common'
import { Title, ScreenButton, TextComponent, IconComponent } from './styled-components'
import { shortenString } from 'helpers'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import { DropActions } from 'data/store/reducers/drop/types'
import { TokenActions } from 'data/store/reducers/token/types'
import * as dropAsyncActions from 'data/store/reducers/drop/async-actions'
import { Dispatch } from 'redux';
import * as dropActions from 'data/store/reducers/drop/actions'
import { TDropStep } from 'types'

const mapStateToProps = ({
  token: { name, image },
  user: { address, provider },
  drop: { proof, tokenId, amount, dropAddress, index, allowedAddressList, logoURL, maxSupply }
}: RootState) => ({
  name, image, address, proof, tokenId, amount, dropAddress, provider, index, allowedAddressList, logoURL, maxSupply
})

const mapDispatcherToProps = (dispatch: Dispatch<DropActions> & Dispatch<TokenActions>) => {
  return {
      claim: (
        address: string,
        proof: string[],
        tokenId: string,
        amount: string,
        maxSupply: string,
        dropAddress: string,
        provider: any,
        index: number
      ) => dropAsyncActions.claim(
        dispatch,
        provider,
        index,
        amount,
        maxSupply,
        address,
        tokenId,
        dropAddress,
        proof
      ),
      stepStep: (step: TDropStep) => dispatch(dropActions.setStep(step))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> 


type TDefineTitle = (tokenName: string, address: string, allowed: boolean) => ReactElement 
const defineTitle: TDefineTitle = (tokenName, address, allowed) => {
  const addressShorten = shortenString(address)
  if (address && allowed) {
    return <Title>Claim <strong>{tokenName}</strong> to address: <span>{addressShorten}</span></Title>
  }
  if (address && !allowed) {
    return <Title>⚠️ You are not eligible to claim this drop ⚠️<br/>to address: <span>{addressShorten}</span></Title>
  }
  if (!address && !allowed) {
    return <Title>⚠️ You are not eligible to claim this drop ⚠️</Title>
  }
  return <Title>Claim {tokenName}</Title>
}

const InitialScreen: FC<ReduxType> = ({ name, maxSupply, allowedAddressList, logoURL, image, address, proof, tokenId, amount, dropAddress, provider, index, claim, stepStep }) => {
  const allowed = allowedAddressList.some(item => item.toLowerCase() === address.toLocaleLowerCase())
  const title = defineTitle(name, address, allowed)
  return <> 
    {logoURL && <TokenImage
      src={logoURL}
      alt={name}
    />}
    {title}
    <ScreenButton
      disabled={!tokenId || !amount || !allowed}
      title='Claim'
      onClick={() => {
        if (!tokenId || !amount || !maxSupply) { return }
        claim(address, proof, tokenId, amount, maxSupply, dropAddress, provider, index)
      }}
    />
    <TextComponent
      onClick={() => {
        console.log('here')
        stepStep('check_eligibility')
      }}
    >Check here if you are eligible<br />for this RetroDrop<IconComponent /></TextComponent>
  </>
}

export default connect(mapStateToProps, mapDispatcherToProps)(InitialScreen)