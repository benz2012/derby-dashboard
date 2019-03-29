import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import moment from 'moment'

import Page from '../components/Page'
import Empty from '../components/Empty'
import DateViewer from '../components/Date/DateViewer'
import DateLink from '../components/Date/DateLink'
import Day from '../components/Day'
import { dataFetch } from '../util'
import { dateSort } from '../util/date'

export default class SchedulePage extends Component {
  state = {
    events: null,
  }

  componentDidMount() {
    dataFetch('/data/events').then((data) => {
      this.setState({ events: data })
    })
  }

  buildDateLinks = (events, baseURL, selected) => {
    if (!events || !baseURL) { return null }
    return Object.keys(events).sort(dateSort).map((date) => {
      const weekday = moment(date).format('ddd').toUpperCase()
      const number = moment(date).format('D')
      const isSelected = moment(date).isSame(selected, 'day')
      return (
        <DateLink
          key={date}
          to={`${baseURL}/${date}`}
          weekday={weekday}
          number={number}
          selected={isSelected}
        />
      )
    })
  }

  selectFirstDate = (events) => {
    if (!(events && Object.keys(events).length > 0)) { return null }
    const dates = Object.keys(events).sort(dateSort)
    const today = dates.find(d => moment(d).isSame(moment(), 'day'))
    return today || dates[0]
  }

  render() {
    const { match, location } = this.props
    const { events } = this.state
    if (!events) { return null }

    const firstDate = this.selectFirstDate(events)
    if (!firstDate) {
      return (<Empty alone>No events have been added to the schedule.</Empty>)
    }

    const urlDateMatch = new RegExp(`${match.url}/(\\d{4}-\\d{2}-\\d{2}).*`)
    const dateMatch = location.pathname.match(urlDateMatch)
    if (!dateMatch) {
      return (
        <Redirect from={match.url} to={`${match.url}/${firstDate}`} />
      )
    }

    const selectedDate = dateMatch[1]
    const dateLinks = this.buildDateLinks(events, match.url, selectedDate)
    const monthYear = moment(selectedDate).format('MMMM, YYYY')
    return (
      <Page style={{ marginTop: '200px' }}>
        <DateViewer monthYear={monthYear}>
          {dateLinks}
        </DateViewer>
        <Route
          path={`${match.url}/:dateString`}
          render={props => <Day {...props} events={events} />}
        />
      </Page>
    )
  }
}
