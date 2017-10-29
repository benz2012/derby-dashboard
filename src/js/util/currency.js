/* eslint comma-dangle: 0 */
import currency from 'currency.js'

const sumCurrencies = (currencies) => {
  const total = currencies.reduce(
    (accum, current) => (accum.add(current)),
    currency(0)
  )
  return total.value
}

const sumTeamFunds = ({ raised, external }) => {
  const initial = currency(raised)
  const total = Object.keys(external)
    .reduce((accum, current) => (
      accum.add(external[current])
    ), initial)
  return total.value
}

const sumSchoolFunds = (teams) => {
  const total = teams.reduce((accum, current) => (
    accum.add(sumTeamFunds(current))
  ), currency(0))
  return total.value
}

export {
  sumCurrencies,
  sumTeamFunds,
  sumSchoolFunds,
}
