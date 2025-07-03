import React, { useState } from 'react';
import BookModal from '../components/BookModal';

const Favorites = ({ books, favorites, onToggleFavorite }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12; // 2 lignes de 6

  const favoriteBooks = books.filter(book => favorites.includes(book._id));
  const totalPages = Math.ceil(favoriteBooks.length / booksPerPage);
  const startIdx = (currentPage - 1) * booksPerPage;
  const endIdx = startIdx + booksPerPage;
  const booksToShow = favoriteBooks.slice(startIdx, endIdx);

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
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
    <div style={{
      padding: '48px 32px 32px 32px',
      minHeight: '100vh',
      background: '#f5f4f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      <h2 style={{fontWeight: 800, fontSize: 32, marginBottom: 24, letterSpacing: 1, color: '#222', textAlign: 'center', fontFamily: 'Inter, Arial, sans-serif'}}>FAVORITES</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 18,
        width: '100%',
        justifyItems: 'center',
        alignItems: 'start',
        background: 'rgba(255,255,255,0.0)',
        borderRadius: 18,
        padding: '0',
        height: 658, // 2*320 + 1*18 (gap)
        overflow: 'visible',
      }}>
        {favoriteBooks.length === 0 ? (
          <p style={{fontSize: 20, color: '#888', gridColumn: '1/-1'}}>No favorites yet.</p>
        ) : (
          booksToShow.map(book => (
            <div key={book._id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 220,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: 0,
            }}
            onClick={() => handleOpenModal(book)}
            >
              {getBookImageUrl(book) && (
                <img src={getBookImageUrl(book)} alt={book.titre} style={{
                  width: 220,
                  height: 320,
                  objectFit: 'cover',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px #0001',
                  marginBottom: 10,
                  background: '#eee',
                  transition: 'transform 0.2s',
                }} />
              )}
              <h4 style={{fontWeight: 700, fontSize: 16, margin: 0, marginBottom: 4, textAlign: 'center', color: '#222', letterSpacing: 0.2}}>{book.titre}</h4>
              <p style={{fontWeight: 400, fontSize: 13, color: '#666', margin: 0, textAlign: 'center', marginBottom: 0}}>{book.auteur}</p>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{padding: '8px 18px', borderRadius: 8, border: '1px solid #bbb', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>Précédent</button>
          <span style={{fontWeight: 600, fontSize: 18}}>Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{padding: '8px 18px', borderRadius: 8, border: '1px solid #bbb', background: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>Suivant</button>
        </div>
      )}
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