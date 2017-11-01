import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Menu = ({ linkData, toggleMenu }) => {
  const activeStyle = {
    fontWeight: '700',
    color: 'black',
  }

  const links = linkData.map(link => (
    <li key={link.to}><NavLinkStyled
      onClick={toggleMenu}
      activeStyle={activeStyle}
      to={link.to}
      exact={link.exact}
    >
      {link.display}
    </NavLinkStyled></li>
  ))

  return (
    <MenuContianer>
      <LinkContainer>
        {links}
      </LinkContainer>
      <Close onClick={toggleMenu}>&times;</Close>
    </MenuContianer>
  )
}

const MenuContianer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(255, 255, 255, 0.9);
`

const LinkContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0;

  list-style: none;
`

const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.contentFG};
  font-weight: 300;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  display: block;
  margin-bottom: 30px;
  text-align: center;
  font-size: 20px;

  &:hover {
    text-decoration: underline;
  }
  &:active {
    text-decoration: none;
    color: ${props => props.theme.textDampen};
  }
  &:visited {
    text-decoration: none;
  }
`

const Close = styled.span`
  font-size: 70px;
  font-weight: 300;
  position: fixed;
  top: -10px;
  right: 15px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`

export default Menu
