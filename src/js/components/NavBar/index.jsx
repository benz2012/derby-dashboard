import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => (
  <ul>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/schedule">Schedule</Link></li>
    <li><Link to="/teams">My Team</Link></li>
    <li><Link to="/challenges">Challenges</Link></li>
    <li><Link to="/live">Live</Link></li>
    <li><Link to="/more">More</Link></li>
  </ul>
)

export default NavBar
