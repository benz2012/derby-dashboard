import React from 'react'

import { FontIcon } from '../Content'
import PlainButton from './PlainButton'

const IconButton = ({ children, onClick, ...rest }) => (
  <PlainButton onClick={onClick}>
    <FontIcon className="material-icons" {...rest}>
      {children}
    </FontIcon>
  </PlainButton>
)

export default IconButton
