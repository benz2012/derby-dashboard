import React, { Component } from 'react'
import moment from 'moment'

import EditRoute from './EditRoute'
import Loading from '../components/Loading'

import DataBin from '../componentsAdmin/DataBin'
import ExitModalIf from '../componentsAdmin/ExitModalIf'
import ListData from '../componentsAdmin/ListData'
import Form, { TextInput, TextAreaInput, SelectInput,
  DateInput } from '../componentsAdmin/Form'

import { dataFetch, dataSend, objectSort } from '../util'
import { dateSort } from '../util/date'
import { setInput, newValues, substance, hasDefault,
  isFormValidAndSetErrors } from '../util/form'

export default class ReportsPage extends Component {
  addForm = React.createRef()

  editForm = React.createRef()

  state = {
    unmounting: false,
    reports: null,
    challenges: null,
    result: null,
    input: {
      header: '',
      body: '',
      date: '',
      challenges: {},
      challengeNames: {},
      publish: false,
    },
    errors: {},
  }

  componentDidMount() {
    this.fetchReportData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (hasDefault(e) && e.target.type !== 'checkbox') e.preventDefault()
    const key = e.target.id.replace('input.', '')
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInput({ [key]: value }, this.setState.bind(this))
  }

  setChallengeName = (e) => {
    const optionIndex = e.target.selectedIndex
    const optionElement = e.target.childNodes[optionIndex]
    const index = e.target.id.replace('input.challenges.', '')
    const challengeId = optionElement.getAttribute('id')
    const challenge = this.state.challenges.find(c => parseInt(c.id) === parseInt(challengeId))
    if (challenge) {
      setInput({
        [`challenges.${index}`]: challenge.id,
        [`challengeNames.${index}`]: challenge.name,
      }, this.setState.bind(this))
    } else {
      setInput({
        [`challenges.${index}`]: null,
        [`challengeNames.${index}`]: e.target.value,
      }, this.setState.bind(this))
    }
  }

  fetchReportData = () => {
    dataFetch('/data/reports').then((data) => {
      if (data[0] && data[0].date) objectSort(data, 'date', dateSort)
      if (!this.state.unmounting) this.setState({ reports: data })
    })
    dataFetch('/data/challenges').then((data) => {
      if (!this.state.unmounting) this.setState({ challenges: data })
    })
  }

  success = (d) => {
    if (d) {
      this.setState({ result: 'SUCCESS' })
      this.fetchReportData()
    }
  }

  failure = (e) => {
    console.log(e)
    this.setState({ result: 'FAILURE' })
  }

  submitValues = () => {
    this.setState({ result: null })
    if (isFormValidAndSetErrors(this.editForm.current, this) === false) {
      return
    }

    const { reports, input } = this.state
    const { uid, token } = this.props.authValues()
    const report = reports.find(r => r.date === input.date)
    const toSend = newValues(report, input).filter(elm => (
      !(['challenges', 'challengeNames'].includes(Object.keys(elm)[0]))
    ))
    toSend.push({
      challenges: Object.values(input.challenges)
        .filter(ch => (ch !== '' && ch !== null && ch !== undefined)),
    })

    dataSend(`/data/reports/${input.date}`, 'POST', uid, token, toSend)
      .then(this.success)
      .catch(this.failure)
  }

  addItem = () => {
    if (isFormValidAndSetErrors(this.addForm.current, this) === false) {
      return
    }

    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const report = substance(input)
    report.challenges = []
    dataSend('/data/reports', 'PUT', uid, token, report)
      .then(this.success)
      .catch(this.failure)
  }

  publish = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const data = [{ publish: !input.publish }]
    dataSend(`/data/reports/${input.date}`, 'POST', uid, token, data)
      .then(this.success)
      .catch(this.failure)
  }

  removeItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    dataSend(`/data/reports/${input.date}`, 'DELETE', uid, token, {})
      .then(this.success)
      .catch(this.failure)
  }

  addLink = () => {
    const { challenges } = this.state.input
    const ids = Object.keys(challenges)
      .map(k => parseInt(k, 10))
      .sort((a, b) => (b - a))
    const nextId = ids.length === 0 ? 0 : ids[0] + 1
    setInput({ [`challenges.${nextId}`]: '' }, this.setState.bind(this))
  }

  removeLink = (id) => {
    const { challenges } = this.state.input
    const updatedChallenges = Object.keys(challenges)
      .filter(k => k !== id)
      .reduce((acc, k) => { acc[k] = challenges[k]; return acc }, {})
    setInput({ challenges: updatedChallenges }, this.setState.bind(this))
  }

  openEdit = (id) => {
    const { reports, challenges } = this.state
    const report = reports.find(r => r.date === id)
    const challengeNames = {}
    const challengesData = report.challenges.reduce((acc, curr, idx) => {
      acc[idx] = curr
      challengeNames[idx] = challenges.find(c => parseInt(c.id) === parseInt(curr)).name
      return acc
    }, {})
    setInput({
      header: report.header,
      body: report.body,
      date: report.date,
      challenges: challengesData,
      challengeNames,
      publish: report.publish,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  openAdd = () => {
    setInput({ date: moment(Date.now()).format('YYYY-MM-DD') }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/add`)
  }

  openPublish = (id) => {
    const report = this.state.reports.find(r => r.date === id)
    setInput({
      date: report.date,
      header: report.header,
      publish: report.publish,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/publish`)
  }

  openRemove = (id) => {
    const report = this.state.reports.find(r => r.date === id)
    setInput({ date: report.date, header: report.header }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/remove`)
  }

  closeModal = () => {
    this.resetValues()
    this.setState({ result: null })
  }

  resetValues = () => {
    setInput({
      header: '',
      body: '',
      date: '',
      challenges: {},
      challengeNames: {},
      publish: false,
    }, this.setState.bind(this))
  }

  reportURL = date => (date && `https://www.derbydashboard.io/reports/${date}`)

  checkUniqueLink = ({ id }) => {
    const elm = document.getElementById(id)
    const optionIndex = elm.selectedIndex
    const optionElement = elm.childNodes[optionIndex]
    const challengeId = optionElement.getAttribute('id')
    const same = Object.values(this.state.input.challenges)
      .filter(i => parseInt(i) === parseInt(challengeId))
    if (same.length > 1) {
      return 'Duplicate challenge links are not allowed.'
    }
    return ''
  }

  render() {
    const { reports, challenges, input, errors, result } = this.state
    if (!(reports && challenges)) return <Loading />
    return (
      <div>
        <ExitModalIf value={input.date} paths={['edit', 'remove', 'publish']} />
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Report</button>
        <DataBin
          items={reports}
          id={r => r.date}
          head={r => r.header}
          body={r => (
            <span>
              {moment(r.date).format('dddd, MMMM Do, YYYY')}<br />
              <a href={this.reportURL(r.date)} target="_blank" rel="noopener noreferrer">{this.reportURL(r.date)}</a>
              <br />
              {r.publish ? (
                <strong className="text-success">Published</strong>
              ) : (
                <strong className="text-warning">Hidden</strong>
              )}
            </span>
          )}
          onEdit={this.openEdit}
          isPublished={r => r.publish}
          onPublish={this.openPublish}
          onDelete={this.openRemove}
        />

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.submitValues}
          result={result}
        >
          <Form ref={this.editForm}>
            <TextInput id="input.date" label="Report Date" value={moment(input.date).format('dddd, MMMM Do, YYYY')} readOnly />
            <TextInput id="display.url" label="Report URL" value={this.reportURL(input.date)} readOnly />
            <TextInput id="input.header" label="Header" value={input.header} error={errors.header} onChange={this.setValue} required />
            <TextAreaInput id="input.body" label="Body" value={input.body} error={errors.body} onChange={this.setValue} rows={3} required />
            <hr />
            <h4>Linked Challenges</h4>
            <button type="button" className="btn btn-success btn-sm mb-4" onClick={this.addLink}>
              + Add Link
            </button>
            <ListData
              data={Object.entries(input.challenges).map(([id, value]) => ({ id, value }))}
              renderInput={({ id }) => (
                <SelectInput
                  id={`input.challenges.${id}`}
                  options={['-- None --', ...challenges.map(c => c.name)]}
                  ids={[null, ...challenges.map(c => c.id)]}
                  value={input.challengeNames[id]}
                  onChange={this.setChallengeName}
                  customvalid="checkUniqueLink"
                  error={errors && errors.challenges && errors.challenges[id]}
                />
              )}
              onDelete={this.removeLink}
            />
          </Form>
        </EditRoute>

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.addItem}
          result={result}
          path="add"
          task="Added"
        >
          <h4>Adding New Report</h4><hr />
          <Form ref={this.addForm}>
            <DateInput id="input.date" label="Report Date" value={input.date} error={errors.date} onChange={this.setValue} options={{ altFormat: 'l, F j, Y' }} required />
            <TextInput id="input.header" label="Header" value={input.header} error={errors.header} onChange={this.setValue} required />
            <TextAreaInput id="input.body" label="Body" value={input.body} error={errors.body} onChange={this.setValue} rows={3} required />
          </Form>
          <p>
            Linking challenges happens on the edit menu.
          </p>
        </EditRoute>

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.publish}
          result={result}
          path="publish"
          task={input.publish ? 'Unpublished' : 'Published'}
        >
          Are you sure you want to&nbsp;
          <u>{input.publish ? 'unpublish' : 'publish'}</u> the&nbsp;
          <strong>{
            moment(input.date).format('dddd, MMMM Do, YYYY')
          }: {input.header}
          </strong>
          &nbsp;Report? This will also <u>publish scores</u>
          &nbsp;for all challenges linked to this report.
        </EditRoute>

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.removeItem}
          result={result}
          path="remove"
          task="Removed"
        >
          Are you sure you want to delete the&nbsp;
          <strong>{moment(input.date).format('dddd, MMMM Do, YYYY')}: {input.header}</strong> Report?
        </EditRoute>
      </div>
    )
  }
}
