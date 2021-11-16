import React, { FC, ReactElement, useEffect } from 'react'

import InitialScreen from './initial-screen'
import ChangeNetwork from './change-network'
import NotAllowedForClaim from './not-allowed-for-claim'
import ClaimingFinished from './claiming-finished'
import ClaimingProcess from './claiming-process'
import CheckEligibility from './check-eligibility'
import { ScreenLoader } from 'components/common'

import { RootState } from 'data/store'
import { connect } from 'react-redux'
import { Container } from './styled-components'
import { useParams } from 'react-router-dom'
import { Dispatch } from 'redux';
import * as dropAsyncActions from 'data/store/reducers/drop/async-actions'
import { DropActions } from 'data/store/reducers/drop/types'
import { TokenActions } from 'data/store/reducers/token/types'
import checkEligibility from './check-eligibility'

const mapStateToProps = ({
  user: { address, provider, chainId },
  drop: { step },
}: RootState) => ({
  address,
  step,
  provider,
  chainId,
})
const mapDispatcherToProps = (dispatch: Dispatch<DropActions> & Dispatch<TokenActions>) => {
  return {
      getData: (
        provider: any,
        ipfs: string,
        chainId: number,
        address: string
      ) => dropAsyncActions.getData(dispatch, provider, ipfs, chainId, address)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

type TDefineStep = (step: string) => ReactElement

const defineCurrentScreen: TDefineStep = step => {
  switch (step) {
    case 'initial':
      return <InitialScreen />
    case 'change_network':
      return <ChangeNetwork />
    case 'not_allowed':
      return <NotAllowedForClaim />
    case 'claiming_process':
      return <ClaimingProcess />
    case 'claiming_finished':
      return <ClaimingFinished />
    case 'check_eligibility':
      return <CheckEligibility />
    default:
      return <ScreenLoader />
  }
}

const ClaimPage: FC<ReduxType> = ({
  step,
  getData,
  address,
  chainId,
  provider
}) => {
  const { ipfs }: { ipfs: string } = useParams()
  const screen = defineCurrentScreen(step)
  useEffect(() => {
    console.log({ chainId })
    if (chainId) {
      getData(provider, ipfs, chainId, address)
    }
  }, [])
  return <Container>
    {screen}
  </Container> 
}

export default connect(mapStateToProps, mapDispatcherToProps)(ClaimPage)
