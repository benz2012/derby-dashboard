import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import { dataFetch, objectSort } from '../util'
import { stringSort } from '../util/string'

export default class TeamsPage extends Component {
  state = {
    unmounting: false,
    teams: null,
  }
  componentDidMount() {
    dataFetch('/data/teams').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ teams: data })
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  itemClick = id => console.log(this.state.teams.find(t => t.id === id))
  render() {
    const { teams } = this.state
    if (!teams) return <Loading />
    return (
      <DataBin
        items={teams}
        head={t => t.org}
        body={t => (
          <span>
            {t.name}<br />
            <a href={t.url} className="card-link" target="_blank">{t.url}</a>
          </span>
        )}
        onEdit={this.itemClick}
      />
    )
  }
}
