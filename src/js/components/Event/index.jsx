import React, { Component } from 'react'

import Modal from '../../containers/Modal'
import { EventContainer, EventOutline, EventContent, EventClose } from './style'

export default class Event extends Component {
  back = (e) => {
    e.stopPropagation()
    const targetClasses = e.target.className.split(' ')
    if (targetClasses.includes('close-modal')) {
      const { history, match } = this.props
      const base = match.path.replace(`/:${Object.keys(match.params)[0]}`, '')
      history.push(base)
    }
  }
  render() {
    const { match } = this.props
    return (
      <div onClick={this.back}>
        <Modal>
          <EventContainer className="close-modal">
            <EventOutline>
              <EventContent>
                <h4>Viewing EventId: {match.params.eventId}</h4>
                <p>Rikitikitavi, bitch!Save it for the Semantics Dome, E.B.White.I do not have discolored butthole flaps.I just wanna die!</p>
                <p>Rikitikitavi, bitch!Save it for the Semantics Dome, E.B.White.I do not have discolored butthole flaps.I just wanna die!</p>
              </EventContent>
              <EventClose className="close-modal">Close</EventClose>
            </EventOutline>
          </EventContainer>
        </Modal>
      </div>
    )
  }
}
