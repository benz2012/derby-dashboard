import React, { Component } from 'react'
import styled from 'styled-components'

import BasicComponent from '../components/BasicComponent'

export default class App extends Component {
  componentWillMount() {
    document.body.style.backgroundColor = '#000000'
  }
  render() {
    return (
      <AppStyle>
        <BasicComponent name="USERNAME" />
      </AppStyle>
    )
  }
}

const AppStyle = styled.div`
  display: block;
  margin: 0;
  border: 0;
  padding: 0;
  color: white;
`
