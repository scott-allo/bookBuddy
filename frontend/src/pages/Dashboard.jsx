import React, { useEffect, useState } from 'react';
import { getUserBooks } from '../api/books';
import BookForm from './BookForm';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserBooks(userId, token);
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchBooks();
  }, [userId, token]);

  if (!userId || !token) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="dashboard-container" style={{padding: '32px 0'}}>
      <h2 style={{fontWeight: 700, fontSize: 28, marginBottom: 32, letterSpacing: 1}}>MY LIBRARY</h2>
      {loading && <p>Chargement...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="book-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 40,
        justifyItems: 'center',
        alignItems: 'start',
        marginTop: 16
      }}>
        {books.length === 0 && !loading ? (
          <p>Aucun livre dans votre collection.</p>
        ) : (
          books.map(book => (
            <div key={book._id} className="book-card" style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 170,
              minHeight: 260
            }}>
              <img src={`http://localhost:5000${book.image_url}`} alt={book.titre} style={{
                width: 150,
                height: 210,
                objectFit: 'cover',
                borderRadius: 16,
                boxShadow: '0 8px 32px #0002',
                marginBottom: 18,
                background: '#eee',
                transition: 'transform 0.2s',
              }} />
              <h4 style={{fontWeight: 700, fontSize: 18, margin: 0, marginBottom: 6, textAlign: 'center', color: '#223'}}>{book.titre}</h4>
              <p style={{fontWeight: 400, fontSize: 15, color: '#3a4656', margin: 0, textAlign: 'center'}}>{book.auteur}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 