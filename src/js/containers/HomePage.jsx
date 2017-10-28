import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Heading from '../components/Heading'
import Video from '../components/Video'
import TeamBlock from '../components/TeamBlock'
import { Header, Body, Ranking, Currency } from '../components/Content'
import ExternalLink from '../components/Content/ExternalLink'
import { dataFetch } from '../util'

export default class HomePage extends Component {
  state = {
    home: null,
    raised: null,
    teams: null,
  }
  componentDidMount() {
    dataFetch('/data/home').then(res => res.json()).then((data) => {
      this.setState({ home: data })
    })
    dataFetch('/data/raised').then(res => res.json()).then((data) => {
      this.setState({ raised: data })
    })
    dataFetch('/data/teams').then(res => res.json()).then((data) => {
      this.setState({ teams: data })
    })
  }
  buildHomeTeam(teams, raised) {
    if (!teams || !raised) { return null }
    const homeTeam = teams.filter(t => t.homeTeam)[0]
    const homeTeamRaised = raised.filter(t => homeTeam.id in t)[0][homeTeam.id]
    return (
      <TeamBlock
        key={homeTeam.id}
        name={homeTeam.org}
        subName={homeTeam.orgId}
        avatar={homeTeam.avatar}
        left={<Ranking style={{ color: 'white' }}>0</Ranking>}
        right={<Currency>${homeTeamRaised.raised}</Currency>}
      />
    )
  }
  buildTeamsRaised(teams, raised) {
    if (!teams || !raised) { return null }
    const teamsData = teams.filter(t => !t.homeTeam)
    teamsData.forEach((team) => {
      const tRaised = raised.find(t => team.id in t)[team.id].raised
      const tIndex = teamsData.findIndex(t => t.id === team.id)
      teamsData[tIndex].raised = tRaised
    })
    teamsData.sort((a, b) => (b.raised - a.raised))
    return teamsData.map((t, idx) => (
      <TeamBlock
        key={t.id}
        name={t.org}
        subName={t.orgId}
        avatar={t.avatar}
        left={<Ranking>{idx + 1}</Ranking>}
        right={<Currency>${t.raised}</Currency>}
      />
    ))
  }
  render() {
    const { home, raised, teams } = this.state
    const homeTeam = this.buildHomeTeam(teams, raised)
    const teamsRaised = this.buildTeamsRaised(teams, raised)
    if (!home) { return null }
    return (
      <Page>
        <Block>
          <Header>
            <Heading>{home.header}</Heading>
            <Body>{home.body}</Body>
            <ExternalLink href={home.learnMoreURL}>Learn More &gt;</ExternalLink>
          </Header>
        </Block>
        <Block>
          <Video src={home.videoURL} />
        </Block>

        <Block>
          {homeTeam}
        </Block>
        <Block>
          {teamsRaised}
        </Block>
      </Page>
    )
  }
}
