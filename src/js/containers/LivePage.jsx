import React, { Component } from 'react'
import io from 'socket.io-client'

import Page from '../components/Page'
import Block from '../components/Block'
import TeamBlock from '../components/TeamBlock'
import Loading from '../components/Loading'
import { Currency } from '../components/Content'
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
    socket.off('liveUpdate')
    socket.off('address')
    socket.off('watching')
    socket.off('cheering')
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
      <TeamBlock
        key={t.id}
        name={t.org}
        subName={t.orgId}
        avatar={t.avatar}
        right={<Currency>{t.raised}</Currency>}
      />
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
        <Block>
          <h2>Live</h2>
          <h2><Currency>{schoolTotal}</Currency></h2>
          <h3>Watching: {watching}</h3>
        </Block>

        <Block>
          {teamsRaised}
        </Block>

        <p><em>{ !teamChoice && 'Choose a team to cheer for!' }</em></p>

      </Page>
    )
  }
}
