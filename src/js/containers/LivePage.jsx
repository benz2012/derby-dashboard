import React, { Component } from 'react'
import io from 'socket.io-client'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import StickyFooter from '../components/StickyFooter'
import LiveCard from '../components/LiveCard'

import { Currency, Centered, IconWhite } from '../components/Content'
import { HeadingText2 } from '../components/HeadingText'
import { CardFlexContainer } from '../components/Card'
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
    initial: true,
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
      this.setState({ initial: false }) // will prevent resorting of the list after initial render
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
  sumCheersForTeam = (cheering, teamId) => {
    if (!cheering || !teamId) { return 0 }
    return Object.keys(cheering).reduce((accum, key) => (
      parseInt(cheering[key]) === parseInt(teamId) ? accum + 1 : accum
    ), 0)
  }
  buildTeams(teams, raised, initial, teamChoice, cheering) {
    if (!teams || !raised) { return null }
    const teamsData = teams
    teamsData.forEach((team) => {
      const tRaised = raised.find(t => t.id === team.id)
      const tIndex = teamsData.findIndex(t => t.id === team.id)
      teamsData[tIndex].raised = sumTeamFunds(tRaised)
      teamsData[tIndex].cheering = this.sumCheersForTeam(cheering, team.id)
    })
    if (initial) {
      teamsData.sort((a, b) => (b.raised - a.raised))
    }
    return teamsData.map(t => (
      <LiveCard
        key={t.id}
        id={t.id}
        raised={t.raised}
        org={t.org}
        orgId={t.orgId}
        selected={parseInt(teamChoice) === parseInt(t.id)}
        onClick={this.handleTeamClick}
        cheering={t.cheering}
        showGraphs={false} // TODO: set this as state
      />
    ))
  }
  handleTeamClick = (e) => {
    // send the server the teamId that the user clicked on
    socket.emit('cheering', { cheeringFor: e.currentTarget.id })
  }
  render() {
    const { watching, teamChoice, teams, raised, initial, cheering } = this.state
    if (!(teams && raised)) { return <Loading /> }

    const teamCards = this.buildTeams(teams, raised, initial, teamChoice, cheering)
    const schoolTotal = sumSchoolFunds(raised)
    return (
      <Page>
        <Block><Centered>
          <Currency fontSize={50}>{schoolTotal}</Currency>
        </Centered></Block>

        <CardFlexContainer>
          {teamCards}
        </CardFlexContainer>

        <StickyFooter>
          <IconWhite fontSize={36} style={{ paddingLeft: '10px' }}>remove_red_eye</IconWhite>
          <HeadingText2 style={{ margin: '0', paddingLeft: '10px' }}>{watching} Watching Live</HeadingText2>
        </StickyFooter>

      </Page>
    )
  }
}
