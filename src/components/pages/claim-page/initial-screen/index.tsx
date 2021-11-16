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
  drop: { proof, tokenId, amount, dropAddress, index }
}: RootState) => ({
  name, image, address, proof, tokenId, amount, dropAddress, provider, index
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


type TDefineTitle = (tokenName: string, address: string) => ReactElement 
const defineTitle: TDefineTitle = (tokenName, address) => {
  if (address) {
    return <Title>Claim <strong>{tokenName}</strong> to address: <span>{address}</span> </Title>
  }
  return <Title>Claim {tokenName}</Title>
}

const InitialScreen: FC<ReduxType> = ({ name, image, address, proof, tokenId, amount, dropAddress, provider, index, claim, stepStep }) => {
  const title = defineTitle(name, shortenString(address))
  return <>
    {image && <TokenImage
      src={image}
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