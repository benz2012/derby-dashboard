import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, CheckboxInput, MultiSelectInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { dateSort } from '../util/date'
import { setInput, newValues, substance } from '../util/form'

export default class ReportsPage extends Component {
  state = {
    unmounting: false,
    reports: null,
    challenges: null,
    result: null,
    input: {
      header: '',
      body: '',
      date: '',
      challenges: '',
      publish: false,
    },
  }

  componentDidMount() {
    this.fetchReportData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (e.target.type !== 'checkbox') e.preventDefault()
    const key = e.target.id.replace('input.', '')
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInput({ [key]: value }, this.setState.bind(this))
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
    const { reports, input } = this.state
    const { uid, token } = this.props.authValues()
    const report = reports.find(r => r.date === input.date)
    dataSend(`/data/reports/${input.date}`, 'POST', uid, token, newValues(report, input))
      .then(this.success)
      .catch(this.failure)
  }

  addItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const report = substance(input)
    dataSend('/data/reports', 'PUT', uid, token, report)
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

  openEdit = (id) => {
    const { reports } = this.state
    const report = reports.find(r => r.date === id)
    setInput({
      header: report.header,
      body: report.body,
      date: report.date,
      challenges: report.challenges.join(','),
      publish: report.publish,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  openAdd = () => {
    this.props.history.replace(`${this.props.match.url}/add`)
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
      challenges: '',
      publish: false,
    }, this.setState.bind(this))
  }

  reportURL = date => (date && `https://www.derbydashboard.io/reports/${date}`)

  render() {
    const { reports, challenges, input, result } = this.state
    if (!(reports && challenges)) return <Loading />
    // const challengeOptions = challenges.map(c => ({ value: c.id, label: c.name }))
    return (
      <div>
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Report</button>
        <DataBin
          items={reports}
          id={r => r.date}
          head={r => r.header}
          body={r => (
            <span>
              {r.body.substr(0, 100)}{r.body.length > 100 && '...'}<br />
              {r.date}<br />
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
          onDelete={this.openRemove}
        />

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.submitValues}
          result={result}
        >
          <Form>
            <TextInput id="input.date" label="Report Date" value={input.date} readOnly />
            <TextInput id="display.url" label="Report URL" value={this.reportURL(input.date)} readOnly />
            <TextInput id="input.header" label="Header" value={input.header} onChange={this.setValue} />
            <TextAreaInput id="input.body" label="Body" value={input.body} onChange={this.setValue} rows={3} />
            {/* <MultiSelectInput
              id="input.challenges"
              label="Linked Challenges"
              options={challengeOptions}
              value={this.state.blip}
              onChange={this.setMulti}
            /> */}
            <TextInput
              id="input.challenges"
              label="Linked Challenges"
              value={input.challenges}
              onChange={this.setValue}
              help="Add Comma Separated Challenge IDs with no space - ie. 12,4,7"
            />
            <CheckboxInput
              id="input.publish"
              label="Publish"
              value={input.publish}
              onChange={this.setValue}
              help="With this checked, all linked challeneges will be set to display publicly! - This feature doesn't work yet, so you'll need to manually make each challenge display public, but the report does need to be published!"
            />
            {/* <div style={{ marginBottom: '150px' }}>&nbsp;</div> */}
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
          <TextInput id="input.date" label="Report Date" value={input.date} onChange={this.setValue} help="YYYY-MM-DD" />
          <TextInput id="input.header" label="Header" value={input.header} onChange={this.setValue} />
          <TextAreaInput id="input.body" label="Body" value={input.body} onChange={this.setValue} rows={3} />
          <p>
            Report will <strong>not</strong> be published now, you must create it first.<br />
            Linking challenges and choosing to Publish happen on the edit menu.<br />
            There can only exist <u>one report per date</u>, so do not attempt to make more than one.
          </p>
        </EditRoute>

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.removeItem}
          result={result}
          path="remove"
          task="Removed"
        >
          Are you sure you want to delete the <strong>{input.date}: {input.header}</strong> Report?
        </EditRoute>
      </div>
    )
  }
}
