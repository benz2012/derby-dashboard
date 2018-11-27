import React from 'react'
import styled from 'styled-components'

const colorNames = [
  'Public Event',
  'Team Activity',
  'Individual Activity',
]

const ColoredOverview = ({ messages }) => (
  <OverviewContainer>
    { messages.map(([left, right], idx) => (
      <React.Fragment key={right}>
        <LeftMessage colorName={colorNames[idx % colorNames.length]}>{left}</LeftMessage>
        <RightMessage colorName={colorNames[idx % colorNames.length]}>{right}</RightMessage>
      </React.Fragment>
    ))}
  </OverviewContainer>
)

const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  grid-template-rows: auto;
  grid-column-gap: 10px;
  grid-row-gap: 4px;

  font-size: 16px;
  font-weight: 300;
`

const LeftMessage = styled.div`
  text-align: right;
  color: ${props => props.theme[props.colorName]};
`

const RightMessage = styled.div`
  text-align: left;
  color: ${props => props.theme[props.colorName]};
`

export default ColoredOverview
