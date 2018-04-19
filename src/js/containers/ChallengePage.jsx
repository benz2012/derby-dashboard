import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import Page from '../components/Page'
import Block from '../components/Block'
import Event from '../components/Event'
import Loading from '../components/Loading'
import HeadingText, { Prefix } from '../components/HeadingText'
import FullWidthButton from '../components/Button/FullWidthButton'
import Leaderboard from '../components/Leaderboard'
import { dataFetch } from '../util'
import { hydrateScores } from '../util/manageIncomingData'

export default class ChallengePage extends Component {
  state = {
    challenge: null,
    teams: null,
  }
  componentDidMount() {
    const { challengeId } = this.props.match.params
    dataFetch(`/data/challenges/${challengeId}`).then((data) => {
      this.setState({ challenge: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }
  render() {
    const { match } = this.props
    const { challenge, teams } = this.state
    if (!(challenge && teams)) { return <Loading /> }
    const hydrated = hydrateScores(challenge.scores, teams)
    const leaderboard = (challenge.public && hydrated) ?
      <Leaderboard scores={hydrated} /> :
      <Block><p>No scores have been added yet!</p></Block>

    return (
      <Page>
        <Block>
          <Prefix>Challenge</Prefix>
          <HeadingText style={{ marginTop: '0px' }}>{challenge.name}</HeadingText>
          <p>{challenge.description}</p>
        </Block>

        {leaderboard}

        {
          challenge.linkedEvent &&
          <Block>
            <Link to={`${match.url}/${challenge.linkedEvent.id}`} replace>
              <FullWidthButton>View Linked Event</FullWidthButton>
            </Link>
          </Block>
        }

        <Route
          path={`${match.url}/:eventId`}
          render={props => <Event {...props} events={[challenge.linkedEvent]} />}
        />
      </Page>
    )
  }
}
