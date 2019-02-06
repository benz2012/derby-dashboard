import styled from 'styled-components'

const Close = styled.span`
  font-size: ${props => (props.size ? `${props.size}px` : '70px')};
  font-weight: 300;
  position: fixed;
  top: -10px;
  right: 15px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: ${props => props.color};
`

export default Close
