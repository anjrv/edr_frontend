import React from 'react';
import { NavLink } from 'react-router-dom';

import './Nav.css';

export default class Nav extends React.Component {
  render() {
    return (
      <nav className='nav-container'>
          <NavLink className='nav-link' to='/'>
            Map
          </NavLink>
          <NavLink className='nav-link' to='/android'>
            App
          </NavLink>
          <NavLink className='nav-link' to='/about'>
            About
          </NavLink>
      </nav>
    );
  }
}
