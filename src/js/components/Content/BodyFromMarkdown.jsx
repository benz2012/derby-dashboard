import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-weight: 300;
  padding-bottom: 3px;

  > div > p > img {
    width: 100%;
  }
`

class BodyFromMarkdown extends Component {
  htmlString = html => (
    <div dangerouslySetInnerHTML={{ __html: html }} /> // eslint-disable-line
  )

  render() {
    const { children } = this.props
    return (
      <Container>
        {this.htmlString(children)}
      </Container>
    )
  }
}

export default BodyFromMarkdown
