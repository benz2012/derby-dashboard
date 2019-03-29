import styled from 'styled-components'

import Currency from './Currency'
import DateString from './DateString'
import ExternalLink from './ExternalLink'
import CleanLink from './CleanLink'
import FontIcon, { IconWhite } from './FontIcon'
import IconLink from './IconLink'
import RightArrow from './RightArrow'
import Cheering from './Cheering'

const SidePad = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`
const FullPad = styled.div`
  padding: ${props => (props.length ? `${props.length}px` : '15px')};
`
const Body = styled.div`
  font-weight: 300;
  padding-bottom: 3px;
`
const BodyFromMarkdown = styled(Body)`
  > div > p > img {
    width: 100%;
  }
`
const Ranking = styled.div`
  font-size: 12px;
  color: ${props => (props.darker ? props.theme.textDampenLess : props.theme.textDampen)};
`
const Score = styled.div`
  font-size: 24px;
  color: ${props => props.theme.buttonBG}
`
const LeftPad = styled.div`
  padding-left: ${props => (props.length ? `${props.length}px` : '8px')};
`
const RightPad = styled.div`
  padding-right: ${props => (props.length ? `${props.length}px` : '8px')};
`
const Centered = styled.div`
  text-align: center;
`
const Ellipsis = styled.div`
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export {
  SidePad,
  FullPad,
  Body,
  BodyFromMarkdown,
  Ranking,
  Score,
  LeftPad,
  RightPad,
  Centered,
  Currency,
  DateString,
  ExternalLink,
  FontIcon,
  IconWhite,
  CleanLink,
  IconLink,
  RightArrow,
  Ellipsis,
  Cheering,
}
