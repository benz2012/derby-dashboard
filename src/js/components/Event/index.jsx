import React from 'react'

const Event = ({ match }) => (
  <div>
    <h4>Viewing EventId: {match.params.eventId}</h4>
  </div>
)

export default Event
