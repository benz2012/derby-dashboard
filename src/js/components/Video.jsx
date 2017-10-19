import React from 'react'
import styled from 'styled-components'

import { embedURL } from '../util'

const Video = ({ src }) => (
  <VideoContainer>
    <VideoFrame
      width="560"
      height="315"
      src={embedURL(src)}
      frameBorder="0"
      allowFullScreen
    />
  </VideoContainer>
)

const VideoContainer = styled.div`
  overflow:hidden;
  padding-bottom:56.25%;
  position:relative;
  height:0;
`

const VideoFrame = styled.iframe`
  left:0;
  top:0;
  height:100%;
  width:100%;
  position:absolute;
`

export default Video
