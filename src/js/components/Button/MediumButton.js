import styled from 'styled-components'

import PlainButton from './PlainButton'

const MediumButton = styled(PlainButton)`
  flex: 1;
  height: 36px;
  margin: 0 8px;

  color: ${props => props.primary ? props.theme.buttonFG : props.theme.buttonBG};
  background-color: ${props => props.primary ? props.theme.buttonBG : props.theme.buttonFG};
  border: 1px solid ${props => props.theme.buttonBG};
  border-radius: 3px;

  font-family: ${props => props.theme.fontBody};
  font-size: 18px;
  font-weight: 700;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`

export default MediumButton
