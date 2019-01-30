import React from 'react'

import { IconDamp } from '../Content/FontIcon'
import { Container, Feature, Value, Label } from './style'
import { Currency } from '../Content'

const CountRaised = ({ count, countName, raised }) => (
  <Container>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <Value>{count}</Value>
        <Feature>
          <Label>#</Label>
          <Label>{countName}</Label>
        </Feature>
      </div>
      <div>
        <Value><Currency fontSize={26} rounded thin>{raised}</Currency></Value>
        <Feature>
          <IconDamp fontSize={18}>bar_chart</IconDamp>
          <Label>Raised</Label>
        </Feature>
      </div>
    </div>
  </Container>
)

export default CountRaised
