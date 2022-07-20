import React from 'react';
import { Link } from 'react-router-dom';

import './Nav.css';

export default class Nav extends React.Component {
  render() {
    return (
      <nav className='nav-container'>
        <div>
          <Link to='/'>Map </Link>
          <Link to='/info'>Info</Link>
        </div>
      </nav>
    );
  }
}
