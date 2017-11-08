import React from 'react'
import styled, { withTheme } from 'styled-components'

import { FontIcon } from '../Content'
import PlainButton from '../Button/PlainButton'

const MenuButton = ({ children, onClick, theme }) => (
  <MenuButtonContainer onClick={onClick}>
    <FontIcon className="material-icons" color={theme.headerFG} fontSize={36}>
      {children}
    </FontIcon>
  </MenuButtonContainer>
)

const MenuButtonContainer = styled(PlainButton)`
  width: 60px;
  height: 100%;
  margin: auto;
`

export default withTheme(MenuButton)
