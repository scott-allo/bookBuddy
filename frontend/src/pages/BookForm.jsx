import React, { useState } from 'react';
import { addBook } from '../api/books';

const BookForm = ({ onBookAdded }) => {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [nb_pages, setNbPages] = useState('');
  const [categorie, setCategorie] = useState('');
  const [status, setStatus] = useState('à lire');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('auteur', auteur);
      formData.append('nb_pages', nb_pages);
      formData.append('categorie', categorie);
      formData.append('status', status);
      if (coverFile) {
        formData.append('cover', coverFile);
      } else if (image_url) {
        formData.append('image_url', image_url);
      }
      formData.append('userId', userId);
      await addBook(formData, userId, token, true);
      setSuccess(true);
      setTitre(''); setAuteur(''); setImageUrl(''); setNbPages(''); setCategorie(''); setStatus('à lire'); setCoverFile(null); setCoverPreview('');
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="book-form-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        background: '#f7f8fa'
      }}
    >
      <h2 style={{
        marginBottom: 30,
        fontWeight: 700,
        letterSpacing: 1,
        color: '#223'
      }}>
        AJOUTER UN LIVRE
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          width: 420,
          background: '#fff',
          padding: 36,
          borderRadius: 22,
          boxShadow: '0 4px 32px #0002',
          border: '1px solid #e3e6ee'
        }}
      >
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={e => setTitre(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            transition: 'border 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #5396e8'}
          onBlur={e => e.target.style.border = '1.5px solid #bfc8d6'}
        />
        <input
          type="text"
          placeholder="Auteur"
          value={auteur}
          onChange={e => setAuteur(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            transition: 'border 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #5396e8'}
          onBlur={e => e.target.style.border = '1.5px solid #bfc8d6'}
        />
        <input
          type="text"
          placeholder="Image de couverture (URL)"
          value={image_url}
          onChange={e => setImageUrl(e.target.value)}
          disabled={!!coverFile}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            transition: 'border 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #5396e8'}
          onBlur={e => e.target.style.border = '1.5px solid #bfc8d6'}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('cover-upload').click()}
            style={{
              background: '#5396e8',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 8px #0001',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#3973b8'}
            onMouseOut={e => e.target.style.background = '#5396e8'}
          >
            <span role="img" aria-label="image">🖼️</span> Choisir une image
          </button>
          {coverPreview && <img src={coverPreview} alt="aperçu couverture" style={{ width: 110, margin: '10px auto', display: 'block', borderRadius: 10, boxShadow: '0 2px 12px #0002', border: '2px solid #e3e6ee' }} />}
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            background: '#f7f8fa',
            color: '#223',
            outline: 'none'
          }}
        >
          <option value="à lire">À lire</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
        <input
          type="number"
          placeholder="Nombre de pages"
          value={nb_pages}
          onChange={e => setNbPages(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            transition: 'border 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #5396e8'}
          onBlur={e => e.target.style.border = '1.5px solid #bfc8d6'}
        />
        <input
          type="text"
          placeholder="Catégorie du livre"
          value={categorie}
          onChange={e => setCategorie(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1.5px solid #bfc8d6',
            fontSize: 16,
            transition: 'border 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #5396e8'}
          onBlur={e => e.target.style.border = '1.5px solid #bfc8d6'}
        />
        <button
          type="submit"
          style={{
            background: '#5396e8',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '16px 0',
            fontWeight: 700,
            fontSize: 20,
            marginTop: 10,
            width: '100%',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
            letterSpacing: 1,
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.target.style.background = '#3973b8'}
          onMouseOut={e => e.target.style.background = '#5396e8'}
        >
          Ajouter un livre
        </button>
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        {success && <p style={{ color: 'green', margin: 0 }}>Livre ajouté avec succès !</p>}
      </form>
    </div>
  );
};

export default BookForm; 