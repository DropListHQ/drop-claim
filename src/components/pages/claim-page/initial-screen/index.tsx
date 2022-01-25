import React, { FC } from 'react'
import { TokenImage, Widget } from 'components/common'
import { Title, ScreenButton, TextComponent, IconComponent, Description } from './styled-components'
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
  drop: { proof, tokenId, amount, dropAddress, index, allowedAddressList, logoURL, description, title }
}: RootState) => ({
  name, image, address, proof, tokenId, amount, dropAddress, provider, index, title, allowedAddressList, logoURL, description
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


const InitialScreen: FC<ReduxType> = ({ name, title, description, allowedAddressList, logoURL, image, address, proof, tokenId, amount, dropAddress, provider, index, claim, stepStep }) => {
  const allowed = allowedAddressList.some(item => item.toLowerCase() === address.toLocaleLowerCase())
  return <Widget
      image={logoURL && <TokenImage
        src={logoURL}
        alt={name}
      />}
    > 
    <Title>{title}</Title>
    <Description>{description}</Description>
    <ScreenButton
      disabled={!tokenId || !amount || !allowed}
      title='Claim'
      onClick={() => {
        if (!tokenId || !amount) { return }
        claim(address, proof, tokenId, amount, dropAddress, provider, index)
      }}
    />
    <TextComponent
      onClick={() => {
        console.log('here')
        stepStep('check_eligibility')
      }}
    >Check here if you are eligible<br />for this RetroDrop<IconComponent /></TextComponent>
  </Widget>
}

export default connect(mapStateToProps, mapDispatcherToProps)(InitialScreen)