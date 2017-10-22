import React from 'react'
import { Route, Link } from 'react-router-dom'

import Event from '../Event'

const Day = ({ match }) => (
  <div>
    <h3>Viewing Date: {match.params.dateString}</h3>
    <li><Link to={`${match.url}/1`}>Event 1</Link></li>
    <li><Link to={`${match.url}/2`}>Event 2</Link></li>
    <li><Link to={`${match.url}/3`}>Event 3</Link></li>
    <hr />
    <Route path={`${match.url}/:eventId`} component={Event} />
  </div>
)

export default Day
