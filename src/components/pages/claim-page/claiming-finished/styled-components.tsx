import styled from 'styled-components'
import { Button } from 'components/common'

export const Title = styled.h2`
  font-size: 14px;
  line-height: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: ${props => props.theme.primaryTextColor};
  font-weight: 400;

  strong {
    font-weight: 700;
  }

  span {
    color: ${props => props.theme.primaryHighlightColor}
  }
`

type TScreenButton = {
  title: string,
  onClick: () => void
}

export const ScreenButton = styled(Button)<TScreenButton>`
  max-width: 270px;
  width: 100%;
`