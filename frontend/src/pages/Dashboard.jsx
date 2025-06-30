import React, { useEffect, useState } from 'react';
import { getUserBooks } from '../api/books';
import BookForm from './BookForm';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // À adapter : récupérer l'userId et le token depuis le stockage/localStorage
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

  const handleBookAdded = () => {
    fetchBooks();
    setShowForm(false);
  };

  if (!userId || !token) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Ma bibliothèque</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Fermer le formulaire' : 'Ajouter un livre'}
      </button>
      {showForm && <BookForm onBookAdded={handleBookAdded} />}
      {loading && <p>Chargement...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="book-list">
        {books.length === 0 && !loading ? (
          <p>Aucun livre dans votre collection.</p>
        ) : (
          books.map(book => (
            <div key={book._id} className="book-card">
              <img src={book.image_url} alt={book.titre} style={{width: '100px'}} />
              <h4>{book.titre}</h4>
              <p>{book.auteur}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 