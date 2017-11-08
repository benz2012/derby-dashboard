import React from 'react'
import styled from 'styled-components'

const FontIcon = styled.i`
  color: ${props => props.color};
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '18px'};
`

const IconWhite = ({ children, ...rest }) => (
  <FontIcon className="material-icons" color="white" {...rest}>
    {children}
  </FontIcon>
)

export default FontIcon
export {
  IconWhite,
}
