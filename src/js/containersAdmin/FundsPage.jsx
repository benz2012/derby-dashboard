import React, { Component } from 'react'
import currency from 'currency.js'

import Loading from '../components/Loading'
import DataBin from '../componentsAdmin/DataBin'
import { dataFetch, objectSort } from '../util'
import { stringSort } from '../util/string'

export default class FundsPage extends Component {
  state = {
    unmounting: false,
    raised: null,
    teams: null,
    external: null,
  }

  componentDidMount() {
    dataFetch('/data/raised').then((data) => {
      if (!this.state.unmounting) this.setState({ raised: data })
      const external = [].concat(
        ...data.map(r => (
          Object.keys(r.external).map(k => (
            { id: k, teamId: r.id, amount: r.external[k] }
          ))
        )),
      )
      if (!this.state.unmounting) this.setState({ external })
    })
    dataFetch('/data/teams').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ teams: data })
    })
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  itemClick = () => null

  formatFund = amount => currency(amount, { formatWithSymbol: true }).format()

  render() {
    const { raised, external, teams } = this.state
    if (!(raised && external && teams)) return <Loading />
    console.log(raised)
    return (
      <div>
        <h4>External Funds</h4>
        <hr />
        <button type="button" className="btn btn-success mb-4">+ Add External Fund</button>
        <DataBin
          items={external}
          id={e => `team-${e.teamId}-id-${e.id}`}
          body={e => (
            <span>
              {teams.find(t => t.id === e.teamId).org}:&nbsp;
              {this.formatFund(e.amount)}
            </span>
          )}
          onEdit={this.itemClick}
          onDelete={this.itemClick}
        />

        <h4>Online Funds</h4>
        <hr />
        <DataBin
          items={raised}
          head={r => (
            <span>
              {teams.find(t => t.id === r.id).org}:&nbsp;
              {this.formatFund(r.raised)}
            </span>
          )}
        />
      </div>
    )
  }
}
