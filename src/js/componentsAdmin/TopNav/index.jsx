import React from 'react'

import NavBrand from './NavBrand'
import NavDropDown from './NavDropDown'
import NavButton from './NavButton'

const TopNav = ({ brand, children }) => (
  <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0">
    {brand}
    <ul className="navbar-nav navbar-expand-sm px-3">
      {children}
    </ul>
  </nav>
)

export default TopNav
export {
  NavBrand,
  NavDropDown,
  NavButton,
}
