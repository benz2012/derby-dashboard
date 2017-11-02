import React, { Component } from 'react'

import Modal from '../../containers/Modal'
import { EventContainer } from './style'

export default class Event extends Component {
  back = (e) => {
    const { history } = this.props
    e.stopPropagation()
    history.goBack()
  }
  render() {
    const { match } = this.props
    return (
      <div onClick={this.back}>
        <Modal>
          <EventContainer>
            <h4>Viewing EventId: {match.params.eventId}</h4>
            <button>Click</button>
          </EventContainer>
        </Modal>
      </div>
    )
  }
}
