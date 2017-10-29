import React from 'react'
import currency from 'currency.js'
import styled from 'styled-components'

const Currency = ({ children }) => {
  const value = currency(children, { formatWithSymbol: true }).format()
  return (
    <CurrencyContainer>{value}</CurrencyContainer>
  )
}

const CurrencyContainer = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgb(69, 194, 80);
`

export default Currency
