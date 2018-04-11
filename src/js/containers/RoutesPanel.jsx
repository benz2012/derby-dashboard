import React, { Component } from 'react'
import { Route, Link, NavLink } from 'react-router-dom'

import Modal from './Modal'

import { dataFetch } from '../util'
import { loadBootstrapCSS } from '../styles/app'

const EditPane = ({ items, match }) => {
  if (!items) return null
  console.log(match)
  const obj = items.find(i => parseInt(i.id) === parseInt(match.params.id))
  console.log(obj)
  return (<Modal>
    <div
      className="card"
      style={{ zIndex: '150', position: 'fixed', width: '60%', height: '80%', 'marginTop': '5%', marginLeft: '20%' }}
    >
      <div className="card-body">
        {
          Object.keys(obj).map(k => (
            <p key={k} className="card-text">{k}: {obj[k]}</p>
          ))
        }
      </div>
    </div>
  </Modal>)
}

export default class RoutesPanel extends Component {
  state = {
    name: null,
    picture: null,
    teams: null,
  }
  componentWillMount() {
    loadBootstrapCSS() // prevents the public site from needing to load it
    const { uid } = this.props
    window.FB.api(`/${uid}?fields=id,name,picture`, 'GET', {}, (res) => {
      this.setState({
        name: res.name,
        picture: res.picture.data.url,
      })
    })

    dataFetch('/data/teams').then((data) => {
      this.setState({ teams: data })
    })
  }
  handleLogout = () => {
    if (!window.FB) {
      console.log('FB not connected')
      return
    }
    const { statusChangeCallback } = this.props
    window.FB.logout(statusChangeCallback)
  }
  makeCard = (head, lines, to) => {
    return (
      <Link key={head} to={to}>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{head}</h5>
            <p className="card-text">
              {lines.join('\n')}
            </p>
          </div>
        </div>
      </Link>
    )
  }
  render() {
    const { name, picture, teams } = this.state
    const { match } = this.props
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0">
          <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to={match.url}>Derby Dashboard Admin</Link>
          <ul className="navbar-nav px-3">
            <li className="nav-item dropdown text-nowrap">
              <a className="nav-link dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">
                <img
                  alt="facebook profile"
                  src={picture}
                  style={{ width: '25px', height: '25px', borderRadius: '50%', marginRight: '5px' }}
                />
                {name}
              </a>
            </li>
          </ul>
        </nav>

        <div className="container-fluid">
          <div className="row">

            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <NavLink className="nav-link" to={match.url} exact>General</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`${match.url}/teams`}>Teams</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`${match.url}/funds`}>Funds</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`${match.url}/events`}>Events</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`${match.url}/challenges`}>Challenges</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`${match.url}/reports`}>Reports</NavLink>
                  </li>
                </ul>
              </div>
            </nav>

            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4 mt-5">
              {
                teams && teams.map(t => (this.makeCard(
                  t.org, [t.orgId, t.url], `${match.url}/teams/${t.id}`,
                )))
              }

              {
                teams &&
                <Route path={`${match.url}/teams/:id`} render={props => (<EditPane {...props} items={teams} />)} />
              }
            </main>

          </div>
        </div>
      </div>
    )
  }
}
