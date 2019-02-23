import React, { Component } from 'react'
import moment from 'moment'

import EditRoute from './EditRoute'
import Loading from '../components/Loading'

import DataBin from '../componentsAdmin/DataBin'
import ExitModalIf from '../componentsAdmin/ExitModalIf'
import Form, { TextInput, TextAreaInput, SelectInput,
  DateInput, TimeInput } from '../componentsAdmin/Form'
import ListData from '../componentsAdmin/ListData'

import { dataFetch, dataSend, objectSort } from '../util'
import { dateSort, timeSort } from '../util/date'
import { stringSort } from '../util/string'
import { setInput, newValues, isFormValidAndSetErrors,
  substance, hasDefault } from '../util/form'

const eventTypeList = ['Individual Activity', 'Team Activity', 'Public Event']

export default class EventsPage extends Component {
  addForm = React.createRef()

  editForm = React.createRef()

  state = {
    unmounting: false,
    result: null,
    events: null,
    eventsFlat: null,
    challenges: null,
    linkableChallenges: null,
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
      challengeName: '',
      challenge: '',
      tags: {},
    },
    errors: {},
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

  setChallengeValue = (e) => {
    const index = e.target.selectedIndex
    const optionElement = e.target.childNodes[index]
    const challengeId = optionElement.getAttribute('id')
    const challenge = this.state.challenges.find(c => parseInt(c.id) === parseInt(challengeId))
    if (challenge) {
      setInput({
        challengeId: challenge.id,
        challengeName: challenge.name,
        challenge: challenge.description,
      }, this.setState.bind(this))
    } else {
      setInput({
        challengeId: '',
        challengeName: e.target.value,
        challenge: '',
      }, this.setState.bind(this))
    }
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
    }).then(() => {
      dataFetch('/data/challenges').then((data) => {
        if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
        if (!this.state.unmounting) this.setState({ challenges: data })
        const linkableChallenges = data.filter(c => !(
          this.state.eventsFlat.find(e => parseInt(e.challengeId) === parseInt(c.id))
        ))
        if (!this.state.unmounting) {
          const currLC = this.state.linkableChallenges
          if (currLC && currLC[0] && currLC[0].name) {
            const sortedLC = [...currLC]
            objectSort(sortedLC, 'name', stringSort)
            this.setState({ linkableChallenges: sortedLC })
          } else {
            this.setState({ linkableChallenges })
          }
        }
      })
    })
  }

  submitValues = () => {
    if (isFormValidAndSetErrors(this.editForm.current, this) === false) {
      return
    }

    this.setState({ result: null })
    const { eventsFlat, input } = this.state
    const { uid, token } = this.props.authValues()
    const event = eventsFlat.find(e => parseInt(e.id) === parseInt(input.id))
    const toSend = newValues(event, input).filter(elm => (
      !(['tags', 'challengeName', 'challenge', 'challengeId']
        .includes(Object.keys(elm)[0]))
    ))
    toSend.push({ tags: Object.values(input.tags) })
    toSend.push({ challengeId: input.challengeId || null })

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
    if (isFormValidAndSetErrors(this.addForm.current, this) === false) {
      return
    }

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
    const challenge = this.state.challenges.find(c => parseInt(c.id) === event.challengeId)
    let challengeData
    if (challenge) {
      challengeData = {
        challengeId: challenge.id,
        challengeName: challenge.name,
        challenge: challenge.description,
      }
      this.setState(state => ({
        linkableChallenges: [
          challenge,
          ...state.linkableChallenges,
        ],
      }))
    }

    setInput({
      id: event.id,
      name: event.name,
      location: event.location,
      description: event.description,
      time: event.time,
      date: event.date,
      type: event.type,
      ...challengeData,
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
    this.setState(state => ({
      linkableChallenges: (
        state.input.challengeId ?
          state.linkableChallenges.filter(c => (
            parseInt(c.id) !== parseInt(state.input.challengeId)
          )) :
          state.linkableChallenges
      ),
    }))
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
      challengeId: '',
      challenge: '',
      challengeName: '',
      tags: {},
    }, this.setState.bind(this))
  }

  checkEndTime = () => {
    const { start, end } = this.state.input.time
    if (moment(end, 'HH:mm').isSameOrBefore(moment(start, 'HH:mm'))) {
      return 'End Time must be after Start Time.'
    }
    return ''
  }

  render() {
    const { events, challenges, linkableChallenges, input, errors, result } = this.state
    if (!(events && challenges && linkableChallenges)) return <Loading />
    return (
      <div>
        <ExitModalIf value={input.id} paths={['edit', 'remove']} />
        <button type="button" className="btn btn-success mb-4" onClick={this.openAdd}>+ Add Event</button>
        {
          events.map(dateObj => (
            <div key={dateObj.date}>
              <h4>{moment(dateObj.date).format('dddd, MMMM Do, YYYY')}</h4>
              <hr />
              <DataBin
                items={dateObj.events}
                head={e => e.name}
                body={e => (
                  <span>
                    {moment(e.date).format('MMMM Do')}
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    {moment(e.time.start, 'HH:mm').format('h:mm a')} -&nbsp;
                    {moment(e.time.end, 'HH:mm').format('h:mm a')}
                    <br />
                    {e.location}
                    <br />
                    {e.challengeId && (
                      <em>Linked to:&nbsp;
                        {challenges.find(c => parseInt(c.id) === parseInt(e.challengeId)).name}
                      </em>
                    )}
                  </span>
                )}
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
          <Form ref={this.editForm}>
            <TextInput id="input.name" label="Event Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextAreaInput id="input.description" label="Description" value={input.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.location" label="Location" value={input.location} error={errors.location} onChange={this.setValue} required />
            <DateInput id="input.date" label="Date" value={input.date} error={errors.date} onChange={this.setValue} required />
            <div className="form-row align-items-center">
              <div className="col">
                <TimeInput id="input.time.start" label="Start Time" value={input.time.start} error={errors.time && errors.time.start} onChange={this.setValue} required />
              </div>
              <div className="col">
                <TimeInput id="input.time.end" label="End Time " value={input.time.end} error={errors.time && errors.time.end} onChange={this.setValue} required customvalid="checkEndTime" />
              </div>
            </div>
            <SelectInput id="input.type" label="Type" options={eventTypeList} value={input.type} onChange={this.setValue} />
            <hr />
            <SelectInput
              id="input.challengeName"
              label="Linked Challenge"
              options={['-- None --', ...linkableChallenges.map(c => c.name)]}
              ids={[null, ...linkableChallenges.map(c => c.id)]}
              value={input.challengeName}
              onChange={this.setChallengeValue}
            />
            <TextAreaInput id="input.challenge" label="Linked Challenge Description" value={input.challenge} rows={3} readOnly />
            <hr />
            <h4>Tags</h4>
            <button type="button" className="btn btn-success btn-sm mb-4" onClick={this.addTag}>
              + Add Tag
            </button>
            <ListData
              data={Object.entries(input.tags).map(([id, value]) => ({ id, value }))}
              dataKey="tags"
              errors={errors}
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
          <Form ref={this.addForm}>
            <TextInput id="input.name" label="Event Name" value={input.name} error={errors.name} onChange={this.setValue} required />
            <TextAreaInput id="input.description" label="Description" value={input.description} error={errors.description} onChange={this.setValue} rows={3} />
            <TextInput id="input.location" label="Location" value={input.location} error={errors.location} onChange={this.setValue} required />
            <DateInput id="input.date" label="Date" value={input.date} error={errors.date} onChange={this.setValue} required />
            <div className="form-row align-items-center">
              <div className="col">
                <TimeInput id="input.time.start" label="Start Time" value={input.time.start} error={errors.time && errors.time.start} onChange={this.setValue} required />
              </div>
              <div className="col">
                <TimeInput id="input.time.end" label="End Time " value={input.time.end} error={errors.time && errors.time.end} onChange={this.setValue} required customvalid="checkEndTime" />
              </div>
            </div>
            <SelectInput id="input.type" label="Type" options={eventTypeList} value={input.type} onChange={this.setValue} required />
          </Form>
          <p>
            <em>Linking challenges and adding tags happen on the edit menu.</em>
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
          Are you sure you want to delete the <strong>{input.name}</strong> event?
        </EditRoute>
      </div>
    )
  }
}
