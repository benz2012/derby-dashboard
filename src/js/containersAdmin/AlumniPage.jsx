import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput } from '../util/form'

export default class AlumniPage extends Component {
  state = {
    unmounting: false,
    result: null,
    alumni: null,
    challenges: null,
    input: {
      id: '',
      name: '',
      email: '',
      pledges: {},
    },
  }

  componentDidMount() {
    this.fetchAlumniData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }

  fetchAlumniData = () => {
    dataFetch('/data/alumni').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ alumni: data })
    })
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
    toSend.pledges = Object.keys(toSend.pledges).reduce((acc, key) => {
      acc[key] = parseInt(toSend.pledges[key], 10)
      return acc
    }, {})

    dataSend(`/data/alumni/${input.id}`, 'POST', uid, token, toSend)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchAlumniData()
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
    dataSend('/data/alumni', 'PUT', uid, token, toSend)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchAlumniData()
        }
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }

  removeItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    dataSend(`/data/alumni/${input.id}`, 'DELETE', uid, token, {})
      .then(() => {
        this.setState({ result: 'SUCCESS' })
        this.fetchAlumniData()
      }).catch((e) => {
        console.log(e)
        this.setState({ result: 'FAILURE' })
      })
  }

  openEdit = (id) => {
    const { alumni, challenges } = this.state
    const alum = alumni.find(a => a.id === id)
    let { pledges } = alum
    if (challenges.length > 0) {
      pledges = challenges.reduce((acc, cur) => {
        acc[cur.id] = pledges[cur.id] || 0
        return acc
      }, {})
    }

    setInput({
      id,
      name: alum.name,
      email: alum.email,
      pledges,
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }

  openAdd = () => {
    this.props.history.replace(`${this.props.match.url}/add`)
  }

  openRemove = (id) => {
    const alum = this.state.alumni.find(a => a.id === id)
    setInput({ id: alum.id, name: alum.name }, this.setState.bind(this))
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
      email: '',
      pledges: {},
    }, this.setState.bind(this))
  }

  pledgeDescription = (pledges) => {
    if (!pledges) return '0 Pledges'
    const num = Object.keys(pledges)
      .filter((key) => {
        const pledge = pledges[key]
        return pledge > 0
      }).length
    return `${num} Pledge${num !== 1 ? 's' : ''}`
  }

  render() {
    const { alumni, challenges, input, result } = this.state
    if (!(alumni && challenges)) return <Loading />
    return (
      <div>
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Alumni</button>
        <DataBin
          items={alumni}
          head={a => a.name}
          body={a => (
            <span>
              {a.email}<br />
              {this.pledgeDescription(a.pledges)}
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
            <TextInput id="input.name" label="Full Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.email" label="Email Address" value={input.email} onChange={this.setValue} />
            <hr />
            <h4>Pledges</h4>
            {
              challenges.map(c => (
                <TextInput
                  key={c.id}
                  id={`input.pledges.${c.id}`}
                  label={c.name}
                  value={input.pledges[c.id]}
                  onChange={this.setValue}
                />
              ))
            }
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
            <TextInput id="input.name" label="Full Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.email" label="Email Address" value={input.email} onChange={this.setValue} />
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
          Are you sure you want to delete Alumni Data for <strong>{input.name}</strong>?
        </EditRoute>
      </div>
    )
  }
}
