import React from 'react'
import moment from 'moment'

const DateString = ({ children, format }) => (
  <span>
    {moment(children).format(format)}
  </span>
)

export default DateString
