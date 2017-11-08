import React from 'react'

import { FontIcon } from '../Content'
import PlainButton from './PlainButton'

const IconButton = ({ children, onClick, fontSize }) => (
  <PlainButton onClick={onClick}>
    <FontIcon className="material-icons" fontSize={fontSize}>
      {children}
    </FontIcon>
  </PlainButton>
)

export default IconButton
