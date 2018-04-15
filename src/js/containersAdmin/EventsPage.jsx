import React, { Component } from 'react'
import moment from 'moment'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, SelectInput } from '../componentsAdmin/Form'
import { dataFetch, dataSend, objectSort } from '../util'
import { dateSort, timeSort } from '../util/date'
import { setInput, newValues } from '../util/form'

export default class EventsPage extends Component {
  state = {
    unmounting: false,
    result: null,
    events: null,
    eventsFlat: null,
    input: {
      id: '',
      name: '',
      location: '',
      description: '',
      time: {
        start: '',
        end: '',
      },
      date: '',
      type: '',
      challengeId: '',
      challenge: '',
    },
  }
  componentDidMount() {
    this.fetchEventData()
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  setValue = (e) => {
    e.preventDefault()
    const key = e.target.id.replace('input.', '')
    setInput({ [key]: e.target.value }, this.setState.bind(this))
  }
  fetchEventData = () => {
    dataFetch('/data/events').then((data) => {
      if (Object.keys(data).length > 0 && data[Object.keys(data)[0]][0].name) {
        const dataList = Object.keys(data).map(k => ({ date: k, events: data[k] }))
        objectSort(dataList, 'date', dateSort)
        dataList.forEach((dateObj) => {
          objectSort(dateObj.events, 'time.start', timeSort)
        })
        const listOfEventLists = dataList.map(dataObj => dataObj.events)
        const flatDataList = [].concat(...listOfEventLists)
        if (!this.state.unmounting) {
          this.setState({ events: dataList })
          this.setState({ eventsFlat: flatDataList })
        }
      }
    })
  }
  submitValues = () => {
    const { eventsFlat, input } = this.state
    const { uid, token } = this.props.authValues()
    const event = eventsFlat.find(e => parseInt(e.id) === parseInt(input.id))
    dataSend(`/data/events/${input.id}`, 'POST', uid, token, newValues(event, input)).then((d) => {
      if (d) {
        this.setState({ result: 'SUCCESS' })
        this.fetchEventData()
      }
    }).catch(() => {
      this.setState({ result: 'FAILURE' })
    })
  }
  addItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    const event = Object.keys(input)
      .filter(key => input[key] !== '')
      .reduce((prev, key) => {
        prev[key] = input[key]
        return prev
      }, {})
    dataSend('/data/events', 'PUT', uid, token, event)
      .then((d) => {
        if (d) {
          this.setState({ result: 'SUCCESS' })
          this.fetchEventData()
        }
      }).catch(() => {
        this.setState({ result: 'FAILURE' })
      })
  }
  removeItem = () => {
    const { input } = this.state
    const { uid, token } = this.props.authValues()
    dataSend(`/data/events/${input.id}`, 'DELETE', uid, token, {})
      .then(() => {
        this.setState({ result: 'SUCCESS' })
        this.fetchEventData()
      }).catch(() => {
        this.setState({ result: 'FAILURE' })
      })
  }
  openModal = (id) => {
    const event = this.state.eventsFlat.find(e => parseInt(e.id) === parseInt(id))
    setInput({
      id: event.id,
      name: event.name,
      location: event.location,
      description: event.description,
      time: event.time,
      date: event.date,
      type: event.type,
      challenge: event.challenge,
      challengeId: event.challengeId || '',
    }, this.setState.bind(this))
    this.props.history.replace(`${this.props.match.url}/edit`)
  }
  openAdd = () => {
    this.props.history.replace(`${this.props.match.url}/add`)
  }
  openRemove = (id) => {
    const event = this.state.eventsFlat.find(e => parseInt(e.id) === parseInt(id))
    setInput({ id: event.id, name: event.name }, this.setState.bind(this))
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
      location: '',
      description: '',
      time: {
        start: '',
        end: '',
      },
      date: '',
      type: '',
      challenge: '',
      challengeId: '',
    }, this.setState.bind(this))
  }
  render() {
    const { events, input, result } = this.state
    if (!events) return <Loading />
    return (
      <div>
        <button className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Event</button>
        {
          events.map(dateObj => (
            <div key={dateObj.date}>
              <h4>{moment(dateObj.date).format('dddd MMMM Do YYYY')}</h4>
              <hr />
              <DataBin
                items={dateObj.events}
                head={e => e.name}
                body={e => (<span>{e.date} {e.time.start}<br />{e.location}</span>)}
                onEdit={this.openModal}
                onDelete={this.openRemove}
              />
              <div className="mb-5" />
            </div>
          ))
        }

        <EditRoute
          {...this.props}
          close={this.closeModal}
          submit={this.submitValues}
          result={result}
        >
          <Form>
            <TextInput id="input.id" label="Event ID" value={input.id} readOnly />
            <TextInput id="input.name" label="Event Name" value={input.name} onChange={this.setValue} />
            <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.location" label="Location" value={input.location} onChange={this.setValue} />
            <TextInput id="input.date" label="Date" value={input.date} onChange={this.setValue} help="YYYY-MM-DD" />
            <TextInput id="input.time.start" label="Start Time" value={input.time.start} onChange={this.setValue} help="HH:MM (24hr)" />
            <TextInput id="input.time.end" label="End Time " value={input.time.end} onChange={this.setValue} help="HH:MM (24hr)" />
            <SelectInput id="input.type" label="Type" options={['Individual Activity', 'Team Activity', 'Public Event']} value={input.type} onChange={this.setValue} />
            <TextInput id="input.challengeId" label="Linked Challenge ID" value={input.challengeId} onChange={this.setValue} />
            <TextAreaInput id="input.challenge" label="Linked Challenge" value={input.challenge} rows={3} readOnly />
          </Form>
        </EditRoute>

        <EditRoute
          {...this.props}
          path={'add'}
          close={this.closeModal}
          submit={this.addItem}
          result={result}
          task={'Added'}
        >
          <Form>
            <TextInput id="input.name" label="Event Name" value={input.name} onChange={this.setValue} />
            <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.location" label="Location" value={input.location} onChange={this.setValue} />
            <TextInput id="input.date" label="Date" value={input.date} onChange={this.setValue} help="YYYY-MM-DD" />
            <TextInput id="input.time.start" label="Start Time" value={input.time.start} onChange={this.setValue} help="HH:MM (24hr)" />
            <TextInput id="input.time.end" label="End Time " value={input.time.end} onChange={this.setValue} help="HH:MM (24hr)" />
            <SelectInput id="input.type" label="Type" options={['Individual Activity', 'Team Activity', 'Public Event']} value={input.type} onChange={this.setValue} />
          </Form>
        </EditRoute>

        <EditRoute
          {...this.props}
          path={'remove'}
          close={this.closeModal}
          submit={this.removeItem}
          result={result}
          task={'Removed'}
        >
          Are you sure you want to delete the <strong>{input.name}</strong> event?
        </EditRoute>
      </div>
    )
  }
}
