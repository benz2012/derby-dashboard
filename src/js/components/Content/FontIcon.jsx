import React from 'react'
import styled from 'styled-components'

import theme from '../../styles/theme'

const FontIcon = styled.i`
  color: ${props => props.color || props.theme.contentFG};
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '18px'};
`

const IconWhite = ({ children, ...rest }) => (
  <FontIcon className="material-icons" color="white" {...rest}>
    {children}
  </FontIcon>
)

const IconDamp = ({ children, ...rest }) => (
  <FontIcon className="material-icons" color={theme.textDampen} {...rest}>
    {children}
  </FontIcon>
)

export default FontIcon
export {
  IconWhite,
  IconDamp
}
