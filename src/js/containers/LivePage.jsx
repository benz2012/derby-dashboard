import React, { Component } from 'react'
import io from 'socket.io-client'
import uuidv4 from 'uuid/v4'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import Empty from '../components/Empty'
import StickyFooter from '../components/StickyFooter'
import LiveCard from '../components/LiveCard'

import { Currency, Centered, IconWhite, SidePad, Cheering } from '../components/Content'
import { HeadingText2 } from '../components/HeadingText'
import { CardFlexContainer } from '../components/Card'
import { dataFetch, storageGet, storageSet } from '../util'
import { sumTeamFunds, sumSchoolFunds } from '../util/currency'

export default class Live extends Component {
  /* eslint react/sort-comp: 0 */
  state = {
    browserId: null,
    watching: 0,
    cheering: null,
    teamChoice: null,
    teams: null,
    raised: null,
    initial: true,
  }

  socket

  componentDidMount() {
    dataFetch('/data/raised').then((data) => {
      this.setState({ raised: data })
    })
    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })

    let browserId = storageGet('browserId')
    if (!browserId) {
      browserId = uuidv4()
      storageSet('browserId', browserId)
    }
    this.setState({ browserId })

    if (!this.socket) {
      this.socket = io({
        autoConnect: false,
        query: { browserId },
      })
    }
    this.socket.open()
    this.enableSocketListeners()
  }

  componentWillUnmount() {
    this.disableSocketListeners([
      'liveUpdate', 'watching', 'cheering',
    ])
    this.socket.close()
  }

  enableSocketListeners = () => {
    this.socket.on('liveUpdate', (update) => {
      // will prevent resorting of the list after initial render
      this.setState({ initial: false })
      const { teamId, mergable } = update
      this.mergeLiveUpdate(teamId, mergable)
    })
    this.socket.on('watching', (data) => {
      this.setState({ watching: data })
    })
    this.socket.on('cheering', (data) => {
      this.setState({ cheering: data })
      const { browserId } = this.state
      const teamChoice = (data && browserId) && data[browserId]
      this.setState({ teamChoice })
    })
  }

  disableSocketListeners = (events) => {
    // Iterate over a list of socket events (strings), and disable event listener
    events.forEach((eventName) => {
      this.socket.off(eventName)
    })
  }

  sumCheersForTeam = (cheering, teamId) => {
    if (!cheering || !teamId) { return 0 }
    return Object.keys(cheering).reduce((accum, key) => (
      parseInt(cheering[key]) === parseInt(teamId) ? accum + 1 : accum
    ), 0)
  }

  handleTeamClick = (e) => {
    // send the server the teamId that the user clicked on
    this.socket.emit('cheering', { cheeringFor: e.currentTarget.id })
  }

  buildTeams = (teams, raised, initial, teamChoice, cheering) => {
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

  mergeLiveUpdate = (teamId, mergable) => {
    this.setState((prevState) => {
      const order = prevState.raised.map(t => t.id)
      const prevRaised = prevState.raised.find(t => parseInt(t.id) === parseInt(teamId))
      const updated = [
        ...prevState.raised.filter(t => parseInt(t.id) !== parseInt(teamId)),
        Object.assign({}, prevRaised, mergable),
      ]
      updated.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
      return { raised: updated }
    })
  }

  render() {
    const { watching, teamChoice, teams, raised, initial, cheering } = this.state
    if (!(teams && raised)) { return <Loading /> }

    const teamCards = this.buildTeams(teams, raised, initial, teamChoice, cheering)
    const schoolTotal = sumSchoolFunds(raised)
    return (
      <Page>
        <Block>
          <Centered>
            <Currency fontSize={50}>{schoolTotal}</Currency>
          </Centered>
        </Block>

        { (teamCards.length === 0) && (
          <Empty>No teams have been added.</Empty>
        )}

        <CardFlexContainer>
          {teamCards}
        </CardFlexContainer>

        <SidePad>
          <Cheering>
            <em>What is Cheering?</em><br />
            Tap on any card to cheer for that team. If multiple people are watching
            the live updates, it helps distinguish which team you are supporting
            while watching. You can change your selection in real time, but to
            deselect your card and stop cheering, refresh the page.
          </Cheering>
        </SidePad>

        <StickyFooter>
          <IconWhite fontSize={36} style={{ paddingLeft: '10px' }}>remove_red_eye</IconWhite>
          <HeadingText2 style={{ margin: '0', paddingLeft: '10px' }}>
            {watching} Watching Live
          </HeadingText2>
        </StickyFooter>

      </Page>
    )
  }
}
