import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import ColoredOverview from '../components/ColoredOverview'
import { AlumniChallengeBlock } from '../components/ChallengeBlock'

import { Body, Centered, Currency } from '../components/Content'

export default class AlumniChallengesPage extends Component {
  render() {
    return (
      <Page>
        <Block>
          <Centered>
            <Currency fontSize={48} muted>{2346.50}</Currency>
            <Body>Total Raised thru Alumni Challenges</Body>
          </Centered>
        </Block>

        <Block>
          <ColoredOverview
            messages={[
              [8, 'challenges'],
              [7, 'alumni invovled'],
              [42, 'pledges made'],
            ]}
          />
        </Block>

        <AlumniChallengeBlock
          id={1}
          name="Community Service"
          description="For every brother that performs 5 or more hours of community service, Alumni will donate pledged amount."
          count="12"
          countName="Brothers"
          raised="240"
        />

        <AlumniChallengeBlock
          id={2}
          name="Greek Community"
          description="For every dry greek event that the chapter attends, being hosted by another organization and proving that 5 or more brothers were in attendance, Alumni will donate pledged amount."
          count="2"
          countName="Events"
          raised="0"
        />
      </Page>
    )
  }
}
