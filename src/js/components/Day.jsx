import React from 'react'
import { Route } from 'react-router-dom'

import Event from './Event'
import EventCard from './EventCard'
import NoMatch from './NoMatch'
import { objectSort } from '../util'
import { timeSort, durationString } from '../util/date'

const Day = ({ match, events }) => {
  if (!events) { return null }
  const dayEvents = events[match.params.dateString]
  if (!dayEvents) { return <NoMatch /> }

  const sortedEvents = objectSort(dayEvents, 'time.start', timeSort)
  const cards = sortedEvents.map((e) => {
    const time = durationString(e.time.start, e.time.end)
    return (
      <EventCard
        key={e.id}
        name={e.name}
        type={e.type}
        time={time}
        eventUrl={`${match.url}/${e.id}`}
      />
    )
  })
  return (
    <div>
      {cards}
      <Route
        path={`${match.url}/:eventId`}
        render={props => <Event {...props} events={dayEvents} />}
      />
    </div>
  )
}

export default Day
