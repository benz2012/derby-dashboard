import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import { dataFetch, objectSort } from '../util'
import { dateSort } from '../util/date'

export default class ReportsPage extends Component {
  state = {
    unmounting: false,
    reports: null,
  }
  componentDidMount() {
    dataFetch('/data/reports').then((data) => {
      if (data[0] && data[0].date) objectSort(data, 'date', dateSort)
      if (!this.state.unmounting) this.setState({ reports: data })
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  itemClick = id => console.log(this.state.reports.find(t => t.id === id))
  render() {
    const { reports } = this.state
    if (!reports) return <Loading />
    console.log(reports)
    return (
      <div>
        <button className="btn btn-success mb-4">+ Add Report</button>
        <DataBin
          items={reports}
          head={r => r.header}
          body={r => (
            <span>
              {r.body.substr(0, 100)}{r.body.length > 100 && '...'}<br />
              {r.date}
            </span>
          )}
          onEdit={this.itemClick}
          onDelete={this.itemClick}
        />
      </div>
    )
  }
}
