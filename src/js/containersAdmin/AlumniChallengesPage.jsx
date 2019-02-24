import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import ExitModalIf from '../componentsAdmin/ExitModalIf'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, DateInput } from '../componentsAdmin/Form'
import ListData from '../componentsAdmin/ListData'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, hasDefault, isFormValidAndSetErrors } from '../util/form'

export default class AlumniChallengesPage extends Component {
  addForm = React.createRef()

  editForm = React.createRef()

  state = {
    unmounting: false,
    result: null,
    challenges: null,
    input: {
      id: '',
      name: '',
      description: '',
      endDate: '',
      countData: {},
      countName: '',
    },
    errors: {},
  }

  componentDidMount() {
    this.fetchChallengeData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (hasDefault(e)) e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }

  fetchChallengeData = () => {
    dataFetch('/data/alumni/challenges').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ challenges: data })
    })
  }

  submitValues = () => {
    if (isFormValidAndSetErrors(this.editForm.current, this) === false) {
      return
    }

    this.setState({ result: null })
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = {
      ...input,
      countData: Object.values(input.countData),
    }
    delete toSend.id

    dataSend(`/data/alumni/challenges/${input.id}`, 'POST', uid, token, toSend)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchChallengeData()
        }
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }

  addItem = () => {
    if (isFormValidAndSetErrors(this.addForm.current, this) === false) {
      return
    }

    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = {
      ...input,
      countData: [],
    }
    delete toSend.id
    dataSend('/data/alumni/challenges', 'PUT', uid, token, toSend)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchChallengeData()
        }
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }

  removeItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    dataSend(`/data/alumni/challenges/${input.id}`, 'DELETE', uid, token, {})
      .then(() => {
        this.setState({ result: 'SUCCESS' })
        this.fetchChallengeData()
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }

  addCountDataItem = () => {
    const ids = Object.keys(this.state.input.countData)
      .map(k => parseInt(k, 10))
      .sort((a, b) => (b - a))
    const nextId = ids.length === 0 ? 0 : ids[0] + 1
    setInput({ [`countData.${nextId}`]: '' }, this.setState.bind(this))
  }

  removeCountDataItem = (id) => {
    const { countData } = this.state.input
    const updatedData = Object.keys(countData)
      .filter(k => k !== id)
      .reduce((acc, k) => { acc[k] = countData[k]; return acc }, {})
    setInput({ countData: updatedData }, this.setState.bind(this))
  }

  openEdit = (id) => {
    const { challenges } = this.state
    const chal = challenges.find(c => c.id === id)
    const countData = chal.countData.reduce((acc, curr, idx) => {
      acc[idx] = curr
      return acc
    }, {})

    setInput({
      id,
      name: chal.name,
      description: chal.description,
      endDate: chal.endDate,
      countData,
      countName: chal.countName,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  openAdd = () => {
    this.props.history.replace(`${this.props.match.url}/add`)
  }

  openRemove = (id) => {
    const chal = this.state.challenges.find(c => c.id === id)
    setInput({ id: chal.id, name: chal.name }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/remove`)
  }

  closeModal = () => {
    this.resetValues()
    this.setState({ result: null })
  }

  resetValues = () => {
    setInput({
      id: '',
      name: '',
      description: '',
      endDate: '',
      countData: {},
      countName: '',
    }, this.setState.bind(this))
  }

  render() {
    const { challenges, input, errors, result } = this.state
    if (!challenges) return <Loading />
    return (
      <div>
        <ExitModalIf value={input.id} paths={['edit', 'remove']} />
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Alumni Challenge</button>
        <DataBin
          items={challenges}
          head={c => c.name}
          body={c => (
            <span>
              {c.description.substr(0, 100)}{c.description.length > 100 && '...'}<br />
              {c.countName} Added: {c.countData.length}
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
          <Form ref={this.editForm}>
            <TextInput id="input.name" label="Challenge Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextAreaInput id="input.description" rows={3} label="Description" value={input.description} error={errors.description} onChange={this.setValue} required />
            <DateInput id="input.endDate" label="End Date" value={input.endDate} error={errors.endDate} onChange={this.setValue} required />
            <TextInput
              id="input.countName"
              label="Count Name"
              value={input.countName}
              error={errors.countName}
              onChange={this.setValue}
              help="This name represents the plural quantifier of the data being counted, ie. Brothers"
              required
            />
            <hr />
            <h4>Count Data: {input.countName}</h4>
            <div style={{ marginBottom: '16px' }}>
              <small>
                You can add images, videos and styles to this data using&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Markdown</a>
              </small>
            </div>
            <button type="button" className="btn btn-success btn-sm mb-4" onClick={this.addCountDataItem}>
              + Add {
                input.countName.slice(-1) === 's' ?
                  input.countName.substring(0, input.countName.length - 1) :
                  input.countName
              }
            </button>
            <ListData
              data={Object.entries(input.countData).map(([id, value]) => ({ id, value }))}
              dataKey="countData"
              onChange={this.setValue}
              onDelete={this.removeCountDataItem}
              errors={errors}
            />
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
          <h4>Adding New Alumni Challenge</h4><hr />
          <Form ref={this.addForm}>
            <TextInput id="input.name" label="Challenge Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextAreaInput id="input.description" rows={3} label="Description" value={input.description} error={errors.description} onChange={this.setValue} required />
            <DateInput id="input.endDate" label="End Date" value={input.endDate} error={errors.endDate} onChange={this.setValue} required />
            <TextInput
              id="input.countName"
              label="Count Name"
              value={input.countName}
              error={errors.countName}
              onChange={this.setValue}
              help="This name represents the plural quantifier of the data being counted, ie. Brothers"
              required
            />
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
          Are you sure you want to delete the <strong>{input.name}</strong> alumni challenge?<br />
          This action will delete all Alumni Pledges tied to this challenge.
        </EditRoute>
      </div>
    )
  }
}
