import React, { Component } from 'react'
import io from 'socket.io-client'

import Page from '../components/Page'

const socket = io({ autoConnect: false })

export default class Live extends Component {
  state = {
    data: null,
  }
  componentDidMount() {
    socket.open()
    socket.on('stuff', (message) => {
      console.log(message)
    })
    socket.on('liveUpdate', (update) => {
      this.setState({ data: update })
    })
  }
  componentWillUnmount() {
    socket.off('stuff')
    socket.off('liveUpdate')
    socket.close()
  }
  render() {
    const { data } = this.state
    const disp = data && String(Object.keys(data).map(k => Object.keys(data[k])))
    return (
      <Page>
        <h2>Live</h2>
        <h4><em>{disp}</em></h4>
      </Page>
    )
  }
}
