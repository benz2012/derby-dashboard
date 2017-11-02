import React from 'react'
import { Route } from 'react-router-dom'

import Event from './Event'
import EventCard from './EventCard'
import NoMatch from '../containers/NoMatch'
import { objectSort } from '../util'
import { timeParse, timeSort } from '../util/date'


const tfmt = t => timeParse(t).format('h:mm a')

const Day = ({ match, events }) => {
  if (!events) { return null }
  const dayEvents = events[match.params.dateString]
  if (!dayEvents) { return <NoMatch /> }

  const sortedEvents = objectSort(dayEvents, 'time.start', timeSort)
  const cards = sortedEvents.map((e) => {
    const time = `${tfmt(e.time.start)} - ${tfmt(e.time.end)}`
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
      <Route path={`${match.url}/:eventId`} component={Event} />
    </div>
  )
}

export default Day
