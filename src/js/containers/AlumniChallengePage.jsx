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
    challenge: {
      name: 'Community Service',
      description: 'For every brother that performs 5 or more hours of community service, Alumni will donate pledged amount.',
      endDate: '2018-05-01',
      countData: ['Farid Barquet', 'Jacob Nelson', 'Russell Perlow', 'Nick Kowalczuk', 'Alex Tabatabai', 'Nicholas Commisso', 'Aidan Sullivan', 'Wystan Wang', 'Cody Johnson', 'Tristin Del Vecchio', 'Ryan Kent', 'Jacob Schnaufer', 'Josh Noble', 'Sam Beach', 'Trevor Hrubecky', 'Michael Lutfring', 'Michael Yaeger', 'Anthony Giallella', 'Andrew Ward', 'Shane Peechatka', 'Tiger Chapman', 'Jon Meacham', 'Eric Kolb'],
      countName: 'Brothers',
      pledges: [21, 5, 5],
    },
  }
  componentDidMount() {
    const { challengeId } = this.props.match.params
    // dataFetch(`/data/challenges/${challengeId}`).then((data) => {
    //   this.setState({ challenge: data })
    // })
  }
  htmlString = html => (
    <div dangerouslySetInnerHTML={{ __html: html }} /> // eslint-disable-line
  )
  renderCountData = countData => (
    countData.map((data, idx) => (
      <BodyFromMarkdown key={idx}> {/* eslint-disable-line */}
        {this.htmlString(data)}
      </BodyFromMarkdown>
    ))
  )
  render() {
    const { challenge } = this.state
    if (!challenge) { return <Loading /> }
    const { name, description, endDate, countData, countName, pledges } = challenge

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
          pledge={pledges.reduce((a, b) => (a + b), 0)}
          count={countData.length}
          countName={countName}
        />

        <Block>
          <HeadingText2>{countName}</HeadingText2>
          {this.renderCountData(countData)}
        </Block>
      </Page>
    )
  }
}
