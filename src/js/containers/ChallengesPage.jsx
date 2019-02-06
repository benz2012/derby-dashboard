import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
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
    const initial = Object.assign({}, ...teamsData.map(t => ({ [t.id]: 0 })))
    const totals = challenges
      .filter(c => (
        (Object.keys(c.scores).length > 0) &&
        (c.public === true)
      ))
      .reduce((accum, current) => {
        Object.keys(current.scores).forEach((tid) => {
          if (current.scores[tid].include === true) {
            // eslint-disable-next-line no-param-reassign
            accum[tid] += current.scores[tid].score
          }
        })
        return accum
      }, initial)
    return Object.keys(totals)
      .map((tid) => {
        const thisTeam = teamsData.find(t => parseInt(t.id) === parseInt(tid))
        return ({
          id: tid,
          score: totals[tid],
          name: thisTeam.org,
          orgId: thisTeam.orgId,
          avatar: thisTeam.avatar,
        })
      })
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
    totals.sort((a, b) => (b.score - a.score))
    return (
      <Page>
        <Block style={{ marginBottom: '0px' }}>
          <HeadingText style={{ marginBottom: '0px' }}>Total Scores</HeadingText>
          <Prefix>All points from all challenges</Prefix>
        </Block>
        { totals && <Leaderboard scores={totals} /> }

        {challengeBlocks}
      </Page>
    )
  }
}
