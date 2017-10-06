const request = require('request')
const cheerio = require('cheerio')


// Scheduler
let executedTenMinutely = false
let executedHourly = false
const tick = () => {
  const now = new Date()

  everySecond()

  if (now.getMinutes() % 10 === 0 && (!executedTenMinutely)) {
    everyTenMinutes()
    executedTenMinutely = true
  }
  if (now.getMinutes() % 10 !== 0 && executedTenMinutely) {
    executedTenMinutely = false
  }

  if (now.getMinutes() === 0 && (!executedHourly)) {
    everyHour()
    executedHourly = true
  }
  if (now.getMinutes() !== 0 && executedHourly) {
    executedHourly = false
  }
}

// Clock, execute every second
setInterval(tick, 1000)

// Scheduled Functions
const everySecond = () => {
  console.log('every second')
}

const everyTenMinutes = () => {
  console.log('every 10 minutes')
}

const everyHour = () => {
  console.log('every hour')
}
