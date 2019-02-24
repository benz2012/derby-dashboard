import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import ExitModalIf from '../componentsAdmin/ExitModalIf'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { stringSort } from '../util/string'
import { setInput, isFormValidAndSetErrors } from '../util/form'

export default class AlumniPage extends Component {
  addForm = React.createRef()

  editForm = React.createRef()

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
    errors: {},
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
    if (isFormValidAndSetErrors(this.editForm.current, this) === false) {
      return
    }

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
    if (isFormValidAndSetErrors(this.addForm.current, this) === false) {
      return
    }

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
    const { alumni, challenges, input, errors, result } = this.state
    if (!(alumni && challenges)) return <Loading />
    return (
      <div>
        <ExitModalIf value={input.id} paths={['edit', 'remove']} />
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
          <Form ref={this.editForm}>
            <TextInput id="input.name" label="Full Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextInput
              id="input.email"
              label="Email Address"
              value={input.email}
              error={errors.email}
              onChange={this.setValue}
              required
              pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
              title="Email should look like name@website.com"
            />
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
                  error={errors && errors.pledges && errors.pledges[c.id]}
                  required
                  pattern="[0-9]+"
                  title="Pledges should be integer numbers."
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
          <h4>Adding New Alumni</h4><hr />
          <Form ref={this.addForm}>
            <TextInput id="input.name" label="Full Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextInput
              id="input.email"
              label="Email Address"
              value={input.email}
              error={errors.email}
              onChange={this.setValue}
              required
              pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
              title="Email should look like name@website.com"
            />
          </Form>
          <p>
            <em>Adding challenge pledges happens on the edit menu.</em>
          </p>
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
