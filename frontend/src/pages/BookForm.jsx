import React, { useState } from 'react';
import { addBook } from '../api/books';

const BookForm = ({ onBookAdded }) => {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [nb_pages, setNbPages] = useState('');
  const [categorie, setCategorie] = useState('');
  const [progression, setProgression] = useState(0);
  const [status, setStatus] = useState('à lire');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await addBook({ titre, auteur, image_url, nb_pages, categorie, progression, status }, userId, token);
      setSuccess(true);
      setTitre(''); setAuteur(''); setImageUrl(''); setNbPages(''); setCategorie(''); setProgression(0); setStatus('à lire');
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="book-form-container">
      <h2>Ajouter un manga</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Titre" value={titre} onChange={e => setTitre(e.target.value)} required />
        <input type="text" placeholder="Auteur" value={auteur} onChange={e => setAuteur(e.target.value)} required />
        <input type="text" placeholder="Image de couverture (URL)" value={image_url} onChange={e => setImageUrl(e.target.value)} />
        <input type="number" placeholder="Nombre de pages" value={nb_pages} onChange={e => setNbPages(e.target.value)} required />
        <input type="text" placeholder="Catégorie" value={categorie} onChange={e => setCategorie(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="à lire">À lire</option>
          <option value="en cours">En cours de lecture</option>
          <option value="terminé">Terminé</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>Livre ajouté avec succès !</p>}
    </div>
  );
};

export default BookForm; 