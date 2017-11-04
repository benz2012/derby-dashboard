import React, { Component } from 'react'

import Modal from '../../containers/Modal'
import { dataFetch } from '../../util'
import { EventContainer, EventOutline, EventContent, EventClose } from './style'

export default class Event extends Component {
  state = {
    event: null,
  }
  componentDidMount() {
    const { eventId } = this.props.match.params
    dataFetch(`/data/event/${eventId}`).then((data) => {
      this.setState({ event: data })
    })
  }
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
    const { event } = this.state
    if (!event) { return null }
    return (
      <div onClick={this.back}>
        <Modal>
          <EventContainer className="close-modal">
            <EventOutline>
              <EventContent>
                <p>{event.name}</p>
              </EventContent>
              <EventClose className="close-modal">Close</EventClose>
            </EventOutline>
          </EventContainer>
        </Modal>
      </div>
    )
  }
}
