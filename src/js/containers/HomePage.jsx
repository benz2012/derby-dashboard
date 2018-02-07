import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import HeadingText from '../components/HeadingText'
import Video from '../components/Video'
import TeamBlock from '../components/TeamBlock'
import Loading from '../components/Loading'
import { Header, Body, Ranking,
  Currency, ExternalLink } from '../components/Content'
import { dataFetch } from '../util'
import { sumTeamFunds, sumSchoolFunds } from '../util/currency'

export default class HomePage extends Component {
  state = {
    home: null,
    raised: null,
    teams: null,
    schoolTotal: null,
  }
  componentDidMount() {
    dataFetch('/data/home').then((data) => {
      this.setState({ home: data })
    })
    dataFetch('/data/raised').then((data) => {
      this.setState({ raised: data })
      if (data) {
        const schoolTotal = sumSchoolFunds(data)
        this.setState({ schoolTotal })
      }
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }

  buildHomeTeam(teams, raised) {
    if (!teams || !raised) { return null }
    const homeTeam = teams.find(t => t.homeTeam)
    const homeTeamRaised = raised.find(t => t.id === homeTeam.id)
    const teamTotal = sumTeamFunds(homeTeamRaised)
    return (
      <TeamBlock
        name={homeTeam.org}
        subName={homeTeam.orgId}
        avatar={homeTeam.avatar}
        left={<Ranking style={{ color: 'white' }}>0</Ranking>}
        right={<Currency>{teamTotal}</Currency>}
      />
    )
  }
  buildTeamsRaised(teams, raised) {
    if (!teams || !raised) { return null }
    const teamsData = teams.filter(t => !t.homeTeam)
    teamsData.forEach((team) => {
      const tRaised = raised.find(t => t.id === team.id)
      const tIndex = teamsData.findIndex(t => t.id === team.id)
      teamsData[tIndex].raised = sumTeamFunds(tRaised)
    })
    teamsData.sort((a, b) => (b.raised - a.raised))
    return teamsData.map((t, idx) => (
      <TeamBlock
        key={t.id}
        name={t.org}
        subName={t.orgId}
        avatar={t.avatar}
        left={<Ranking>{idx + 1}</Ranking>}
        right={<Currency>{t.raised}</Currency>}
      />
    ))
  }
  render() {
    const { home, raised, teams, schoolTotal } = this.state
    const homeTeam = this.buildHomeTeam(teams, raised)
    const teamsRaised = this.buildTeamsRaised(teams, raised)
    if (!home) { return <Loading /> }
    return (
      <Page>
        <Block>
          <Header>
            <HeadingText>{home.header}</HeadingText>
            <Body>{home.body}</Body>
            <ExternalLink href={home.learnMoreURL}>Learn More &gt;</ExternalLink>
          </Header>
        </Block>
        <Block>
          <Video src={home.videoURL} />
        </Block>

        <Block>
          <TeamBlock
            name={`${home.abbrv} Total`}
            avatar={home.avatar}
            left={<Ranking style={{ color: 'white' }}>0</Ranking>}
            right={<Currency>{schoolTotal}</Currency>}
          />
        </Block>

        <Block>
          {homeTeam}
          {teamsRaised}
        </Block>
      </Page>
    )
  }
}
