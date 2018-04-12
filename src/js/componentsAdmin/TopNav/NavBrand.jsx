import React from 'react'

const NavBrand = ({ children, to }) => (
  <a className="navbar-brand col-sm-3 col-md-2 mr-0" href={to}>{children}</a>
)

export default NavBrand
