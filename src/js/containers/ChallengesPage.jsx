import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import HeadingText from '../components/HeadingText'
import { CleanLink, RightArrow } from '../components/Content'
import { dataFetch } from '../util'

export default class ChallengesPage extends Component {
  state = {
    challenges: null,
    teams: null,
  }
  componentDidMount() {
    dataFetch('/data/challenges').then((data) => {
      this.setState({ challenges: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }
  buildBlocks(challenges, teams) {
    const { match } = this.props
    return challenges.map((ch) => {
      const scores = Object.keys(ch.scores).length > 0 && this.buildScores(ch.scores, teams)
      return (
        <Block key={ch.id}>
          <CleanLink to={`${match.url}/${ch.id}`}><HeadingText>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              {ch.name}<RightArrow />
            </div>
          </HeadingText></CleanLink>
          <p>{ch.description}</p>
          <ul>{scores}</ul>
        </Block>
      )
    })
  }
  buildScores = (scores, teams) => {
    scores.sort((a, b) => (b.score - a.score))
    return Object.keys(scores).map((teamId) => {
      const thisTeam = teams.find(t => parseInt(t.id) === parseInt(teamId))
      if (!thisTeam) { return null }
      if (Object.keys(scores[teamId]).length === 0) return null
      const teamName = thisTeam.org
      return (
        <li key={thisTeam.teamId}>{scores[teamId].score} | {teamName}</li>
      )
    })
  }
  render() {
    const { challenges, teams } = this.state
    if (!(challenges && teams)) { return <Loading /> }

    const challengeBlocks = this.buildBlocks(challenges, teams)
    return (
      <Page>
        {challengeBlocks}
      </Page>
    )
  }
}
