const scrape = require('./scrape')
const dbWrite = require('./database/dbWrite.js')


// Scheduled Functions
const everySecond = () => {
  scrape.raised()
    .then(data => dbWrite.raised(data))
    .catch(err => console.log(err))
}
const everyTenMinutes = () => {
  scrape.teams()
    .then((data) => {
      dbWrite.teams(data)
      return data
    })
    .then(data => dbWrite.teamsForSchool(data))
    .catch(err => console.log(err))
}
const everyHour = () => {
  scrape.teamValues()
    .then(data => dbWrite.teamValues(data))
    .catch(err => console.log(err))
}

// Trigger each method once, for initial data gathering on worker restart
// which will prevent waiting for a certain minute/hour to elliminate
// stale data
const initialRun = () => {
  everySecond()
  everyTenMinutes()
  everyHour()
}

// Scheduler
let executedTenMinutely = false
let executedHourly = false
const scheduler = () => {
  const now = new Date()
  // Trigger 1 Second Functions
  everySecond()
  // Trigger 10 Minute Functions
  if (now.getMinutes() % 10 === 0 && (!executedTenMinutely)) {
    everyTenMinutes()
    executedTenMinutely = true
  }
  if (now.getMinutes() % 10 !== 0 && executedTenMinutely) {
    executedTenMinutely = false
  }
  // Trigger 1 Hour Functions
  if (now.getMinutes() === 0 && (!executedHourly)) {
    everyHour()
    executedHourly = true
  }
  if (now.getMinutes() !== 0 && executedHourly) {
    executedHourly = false
  }
}


// roughly wait for in-memory init
setTimeout(() => {
  // try a first pass so we don't have to wait 59 mins for values
  initialRun()

  // Clock, execute every second
  setInterval(scheduler, 1000)
}, 3000)
