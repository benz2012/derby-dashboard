import React from 'react'
import { Route } from 'react-router-dom'

import EditView from '../componentsAdmin/EditView'

const EditRoute = props => (
  <Route
    path={`${props.match.url}/${props.path || 'edit'}`}
    render={routeProps => (
      <EditView {...props} {...routeProps}>
        {props.children}
      </EditView>
    )}
  />
)

export default EditRoute
