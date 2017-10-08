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
  // scrape.members().then(data => dbWrite.members(data))
  // scrape.teamNames().then(data => dbWrite.teamNames(data))
  // scrape.avatarPhotos().then(data => dbWrite.avatarPhotos(data))
  // scrape.coverPhotos().then(data => dbWrite.coverPhotos(data))
  return
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


// Clock, execute every second
setInterval(scheduler, 1000)
