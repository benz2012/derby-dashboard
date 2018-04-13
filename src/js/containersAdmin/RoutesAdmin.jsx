import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import LoginPage from './LoginPage'
import RoutesPanel from './RoutesPanel'
import UnauthorizedPage from './UnauthorizedPage'

import NoMatch from '../components/NoMatch'
import Loading from '../components/Loading'
import { dataFetch } from '../util'

export default class RoutesAdmin extends Component {
  state = {
    stage: 'CHECKING',
    uid: null,
  }
  componentDidMount() {
    if (document.getElementById('facebook-jssdk') && window.FB) {
      // the api was loaded on a previous mounting
      window.FB.getLoginStatus(this.authStatusHandler)
    }
    this.loadFacebookAPI(document, 'script', 'facebook-jssdk')
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '1712021218863173',
        version: 'v2.12',
      });
      // Check a user's auth status
      window.FB.getLoginStatus(this.authStatusHandler)
    }
  }
  loadFacebookAPI = (d, s, id) => {
    const fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    const js = d.createElement(s); js.id = id
    js.src = 'https://connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  }
  authStatusHandler = (response) => {
    console.log(response)
    if (response.status === 'connected') {
      const uid = response.authResponse.userID
      this.setState({ uid })
      dataFetch(`/auth?uid=${uid}`).then((authData) => {
        const authorized = authData.AdminPanel.indexOf(uid) !== -1
        if (authorized) {
          this.setState({ stage: 'AUTHORIZED' })
        } else {
          // user is not an authorized administrator
          this.setState({ stage: 'LOGGED_IN' })
        }
      })
    } else {
      this.setState({ stage: 'LOGGED_OUT' })
    }
  }
  contents = (stage) => {
    const { uid } = this.state
    if (stage === 'CHECKING') {
      return <Loading />
    } else if (stage === 'LOGGED_IN') {
      return <UnauthorizedPage uid={uid} />
    } else if (stage === 'LOGGED_OUT') {
      return <LoginPage statusChangeCallback={this.authStatusHandler} />
    } else if (stage === 'AUTHORIZED') {
      return (
        <RoutesPanel
          uid={uid}
          match={this.props.match}
          statusChangeCallback={this.authStatusHandler}
        />
      )
    }
    return <UnauthorizedPage uid={uid} />
  }
  render() {
    const { match } = this.props
    const { stage } = this.state
    const contents = this.contents(stage)
    return (
      <div>
        <div id="fb-root" />
        <Switch>
          <Route path={match.url} render={() => contents} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}