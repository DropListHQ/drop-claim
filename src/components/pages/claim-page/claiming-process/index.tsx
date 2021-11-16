import React, { FC } from 'react'
import { Loader, ScreenSubtitle, ScreenTitle, Container, Link } from './styled-components'
import { Text } from 'components/common'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import { defineExplorerURL } from 'helpers'

const mapStateToProps = ({
  user: { chainId },
  drop: { hash }
}: RootState) => ({
  hash,
  chainId
})
type ReduxType = ReturnType<typeof mapStateToProps>

const ClaimingProcess: FC<ReduxType> = ({ hash, chainId }) => {
  const explorerUrl = chainId && hash ? <span>See details on <Link href={`${defineExplorerURL(chainId)}/tx/${hash}`}>Explorer</Link></span> : null
  return <Container>
    <Loader size='small' />
    <ScreenTitle>Claiming…</ScreenTitle>
    <ScreenSubtitle>Transaction is processing</ScreenSubtitle>
    <Text>It may take a few minutes. You can<br/>check back later. {explorerUrl}</Text>
  </Container>
}

export default connect(mapStateToProps)(ClaimingProcess)
