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
import { getUserFavoris, toggleFavori } from './api/user';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ marginLeft: 200, minHeight: '100vh', background: '#f5f4f0', width: 'calc(100vw - 200px)' }}>
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

  const fetchBooks = async () => {
    if (userId && token) {
      const data = await getUserBooks(userId, token);
      setBooks(data);
    }
  };

  useEffect(() => {
    fetchBooks();
    // Charger les favoris depuis l'API
    const fetchFavoris = async () => {
      if (userId && token) {
        try {
          const favs = await getUserFavoris(userId, token);
          setFavorites(favs.map(f => f._id));
        } catch (e) {
          setFavorites([]);
        }
      }
    };
    fetchFavoris();
  }, [userId, token]);

  const handleToggleFavorite = async (bookId) => {
    if (!userId || !token) return;
    try {
      const res = await toggleFavori(userId, bookId, token);
      setFavorites(res.favoris.map(f => f.toString ? f.toString() : f));
      setToast(res.message);
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      setToast("Erreur lors de la modification des favoris");
      setTimeout(() => setToast(null), 2000);
    }
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
        <Route path="/add-book" element={<Layout><BookForm onBookAdded={fetchBooks} /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/favorites" element={<Layout><Favorites books={books} favorites={favorites} onToggleFavorite={handleToggleFavorite} /></Layout>} />
        {/* D'autres routes à venir, protégées par Layout */}
      </Routes>
    </Router>
  );
};

export default App;
