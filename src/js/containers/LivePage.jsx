import React, { Component } from 'react'
import io from 'socket.io-client'

import Page from '../components/Page'
import Block from '../components/Block'
import Card from '../components/Card'
import TeamBlock from '../components/TeamBlock'
import Loading from '../components/Loading'
import StickyFooter from '../components/StickyFooter'
import { Currency, Centered, IconWhite } from '../components/Content'
import { HeadingText2 } from '../components/HeadingText'
import { dataFetch } from '../util'
import { sumTeamFunds, sumSchoolFunds } from '../util/currency'

const socket = io({ autoConnect: false })

export default class Live extends Component {
  state = {
    address: null,
    watching: 0,
    cheering: null,
    teamChoice: null,
    teams: null,
    raised: null,
    schoolTotal: null,
  }
  componentDidMount() {
    dataFetch('/data/raised').then((data) => {
      this.setState({ raised: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
    socket.open()
    this.enableSocketListeners()
  }
  componentWillUnmount() {
    this.disableSocketListeners([
      'liveUpdate', 'address', 'watching', 'cheering',
    ])
    socket.close()
  }
  enableSocketListeners() {
    socket.on('liveUpdate', (update) => {
      console.log('liveUpdate: ', update)
      const { teamId, mergable } = update
      this.mergeLiveUpdate(teamId, mergable)
    })
    socket.on('address', (data) => {
      this.setState({ address: data })
    })
    socket.on('watching', (data) => {
      this.setState({ watching: data })
    })
    socket.on('cheering', (data) => {
      this.setState({ cheering: data })
      const { address } = this.state
      const teamChoice = (data && address) && data[address]
      this.setState({ teamChoice })
    })
  }
  disableSocketListeners(events) {
    // Iterate over a list of socket events (strings), and disable event listener
    events.forEach((eventName) => {
      socket.off(eventName)
    })
  }
  mergeLiveUpdate(teamId, mergable) {
    this.setState((prevState) => {
      const prevRaised = prevState.raised.find(t => parseInt(t.id) === parseInt(teamId))
      return {
        raised: [
          ...prevState.raised.filter(t => parseInt(t.id) !== parseInt(teamId)),
          Object.assign({}, prevRaised, mergable),
        ],
      }
    })
  }
  buildTeamsRaised(teams, raised) {
    if (!teams || !raised) { return null }
    const teamsData = teams
    teamsData.forEach((team) => {
      const tRaised = raised.find(t => t.id === team.id)
      const tIndex = teamsData.findIndex(t => t.id === team.id)
      teamsData[tIndex].raised = sumTeamFunds(tRaised)
    })
    return teamsData.map(t => (
      <Card>
        <TeamBlock
          key={t.id}
          name={t.org}
          subName={t.orgId}
          avatar={t.avatar}
          right={<Currency>{t.raised}</Currency>}
        />
      </Card>
    ))
  }
  handleTeamClick = (e) => {
    // send the server the teamId that the user clicked on
    socket.emit('cheering', { cheeringFor: e.currentTarget.id })
  }
  render() {
    const { watching, teamChoice, teams, raised } = this.state
    if (!(teams && raised)) { return <Loading /> }

    const teamsRaised = this.buildTeamsRaised(teams, raised)
    const schoolTotal = sumSchoolFunds(raised)
    return (
      <Page>
        <Block><Centered>
          <Currency fontSize={48}>{schoolTotal}</Currency>
        </Centered></Block>

        <div>
          {teamsRaised}
        </div>

        <p><em>{ !teamChoice && 'Choose a team to cheer for!' }</em></p>

        <StickyFooter>
          <IconWhite fontSize={36}>remove_red_eye</IconWhite>
          <HeadingText2 style={{ margin: '0' }}>{watching} Watching Live</HeadingText2>
        </StickyFooter>

      </Page>
    )
  }
}
