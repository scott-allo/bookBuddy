import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" activeClassName="active">
            📚 Ma bibliothèque
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-book" activeClassName="active">
            ➕ Ajouter un livre
          </NavLink>
        </li>
        <li>
          <NavLink to="/favorites" activeClassName="active">
            ⭐ Favoris
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active">
            👤 Profil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 