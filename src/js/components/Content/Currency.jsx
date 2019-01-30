import React from 'react'
import currency from 'currency.js'
import styled from 'styled-components'

const Currency = ({ children, rounded, ...rest }) => {
  const options = { formatWithSymbol: true }
  if (rounded === true) { options.precision = 0 }
  const value = currency(children, options).format()
  return (
    <CurrencyContainer {...rest}>{value}</CurrencyContainer>
  )
}

const CurrencyContainer = styled.div`
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '16px'};
  font-weight: ${props => props.thin ? 400 : 700};
  color: ${props => props.muted ? props.theme.buttonBG : 'rgb(69, 194, 80)'};
`

export default Currency
