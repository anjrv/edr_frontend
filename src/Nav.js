import React from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {
  render() {
    return (
      <nav className='Nav'>
        <div>
          <Link to='/'>Map </Link>
          <Link to='/info'>Info</Link>
        </div>
      </nav>
    );
  }
}
