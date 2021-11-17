import React, { FC } from 'react'
import { RootState } from 'data/store'
import { connect } from 'react-redux'

const mapStateToProps = ({
  user: { chainId },
  drop: { chainId: dropChainId },
}: RootState) => ({
  chainId,
  dropChainId
})

type ReduxType = ReturnType<typeof mapStateToProps> 


const SetConnector: FC<ReduxType> = () => {
  const { host, pathname } = window.location
  return <>
    <a href={`https://metamask.app.link/dapp/${host}${pathname}`}>Connect with METAMASK</a>
  </>
}

export default connect(mapStateToProps)(SetConnector)