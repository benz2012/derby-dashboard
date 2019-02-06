import React from 'react'

import CleanLink from './CleanLink'
import { FontIcon } from '.'

const IconLink = ({ to, children, replace, ...rest }) => (
  <CleanLink to={to} replace={replace}>
    <FontIcon className="material-icons" {...rest}>{children}</FontIcon>
  </CleanLink>
)

export default IconLink
