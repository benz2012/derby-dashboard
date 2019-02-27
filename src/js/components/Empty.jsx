import React from 'react'
import styled from 'styled-components'

import Page from './Page'
import { WaitingText } from './Loading/style'

const Text = styled(WaitingText)`
  margin-top: 50px;
`

const TextAlone = styled(WaitingText)`
  margin-top: 150px;
`

const Empty = ({ children, alone }) => (
  alone ? (
    <Page>
      <TextAlone>
        {children}
      </TextAlone>
    </Page>
  ) : (
    <Text>{children}</Text>
  )
)

export default Empty
