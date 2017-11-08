import React from 'react'

import CleanLink from './CleanLink'
import { FontIcon } from '../Content'

const IconLink = ({ to, children, ...rest }) => (
  <CleanLink to={to}>
    <FontIcon className="material-icons" {...rest}>{children}</FontIcon>
  </CleanLink>
)

export default IconLink
