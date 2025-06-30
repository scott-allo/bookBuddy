import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" activeclassname="active">
            📚 Ma bibliothèque
          </NavLink>
        </li>
        <li>
          <NavLink to="/favorites" activeclassname="active">
            ⭐ Favoris
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeclassname="active">
            👤 Profil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 