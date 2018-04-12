import React from 'react'
import { NavLink } from 'react-router-dom'

const SideNavLink = ({ to, exact, children }) => (
  <li className="nav-item">
    <NavLink className="nav-link" to={to} exact={exact}>
      {children}
    </NavLink>
  </li>
)

export default SideNavLink
