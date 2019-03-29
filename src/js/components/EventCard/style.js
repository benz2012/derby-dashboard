import styled from 'styled-components'

const EventType = styled.div`
  padding: 4px 10px;
  font-weight: 700;
  color: white;
  background-color: ${props => props.children && props.theme[props.children]};
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

const TagContiner = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const EventTag = styled.div`
  position: relative;
  padding: 4px 6px 4px 24px;
  margin: 0px 6px 6px 0px;
  color: ${props => props.theme.buttonFG};
  background-color: ${props => props.theme.tagBG};
  border-radius: 12px 0px 0px 12px;

  &::before {
    content:'';
    position: absolute;
    top: 6px;
    left: 6px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: ${props => props.theme.buttonFG};
  }
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
  TagContiner,
  EventTag,
  IconContainer,
}
