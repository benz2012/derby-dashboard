import React, { Component } from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import { NavBarContainer, TitleContainer } from './style'
import { dataFetch } from '../../util'

export default class NavBar extends Component {
  state = {
    menuOpen: false,
    year: null,
  }
  componentDidMount() {
    dataFetch('/data/year').then(res => res.json()).then((data) => {
      this.setState({ year: data.year })
    })
  }
  toggleMenu = () => {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen,
    }))
  }
  render() {
    const { menuOpen, year } = this.state
    return (
      <NavBarContainer>
        <MenuButton onClick={this.toggleMenu}>menu</MenuButton>
        <TitleContainer>{year ? `Derby Days ${year}` : '\u00a0'}</TitleContainer>
        { menuOpen && <Menu toggleMenu={this.toggleMenu} /> }
      </NavBarContainer>
    )
  }
}
