import React from 'react'

import { IconDamp } from '../Content/FontIcon'
import { Container, Row, Feature, Value, Label } from './style'

const RankScore = ({ rank, score }) => (
  <Container>
    <Row>
      <Value>{rank}</Value>
      <Value>{score}</Value>
    </Row>

    <Row>
      <div>
        <Feature>
          <IconDamp fontSize={18}>arrow_upward</IconDamp>
          <Label>Rank</Label>
        </Feature>
      </div>
      <div>
        <Feature>
          <IconDamp fontSize={18}>local_activity</IconDamp>
          <Label>Score</Label>
        </Feature>
      </div>
    </Row>
  </Container>
)

export default RankScore
