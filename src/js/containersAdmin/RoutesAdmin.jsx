import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import LoginPage from './LoginPage'
import RoutesPanel from './RoutesPanel'
import UnauthorizedPage from './UnauthorizedPage'

import NoMatch from '../components/NoMatch'
import Loading from '../components/Loading'
import { dataFetch, dataSend } from '../util'

const FB_APP_ID = '1712021218863173'
const FB_API_VERSION = 'v2.12'

export default class RoutesAdmin extends Component {
  state = {
    stage: 'CHECKING',
    uid: null,
    token: null,
    group: null,
  }

  componentDidMount() {
    if (document.getElementById('facebook-jssdk') && window.FB) {
      // the api was loaded on a previous mounting
      window.FB.getLoginStatus(this.authStatusHandler)
    }
    this.loadFacebookAPI(document, 'script', 'facebook-jssdk')
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FB_APP_ID,
        version: FB_API_VERSION,
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

  invokeLoginDialogURL = () => (
    `https://www.facebook.com/${FB_API_VERSION}/dialog/oauth?` +
    `client_id=${FB_APP_ID}` +
    `&redirect_uri=${window.location.origin}/admin`
  )

  authStatusHandler = (response) => {
    if (response.status === 'connected') {
      const uid = response.authResponse.userID
      const token = response.authResponse.accessToken
      this.setState({ uid, token })
      dataFetch(`/data/auth?uid=${uid}`).then(({ authorized, group }) => {
        if (authorized) {
          this.setState({ stage: 'AUTHORIZED', group })
          dataSend('/data/auth/access', 'POST', uid, token, { uid, token })
        } else {
          // user is not an authorized administrator
          this.setState({ stage: 'LOGGED_IN' })
        }
      })
    } else {
      this.setState({ stage: 'LOGGED_OUT' })
    }
  }

  authValues = () => {
    const { uid, token, group } = this.state
    return ({ uid, token, group })
  }

  contents = (stage) => {
    const { uid } = this.state
    if (stage === 'CHECKING') {
      return <Loading />
    }
    if (stage === 'LOGGED_IN') {
      return <UnauthorizedPage uid={uid} />
    }
    if (stage === 'LOGGED_OUT') {
      return <LoginPage
        statusChangeCallback={this.authStatusHandler}
        invokeLoginDialogURL={this.invokeLoginDialogURL}
      />
    }
    if (stage === 'AUTHORIZED') {
      return (
        <RoutesPanel
          authValues={this.authValues}
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
