import React from 'react'

import NavBrand from './NavBrand'
import NavDropDown from './NavDropDown'

const TopNav = ({ brand, children }) => (
  <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0">
    {brand}
    <ul className="navbar-nav px-3">
      {children}
    </ul>
  </nav>
)

export default TopNav
export {
  NavBrand,
  NavDropDown
}
