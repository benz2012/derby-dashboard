import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import HeadingText from '../components/HeadingText'
import { CleanLink, RightArrow } from '../components/Content'
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
          {(ch.public && scores) && <ul>{scores}</ul>}
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
        })
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
        <Block>
          <HeadingText>Total Scores</HeadingText>
          <p>All points from all challenges</p>
          <ul>{
            totals &&
            totals.map(s => (
              <li key={s.id}>{s.score} | {s.name}</li>
            ))
          }</ul>
        </Block>

        {challengeBlocks}
      </Page>
    )
  }
}
