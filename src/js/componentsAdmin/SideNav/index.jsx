import React from 'react'

import SideNavLink from './SideNavLink'

const SideNav = ({ linkData }) => (
  <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
    <div className="sidebar-sticky">
      <ul className="nav flex-column">
        {
          linkData.map(l => (
            <SideNavLink key={l.display} to={l.to} exact={l.exact}>
              {l.display}
            </SideNavLink>
          ))
        }
      </ul>
    </div>
  </nav>
)

export default SideNav
