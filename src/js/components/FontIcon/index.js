import styled from 'styled-components'

const FontIcon = styled.i`
  color: ${props => props.color};
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '18px'};
`

export default FontIcon
