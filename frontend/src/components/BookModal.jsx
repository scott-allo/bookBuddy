import React from 'react';

const BookModal = ({ book, open, onClose, isFavorite, onToggleFavorite }) => {
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
        <img src={`http://localhost:5000${book.image_url}`} alt={book.titre} style={{
          width: 200, height: 290, objectFit: 'cover', borderRadius: 18, boxShadow: '0 4px 24px #0002', background: '#eee', flexShrink: 0
        }} />
        {/* Infos */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
          <h2 style={{fontWeight: 700, fontSize: 28, margin: 0, marginBottom: 10}}>{book.titre}</h2>
          <div style={{display: 'flex', gap: 32, marginBottom: 10, justifyContent: 'flex-start'}}>
            <div><b style={{fontWeight: 600}}>Author</b><br/>{book.auteur}</div>
            <div><b style={{fontWeight: 600}}>Genre</b><br/>{book.categorie || '-'}</div>
            <div><b style={{fontWeight: 600}}>Release status</b><br/>{book.progression || 0}/{book.nb_pages || '-'} page</div>
          </div>
          {/* Description */}
          <div style={{marginTop: 10, color: '#444', fontSize: 16, lineHeight: 1.5}}>
            {book.description ? book.description : <i>Aucune description disponible.</i>}
          </div>
        </div>
        {/* Bouton favori en bas à droite */}
        <button onClick={onToggleFavorite} style={{
          position: 'absolute',
          right: 32,
          bottom: 32,
          background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', color: isFavorite ? '#e74c3c' : '#bbb', transition: 'color 0.2s', display: 'flex', alignItems: 'center', padding: 0
        }}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onMouseOver={e => e.currentTarget.style.color = '#e74c3c'}
          onMouseOut={e => e.currentTarget.style.color = isFavorite ? '#e74c3c' : '#bbb'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default BookModal; 