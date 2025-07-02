import React, { useEffect, useState } from 'react';
import { getUserBooks, deleteBook } from '../api/books';
import BookForm from './BookForm';
import BookModal from '../components/BookModal';

const Dashboard = ({ books, favorites, onToggleFavorite }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localBooks, setBooks] = useState(books);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setBooks(books);
  }, [books]);

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  // Fonction de suppression
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId, localStorage.getItem('userId'), localStorage.getItem('token'));
      setModalOpen(false);
      setToast('Book deleted successfully');
      // Recharge la bibliothèque
      const data = await getUserBooks(localStorage.getItem('userId'), localStorage.getItem('token'));
      setBooks(data);
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      alert(err.message || 'Error deleting book');
    }
  };

  // Utilitaire pour obtenir la bonne URL d'image
  const getBookImageUrl = (book) => {
    if (!book.image_url) return '';
    if (book.image_url.startsWith('/uploads/')) {
      return `http://localhost:5000${book.image_url}`;
    }
    return book.image_url;
  };

  return (
    <div className="dashboard-container" style={{padding: '32px 0'}}>
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
      <h2 style={{fontWeight: 700, fontSize: 28, marginBottom: 32, letterSpacing: 1}}>MY LIBRARY</h2>
      <div className="book-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 40,
        justifyItems: 'center',
        alignItems: 'start',
        marginTop: 16
      }}>
        {localBooks.length === 0 ? (
          <p>No books in your collection.</p>
        ) : (
          localBooks.map(book => (
            <div key={book._id} className="book-card" style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 170,
              minHeight: 260,
              cursor: 'pointer'
            }}
            onClick={() => handleOpenModal(book)}
            >
              {getBookImageUrl(book) && (
                <img src={getBookImageUrl(book)} alt={book.titre} style={{
                  width: 150,
                  height: 210,
                  objectFit: 'cover',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px #0002',
                  marginBottom: 18,
                  background: '#eee',
                  transition: 'transform 0.2s',
                }} />
              )}
              <h4 style={{fontWeight: 700, fontSize: 18, margin: 0, marginBottom: 6, textAlign: 'center', color: '#223'}}>{book.titre}</h4>
              <p style={{fontWeight: 400, fontSize: 15, color: '#3a4656', margin: 0, textAlign: 'center'}}>{book.auteur}</p>
            </div>
          ))
        )}
      </div>
      <BookModal
        book={selectedBook}
        open={modalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedBook && favorites.includes(selectedBook._id)}
        onToggleFavorite={() => selectedBook && onToggleFavorite(selectedBook._id)}
        onDelete={() => selectedBook && handleDeleteBook(selectedBook._id)}
      />
    </div>
  );
};

export default Dashboard; 