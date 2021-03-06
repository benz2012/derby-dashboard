import React, { Component } from 'react'
import moment from 'moment'

import Modal from '../../containers/Modal'
import { durationString } from '../../util/date'
import { IconWhite } from '../Content'
import HeadingText from '../HeadingText'
import { EventContainer, EventOutline, EventContent,
  EventDetail, EventDetailText, EventClose } from './style'

export default class Event extends Component {
  back = (e) => {
    e.stopPropagation()
    const targetClasses = e.target.className.split(' ')
    if (targetClasses.includes('close-modal')) {
      const { history, match } = this.props
      const base = match.path.replace(`/:${Object.keys(match.params)[0]}`, '')
      history.replace(base)
    }
  }

  render() {
    const { match, events } = this.props
    if (!events) { return null }
    const event = events.find(e => e.id === parseInt(match.params.eventId))
    if (!event) { return null }
    console.log(event)
    const duration = durationString(event.time.start, event.time.end)
    return (
      <div role="button" onClick={this.back} tabIndex={0}>
        <Modal radius={8}>
          <EventContainer className="close-modal">
            <EventOutline>
              <EventContent>
                <HeadingText>{event.name}</HeadingText>
                <p>{event.description}</p>

                <EventDetail>
                  <IconWhite fontSize={24}>event</IconWhite>
                  <EventDetailText>{moment(event.date).format('dddd, MMM Do')}</EventDetailText>
                </EventDetail>

                <EventDetail>
                  <IconWhite fontSize={24}>watch_later</IconWhite>
                  <EventDetailText>{duration}</EventDetailText>
                </EventDetail>

                <EventDetail>
                  <IconWhite fontSize={24}>place</IconWhite>
                  <EventDetailText>{event.location}</EventDetailText>
                </EventDetail>

                {(event.tags && event.tags.length) > 0 &&
                  <EventDetail>
                    <IconWhite fontSize={24}>local_offer</IconWhite>
                    <EventDetailText>{event.tags.join(', ')}</EventDetailText>
                  </EventDetail>
                }

                {event.challenge &&
                  <EventDetail>
                    <IconWhite fontSize={24}>stars</IconWhite>
                    <EventDetailText>{event.challenge}</EventDetailText>
                  </EventDetail>
                }
              </EventContent>
              <EventClose className="close-modal">Close</EventClose>
            </EventOutline>
          </EventContainer>
        </Modal>
      </div>
    )
  }
}
