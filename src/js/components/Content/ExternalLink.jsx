import React from 'react'
import styled from 'styled-components'

const ExternalLink = ({ children, href }) => (
  <LinkContainer>
    <LinkElement href={href} target="_blank">
      {children}
    </LinkElement>
  </LinkContainer>
)

const LinkContainer = styled.div`
  padding: 5px 0px;
  font-weight: 700;
`

const LinkElement = styled.a`
  color: ${props => props.theme.headerBG};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.headerBG};
    text-decoration: underline;
  }
  &:active {
    color: ${props => props.theme.headerBG};
    text-decoration: none;
  }
  &:visited {
    color: ${props => props.theme.headerBG};
    text-decoration: none;
  }
`

export default ExternalLink
