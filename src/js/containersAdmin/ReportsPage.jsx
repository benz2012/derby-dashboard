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
  itemClick = id => console.log(this.state.reports.find(t => t.date === id))
  render() {
    const { reports } = this.state
    if (!reports) return <Loading />
    return (
      <div>
        <button className="btn btn-success mb-4">+ Add Report</button>
        <DataBin
          items={reports}
          id={r => r.date}
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
