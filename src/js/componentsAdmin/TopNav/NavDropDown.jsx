import React from 'react'

const NavDropDown = ({ children }) => (
  <li className="nav-item dropdown pl-4">
    <a className="nav-link dropdown-toggle" role="button">
      {children}
    </a>
  </li>
)

export default NavDropDown
