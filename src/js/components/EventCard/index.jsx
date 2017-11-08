import React from 'react'

import Card from '../Card'
import { IconLink } from '../Content'
import { EventType, EventContent, EventName,
  EventTime, IconContainer, colored } from './style'

const EventCard = ({ name, type, time, eventUrl }) => (
  <Card>
    <EventType>{type}</EventType>
    <EventContent>
      <EventName>{name}</EventName>
      <EventTime>{time}</EventTime>
    </EventContent>
    <IconContainer>
      <IconLink
        to={eventUrl}
        color={colored(type)}
        fontSize={30}
      >
        info_outline
      </IconLink>
    </IconContainer>
  </Card>
)

export default EventCard
