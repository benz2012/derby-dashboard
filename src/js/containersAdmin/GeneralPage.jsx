import React, { Component } from 'react'
import moment from 'moment'

import Loading from '../components/Loading'
import DataCard from '../componentsAdmin/DataCard'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, TimeInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend } from '../util'
import { setInput, newValues, hasDefault } from '../util/form'

export default class GeneralPage extends Component {
  state = {
    unmounting: false,
    result: null,
    general: null,
    input: {
      name: '',
      abbrv: '',
      header: '',
      body: '',
      learnMoreURL: '',
      videoURL: '',
      year: '',
      alertTime: '',
    },
  }

  componentDidMount() {
    this.fetchGeneralData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (hasDefault(e)) e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }

  submitValues = (url) => {
    this.setState({ result: null })
    const { general, input } = this.state
    const { uid, token } = this.props.authValues()
    dataSend(url, 'POST', uid, token, newValues(general, input)).then((d) => {
      if (d) {
        this.setState({ result: 'SUCCESS' })
        this.fetchGeneralData()
      }
    }).catch(() => {
      this.setState({ result: 'FAILURE' })
    })
  }

  fetchGeneralData = () => {
    dataFetch('/data/home').then((data) => {
      if (!this.state.unmounting) {
        this.setState({ general: data }, this.resetValues)
      }
    })
  }

  closeModal = () => {
    this.resetValues()
    this.setState({ result: null })
  }

  resetValues = () => {
    setInput({
      name: this.state.general.name,
      abbrv: this.state.general.abbrv,
      header: this.state.general.header,
      body: this.state.general.body,
      learnMoreURL: this.state.general.learnMoreURL,
      videoURL: this.state.general.videoURL,
      year: this.state.general.year,
      alertTime: this.state.general.alertTime,
    }, this.setState.bind(this))
  }

  render() {
    const { general, input, result } = this.state
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
              <a className="card-link" target="_blank" rel="noopener noreferrer" href={general.schoolURL}>{general.schoolURL}</a>
            </span>
          }
          onEdit={() => history.replace(`${match.url}/school`)}
        />
        <DataCard
          head="Event Information"
          body={
            <span>
              Event Year: {general.year}<br />
              Text Alerts:&nbsp;
              {moment(general.alertRange.start).format('MMMM Do')}
              &nbsp;to&nbsp;
              {moment(general.alertRange.end).format('MMMM Do')}
              &nbsp;@&nbsp;
              {moment(general.alertTime, 'HH:mm').format('H:mm a')}
            </span>
          }
          onEdit={() => history.replace(`${match.url}/event`)}
        />
        <DataCard
          head="Home Page Information"
          body={
            <span>
              {general.header}<br />
              {general.body.substr(0, 100)}{general.body.length > 100 && '...'}<br />
              <a className="card-link" target="_blank" rel="noopener noreferrer" href={general.videoURL}>{general.videoURL}</a>
            </span>
          }
          onEdit={() => history.replace(`${match.url}/homepage`)}
        />

        <EditRoute {...this.props} path="school" close={this.closeModal} submit={() => this.submitValues('/data/home')} result={result}>
          <Form>
            <TextInput id="input.name" label="School Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.abbrv" label="School Abbreviation" value={input.abbrv} onChange={this.setValue} />
            <TextInput id="general.schoolURL" label="Derby Challenge URL" value={general.schoolURL} readOnly />
            <TextInput id="general.avatar" label="Derby Challenge Avatar" value={general.avatar} readOnly />
          </Form>
        </EditRoute>

        <EditRoute {...this.props} path="event" close={this.closeModal} submit={() => this.submitValues('/data/home')} result={result}>
          <Form>
            <TextInput id="input.year" label="Event Year" value={input.year} onChange={this.setValue} help="YYYY" />
            <TextInput
              id="general.alertRange"
              label="Text Alert Date Range"
              value={`${general.alertRange.start} to ${general.alertRange.end}`}
              readOnly
            />
            <TimeInput id="input.alertTime" label="Daily Text Alert Time" value={input.alertTime} onChange={this.setValue} />
          </Form>
        </EditRoute>

        <EditRoute {...this.props} path="homepage" close={this.closeModal} submit={() => this.submitValues('/data/home/page')} result={result}>
          <Form>
            <TextInput id="input.header" label="Header Line" value={input.header} onChange={this.setValue} />
            <TextAreaInput id="input.body" label="Body Text" value={input.body} onChange={this.setValue} rows={3} />
            <TextInput id="input.learnMoreURL" label="Learn More URL" value={input.learnMoreURL} onChange={this.setValue} />
            <TextInput id="input.videoURL" label="Video URL" value={input.videoURL} onChange={this.setValue} />
          </Form>
        </EditRoute>
      </div>
    )
  }
}
