import React from 'react'

import { Card } from '../Card'
import { IconLink } from '../Content'
import { EventType, EventContent, EventName,
  EventTime, TagContiner, EventTag, IconContainer } from './style'
import theme from '../../styles/theme'

const EventCard = ({ name, type, time, tags, eventUrl }) => (
  <Card>
    <EventType>{type}</EventType>
    <EventContent>

      <EventName>{name}</EventName>
      <EventTime>{time}</EventTime>

      <TagContiner>
        {(tags && tags.length > 0) && tags.map(tag => (
          <EventTag key={tag}>{tag}</EventTag>
        ))}
      </TagContiner>

    </EventContent>

    <IconContainer>
      <IconLink
        to={eventUrl}
        color={theme[type]}
        fontSize={36}
        replace
      >
        info_outline
      </IconLink>
    </IconContainer>
  </Card>
)

export default EventCard
