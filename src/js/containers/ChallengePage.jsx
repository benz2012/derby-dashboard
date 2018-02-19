import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import Page from '../components/Page'
import Block from '../components/Block'
import Event from '../components/Event'
import Loading from '../components/Loading'
import HeadingText from '../components/HeadingText'
import FullWidthButton from '../components/Button/FullWidthButton'
import { dataFetch } from '../util'

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
  buildScores = (scores, teams) => {
    scores.sort((a, b) => (b.score - a.score))
    return scores.map((sc) => {
      const thisTeam = teams.find(t => parseInt(t.id) === parseInt(sc.teamId))
      if (!thisTeam) { return null }
      const teamName = thisTeam.org
      return (
        <li key={sc.teamId}>{sc.score} | {teamName}</li>
      )
    })
  }
  render() {
    const { match } = this.props
    const { challenge, teams } = this.state
    if (!(challenge && teams)) { return <Loading /> }

    return (
      <Page>
        <Block>
          <HeadingText>{challenge.name}</HeadingText>
          <p>{challenge.description}</p>
        </Block>

        {
          challenge.scores &&
          <Block>
            <ul>{this.buildScores(challenge.scores, teams)}</ul>
          </Block>
        }

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
