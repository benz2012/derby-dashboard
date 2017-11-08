import styled from 'styled-components'

import Currency from './Currency'
import ExternalLink from './ExternalLink'
import CleanLink from './CleanLink'
import FontIcon, { IconWhite } from './FontIcon'
import IconLink from './IconLink'

const Header = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`
const Body = styled.div`
  font-weight: 300;
  padding-bottom: 3px;
`
const Ranking = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textDampen}
`
const LeftPad = styled.div`
  padding-left: ${props => props.length ? `${props.length}px` : '8px'};
`

export {
  Header,
  Body,
  Ranking,
  LeftPad,
  Currency,
  ExternalLink,
  FontIcon,
  IconWhite,
  CleanLink,
  IconLink,
}
