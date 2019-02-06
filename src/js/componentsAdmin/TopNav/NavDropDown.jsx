import React from 'react'

const NavDropDown = ({ children }) => (
  <li className="nav-item dropdown pl-4">
    <div className="nav-link dropdown-toggle" role="button">
      {children}
    </div>
  </li>
)

export default NavDropDown
