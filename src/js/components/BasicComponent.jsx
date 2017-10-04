import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class BasicComponent extends Component {
  componentDidMount() {
    console.log('component is mounted')
  }
  render() {
    const { name } = this.props
    return (
      <div>
        <Title>Welcome to your new app, {name}!</Title>
      </div>
    )
  }
}

const Title = styled.h1`
  color: white;
  font-size: 100px;
`

BasicComponent.propTypes = {
  name: PropTypes.string.isRequired,
}
