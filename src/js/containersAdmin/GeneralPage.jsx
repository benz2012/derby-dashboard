import React, { Component } from 'react'
import moment from 'moment'

import Loading from '../components/Loading'
import DataCard from '../componentsAdmin/DataCard'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, TimeInput, DateInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend } from '../util'
import { setInput, newValues, hasDefault,
  isFormValidAndSetErrors } from '../util/form'

const ALERT_RANGE_MAX = 8

export default class GeneralPage extends Component {
  schoolForm = React.createRef()

  eventForm = React.createRef()

  homepageForm = React.createRef()

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
      alertRange: {
        start: '',
        end: '',
      },
    },
    errors: {},
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

  setAlertRange = (e) => {
    const { selectedDates } = e.target
    const dateStrs = selectedDates.map(dt => moment(dt).format('YYYY-MM-DD'))
    setInput({
      alertRange: { start: dateStrs[0], end: dateStrs[1] },
    }, this.setState.bind(this))
  }

  submitValues = (url) => {
    this.setState({ result: null })
    const paths = this.props.location.pathname.split('/')
    const path = paths[paths.length - 1]
    if (isFormValidAndSetErrors(this[`${path}Form`].current, this) === false) {
      return
    }

    const { general, input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = newValues(general, input)
    dataSend(url, 'POST', uid, token, toSend).then((d) => {
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
      alertRange: this.state.general.alertRange,
    }, this.setState.bind(this))
  }

  render() {
    const { general, input, errors, result } = this.state
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
          <Form ref={this.schoolForm}>
            <TextInput id="input.name" label="School Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextInput id="input.abbrv" label="School Abbreviation" value={input.abbrv} error={errors.abbrv} onChange={this.setValue} required />
            <TextInput id="general.schoolURL" label="Derby Challenge URL" value={general.schoolURL} readOnly />
            <TextInput id="general.avatar" label="Derby Challenge Avatar" value={general.avatar} readOnly />
          </Form>
        </EditRoute>

        <EditRoute {...this.props} path="event" close={this.closeModal} submit={() => this.submitValues('/data/home')} result={result}>
          <Form ref={this.eventForm}>
            <TextInput
              id="input.year"
              label="Event Year"
              value={input.year}
              error={errors.year}
              onChange={this.setValue}
              required
              pattern="[0-9]{4}"
              title="Year should be 4 digits formatted as YYYY."
            />
            <DateInput
              id="input.alertRange"
              label="Text Alert Date Range"
              options={{
                mode: 'range',
                altFormat: 'F J Y',
                disable: [(date) => {
                  if (input.alertRange.start && input.alertRange.end) return false
                  const selected = moment(input.alertRange.start)
                  return (
                    moment(date).isAfter(moment(selected).add(ALERT_RANGE_MAX, 'days')) ||
                    moment(date).isBefore(moment(selected))
                  )
                }],
              }}
              value={[input.alertRange.start, input.alertRange.end]}
              error={errors.alertRange}
              onChange={this.setAlertRange}
              help={`The maximum allowed range is ${ALERT_RANGE_MAX} days`}
              required
            />
            <TimeInput id="input.alertTime" label="Daily Text Alert Time" value={input.alertTime} error={errors.alertTime} onChange={this.setValue} required />
          </Form>
        </EditRoute>

        <EditRoute {...this.props} path="homepage" close={this.closeModal} submit={() => this.submitValues('/data/home/page')} result={result}>
          <Form ref={this.homepageForm}>
            <TextInput id="input.header" label="Header Line" value={input.header} error={errors.header} onChange={this.setValue} required />
            <TextAreaInput id="input.body" label="Body Text" value={input.body} error={errors.body} onChange={this.setValue} rows={3} required />
            <TextInput
              id="input.learnMoreURL"
              label="Learn More URL"
              value={input.learnMoreURL}
              error={errors.learnMoreURL}
              onChange={this.setValue}
              required
              pattern="^(http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"
              title="URL should be formatted similar to http://www.website.com/page"
            />
            <TextInput
              id="input.videoURL"
              label="Video URL"
              value={input.videoURL}
              error={errors.videoURL}
              onChange={this.setValue}
              required
              pattern="^(http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"
              title="URL should be formatted similar to http://www.website.com/page"
            />
          </Form>
        </EditRoute>
      </div>
    )
  }
}
