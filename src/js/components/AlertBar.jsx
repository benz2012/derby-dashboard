import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import PlainButton from './Button/PlainButton'
import { storageEnabled, storageSet, storageGet } from '../util'

const Container = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;

  top: 50px;
  z-index: 49;
  width: 100%;
  height: 50px;

  color: white;
  background-color: ${props => props.theme.tagBG};
`

const PushContent = styled.div`
  position: relative;
  display: block;
  height: 50px;
  width: 100%;
`

const Message = styled.div`
  margin-left: 15px;
`

const Action = styled(PlainButton)`
  height: 32px;
  padding: 0px 8px;
  margin-right: 15px;

  color: white;
  background-color: transparent;
  border: 1px solid white;

  font-size: 14px;
  font-weight: 300;
  border-radius: 3px;
`

class AlertBar extends Component {
  state = {
    show: false,
  }

  componentDidMount() {
    const desktop = document.documentElement.clientWidth > 960
    const storage = storageEnabled()
    if (!storage && desktop) return

    if (storage) {
      if (desktop) {
        storageSet('saveAsAppAction', true)
        return
      }

      const { pathname } = this.props.location
      if (pathname === '/more') {
        storageSet('saveAsAppAction', true)
        return
      }

      const userTookAction = storageGet('saveAsAppAction')
      if (userTookAction) return

      const lastSeen = storageGet('saveAsAppSeen')
      const dayHasPassed = lastSeen ? (
        Date.now() - lastSeen > 1000 * 60 * 60 * 24
      ) : true
      if (dayHasPassed) {
        this.setState({ show: true })
      }
      storageSet('saveAsAppSeen', Date.now())
    }
  }

  componentDidUpdate(prevProps) {
    const prevPath = prevProps.location.pathname
    const { pathname } = this.props.location
    const { show } = this.state
    if (show && prevPath !== pathname) {
      this.handleDismiss()
    }
  }

  handleDismiss = () => this.setState({ show: false })

  handleAction = () => {
    const { history } = this.props
    this.handleDismiss()
    storageSet('saveAsAppAction', true)
    history.push('/more#save-as-app')
  }

  render() {
    const { show } = this.state
    return (show &&
      <Fragment>
        <PushContent />
        <Container>
          <Message>Save this website as an app shortcut!</Message>
          <Action onClick={this.handleAction}>SHOW ME</Action>
        </Container>
      </Fragment>
    )
  }
}

export default withRouter(AlertBar)
