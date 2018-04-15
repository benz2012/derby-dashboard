import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, newValues, substance } from '../util/form'

export default class ChallengesPage extends Component {
  state = {
    unmounting: false,
    challenges: null,
    result: null,
    input: {
      id: '',
      name: '',
      description: '',
      scores: [],
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
    dataFetch('/data/challenges').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ challenges: data })
    })
  }
  submitValues = () => {
    const { challenges, input } = this.state
    const { uid, token } = this.props.authValues()
    const challenge = challenges.find(c => parseInt(c.id) === parseInt(input.id))
    dataSend(`/data/challenges/${input.id}`, 'POST', uid, token, newValues(challenge, input))
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchChallengeData()
        }
      })
      .catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }
  addItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const challenge = substance(input)
    dataSend('/data/challenges', 'PUT', uid, token, challenge)
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
    dataSend(`/data/challenges/${input.id}`, 'DELETE', uid, token, {})
      .then(() => {
        this.setState({ result: 'SUCCESS' })
        this.fetchChallengeData()
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }
  openEdit = (id) => {
    const challenge = this.state.challenges.find(c => parseInt(c.id) === parseInt(id))
    setInput({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      scores: challenge.scores.map(c => JSON.stringify(c)).toString(),
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }
  openAdd = () => {
    this.props.history.replace(`${this.props.match.url}/add`)
  }
  openRemove = (id) => {
    const challenge = this.state.challenges.find(c => parseInt(c.id) === parseInt(id))
    setInput({ id: challenge.id, name: challenge.name }, this.setState.bind(this))
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
      scores: [],
    }, this.setState.bind(this))
  }
  render() {
    const { challenges, input, result } = this.state
    if (!challenges) return <Loading />
    return (
      <div>
        <button className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Challenge</button>
        <DataBin
          items={challenges}
          head={c => c.name}
          body={c => (
            <span>
              {c.description.substr(0, 100)}{c.description.length > 100 && '...'}<br />
              {c.scores && `Scores Added: ${c.scores.length}`}
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
            <TextInput id="input.id" label="Challenge ID" value={input.id} readOnly />
            <TextInput id="input.name" label="Challenge Name" value={input.name} onChange={this.setValue} />
            <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.scores" label="Scores" value={input.scores} readOnly />
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
          <TextInput id="input.name" label="Challenge Name" value={input.name} onChange={this.setValue} />
          <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
        </EditRoute>

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.removeItem}
          result={result}
          path="remove"
          task="Removed"
        >
          Are you sure you want to delete the <strong>{input.name}</strong> challenge?
        </EditRoute>
      </div>
    )
  }
}
