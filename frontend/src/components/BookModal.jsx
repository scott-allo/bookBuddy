import React from 'react';

// Utilitaire pour obtenir la bonne URL d'image
const getBookImageUrl = (book) => {
  if (!book?.image_url) return '';
  if (book.image_url.startsWith('/uploads/')) {
    return `http://localhost:5000${book.image_url}`;
  }
  return book.image_url;
};

const BookModal = ({ book, open, onClose, isFavorite, onToggleFavorite, onDelete }) => {
  if (!open || !book) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(30,34,45,0.18)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 40px #0002',
        display: 'flex',
        flexDirection: 'row',
        minWidth: 700,
        maxWidth: 900,
        width: '90%',
        padding: 36,
        gap: 36,
        position: 'relative',
        alignItems: 'flex-start'
      }}>
        {/* Bouton fermer */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 18, right: 24,
          background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#888'
        }}>&times;</button>
        {/* Image */}
        {getBookImageUrl(book) && (
          <img src={getBookImageUrl(book)} alt={book.titre} style={{
            width: 200, height: 290, objectFit: 'cover', borderRadius: 18, boxShadow: '0 4px 24px #0002', background: '#eee', flexShrink: 0
          }} />
        )}
        {/* Infos */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
          <h2 style={{fontWeight: 700, fontSize: 28, margin: 0, marginBottom: 10}}>{book.titre}</h2>
          {/* Badge de statut de lecture */}
          {book.status && (
            <span style={{
              display: 'inline-block',
              marginBottom: 12,
              padding: '4px 16px',
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 15,
              color: '#fff',
              background:
                book.status === 'finished' ? '#43b66e'
                : book.status === 'reading' ? '#f7b731'
                : '#5396e8',
              letterSpacing: 1,
              boxShadow: '0 1px 6px #0001',
              marginRight: 8
            }}>
              {book.status === 'finished' ? 'Finished'
                : book.status === 'reading' ? 'Reading'
                : 'To read'}
            </span>
          )}
          <div style={{display: 'flex', gap: 32, marginBottom: 10, justifyContent: 'flex-start'}}>
            <div><b style={{fontWeight: 600}}>Author</b><br/>{book.auteur}</div>
            <div><b style={{fontWeight: 600}}>Genre</b><br/>{book.categorie || '-'}</div>
            <div><b style={{fontWeight: 600}}>Pages</b><br/>{book.nb_pages || '-'}</div>
          </div>
          {/* Description */}
          <div style={{marginTop: 10, color: '#444', fontSize: 16, lineHeight: 1.5}}>
            {book.description ? book.description : <i>Aucune description disponible.</i>}
          </div>
        </div>
        {/* Boutons en bas à gauche */}
        <div style={{ position: 'absolute', left: 32, bottom: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Bouton favori (SVG) */}
          <button
            onClick={onToggleFavorite}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 28,
              cursor: 'pointer',
              color: isFavorite ? '#e74c3c' : '#bbb',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              outline: 'none',
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onMouseOver={e => e.currentTarget.style.color = '#e74c3c'}
            onMouseOut={e => e.currentTarget.style.color = isFavorite ? '#e74c3c' : '#bbb'}
            tabIndex={0}
          >
            {isFavorite ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z"/>
              </svg>
            )}
          </button>
          {/* Bouton supprimer */}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 22px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0001',
                transition: 'background 0.2s',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal; 