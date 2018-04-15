import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import TeamHeader from '../components/TeamHeader'
import TeamChallengeRank from '../components/TeamChallengeRank'
import FullWidthButton from '../components/Button/FullWidthButton'

import { Body, Centered, Currency } from '../components/Content'
import { HeadingText2 } from '../components/HeadingText'
import { LargeLine } from '../components/Chart'

import { storageEnabled, storageGet, storageSet, dataFetch } from '../util'
import { sumTeamFunds, joinFundsHistory } from '../util/currency'
import { filterChallenges } from '../util/manageIncomingData'

export default class TeamPage extends Component {
  state = {
    thisTeamIsSaved: false,
    team: null,
    raised: null,
    history: null,
    challenges: null,
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
    dataFetch('/data/challenges').then((data) => {
      const challenges = filterChallenges(data, parseInt(teamId))
      this.setState({ challenges })
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
  buildChallengeBlocks = challenges => (
    challenges.map(c => (
      <TeamChallengeRank
        key={c.id}
        id={c.id}
        name={c.name}
        description={c.description}
        rank={c.rank}
        score={c.score}
      />
    ))
  )
  render() {
    const { thisTeamIsSaved, team, raised, history, challenges } = this.state
    if (team === null || raised === null) { return <Loading /> }

    const unsave = thisTeamIsSaved ? this.unsaveButton() : null
    const challengeBlocks = challenges && this.buildChallengeBlocks(challenges)
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
          <Centered>
            <Currency fontSize={48} muted>{raised}</Currency>
            <Body>Total Raised to Date</Body>
          </Centered>
        </Block>

        <Block>
          <HeadingText2>Two Week History</HeadingText2>
          { history && <LargeLine values={history} /> }
        </Block>

        {
          team.snap &&
          <Block>
            <HeadingText2>Snapchat Lens</HeadingText2>
            <Body>
              <a href={team.snap} target="_blank">{team.snap}</a>
            </Body>
          </Block>
        }

        {challengeBlocks}

        {unsave}
      </Page>
    )
  }
}
