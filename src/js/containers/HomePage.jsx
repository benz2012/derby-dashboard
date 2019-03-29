/* eslint no-param-reassign: 0 */
import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import HeadingText from '../components/HeadingText'
import Video from '../components/Video'
import TeamBlock from '../components/TeamBlock'
import Loading from '../components/Loading'
import Empty from '../components/Empty'
import { SidePad, Body, Ranking,
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

  buildHomeTeam = (teams, raised) => {
    if (!(teams && teams.length > 0 && raised && raised.length > 0)) { return null }
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

  buildTeamsRaised = (teams, raised) => {
    if (!(
      teams && teams.length > 0 &&
      raised && raised.length > 0)
    ) return null

    return teams
      .filter(t => !t.homeTeam)
      .map((team) => {
        const tRaised = raised.find(t => t.id === team.id)
        return ({ ...team, raised: sumTeamFunds(tRaised) })
      })
      .sort((a, b) => {
        if (b.raised === a.raised) {
          return a.org.localeCompare(b.org)
        }
        return b.raised - a.raised
      })
      .map((team, index, sortedTeams) => {
        const rank = sortedTeams.reduce((acc, them) => {
          if (them.raised > team.raised) return acc + 1
          return acc
        }, 1)
        return ({ ...team, rank })
      })
      .map(t => (
        <TeamBlock
          key={t.id}
          name={t.org}
          subName={t.orgId}
          avatar={t.avatar}
          left={<Ranking>{t.rank}</Ranking>}
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
          <SidePad>
            <HeadingText>{home.header}</HeadingText>
            <Body>{home.body}</Body>
            <ExternalLink href={home.learnMoreURL}>Learn More &gt;</ExternalLink>
          </SidePad>
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

        { (homeTeam || teamsRaised) ? (
          <Block>
            {homeTeam}
            {teamsRaised}
          </Block>
        ) : (
          <Empty>No teams have been added.</Empty>
        )}
      </Page>
    )
  }
}
