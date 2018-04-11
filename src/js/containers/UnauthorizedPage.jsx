import React from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import HeadingText from '../components/HeadingText'

const UnauthorizedPage = ({ uid }) => (
  <Page>
    <Block>
      <HeadingText>Derby Dashboard Admin Panel</HeadingText>
      <p>You are <strong>NOT</strong> authorized to use this admin panel.</p>
      <p>Please provide this Faecbook user ID # to a site maintainer for access: {uid}</p>
    </Block>
  </Page>
)

export default UnauthorizedPage
