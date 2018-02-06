import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import { Body, Centered, Currency } from '../components/Content'
import Loading from '../components/Loading'
import TeamHeader from '../components/TeamHeader'
import { HeadingText2 } from '../components/HeadingText'
import { LargeLine } from '../components/Chart'
import FullWidthButton from '../components/Button/FullWidthButton'
import { storageEnabled, storageGet, storageSet, dataFetch } from '../util'
import { sumTeamFunds, joinFundsHistory } from '../util/currency'

export default class TeamPage extends Component {
  state = {
    thisTeamIsSaved: false,
    team: null,
    raised: null,
    history: null,
  }
  componentDidMount() {
    this.isThisTheSavedTeam()
    const teamId = this.props.match.params.teamId
    dataFetch(`/data/teams/${teamId}`).then((data) => {
      this.setState({ team: data })
    })
    dataFetch(`/data/raised/${teamId}`).then((data) => {
      const raised = sumTeamFunds(data)
      this.setState({ raised })
    })
    dataFetch(`/data/history/${teamId}`).then((data) => {
      const history = joinFundsHistory(data)
      this.setState({ history })
    })
  }
  isThisTheSavedTeam() {
    if (storageEnabled() === false) { return }
    const team = storageGet('teamSelection')
    const { match } = this.props
    if (team && team.value === match.params.teamId) {
      this.setState({ thisTeamIsSaved: true })
    }
  }
  handleUnsave = () => {
    storageSet('teamSelection', { value: 0 })
    const { match } = this.props
    const parentURL = match.url.replace(`/${match.params.teamId}`, '')
    this.props.history.push(parentURL)
  }
  unsaveButton = () => (
    <Block><Body>
      <FullWidthButton onClick={this.handleUnsave}>
        Unsave my team selection
      </FullWidthButton>
    </Body></Block>
  )
  render() {
    const { thisTeamIsSaved, team, raised, history } = this.state
    const unsave = thisTeamIsSaved ? this.unsaveButton() : null

    if (team === null || raised === null) { return <Loading /> }
    return (
      <Page>
        <TeamHeader
          org={team.org}
          orgId={team.orgId}
          url={team.url}
          avatar={team.avatar}
          cover={team.cover}
        />

        <Block><Centered>
          <Currency fontSize={48} muted>{raised}</Currency>
          <Body>Total Raised to Date</Body>
        </Centered></Block>

        <Block>
          <HeadingText2>Two Week History</HeadingText2>
          { history && <LargeLine values={history} /> }
        </Block>

        <Block>
          <p>Challenge 1</p>
        </Block>
        <Block>
          <p>Challenge 2</p>
        </Block>
        <Block>
          <p>Challenge 3</p>
        </Block>

        {unsave}
      </Page>
    )
  }
}
