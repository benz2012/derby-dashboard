import moment from 'moment'

const dateSort = (dateA, dateB) => {
  if (moment(dateA).isBefore(dateB, 'day')) {
    return -1
  }
  if (moment(dateA).isAfter(dateB, 'day')) {
    return 1
  }
  return 0
}

const timeParse = t => moment(t, 'HH:mm')
const tfmt = t => timeParse(t).format('h:mm a')
const durationString = (start, end) => `${tfmt(start)} - ${tfmt(end)}`

const timeSort = (timeA, timeB) => {
  const datetimeA = timeParse(timeA)
  const datetimeB = timeParse(timeB)
  if (datetimeA.isBefore(datetimeB)) {
    return -1
  }
  if (datetimeA.isAfter(datetimeB)) {
    return 1
  }
  return 0
}


export {
  dateSort,
  timeSort,
  durationString,
}
