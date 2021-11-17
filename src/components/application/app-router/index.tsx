import React, { useEffect, FC } from 'react'
import { Route, Switch, Router } from 'react-router-dom'
// import { functionalActions } from 'decorators'
import Web3Modal from "web3modal";
import { Web3Provider } from '@ethersproject/providers'
import { history } from 'data/store'
import {
  NotFound,
  ClaimPage
//   NotFound,
//   ProtectedRoute,
//   Authorize
} from 'components/pages'
import { Dispatch } from 'redux';
import * as actions from 'data/store/reducers/user/actions'
import { UserActions } from 'data/store/reducers/user/types'
import { connect } from 'react-redux';
import { RootState } from 'data/store';

const mapDispatcherToProps = (dispatch: Dispatch<UserActions>) => {
  return {
      setAddress: (address: string) => dispatch(actions.setAddress(address)),
      setProvider: (provider: any) => dispatch(actions.setProvider(provider)),
      setChainId: (chainId: number) => dispatch(actions.setChainId(chainId))
  }
}
const mapStateToProps = ({ user: { provider } }: RootState) => ({ provider })

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const AppRouter: FC<ReduxType> = ({ setAddress, setProvider, setChainId, provider }) => {
  useEffect(() => {
    async function defineProvider () {
      const providerOptions = {
        /* See Provider Options Section */
      };
      const web3Modal = new Web3Modal({
        network: "rinkeby", // optional
        cacheProvider: true, // optional
        providerOptions // required
      })
      const provider = await web3Modal.connect();
      provider.on("accountsChanged", (accounts: string[]) => {
        window.location.reload()
      })
      provider.on("chainChanged", (chainId: number) => {
        window.location.reload()
      });
      
      const providerWeb3 = new Web3Provider(provider)
      
      const { chainId } = await providerWeb3.getNetwork()
      const accounts = await providerWeb3.listAccounts()
      setAddress(accounts[0])
      setChainId(chainId)
      setProvider(providerWeb3)
      
    }
    
    if (provider) { return }
    defineProvider()
  }, [])

  

  if (!provider) {
    return <>Loading</>
  }

  return <Router history={history}>
    <Switch>
      <Route path='/claim/:ipfs'><ClaimPage /></Route>
      <Route path='*'><NotFound /></Route>
    </Switch>
  </Router>
}

export default connect(mapStateToProps, mapDispatcherToProps)(AppRouter)