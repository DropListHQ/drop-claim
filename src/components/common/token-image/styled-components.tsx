import styled from 'styled-components'

type TProps = {
  src: string,
  alt: string
}
export const TokenImage = styled.img<TProps>`
  width: 300px;
  height: 300px;
  object-fit: contain;
  border-radius: 8px;
`