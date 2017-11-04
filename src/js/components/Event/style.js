import styled from 'styled-components'

import PlainButton from '../Button/PlainButton'

const EventContainer = styled.div`
  z-index: 70;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`
const EventOutline = styled.div`
  width: 85%;
  height: auto;
  max-height: 85%;

  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  color: white;
  cursor: auto;
`
const EventContent = styled.div`
  padding: 10px;
  flex-grow: 1;
  overflow: scroll;
  margin-bottom: 34px;
`
const EventClose = styled(PlainButton)`
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 6px 0px;
  border-top: 1px solid white;
  color: white;
  font: 300 18px 'Roboto', sans-serif;
`

export {
  EventContainer,
  EventOutline,
  EventContent,
  EventClose,
}
