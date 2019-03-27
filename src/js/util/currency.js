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
  // NOTE: the last `team` represents the school total on the donation website

  const simplyRaised = teams.reduce((accum, { raised }, index) => {
    if (index === teams.length - 1) return accum
    return accum.add(raised)
  }, currency(0))

  const schoolTotal = currency(teams[teams.length - 1].raised)
  const donatedToSchool = currency(schoolTotal).subtract(simplyRaised)

  const teamTotal = teams.reduce((accum, current, index) => {
    if (index === teams.length - 1) return accum
    return accum.add(sumTeamFunds(current))
  }, currency(0))
  const final = teamTotal.add(donatedToSchool)

  return final.value
}

const joinFundsHistory = ({ raised, external }) => {
  let final = raised.map(item => currency(item.raised))
  external.forEach((fund) => {
    const startingIndex = raised.findIndex(element => (
      fund.dateString === element.dateString.substr(0, 10)
    ))
    if (startingIndex === -1) {
      // fund was added before the raised history range
      final = final.map(r => currency(r).add(fund.amount))
    } else {
      // fund was added within the raised history range
      final = final.map((r, index) => {
        if (index < startingIndex) { return r }
        return currency(r).add(fund.amount)
      })
    }
  })
  return final.map(total => total.value)
}

export {
  sumCurrencies,
  sumTeamFunds,
  sumSchoolFunds,
  joinFundsHistory,
}
