import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput } from '../util/form'

export default class AlumniChallengesPage extends Component {
  state = {
    unmounting: false,
    result: null,
    challenges: null,
    input: {
      id: '',
      name: '',
      description: '',
      endDate: '',
      countData: [],
      countName: '',
    },
  }

  componentDidMount() {
    this.fetchChallengeData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    e.preventDefault()
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
    this.setState({ result: null })
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { ...input }
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
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { ...input }
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

  openEdit = (id) => {
    const { challenges } = this.state
    const chal = challenges.find(c => c.id === id)

    setInput({
      id,
      name: chal.name,
      description: chal.description,
      endDate: chal.endDate,
      countData: chal.countData,
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
      countData: [],
      countName: '',
    }, this.setState.bind(this))
  }

  render() {
    const { challenges, input, result } = this.state
    if (!challenges) return <Loading />
    return (
      <div>
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
          <Form>
            <TextInput id="input.name" label="Challenge Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.description" label="Description" value={input.description} onChange={this.setValue} />
            <TextInput id="input.endDate" label="End Date" value={input.endDate} onChange={this.setValue} help="YYYY-MM-DD" />
            <hr />
            <TextInput id="input.countName" label="Count Name" value={input.countName} onChange={this.setValue} help="This name represents the plural quantifier of the data being counted, ie. Brothers" />
            <div>Count Data Here</div>
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
          <Form>
            <TextInput id="input.name" label="Challenge Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.description" label="Description" value={input.description} onChange={this.setValue} />
            <TextInput id="input.endDate" label="End Date" value={input.endDate} onChange={this.setValue} help="YYYY-MM-DD" />
            <TextInput id="input.countName" label="Count Name" value={input.countName} onChange={this.setValue} help="This name represents the plural quantifier of the data being counted, ie. Brothers" />
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
          Are you sure you want to delete the <strong>{input.name}</strong> alumni challenge?
        </EditRoute>
      </div>
    )
  }
}
