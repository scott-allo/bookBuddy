import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            📚 My Library
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-book" className={({ isActive }) => isActive ? "active" : ""}>
            ➕ Add book
          </NavLink>
        </li>
        <li>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? "active" : ""}>
            ⭐ Favorites
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
            👤 Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 