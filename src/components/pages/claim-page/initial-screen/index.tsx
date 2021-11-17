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
  drop: { proof, tokenId, amount, dropAddress, index, allowedAddressList, logoURL }
}: RootState) => ({
  name, image, address, proof, tokenId, amount, dropAddress, provider, index, allowedAddressList, logoURL
})

const mapDispatcherToProps = (dispatch: Dispatch<DropActions> & Dispatch<TokenActions>) => {
  return {
      claim: (
        address: string,
        proof: string[],
        tokenId: string,
        amount: string,
        dropAddress: string,
        provider: any,
        index: number
      ) => dropAsyncActions.claim(
        dispatch,
        provider,
        index,
        amount,
        address,
        tokenId,
        dropAddress,
        proof
      ),
      stepStep: (step: TDropStep) => dispatch(dropActions.setStep(step))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> 


type TDefineTitle = (tokenName: string, address: string, allowedAddressList: string[]) => ReactElement 
const defineTitle: TDefineTitle = (tokenName, address, allowedAddressList) => {
  const allowed = allowedAddressList.some(item => item.toLowerCase() === address.toLocaleLowerCase())
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

const InitialScreen: FC<ReduxType> = ({ name, allowedAddressList, logoURL, image, address, proof, tokenId, amount, dropAddress, provider, index, claim, stepStep }) => {
  const title = defineTitle(name, address, allowedAddressList)
  return <> 
    {logoURL && <TokenImage
      src={logoURL}
      alt={name}
    />}
    {title}
    <ScreenButton disabled={!tokenId || !amount} title='Claim' onClick={() => {
      if (!tokenId || !amount) { return }
      claim(address, proof, tokenId, amount, dropAddress, provider, index)
    }}/>
    <TextComponent
      onClick={() => {
        console.log('here')
        stepStep('check_eligibility')
      }}
    >Check here if you are eligible<br />for this RetroDrop<IconComponent /></TextComponent>
  </>
}

export default connect(mapStateToProps, mapDispatcherToProps)(InitialScreen)