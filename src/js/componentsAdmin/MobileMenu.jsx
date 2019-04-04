import React from 'react'
import styled from 'styled-components'

import Modal from '../containers/Modal'
import { EditContainer, EditPane, ViewContent } from './EditView/style'
import SideNavLink from './SideNav/SideNavLink'

const Text = styled.div`
  width: 100%;
  font-size: 24px;
  text-align: center;
`

const MobileMenu = ({ toggleMenu, linkData }) => (
  <div role="button" onClick={toggleMenu} tabIndex={0}>
    <Modal radius={3}>
      <EditContainer>
        <EditPane>
          <ViewContent>
            <ul className="nav flex-column">
              {
                linkData.map(l => (
                  <SideNavLink key={l.display} to={l.to} exact={l.exact}>
                    <Text>{l.display}</Text>
                  </SideNavLink>
                ))
              }
            </ul>
          </ViewContent>
        </EditPane>
      </EditContainer>
    </Modal>
  </div>

)

export default MobileMenu
