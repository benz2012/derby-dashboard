import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Heading from '../components/Heading'
import Video from '../components/Video'
import { Header, Body } from '../components/Content'
import ExternalLink from '../components/Content/ExternalLink'
import { dataFetch } from '../util'

export default class HomePage extends Component {
  state = {
    home: null,
    raised: null,
  }
  componentDidMount() {
    dataFetch('/data/home').then(res => res.json()).then((data) => {
      this.setState({ home: data })
    })
    dataFetch('/data/raised/school').then(res => res.json()).then((data) => {
      this.setState({ raised: data })
    })
  }
  render() {
    const { home } = this.state
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
          Sigma Chi
        </Block>
        <Block>
          <ul>
            <li>Team 1</li>
            <li>Team 2</li>
            <li>Team 3</li>
            <li>Team 4</li>
            <li>Team 5</li>
          </ul>
        </Block>
      </Page>
    )
  }
}
