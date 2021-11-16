import React, { FC } from 'react'
import { TokenImage } from './styled-components'

type TProps = {
  src: string,
  alt: string
}

const TokenImageComponent: FC<TProps> = ({ src, alt }) => {
  return <TokenImage src={src} alt={alt} />
}

export default TokenImageComponent