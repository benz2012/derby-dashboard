import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import HeadingText from '../components/HeadingText'
import Leaderboard from '../components/Leaderboard'
import FullWidthButton from '../components/Button/FullWidthButton'
import { Body, SidePad, FullPad, CleanLink, RightArrow, Ellipsis } from '../components/Content'
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

  buildBlocks = (challenges, teams) => (
    challenges.map((ch) => {
      const hydrated = hydrateScores(ch.scores, teams)
      const leaderboard = hydrated && <Leaderboard scores={hydrated} simple />
      return (
        <Block key={ch.id}>
          <CleanLink to={`/challenges/${ch.id}`}>
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
  )

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
            </Body>
          </SidePad>
        </Block>

        <Block>
          <Link to="/challenges">
            <FullWidthButton>View Total Scores</FullWidthButton>
          </Link>
        </Block>

        <Block>
          <FullPad>
            <HeadingText style={{ margin: '0px' }}>
              Related Challenges & Scores from {moment(report.date).format('MMM Do')}
            </HeadingText>
          </FullPad>
        </Block>

        {challengeBlocks}
      </Page>
    )
  }
}
