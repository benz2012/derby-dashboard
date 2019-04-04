import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import PledgeBlock from '../components/PledgeBlock'
import HeadingText, { HeadingText2, Prefix } from '../components/HeadingText'
import { BodyFromMarkdown, DateString } from '../components/Content'
import { dataFetch } from '../util'

export default class AlumniChallengePage extends Component {
  state = {
    challenge: null,
    pledges: null,
  }

  componentDidMount() {
    const { challengeId } = this.props.match.params
    dataFetch(`/data/alumni/challenges/${challengeId}`).then((data) => {
      this.setState({ challenge: data })
    })
    dataFetch('/data/alumni/pledges').then((data) => {
      this.setState({ pledges: data })
    })
  }

  totalPledged = (cid, pledges) => (
    pledges.reduce((acc, cur) => (acc + (cur[cid] || 0)), 0)
  )

  render() {
    const { challenge, pledges } = this.state
    if (!(challenge && pledges)) return <Loading />
    const { id, name, description, endDate, countData, countName } = challenge
    const totalPledged = this.totalPledged(id, pledges)

    return (
      <Page>
        <Block>
          <Prefix>Alumni Challenge</Prefix>
          <HeadingText style={{ marginTop: '0px' }}>{name}</HeadingText>
          <p>{description}</p>
          <div style={{ color: 'red', paddingBottom: '6px' }}>End Date:&nbsp;
            <DateString format="dddd, MMM Do, YYYY">{endDate}</DateString>
          </div>
        </Block>

        <PledgeBlock
          pledge={totalPledged}
          count={countData.length}
          countName={countName}
        />

        <Block>
          <HeadingText2>{countName}</HeadingText2>
          {countData.map(data => (
            <BodyFromMarkdown key={JSON.stringify(data)}>{data}</BodyFromMarkdown>
          ))}
          {countData.length === 0 && (
            <Prefix>No data has been added.</Prefix>
          )}
        </Block>
      </Page>
    )
  }
}
