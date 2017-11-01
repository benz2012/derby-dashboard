import React from 'react'
import { Route, Link } from 'react-router-dom'

import Event from '../Event'

// TODO: show a no match when datestring is not found in events

const Day = ({ match, events }) => (
  <div>
    <h3>Viewing Date: {match.params.dateString}</h3>
    {
      events &&
      events[match.params.dateString].map(e => (
        <li key={e.id}><Link to={`${match.url}/${e.id}`}>{e.name}</Link></li>
      ))
    }
    <hr />
    <Route path={`${match.url}/:eventId`} component={Event} />
  </div>
)

export default Day
