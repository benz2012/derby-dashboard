import React from 'react'
import { Redirect } from 'react-router'

const stringSort = (stringA, stringB) => {
  // ignore upper and lowercase
  const valueA = stringA.toUpperCase()
  const valueB = stringB.toUpperCase()
  if (valueA < valueB) {
    return -1
  }
  if (valueA > valueB) {
    return 1
  }
  return 0 // values must be equal
}

const removeTrailingSlash = ({ location }) => {
  const path = location.pathname
  if (path === '/') { return null }
  const trail = path.substr(-1)
  if (trail !== '/') { return null }
  const pathWithoutTrail = path.substr(0, path.length - 1)
  return <Redirect to={pathWithoutTrail} />
}

export {
  stringSort,
  removeTrailingSlash,
}
