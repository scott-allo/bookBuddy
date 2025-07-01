import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookForm from './pages/BookForm';
import Sidebar from './components/Sidebar/Sidebar';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import { useEffect, useState } from 'react';
import { getUserBooks } from './api/books';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ marginLeft: 200, width: '100%' }}>
      {children}
    </div>
  </div>
);

const App = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]); // ids des livres favoris
  const [toast, setToast] = useState(null); // message de notification
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBooks = async () => {
      if (userId && token) {
        const data = await getUserBooks(userId, token);
        setBooks(data);
      }
    };
    fetchBooks();
  }, [userId, token]);

  const handleToggleFavorite = (bookId) => {
    setFavorites(favs => {
      const isFav = favs.includes(bookId);
      setToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris');
      setTimeout(() => setToast(null), 2000);
      return isFav ? favs.filter(id => id !== bookId) : [...favs, bookId];
    });
  };

  return (
    <Router>
      {/* Toast de notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#223',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 600,
          boxShadow: '0 4px 24px #0003',
          zIndex: 2000,
          letterSpacing: 1
        }}>{toast}</div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard books={books} favorites={favorites} onToggleFavorite={handleToggleFavorite} /></Layout>} />
        <Route path="/add-book" element={<Layout><BookForm /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/favorites" element={<Layout><Favorites books={books} favorites={favorites} onToggleFavorite={handleToggleFavorite} /></Layout>} />
        {/* D'autres routes à venir, protégées par Layout */}
      </Routes>
    </Router>
  );
};

export default App;
