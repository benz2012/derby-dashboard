import styled from 'styled-components'

import PlainButton from './PlainButton'

const FullWidthButton = styled(PlainButton)`
  width: 100%;
  margin: auto;

  font-family: ${props => props.theme.fontBody};
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.buttonBG};
`

export default FullWidthButton
