import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, CheckboxInput } from '../componentsAdmin/Form'
import ScoreGroup from '../componentsAdmin/ScoreGroup'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, newValues, substance } from '../util/form'

export default class ChallengesPage extends Component {
  state = {
    unmounting: false,
    challenges: null,
    teams: null,
    result: null,
    input: {
      id: '',
      name: '',
      description: '',
      scores: {},
      public: false,
    },
  }

  componentDidMount() {
    this.fetchChallengeData()
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

  fetchChallengeData = () => {
    dataFetch('/data/challenges').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ challenges: data })
    })
    dataFetch('/data/teams').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ teams: data })
    })
  }

  submitValues = () => {
    this.setState({ result: null })
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
    const { challenges, teams } = this.state
    const challenge = challenges.find(c => parseInt(c.id) === parseInt(id))
    const scores = {}
    teams.forEach((t) => {
      const teamScore = challenge.scores[t.id]
      if (!teamScore) {
        scores[t.id] = { score: 0, include: false }
      } else {
        scores[t.id] = teamScore
      }
    })
    setInput({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      scores,
      public: challenge.public,
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

  includeAll = (e) => {
    e.preventDefault()
    const yes = Boolean(e.target.getAttribute('data-yes'))
    const { scores } = this.state.input
    Object.keys(scores).forEach((k) => {
      setInput({ [`scores.${k}.include`]: yes }, this.setState.bind(this))
    })
  }

  resetValues = () => {
    setInput({
      id: '',
      name: '',
      description: '',
      scores: {},
      public: false,
    }, this.setState.bind(this))
  }

  scoreValues = (teams, scores) => (
    Object.keys(scores).length > 0 &&
    teams.map(t => ({
      id: t.id,
      name: t.org,
      score: scores[t.id].score,
      include: scores[t.id].include,
    }))
  )

  render() {
    const { challenges, teams, input, result } = this.state
    if (!(challenges && teams)) return <Loading />
    const scoreValues = this.scoreValues(teams, input.scores)
    return (
      <div>
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Challenge</button>
        <DataBin
          items={challenges}
          head={c => c.name}
          body={c => (
            <span>
              {c.description.substr(0, 100)}{c.description.length > 100 && '...'}<br />
              {c.scores && `Scores Added: ${Object.keys(c.scores).length}`}
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
            <TextAreaInput
              id="input.description"
              label="Description"
              value={input.description}
              onChange={this.setValue}
              rows={3}
            />
            <h4>Scores</h4>
            <CheckboxInput id="input.public" label="Display Publicly" value={input.public} onChange={this.setValue} />
            {
              Object.keys(input.scores).length > 0 &&
              <ScoreGroup
                teams={scoreValues}
                onChange={this.setValue}
                includeAll={this.includeAll}
              />
            }
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
          <TextAreaInput
            id="input.description"
            label="Description"
            value={input.description}
            onChange={this.setValue}
            rows={3}
          />
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
