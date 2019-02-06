const moment = require('moment')
const marked = require('marked')
const sanitizeHTML = require('sanitize-html')

marked.setOptions({
  breaks: true,
})

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

const TimeString = (distanceInDays, timeSlot) => (
  moment().utc().subtract(distanceInDays, 'days').format(`YYYY-MM-DD-${timeSlot}`)
)

const lastDateTimeString = () => {
  const timeSlot = Math.floor(moment().utc().hour() / 6) + 3
  return TimeString(1, timeSlot)
}

const twoWeekTimeString = () => {
  const timeSlot = Math.floor(moment().utc().hour() / 6)
  return TimeString(14, timeSlot)
}

const markdownToHTML = input => (
  sanitizeHTML(marked(input), {
    allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHTML.defaults.allowedAttributes,
      img: sanitizeHTML.defaults.allowedAttributes.img.concat(['alt']),
    },
  })
)

const toCamelCase = str => (
  `${str.charAt(0).toLowerCase()}${str.slice(1)}`
)

const applyKeyMapToObj = (obj, keyMap) => (
  Object.keys(obj).reduce((accum, key) => {
    // eslint-disable-next-line no-param-reassign
    accum[keyMap[key]] = obj[key]
    return accum
  }, {})
)

module.exports = {
  errorEnd,
  groupBy,
  lastDateTimeString,
  twoWeekTimeString,
  markdownToHTML,
  toCamelCase,
  applyKeyMapToObj,
}
