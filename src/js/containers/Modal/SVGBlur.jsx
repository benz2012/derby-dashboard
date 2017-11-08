import React from 'react'

const SVGBlur = ({ radius }) => (
  <svg style={{ position: 'absolute', top: '-99999px' }} xmlns="http://www.w3.org/2000/svg">
    <filter id="svgBlur" x="-5%" y="-5%" width="150%" height="150%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={radius} />
    </filter>
  </svg>
)

export default SVGBlur
