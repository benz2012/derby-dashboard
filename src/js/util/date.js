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

export {
  dateSort // eslint-disable-line
}
