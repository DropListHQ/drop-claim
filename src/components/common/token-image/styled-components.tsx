import styled from 'styled-components'

type TProps = {
  src: string,
  alt: string
}
export const TokenImage = styled.img<TProps>`
  width: 227px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
`