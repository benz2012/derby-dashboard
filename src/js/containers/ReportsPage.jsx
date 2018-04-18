import React, { Component } from 'react'
import moment from 'moment'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import HeadingText, { HeadingText2 } from '../components/HeadingText'
import { Body, SidePad, FullPad, CleanLink, RightArrow, ExternalLink } from '../components/Content'
import { dataFetch, objectSort } from '../util'
import { stringSort } from '../util/string'
import { hydrateScores } from '../util/manageIncomingData'

export default class MorePage extends Component {
  state = {
    report: null,
    challenges: null,
    teams: null,
  }
  componentDidMount() {
    const { date } = this.props.match.params
    dataFetch(`/data/reports/${date}`).then((data) => {
      this.setState({ report: data })
    })
    dataFetch('/data/challenges').then((data) => {
      objectSort(data, 'name', stringSort)
      this.setState({ challenges: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }
  buildBlocks(challenges, teams) {
    return challenges.map((ch) => {
      const scores = this.buildScores(ch.scores, teams)
      return (
        <Block key={ch.id}>
          <CleanLink to={`/challenges/${ch.id}`}><HeadingText>
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
  render() {
    const { report, challenges, teams } = this.state
    if (!(report && challenges && teams)) { return <Loading /> }
    if (report.publish === false) {
      return (
        <Page><Block>This report is no longer published!</Block></Page>
      )
    }
    const challengeBlocks = this.buildBlocks(
      challenges.filter(c => report.challenges.indexOf(parseInt(c.id)) !== -1),
      teams
    )
    return (
      <Page>
        <Block>
          <SidePad>
            <HeadingText>{report.header}</HeadingText>
            <Body>
              <p>Report for {moment(report.date).format('dddd, MMMM Do YYYY')}</p>
              <p>{report.body}</p>
              {/* <button>Share This Report!</button> */}
            </Body>
          </SidePad>
        </Block>

        <Block>
          <FullPad>
            <HeadingText>Today's scores below</HeadingText>
            <a href="/challenges">View Total Scores</a>
          </FullPad>
        </Block>

        {challengeBlocks}
      </Page>
    )
  }
}
