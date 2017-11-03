import styled from 'styled-components'

const Blur = radius => (`
  filter: url(#svgBlur);
  filter: blur(${radius}px);
`)

const Backdrop = styled.div`
  z-index: 60;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(0, 0, 0, 0.25);
  -webkit-overflow-scrolling: touch;
`

export {
  Blur,
  Backdrop,
}
