import React from 'react'

import { DateOption, Weekday, DateCircle, DateNumber } from './style'

const DateLink = ({ to, weekday, number, selected }) => (
  <DateOption to={to}>
    <Weekday selected={selected}>{weekday}</Weekday>
    <DateCircle selected={selected}>
      <DateNumber selected={selected}>{number}</DateNumber>
    </DateCircle>
  </DateOption>
)

export default DateLink
