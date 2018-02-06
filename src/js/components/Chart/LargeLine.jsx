import React from 'react'
import { Line } from 'react-chartjs-2'

import LineConfig from './LineConfig'
import theme from '../../styles/theme'

const chartScale = (values) => {
  const max = parseInt(Math.max(...values))
  if (max >= 0 && max < 500) {
    return Math.ceil(((max + 1) * 1.2) / 100) * 100
  } else if (max >= 500 && max < 3000) {
    return Math.ceil((max * 1.2) / 500) * 500
  }
  return Math.ceil((max * 1.2) / 1000) * 1000
}

const LargeLine = ({ values, color }) => {
  const lineColor = color || theme.buttonBG
  const scale = chartScale(values)
  const chart = new LineConfig(values, lineColor, scale)
  return (
    <Line data={chart.data} options={chart.options} />
  )
}

export default LargeLine
