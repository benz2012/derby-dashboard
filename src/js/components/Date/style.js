import styled from 'styled-components'
import { CleanLink } from '../Content'

const DateViewerContainer = styled.div`
  position: fixed;
  top: 50px;
  z-index: 45;
  width: 100%;

  padding: 4px 0px;
  font-weight: 700;
  background-color: ${props => props.theme.headerBG};
  color: ${props => props.theme.headerFG};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4);
`
const Month = styled.div`
  margin: 10px 0px 20px 16px;
  font-size: 16px;
`
const DateOptionContainer = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
`

const DateOption = styled(CleanLink)`
  display: inline-block;
  width: 40px;
  padding: 4px 6px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);

  &:first-child {
    padding-left: 12px;
  }
  &:last-child {
    padding-right: 12px;
  }
  &:hover, &:active, &:visited {
    color: rgba(255, 255, 255, 0.5);
  }
`
const Weekday = styled.div`
  padding-bottom: 4px;
  color: ${props => props.selected ? props.theme.headerFG : 'inherit'}
`
const DateCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.selected ? props.theme.headerFG : 'none'}
`
const DateNumber = styled.div`
  font-size: 18px;
  color: ${props => props.selected ? props.theme.headerBG : 'inherit'}
`

export {
  DateViewerContainer,
  Month,
  DateOptionContainer,
  DateOption,
  Weekday,
  DateCircle,
  DateNumber,
}
