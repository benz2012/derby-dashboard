import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import { Body, Currency } from '../components/Content'
import Loading from '../components/Loading'
import TeamHeader from '../components/TeamHeader'
import FullWidthButton from '../components/Button/FullWidthButton'
import { storageEnabled, storageGet, storageSet, dataFetch } from '../util'
import { sumTeamFunds } from '../util/currency'

export default class TeamPage extends Component {
  state = {
    thisTeamIsSaved: false,
    team: null,
    raised: null,
  }
  componentDidMount() {
    this.isThisTheSavedTeam()
    const teamId = this.props.match.params.teamId
    dataFetch(`/data/teams/${teamId}`).then((data) => {
      this.setState({ team: data })
    })
    dataFetch(`/data/raised/${teamId}`).then((data) => {
      const total = sumTeamFunds(data)
      this.setState({ raised: total })
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
    const { thisTeamIsSaved, team, raised } = this.state
    const unsave = thisTeamIsSaved ? this.unsaveButton() : null

    if (!(team && raised)) { return <Loading /> }
    return (
      <Page>
        <TeamHeader
          org={team.org}
          orgId={team.orgId}
          url={team.url}
          avatar={team.avatar}
          cover={team.cover}
        />

        <Block>
          <div style={{ textAlign: 'center' }}>
            <Currency fontSize={48}>{raised}</Currency>
            <Body>Total Raised to Date</Body>
          </div>
        </Block>

        <Block>
          <h2>Graph</h2>
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
