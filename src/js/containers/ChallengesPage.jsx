import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import Empty from '../components/Empty'
import HeadingText, { Prefix } from '../components/HeadingText'
import Leaderboard from '../components/Leaderboard'
import { CleanLink, RightArrow, Ellipsis } from '../components/Content'
import { dataFetch, objectSort } from '../util'
import { stringSort } from '../util/string'
import { hydrateScores } from '../util/manageIncomingData'

export default class ChallengesPage extends Component {
  state = {
    challenges: null,
    teams: null,
  }

  componentDidMount() {
    dataFetch('/data/challenges').then((data) => {
      objectSort(data, 'name', stringSort)
      this.setState({ challenges: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }

  totalScores = (challenges, teams) => {
    const teamsData = teams.filter(t => !t.homeTeam)
    const initial = { include: true, score: 0 }
    const initialSet = Object.assign({}, ...teamsData.map(t => ({
      [t.id]: {
        ...initial,
      },
    })))

    return challenges
      .filter(c => (
        (Object.keys(c.scores).length > 0) &&
        (c.public === true)
      ))
      .reduce((accum, current) => {
        Object.keys(current.scores).forEach((tid) => {
          if (current.scores[tid].include === true) {
            // eslint-disable-next-line no-param-reassign
            accum[tid].score += current.scores[tid].score
          }
        })
        return accum
      }, initialSet)
  }

  buildBlocks(challenges, teams) {
    const { match } = this.props
    return challenges.map((ch) => {
      const hydrated = hydrateScores(ch.scores, teams)
      const leaderboard = hydrated && <Leaderboard scores={hydrated} simple />
      return (
        <Block key={ch.id}>
          <CleanLink to={`${match.url}/${ch.id}`}>
            <HeadingText>
              <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                {ch.name}<RightArrow />
              </div>
            </HeadingText>
          </CleanLink>
          {(ch.public && hydrated) ? (
            <div>
              <Ellipsis>{ch.description}</Ellipsis>
              <div style={{ margin: '5px 12px' }}>{leaderboard}</div>
            </div>
          ) : (
            <p>{ch.description}</p>
          )}
        </Block>
      )
    })
  }

  render() {
    const { challenges, teams } = this.state
    if (!(challenges && teams)) return <Loading />

    const challengeBlocks = this.buildBlocks(challenges, teams)
    const totals = this.totalScores(challenges, teams)
    const totalsHydrated = hydrateScores(totals, teams)

    if (challengeBlocks.length === 0) {
      return (<Empty alone>No challenges have been added.</Empty>)
    }

    return (
      <Page>
        { (totalsHydrated && totalsHydrated.length > 0) && (
          <React.Fragment>
            <Block style={{ marginBottom: '0px' }}>
              <HeadingText style={{ marginBottom: '0px' }}>Total Scores</HeadingText>
              <Prefix>All points from all challenges</Prefix>
            </Block>
            <Leaderboard scores={totalsHydrated} />
          </React.Fragment>
        )}

        {challengeBlocks}
      </Page>
    )
  }
}
