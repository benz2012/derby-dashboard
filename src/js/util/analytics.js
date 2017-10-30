import ReactGA from 'react-ga'

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
  return null
}

export {
  logPageView, // eslint-disable-line
}
