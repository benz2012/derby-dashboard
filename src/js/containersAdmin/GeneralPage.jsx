import React, { Component } from 'react'

import Loading from '../components/Loading'
import DataCard from '../componentsAdmin/DataCard'
import EditRoute from './EditRoute'
import { dataFetch, dataSend } from '../util'

export default class GeneralPage extends Component {
  state = {
    unmounting: false,
    general: null,
    input: {
      name: '',
    },
  }
  componentDidMount() {
    dataFetch('/data/home').then((data) => {
      if (!this.state.unmounting) {
        this.setState({ general: data }, this.resetValues)
      }
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  setInput = (update) => {
    const k = Object.keys(update)[0]
    const v = update[k]
    this.setState(prevState => ({
      input: {
        ...prevState.input,
        [k]: v,
      },
    }))
  }
  resetValues = () => {
    this.setInput({
      name: this.state.general.name,
    })
  }
  newValues = () => {
    const { general, input } = this.state
    return Object.keys(input)
      .filter(k => input[k] !== general[k])
      .map(k => ({ [k]: input[k] }))
  }
  render() {
    const { general, input } = this.state
    const { history, match } = this.props
    if (!general) return <Loading />
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
          onEdit={() => history.replace(`${match.url}/school`)}
        />
        <DataCard
          head="Event Information"
          body={
            <span>
              Event Year: {general.year}<br />
              Text Alert Date Range: {general.alertRange.start} to {general.alertRange.end}
            </span>
          }
          onEdit={() => history.replace(`${match.url}/event`)}
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
          onEdit={() => history.replace(`${match.url}/homepage`)}
        />

        <EditRoute
          {...this.props}
          path={'school'}
          close={this.resetValues}
          submit={() => { dataSend('/data/home', this.newValues()) }}
        >
          <form>
            <div className="form-group">
              <label htmlFor="input.name">School Name</label>
              <input
                type="text"
                className="form-control"
                id="input.name"
                value={this.state.input.name}
                onChange={(e) => { this.setInput({ name: e.target.value }) }}
              />
            </div>
          </form>
        </EditRoute>

        <EditRoute {...this.props} path={'event'} submit={() => {console.log('you clicked it')}}>
          Event Data
        </EditRoute>
        <EditRoute {...this.props} path={'homepage'} submit={() => {console.log('you clicked it')}}>
          HomePage Data
        </EditRoute>
      </div>
    )
  }
}
