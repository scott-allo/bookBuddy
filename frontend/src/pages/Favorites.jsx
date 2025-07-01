import React, { useState } from 'react';
import BookModal from '../components/BookModal';

const Favorites = ({ books, favorites, onToggleFavorite }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const favoriteBooks = books.filter(book => favorites.includes(book._id));

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="favorites-container" style={{padding: '32px 0'}}>
      <h2 style={{fontWeight: 700, fontSize: 28, marginBottom: 32, letterSpacing: 1}}>FAVORIS</h2>
      <div className="book-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 40,
        justifyItems: 'center',
        alignItems: 'start',
        marginTop: 16
      }}>
        {favoriteBooks.length === 0 ? (
          <p>Aucun favori pour le moment.</p>
        ) : (
          favoriteBooks.map(book => (
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
      <BookModal
        book={selectedBook}
        open={modalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedBook && favorites.includes(selectedBook._id)}
        onToggleFavorite={() => selectedBook && onToggleFavorite(selectedBook._id)}
      />
    </div>
  );
};

export default Favorites; 