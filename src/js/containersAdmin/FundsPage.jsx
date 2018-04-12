import React, { Component } from 'react'

import { dataFetch } from '../util'

export default class FundsPage extends Component {
  state = {
    unmounting: false,
    funds: null,
  }
  componentDidMount() {
    dataFetch('/data/funds').then((data) => {
      if (!this.state.unmounting) this.setState({ funds: data })
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  render() {
    return (
      <div>FundsPage</div>
    )
  }
}
