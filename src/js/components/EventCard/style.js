import styled from 'styled-components'

const typeColors = {
  'Individual Activity': 'rgb(6, 150, 136)',
  'Team Activity': 'rgb(232, 30, 99)',
  'Public Event': 'rgb(63, 81, 180)',
}
const colored = type => typeColors[type]
const EventType = styled.div`
  padding: 4px 10px;
  font-weight: 700;
  color: white;
  background-color: ${props => props.children && typeColors[props.children]};
`

const EventContent = styled.div`
  padding: 10px;
  padding-right: 40px;
`
const EventName = styled.div`
  margin-bottom: 6px;
  font-family: ${props => props.theme.fontHeading};
  font-size: 30px;
  font-weight: 700;
`
const EventTime = styled.div`
  color: rgba(0, 0, 0, 0.4);
  margin-bottom: 6px;
`

const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 4px;
`

export {
  EventType,
  EventContent,
  EventName,
  EventTime,
  colored,
  IconContainer,
}
