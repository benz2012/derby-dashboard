import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import Loading from '../components/Loading'
import Video from '../components/Video'
import HeadingText, { HeadingText2 } from '../components/HeadingText'
import { BodyFromMarkdown, FullPad } from '../components/Content'
import { dataFetch } from '../util'

import '../../assets/images/icon_on_home.png'

export default class MorePage extends Component {
  state = {
    more: null,
  }
  componentDidMount() {
    dataFetch('/data/application/more').then((data) => {
      this.setState({ more: data })
    })
  }
  htmlString = html => (
    <div dangerouslySetInnerHTML={{ __html: html }} /> // eslint-disable-line
  )
  render() {
    const { more } = this.state
    if (!more) { return <Loading /> }
    return (
      <Page>
        <Block style={{ paddingLeft: '25px' }}>
          <HeadingText style={{ fontSize: '50px' }}>Derby Dashboard</HeadingText>
        </Block>

        <Block>
          <FullPad style={{ paddingTop: '0px' }}>
            <HeadingText>Overview</HeadingText>
            <Video src={more.overviewVideoURL} />
          </FullPad>
        </Block>

        <Block>
          <FullPad>
            <HeadingText2>Save this Website as an App</HeadingText2>
            <BodyFromMarkdown>
              {this.htmlString(more.bookmark)}
            </BodyFromMarkdown>
          </FullPad>
        </Block>

        <Block>
          <FullPad>
            <HeadingText2>Text (SMS) Notifications</HeadingText2>
            <BodyFromMarkdown>
              {this.htmlString(more.texting)}
            </BodyFromMarkdown>
          </FullPad>
        </Block>

        <Block>
          <FullPad>
            <HeadingText2>Disclaimer</HeadingText2>
            <BodyFromMarkdown>
              {this.htmlString(more.disclaimer)}
            </BodyFromMarkdown>
          </FullPad>
        </Block>

        <Block>
          <FullPad>
            <HeadingText2>Support</HeadingText2>
            <BodyFromMarkdown>
              {this.htmlString(more.support)}
            </BodyFromMarkdown>
          </FullPad>
        </Block>
      </Page>
    )
  }
}
