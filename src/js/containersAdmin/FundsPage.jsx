import React, { Component } from 'react'
import moment from 'moment'
import currency from 'currency.js'

import Loading from '../components/Loading'
import ExitModalIf from '../componentsAdmin/ExitModalIf'
import DataBin from '../componentsAdmin/DataBin'
import Form, { TextInput, SelectInput, DateInput } from '../componentsAdmin/Form'
import EditRoute from './EditRoute'

import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, hasDefault, isFormValidAndSetErrors } from '../util/form'

export default class FundsPage extends Component {
  addForm = React.createRef()

  editForm = React.createRef()

  state = {
    unmounting: false,
    raised: null,
    teams: null,
    external: null,
    result: null,
    input: {
      teamId: '',
      teamName: '',
      entryId: '',
      amount: '',
      dateString: '',
    },
    errors: {},
  }

  componentDidMount() {
    this.fetchRaisedData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (hasDefault(e)) e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }

  setTeamValue = (e) => {
    const index = e.target.selectedIndex
    const optionElement = e.target.childNodes[index]
    const teamId = optionElement.getAttribute('id')
    const team = this.state.teams.find(t => parseInt(t.id) === parseInt(teamId))
    setInput({
      teamId,
      teamName: team.org,
    }, this.setState.bind(this))
  }

  fetchRaisedData = () => {
    dataFetch('/data/raised').then((data) => {
      if (!this.state.unmounting) this.setState({ raised: data })
    })
    dataFetch('/data/raised/external').then((data) => {
      const dataFlat = data.reduce((acc, cur) => (acc.concat(cur)), [])
      if (!this.state.unmounting) this.setState({ external: dataFlat })
    })
    dataFetch('/data/teams').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ teams: data })
    })
  }

  success = (d) => {
    if (d) {
      this.setState({ result: 'SUCCESS' })
      this.fetchRaisedData()
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

    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { ...input }
    delete toSend.teamName

    dataSend('/data/raised/external', 'POST', uid, token, toSend)
      .then(this.success)
      .catch(this.failure)
  }

  addItem = () => {
    if (isFormValidAndSetErrors(this.addForm.current, this) === false) {
      return
    }

    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { ...input }
    delete toSend.teamName
    delete toSend.entryId

    dataSend('/data/raised/external', 'PUT', uid, token, toSend)
      .then(this.success)
      .catch(this.failure)
  }

  removeItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { teamId: input.teamId, entryId: input.entryId }
    dataSend('/data/raised/external', 'DELETE', uid, token, toSend)
      .then(this.success)
      .catch(this.failure)
  }

  openEdit = (id) => {
    const ids = id.split('-')
    const teamId = parseInt(ids[1])
    const entryId = parseInt(ids[3])

    const { external, teams } = this.state
    const fund = external.find(e => e.teamId === teamId && e.entryId === entryId)
    const team = teams.find(t => t.id === teamId)

    setInput({
      ...fund,
      teamName: team.org,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  openAdd = () => {
    const { teams } = this.state
    setInput({
      teamId: teams[0].id,
      teamName: teams[0].org,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/add`)
  }

  openRemove = (id) => {
    const ids = id.split('-')
    const teamId = parseInt(ids[1])
    const entryId = parseInt(ids[3])

    const { external, teams } = this.state
    const fund = external.find(e => e.teamId === teamId && e.entryId === entryId)
    const team = teams.find(t => t.id === teamId)

    setInput({ ...fund, teamName: team.org }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/remove`)
  }

  closeModal = () => {
    this.resetValues()
    this.setState({ result: null })
  }

  resetValues = () => {
    setInput({
      teamId: '',
      teamName: '',
      entryId: '',
      amount: '',
      dateString: '',
    }, this.setState.bind(this))
  }

  formatFund = amount => currency(amount, { formatWithSymbol: true }).format()

  render() {
    const { raised, external, teams, input, errors, result } = this.state
    if (!(raised && external && teams)) return <Loading />
    return (
      <div>
        <ExitModalIf value={input.entryId} paths={['edit', 'remove']} />
        <h4>External Funds</h4>
        <hr />
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add External Fund</button>
        <DataBin
          items={external}
          id={e => `team-${e.teamId}-id-${e.entryId}`}
          body={e => (
            <span>
              {teams.find(t => t.id === e.teamId).org}:&nbsp;
              {this.formatFund(e.amount)}<br />
              {moment(e.dateString).format('MMM do, YYYY')}
            </span>
          )}
          onEdit={this.openEdit}
          onDelete={this.openRemove}
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

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.submitValues}
          result={result}
        >
          <Form ref={this.editForm}>
            <TextInput id="input.teamName" label="Team" value={input.teamName} disabled />
            <TextInput
              id="input.amount"
              label="Amount"
              prepend="$"
              value={input.amount}
              error={errors.amount}
              onChange={this.setValue}
              required
              pattern="[0-9]+(\.[0-9]{2})?"
              title="Amount should be formatted as X.XX"
            />
            <DateInput id="input.dateString" label="Date" value={input.dateString} error={errors.dateString} onChange={this.setValue} required />
          </Form>
        </EditRoute>

        <EditRoute
          {...this.props}
          path="add"
          close={this.closeModal}
          submit={this.addItem}
          result={result}
          task="Added"
        >
          <h4>Adding New External Fund</h4><hr />
          <Form ref={this.addForm}>
            <SelectInput
              id="input.teamName"
              label="Team"
              options={teams.map(t => t.org)}
              ids={teams.map(t => t.id)}
              value={input.teamName}
              onChange={this.setTeamValue}
            />
            <TextInput
              id="input.amount"
              label="Amount"
              prepend="$"
              value={input.amount}
              error={errors.amount}
              onChange={this.setValue}
              required
              pattern="[0-9]+(\.[0-9]{2})?"
              title="Amount should be formatted as X.XX"
            />
            <DateInput id="input.dateString" label="Date" value={input.dateString} error={errors.dateString} onChange={this.setValue} required />
          </Form>
        </EditRoute>

        <EditRoute
          {...this.props}
          path="remove"
          close={this.closeModal}
          submit={this.removeItem}
          result={result}
          task="Removed"
        >
          Are you sure you want to delete&nbsp;
          <strong>{this.formatFund(input.amount)}</strong> from&nbsp;
          <strong>{input.teamName}</strong>?
        </EditRoute>
      </div>
    )
  }
}
