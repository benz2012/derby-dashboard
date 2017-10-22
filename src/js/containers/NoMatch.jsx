import React, { Component } from 'react'
import styled from 'styled-components'

import Page from '../components/Page'

export default class NoMatch extends Component {
  componentDidMount() {
    console.log('NoMatch is mounted')
  }
  render() {
    return (
      <Page>
        <NotFoundMessage>
          no page found :(<br /><br />
          try something other than: {this.props.location.pathname}
        </NotFoundMessage>
      </Page>
    )
  }
}

const NotFoundMessage = styled.h1`
  width: 100%;
  height: 100%;
  text-align: center;
  margin-top: 100px;

  color: ${props => props.theme.textDampen};
`
