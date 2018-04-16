import React from 'react'

const NavButton = ({ children, to }) => (
  <li className="nav-item pl-4">
    <a className="nav-link" role="button" href={to}>
      {children}
    </a>
  </li>
)

export default NavButton
