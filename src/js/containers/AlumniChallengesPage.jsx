import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import ColoredOverview from '../components/ColoredOverview'
import Loading from '../components/Loading'
import { AlumniChallengeBlock } from '../components/ChallengeBlock'
import { Body, Centered, Currency } from '../components/Content'
import { dataFetch } from '../util'

export default class AlumniChallengesPage extends Component {
  state = {
    challenges: null,
    pledges: null,
  }

  componentDidMount() {
    dataFetch('/data/alumni/challenges').then((data) => {
      this.setState({ challenges: data })
    })
    dataFetch('/data/alumni/pledges').then((data) => {
      this.setState({ pledges: data })
    })
  }

  totalRaised = (cid, count, pledges) => {
    const pledged = pledges.reduce((acc, cur) => (acc + (cur[cid] || 0)), 0)
    return count * pledged
  }

  buildBlocks = (challenges, pledges) => (
    challenges.map(c => (
      <AlumniChallengeBlock
        key={c.id}
        id={c.id}
        name={c.name}
        description={c.description}
        count={c.countData.length}
        countName={c.countName}
        raised={this.totalRaised(c.id, c.countData.length, pledges)}
      />
    ))
  )

  render() {
    const { challenges, pledges } = this.state
    if (!(challenges && pledges)) return <Loading />

    const challengeBlocks = this.buildBlocks(challenges, pledges)
    const pledgeCount = pledges.reduce((acc, cur) => (
      acc + Object.keys(cur).filter(k => cur[k] > 0).length
    ), 0)
    const totalRaised = challenges.reduce((acc, cur) => (
      acc + this.totalRaised(cur.id, cur.countData.length, pledges)
    ), 0)

    return (
      <Page>
        <Block>
          <Centered>
            <Currency fontSize={48} muted>{totalRaised}</Currency>
            <Body>Total Raised thru Alumni Challenges</Body>
          </Centered>
        </Block>

        <Block>
          <ColoredOverview
            messages={[
              [challenges.length, 'challenges'],
              [pledges.length, 'alumni invovled'],
              [pledgeCount, 'pledges made'],
            ]}
          />
        </Block>

        {challengeBlocks}
      </Page>
    )
  }
}
