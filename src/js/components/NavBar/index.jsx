import React, { Component } from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import { NavBarContainer, NavBarShadow, TitleContainer } from './style'
import { dataFetch } from '../../util'

export default class NavBar extends Component {
  state = {
    menuOpen: false,
    year: null,
  }
  componentDidMount() {
    dataFetch('/data/year').then((data) => {
      if (data) {
        this.setState({ year: data.year })
      }
    })
  }
  toggleMenu = () => {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen,
    }))
  }
  render() {
    const { linkData } = this.props
    const { menuOpen, year } = this.state
    return [
      <NavBarContainer key={0}>
        <MenuButton onClick={this.toggleMenu}>menu</MenuButton>
        <TitleContainer>{year ? `Derby Days ${year}` : '\u00a0'}</TitleContainer>
        { menuOpen && <Menu linkData={linkData} toggleMenu={this.toggleMenu} /> }
      </NavBarContainer>,
      <NavBarShadow key={1} />,
    ]
  }
}
