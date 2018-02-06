import React from 'react'

import { Container, Dot } from './style'

const Loading = () => (
  <Container>
    <Dot delay={'-0.32s'} />
    <Dot delay={'-0.16s'} />
    <Dot />
  </Container>
)

export default Loading
