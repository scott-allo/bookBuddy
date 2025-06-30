import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookForm from './pages/BookForm';
import Sidebar from './components/Sidebar/Sidebar';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ marginLeft: 200, width: '100%' }}>
      {children}
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/add-book" element={<Layout><BookForm /></Layout>} />
        {/* D'autres routes à venir, protégées par Layout */}
      </Routes>
    </Router>
  );
};

export default App;
