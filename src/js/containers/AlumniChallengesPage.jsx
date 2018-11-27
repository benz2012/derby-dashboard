import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import ColoredOverview from '../components/ColoredOverview'

import { Body, Centered, Currency } from '../components/Content'

export default class AlumniChallengesPage extends Component {
  render() {
    return (
      <Page>
        <Block>
          <Centered>
            <Currency fontSize={48} muted>{2346.50}</Currency>
            <Body>Total Pleged by Alumni to Date</Body>
          </Centered>
        </Block>

        <Block>
          <ColoredOverview
            messages={[
              [7, 'alumni'],
              [8, 'challenges'],
              [42, 'pledges'],
            ]}
          />
        </Block>
      </Page>
    )
  }
}
