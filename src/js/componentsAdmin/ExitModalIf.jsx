import { withRouter } from 'react-router'

const ExitModalIf = ({ value, paths, location, history }) => {
  const names = location.pathname.split('/')
  const here = names[names.length - 1]
  if (paths.indexOf(here) !== -1) {
    if (value === '') {
      const to = location.pathname.replace(here, '')
      history.replace(to)
      return null
    }
  }
  return null
}

export default withRouter(ExitModalIf)
