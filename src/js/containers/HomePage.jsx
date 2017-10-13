import React, { Component } from 'react'

export default class HomePage extends Component {
  componentDidMount() {
    console.log('HomePage is mounted')
  }
  render() {
    return (
      <div>
        <h1>HomePage</h1>
      </div>
    )
  }
}
