import React from 'react'

const NavDropDown = ({ children }) => (
  <li className="nav-item dropdown text-nowrap">
    <a className="nav-link dropdown-toggle" role="button">
      {children}
    </a>
  </li>
)

export default NavDropDown
