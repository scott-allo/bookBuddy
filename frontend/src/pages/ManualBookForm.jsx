import React, { useState } from 'react';
import { addBook } from '../api/books';

const ManualBookForm = ({ onBookAdded }) => {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [nb_tomes, setNbTomes] = useState('');
  const [tomes_lus, setTomesLus] = useState(0);
  const [categorie, setCategorie] = useState('');
  const [status, setStatus] = useState('to read');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [nb_pages] = useState(''); // champ fictif pour le backend

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!titre) return;
    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('auteur', auteur);
      formData.append('nb_tomes', nb_tomes);
      formData.append('tomes_lus', tomes_lus);
      formData.append('categorie', categorie);
      formData.append('status', status);
      formData.append('description', description);
      formData.append('nb_pages', nb_pages); // pour satisfaire le backend
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      formData.append('userId', userId);
      await addBook(formData, userId, token, true);
      setSuccess(true);
      setTitre(''); setAuteur(''); setNbTomes(''); setTomesLus(0); setCategorie(''); setStatus('to read'); setDescription(''); setCoverFile(null); setCoverPreview('');
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
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
        border: '1px solid #e3e6ee',
        marginTop: 60,
      }}
    >
      <h2 style={{
        marginBottom: 30,
        fontWeight: 700,
        letterSpacing: 1,
        color: '#223'
      }}>
        ADD A BOOK (manual)
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={titre}
        onChange={e => setTitre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={auteur}
        onChange={e => setAuteur(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of volumes (tomes)"
        value={nb_tomes}
        onChange={e => setNbTomes(e.target.value)}
        min={1}
      />
      <input
        type="number"
        placeholder="Volumes read (tomes lus)"
        value={tomes_lus}
        onChange={e => setTomesLus(e.target.value)}
        min={0}
        max={nb_tomes || undefined}
      />
      <input
        type="text"
        placeholder="Book category"
        value={categorie}
        onChange={e => setCategorie(e.target.value)}
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="to read">To read</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{
          padding: 12,
          borderRadius: 10,
          border: '1.5px solid #bfc8d6',
          fontSize: 15,
          background: '#f7f8fa',
          color: '#223',
          minHeight: 80,
          width: '100%',
          outline: 'none',
        }}
      />
      <input type="file" accept="image/*" onChange={handleCoverChange} style={{marginBottom: 0}} />
      {coverPreview && <img src={coverPreview} alt="cover preview" style={{ width: 110, margin: '10px auto', display: 'block', borderRadius: 10, boxShadow: '0 2px 12px #0002', border: '2px solid #e3e6ee' }} />}
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
        Add book
      </button>
      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      {success && <p style={{ color: 'green', margin: 0 }}>Book added successfully!</p>}
    </form>
  );
};

export default ManualBookForm; 