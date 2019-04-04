import React, { Fragment } from 'react'

import NavBrand from './NavBrand'
import NavDropDown from './NavDropDown'
import NavButton from './NavButton'
import { showWhenSmall, hideWhenSmall } from '../styleUtils'

const SmallBar = showWhenSmall('div')
const LargeBar = hideWhenSmall('div')

const TopNav = ({ toggleMenu, brand, children }) => (
  <Fragment>
    <LargeBar>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0">
        {brand}
        <ul className="navbar-nav navbar-expand-sm px-3">
          {children}
        </ul>
      </nav>
    </LargeBar>
    <SmallBar>
      <nav className="navbar navbar-dark fixed-top bg-dark">
        {brand}
        <button onClick={toggleMenu} className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon" />
        </button>
      </nav>
    </SmallBar>
  </Fragment>
)


export default TopNav
export {
  NavBrand,
  NavDropDown,
  NavButton,
}
