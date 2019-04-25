import React, { Component } from 'react'
import { Redirect } from 'react-router'

import Page from '../components/Page'
import Block from '../components/Block'
import HeadingText from '../components/HeadingText'
import TeamBlock from '../components/TeamBlock'
import Loading from '../components/Loading'
import Empty from '../components/Empty'
import SaveSelection from '../components/Button/SaveSelection'
import { SidePad, CleanLink, RightArrow } from '../components/Content'
import { dataFetch, objectSort, storageEnabled,
  storageSet, storageGet } from '../util'
import { stringSort } from '../util/string'

export default class TeamSelectionPage extends Component {
  state = {
    teams: null,
    save: true,
    selection: 0,
    storageIsEnabled: true,
  }

  componentDidMount() {
    // test if browser can perform HTML localStorage
    const storage = storageEnabled()
    this.setState({ storageIsEnabled: storage }) // eslint-disable-line
    if (storage === false) {
      this.setState({ save: false }) // eslint-disable-line
    }

    const selection = this.checkForSelection()

    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
      if (selection > 0 && data.every(t => t.id !== selection)) {
        storageSet('teamSelection', { value: 0 })
        this.setState({ selection: 0 })
        this.setState({ save: true })
      }
    })
  }

  handleSaveClick = () => {
    if (this.state.storageIsEnabled === false) { return }
    this.setState(prevState => ({ save: !prevState.save }))
  }

  handleTeamClick = (e) => {
    const { save, storageIsEnabled } = this.state
    if (storageIsEnabled) {
      if (save) {
        storageSet('teamSelection', { value: e.currentTarget.id })
      } else {
        storageSet('teamSelection', { value: 0 })
      }
    }
  }

  teamLink = (t) => {
    const { match } = this.props
    return (
      <CleanLink
        key={t.id}
        id={t.id}
        to={`${match.url}/${t.id}`}
        onClick={this.handleTeamClick}
      >
        <TeamBlock name={t.org} subName={t.orgId} avatar={t.avatar} right={<RightArrow />} />
      </CleanLink>
    )
  }

  checkForSelection() {
    // load the selected teamId
    const teamSelection = storageGet('teamSelection')
    if (teamSelection) {
      const value = parseInt(teamSelection.value)
      this.setState({ selection: value })
      this.setState({ save: false })
      return value
    }
    return 0
  }

  buildTeamLinks(teams) {
    if (!(teams && teams.length > 0)) { return null }
    const teamsData = teams.filter(t => !t.homeTeam)
    if (teamsData.length === 0) return null
    const sortedTeamsData = objectSort(teamsData, 'org', stringSort)
    return sortedTeamsData.map(this.teamLink)
  }

  buildHomeTeamLink(teams) {
    if (!(teams && teams.length > 0)) { return null }
    const homeTeam = teams.find(t => t.homeTeam)
    return this.teamLink(homeTeam)
  }

  render() {
    const { match } = this.props
    const { teams, save, selection, storageIsEnabled } = this.state

    if (selection > 0 && teams && teams.find(t => t.id === selection)) {
      return <Redirect to={`${match.url}/${selection}`} />
    }

    const teamLinks = this.buildTeamLinks(teams)
    const homeTeamLink = this.buildHomeTeamLink(teams)
    return (
      <Page>
        <Block>
          <SidePad>
            <HeadingText>Which team would you like to view?</HeadingText>
            <SaveSelection selected={save} onClick={this.handleSaveClick} />
            {
              storageIsEnabled === false &&
              <em>Saving is not available in your browser</em>
            }
          </SidePad>
        </Block>

        { teams === null ? (
          <Loading />
        ) : (
          <React.Fragment>
            { teamLinks && (<Block>{teamLinks}</Block>)}
            { homeTeamLink && (<Block>{homeTeamLink}</Block>)}
          </React.Fragment>
        )}

        { (teams && teams.length === 0) && (
          <Empty>No teams have been added.</Empty>
        )}
      </Page>
    )
  }
}
