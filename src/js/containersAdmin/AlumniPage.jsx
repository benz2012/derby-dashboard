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
    input: {
      id: '',
      name: '',
      email: '',
      pledges: [],
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
  }

  submitValues = () => {
    this.setState({ result: null })
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const toSend = { ...input }
    delete toSend.id
    dataSend(`/data/alumni/${input.id}`, 'POST', uid, token, toSend)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchAlumniData()
        }
      }).catch(() => {
        this.setState({ result: 'FAILURE' })
      })
  }

  openEdit = (id) => {
    const alum = this.state.alumni.find(a => a.id === id)
    setInput({
      id,
      name: alum.name,
      email: alum.email,
      pledges: alum.pledges,
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
      email: '',
      pledges: [],
    }, this.setState.bind(this))
  }

  render() {
    const { alumni, input, result } = this.state
    if (!alumni) return <Loading />
    return (
      <div>
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Alumni</button>
        <DataBin
          items={alumni}
          head={a => a.name}
          body={a => (
            <span>
              {a.email}<br />
              {Object.keys(a.pledges).length} Pledges
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
            <TextInput id="input.name" label="Full Name" value={input.name} onChange={this.setValue} />
            <TextInput id="input.email" label="Email Address" value={input.email} onChange={this.setValue} />
          </Form>
        </EditRoute>
      </div>
    )
  }
}
