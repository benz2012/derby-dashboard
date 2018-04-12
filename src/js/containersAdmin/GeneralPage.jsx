import React, { Component } from 'react'

import Loading from '../components/Loading'
import DataCard from '../componentsAdmin/DataCard'
import { dataFetch } from '../util'

export default class GeneralPage extends Component {
  state = {
    unmounting: false,
    general: null,
  }
  componentDidMount() {
    dataFetch('/data/home').then((data) => {
      if (!this.state.unmounting) this.setState({ general: data })
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  render() {
    const { general } = this.state
    if (!general) return <Loading />
    console.log(general)
    return (
      <div>
        <h2 className="mb-4">Derby Dashboard Admin Panel</h2>
        <DataCard
          head="School Information"
          body={
            <span>
              {general.name}<br />
              <a className="card-link" target="_blank" href={general.schoolURL}>{general.schoolURL}</a>
            </span>
          }
        />
        <DataCard
          head="Event Information"
          body={
            <span>
              Event Year: {general.year}<br />
              Text Alert Date Range: YYYY-MM-DD to YYYY-MM-DD
            </span>
          }
        />
        <DataCard
          head="HomePage Information"
          body={
            <span>
              {general.header}<br />
              {general.body.substr(0, 100)}{general.body.length > 100 && '...'}<br />
              <a className="card-link" target="_blank" href={general.videoURL}>{general.videoURL}</a>
            </span>
          }
        />
      </div>
    )
  }
}
