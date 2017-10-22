const moment = require('moment')

const errorEnd = (err, res) => {
  console.log(err)
  res.status(500).send()
}

const groupBy = (ungrouped, key) => (
  ungrouped.reduce((final, curr) => {
    // eslint-disable-next-line no-param-reassign
    (final[curr[key]] = final[curr[key]] || []).push(curr)
    return final
  }, {})
)

const lastDateTimeString = () => {
  const timeSlot = Math.floor(moment().utc().hour() / 6) + 3
  return moment().utc().subtract(1, 'days').format(`YYYY-MM-DD-${timeSlot}`)
}

module.exports = {
  errorEnd,
  groupBy,
  lastDateTimeString,
}
