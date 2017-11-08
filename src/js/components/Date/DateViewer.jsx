import React from 'react'

import { DateViewerContainer, Month, DateOptionContainer } from './style'

const DateViewer = ({ monthYear, children }) => (
  <DateViewerContainer>
    <Month>{monthYear}</Month>
    <DateOptionContainer>{children}</DateOptionContainer>
  </DateViewerContainer>
)


export default DateViewer
