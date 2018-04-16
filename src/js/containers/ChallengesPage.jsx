import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import HeadingText from '../components/HeadingText'
import { CleanLink, RightArrow } from '../components/Content'
import { dataFetch } from '../util'
import { hydrateScores } from '../util/manageIncomingData'

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
      const scores = this.buildScores(ch.scores, teams)
      return (
        <Block key={ch.id}>
          <CleanLink to={`${match.url}/${ch.id}`}><HeadingText>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              {ch.name}<RightArrow />
            </div>
          </HeadingText></CleanLink>
          <p>{ch.description}</p>
          {scores && <ul>{scores}</ul>}
        </Block>
      )
    })
  }
  buildScores = (scores, teams) => {
    const hydrated = hydrateScores(scores, teams)
    if (!hydrated) return null
    return hydrated.map(s => (
      <li key={s.id}>{s.score} | {s.name}</li>
    ))
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
