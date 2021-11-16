import styled from 'styled-components'
import { Button, Text } from 'components/common'
import Icons from 'icons'

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
  max-width: 100%;
  width: 100%;
  margin-bottom: 16px;
`

export const TextComponent = styled(Text)`
  text-align: center;
  cursor: pointer;
`

export const IconComponent = styled(Icons.BlueArrowIcon)`
  vertical-align: middle;
  margin-left: 4px;
`