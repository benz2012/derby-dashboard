import React, { Component } from 'react'
import moment from 'moment'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import EditRoute from './EditRoute'
import Form, { TextInput, TextAreaInput, SelectInput, DateInput } from '../componentsAdmin/Form'
import ListData from '../componentsAdmin/ListData'
import { dataFetch, dataSend, objectSort } from '../util'
import { dateSort, timeSort } from '../util/date'
import { setInput, newValues, substance, hasDefault } from '../util/form'

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
      tags: {},
    },
  }

  componentDidMount() {
    this.fetchEventData()
  }

  componentWillUnmount() {
    this.setState({ unmounting: true })
  }

  setValue = (e) => {
    if (hasDefault(e)) e.preventDefault()
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
    this.setState({ result: null })
    const { eventsFlat, input } = this.state
    const { uid, token } = this.props.authValues()
    const event = eventsFlat.find(e => parseInt(e.id) === parseInt(input.id))
    const toSend = newValues(event, input).filter(elm => (
      !(['tags'].includes(Object.keys(elm)[0]))
    ))
    toSend.push({ tags: Object.values(input.tags) })

    dataSend(`/data/events/${input.id}`, 'POST', uid, token, toSend).then((d) => {
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
    const event = substance(input)
    event.tags = []
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

  addTag = () => {
    const { tags } = this.state.input
    const ids = Object.keys(tags)
      .map(k => parseInt(k, 10))
      .sort((a, b) => (b - a))
    const nextId = ids.length === 0 ? 0 : ids[0] + 1
    setInput({ [`tags.${nextId}`]: '' }, this.setState.bind(this))
  }

  removeTag = (id) => {
    const { tags } = this.state.input
    const updatedTags = Object.keys(tags)
      .filter(k => k !== id)
      .reduce((acc, k) => { acc[k] = tags[k]; return acc }, {})
    setInput({ tags: updatedTags }, this.setState.bind(this))
  }

  openEdit = (id) => {
    const event = this.state.eventsFlat.find(e => parseInt(e.id) === parseInt(id))
    const tags = event.tags.reduce((acc, curr, idx) => {
      acc[idx] = curr
      return acc
    }, {})

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
      tags,
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
      tags: {},
    }, this.setState.bind(this))
  }

  render() {
    const { events, input, result } = this.state
    if (!events) return <Loading />
    return (
      <div>
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Event</button>
        {
          events.map(dateObj => (
            <div key={dateObj.date}>
              <h4>{moment(dateObj.date).format('dddd MMMM Do YYYY')}</h4>
              <hr />
              <DataBin
                items={dateObj.events}
                head={e => e.name}
                body={e => (<span>{e.date} {e.time.start}<br />{e.location}</span>)}
                onEdit={this.openEdit}
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
            <hr />
            <TextInput id="input.challengeId" label="Linked Challenge ID" value={input.challengeId} onChange={this.setValue} />
            <TextAreaInput id="input.challenge" label="Linked Challenge" value={input.challenge} rows={3} readOnly />
            <hr />
            <h4>Tags</h4>
            <button type="button" className="btn btn-success btn-sm mb-4" onClick={this.addTag}>
              + Add Tag
            </button>
            <ListData
              data={Object.entries(input.tags).map(([id, value]) => ({ id, value }))}
              dataKey="tags"
              onChange={this.setValue}
              onDelete={this.removeTag}
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
          <h4>Adding New Event</h4><hr />
          <Form>
            <TextInput id="input.name" label="Event Name" value={input.name} onChange={this.setValue} />
            <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.location" label="Location" value={input.location} onChange={this.setValue} />
            <DateInput id="input.date" label="Date" value={input.date} onChange={this.setValue} />
            <TextInput id="input.time.start" label="Start Time" value={input.time.start} onChange={this.setValue} help="HH:MM (24hr)" />
            <TextInput id="input.time.end" label="End Time " value={input.time.end} onChange={this.setValue} help="HH:MM (24hr)" />
            <SelectInput id="input.type" label="Type" options={['Individual Activity', 'Team Activity', 'Public Event']} value={input.type} onChange={this.setValue} />
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
          Are you sure you want to delete the <strong>{input.name}</strong> event?
        </EditRoute>
      </div>
    )
  }
}
