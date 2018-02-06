import React from 'react'

import FontIcon from './FontIcon'
import theme from '../../styles/theme'

const RightArrow = ({ ...rest }) => (
  <FontIcon
    className="material-icons"
    fontSize={36}
    color={theme.textDampen}
    {...rest}
  >
    keyboard_arrow_right
  </FontIcon>
)

export default RightArrow
