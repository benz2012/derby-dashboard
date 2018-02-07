import React from 'react'

import { IconWhite } from '../Content'
import { Container, Icon, Text } from './style'

const CopyFailure = () => (
  <Container>
    <Icon>
      <IconWhite fontSize={48}>warning</IconWhite>
    </Icon>
    <Text>Auto-Copy not supported.</Text>
  </Container>
)

export default CopyFailure
