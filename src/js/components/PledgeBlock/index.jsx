import React from 'react'

import Block from '../Block'
import { SidePad } from '../Content'
import { Container, Feature, Total, Label, Line } from './style'

const PledgeBlock = ({ pledge, count, countName }) => (
  <Block>
    <SidePad>
      <Container>
        <React.Fragment>
          <Feature colorName="Public Event">${pledge}</Feature>
          <Label>
            pledge per {
              countName.slice(-1) === 's' ?
                countName.substring(0, countName.length - 1) :
                countName
            }
          </Label>
        </React.Fragment>

        <React.Fragment>
          <Feature colorName="Team Activity">{count}</Feature>
          <Label>{countName}</Label>
        </React.Fragment>
      </Container>
      <Line />
      <Container>
        <React.Fragment>
          <Total colorName="Individual Activity">
            ${pledge * count}
          </Total>
          <Label>Raised</Label>
        </React.Fragment>
      </Container>
    </SidePad>
  </Block>
)

export default PledgeBlock
