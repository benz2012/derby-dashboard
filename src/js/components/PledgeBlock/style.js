import styled from 'styled-components'

import { OverviewContainer } from '../ColoredOverview'

const Container = styled(OverviewContainer)`
  grid-template-columns: 45% 1fr;
  align-items: center;
`

const Feature = styled.div`
  font-size: 20px;
  text-align: right;
  font-weight: 700;
  color: ${props => props.colorName && props.theme[props.colorName]};
`

const Total = styled(Feature)`
  font-size: 26px;
`

const Label = styled.span`
  text-align: left;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme.textDampen};
`

const Line = styled.hr`
  border-top: 1px solid ${props => props.theme.textDampen};
  border-right: 0px;
  border-left: 0px;
  border-bottom: 0px;
`

export {
  Container,
  Total,
  Feature,
  Label,
  Line,
}
