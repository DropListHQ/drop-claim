import React, { FC, ReactElement } from 'react'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import { TokenImage } from 'components/common'
import { shortenString, defineNetworkName } from 'helpers'
import { Title, ScreenButton } from './styled-components'

const mapStateToProps = ({
  drop: { hash, chainId, tokenId, tokenAddress, logoURL },
  user: { address },
  token: { image, name }
}: RootState) => ({
  address,
  image, name,
  chainId,
  tokenId, tokenAddress,
  logoURL
})
type ReduxType = ReturnType<typeof mapStateToProps>
type TDefineTitle = (tokenName: string, address: string) => ReactElement
type TDefineOpenseaUrl = ({ chainId, tokenId, tokenAddress }: { chainId: number, tokenId: string, tokenAddress: string }) => string


const defineOpenseaURL: TDefineOpenseaUrl = ({ chainId, tokenId, tokenAddress }) => {
  const networkName = defineNetworkName(chainId)
  if (networkName === 'mainnet') {
    return `https://opensea.io/assets/${tokenAddress}/${tokenId}`
  }
  if (networkName === 'matic') {
    return `https://opensea.io/assets/matic/${tokenAddress}/${tokenId}`
  }
  return `https://testnets.opensea.io/assets/${networkName}/${tokenAddress}/${tokenId}`
}

const defineTitle: TDefineTitle = (tokenName, address) => {
  if (address) {
    return <Title><strong>{tokenName}</strong> has been claimed<br />to address: <span>{address}</span> </Title>
  }
  return <Title><strong>{tokenName}</strong> has been claimed</Title>
}

const ClaimingFinished: FC<ReduxType> = ({ image, name, address, chainId, tokenId, tokenAddress, logoURL }) => {
  const title = defineTitle(name, shortenString(address))
  return <>
    {logoURL && <TokenImage
      src={logoURL}
      alt={name}
    />}
    {title}
    {chainId && tokenId && tokenAddress && <ScreenButton title='View NFT on OpenSea' appearance='inverted' onClick={() => {
      window.open(defineOpenseaURL({
        chainId,
        tokenId,
        tokenAddress
      }))
    }}/>}
  </>
}

export default connect(mapStateToProps)(ClaimingFinished)