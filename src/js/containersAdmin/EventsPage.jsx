import React, { Component } from 'react'
import moment from 'moment'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import { dataFetch, objectSort } from '../util'
import { dateSort, timeSort } from '../util/date'

export default class EventsPage extends Component {
  state = {
    unmounting: false,
    events: null,
  }
  componentDidMount() {
    dataFetch('/data/events').then((data) => {
      if (Object.keys(data).length > 0 && data[Object.keys(data)[0]][0].name) {
        const dataList = Object.keys(data).map(k => ({ date: k, events: data[k] }))
        objectSort(dataList, 'date', dateSort)
        dataList.forEach((dateObj) => {
          objectSort(dateObj.events, 'time.start', timeSort)
        })
        if (!this.state.unmounting) this.setState({ events: dataList })
      }
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  itemClick = id => console.log(id)
  render() {
    const { events } = this.state
    if (!events) return <Loading />
    return (
      <div>
        <button className="btn btn-success mb-4">+ Add Event</button>
        {
          events.map(dateObj => (
            <div key={dateObj.date}>
              <h4>{moment(dateObj.date).format('dddd MMMM Do YYYY')}</h4>
              <hr />
              <DataBin
                items={dateObj.events}
                head={e => e.name}
                body={e => (<span>{e.date} {e.time.start}<br />{e.location}</span>)}
                onEdit={this.itemClick}
                onDelete={this.itemClick}
              />
              <div className="mb-5" />
            </div>
          ))
        }
      </div>
    )
  }
}
