import React from 'react'

const NavBrand = ({ children, to }) => (
  <a className="navbar-brand col-1 col-sm-1 col-md-2 mr-0" href={to}>{children}</a>
)

export default NavBrand
