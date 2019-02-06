import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, newValues } from '../util/form'

export default class TeamsPage extends Component {
  state = {
    unmounting: false,
    result: null,
    teams: null,
    input: {
      id: '',
      name: '',
      org: '',
      orgId: '',
      avatar: '',
      cover: '',
      url: '',
      members: '',
      snap: '',
    },
  }

  componentDidMount() {
    this.fetchTeamData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }

  fetchTeamData = () => {
    dataFetch('/data/teams').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ teams: data })
    })
  }

  submitValues = () => {
    this.setState({ result: null })
    const { teams, input } = this.state
    const { uid, token } = this.props.authValues()
    const team = teams.find(t => parseInt(t.id) === parseInt(input.id))
    dataSend(`/data/teams/${input.id}`, 'POST', uid, token, newValues(team, input))
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchTeamData()
        }
      }).catch(() => {
        this.setState({ result: 'FAILURE' })
      })
  }

  openEdit = (id) => {
    const team = this.state.teams.find(t => parseInt(t.id) === parseInt(id))
    setInput({
      id: team.id,
      name: team.name,
      org: team.org,
      orgId: team.orgId,
      avatar: team.avatar,
      cover: team.cover,
      url: team.url,
      members: team.members,
      snap: team.snap,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  closeModal = () => {
    this.resetValues()
    this.setState({ result: null })
  }

  resetValues = () => {
    setInput({
      id: '',
      name: '',
      org: '',
      orgId: '',
      avatar: '',
      cover: '',
      url: '',
      members: '',
      snap: '',
    }, this.setState.bind(this))
  }

  render() {
    const { teams, input, result } = this.state
    if (!teams) return <Loading />
    return (
      <div>
        <DataBin
          items={teams}
          head={t => t.org}
          body={t => (
            <span>
              {t.name}<br />
              <a href={t.url} className="card-link" target="_blank" rel="noopener noreferrer">{t.url}</a>
            </span>
          )}
          onEdit={this.openEdit}
        />

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.submitValues}
          result={result}
        >
          <Form>
            <TextInput id="input.name" label="Team Name" value={input.name} readOnly />
            <TextInput id="input.org" label="Organization" value={input.org} onChange={this.setValue} />
            <TextInput id="input.orgId" label="Organization Identifier" value={input.orgId} onChange={this.setValue} />
            <TextInput id="input.snap" label="Snapchat Lens URL" value={input.snap} onChange={this.setValue} />
            <TextInput id="input.avatar" label="Avatar Photo" value={input.avatar} readOnly />
            <TextInput id="input.cover" label="Cover Photo" value={input.cover} readOnly />
            <TextInput id="input.url" label="Derby Challenge URL" value={input.url} readOnly />
            <TextInput id="input.members" label="Members Signed Up" value={input.members} readOnly />
          </Form>
        </EditRoute>
      </div>
    )
  }
}
