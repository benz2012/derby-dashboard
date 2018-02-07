import React from 'react'

import { IconWhite } from '../Content'
import { Container, Icon, Text } from './style'

const CopySuccess = () => (
  <Container>
    <Icon>
      <IconWhite fontSize={48}>link</IconWhite>
    </Icon>
    <Text>Link copied to clipboard!</Text>
  </Container>
)

export default CopySuccess
