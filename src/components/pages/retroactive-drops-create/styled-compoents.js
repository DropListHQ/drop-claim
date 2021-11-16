import styled from 'styled-components';
import {
  Input,
  Button,
  Textarea,
  DataBlock
} from 'components/common'

export const WidgetInput = styled(Input)`
`;

export const WidgetTextarea = styled(Textarea)`
`

export const WidgetControls = styled.div`
  display: flex;
  width: 100%;
  gap: 18px;
  margin-top: 50px;
`

export const WidgetButton = styled(Button)`
  flex: 1;
`
export const WidgetDataSplit = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
`

export const WidgetDataBlock = styled(DataBlock)`
  flex: 1;
`