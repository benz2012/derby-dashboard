import React from 'react'
import currency from 'currency.js'
import styled from 'styled-components'

const Currency = ({ children, ...rest }) => {
  const value = currency(children, { formatWithSymbol: true }).format()
  return (
    <CurrencyContainer {...rest}>{value}</CurrencyContainer>
  )
}

const CurrencyContainer = styled.div`
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '16px'};
  font-weight: 700;
  color: rgb(69, 194, 80);
`

export default Currency
