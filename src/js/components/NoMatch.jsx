import React from 'react'
import styled from 'styled-components'

import Page from './Page'

const NoMatch = () => (
  <Page>
    <NotFoundMessage>
      no page found :(<br /><br />
      try something other than: {window.location.pathname}
    </NotFoundMessage>
  </Page>
)

const NotFoundMessage = styled.h1`
  width: 100%;
  height: 100%;
  text-align: center;
  margin-top: 100px;

  color: ${props => props.theme.textDampen};
`

export default NoMatch
