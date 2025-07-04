import React, { useState, useEffect, useRef } from 'react';
import { addBook } from '../api/books';
import ManualBookForm from './ManualBookForm';
import toast from 'react-hot-toast';

const BookForm = ({ onBookAdded }) => {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [nb_pages, setNbPages] = useState('');
  const [nb_tomes, setNbTomes] = useState('');
  const [tomes_lus, setTomesLus] = useState(0);
  const [categorie, setCategorie] = useState('');
  const [status, setStatus] = useState('to read');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSynopsis, setSelectedSynopsis] = useState('');
  const [selectedManga, setSelectedManga] = useState(null);
  const searchRef = useRef(null);

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

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(search)}&limit=5`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (manga) => {
    setSelectedManga(manga);
    setTitre(manga.title || '');
    setAuteur(manga.authors && manga.authors[0] ? manga.authors[0].name : '');
    setCategorie(manga.genres && manga.genres[0] ? manga.genres[0].name : '');
    setImageUrl(manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '');
    setCoverPreview(manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '');
    setSelectedSynopsis(manga.synopsis || '');
    setNbPages(manga.pages || '');
    setNbTomes(manga.volumes || '');
    setTomesLus(0);
    setResults([]);
    setSearch(manga.title || '');
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.blur();
    }
  };

  const isFormDisabled = !selectedManga;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('auteur', auteur);
      formData.append('nb_pages', nb_pages);
      formData.append('nb_tomes', nb_tomes);
      formData.append('tomes_lus', tomes_lus);
      formData.append('categorie', categorie);
      formData.append('status', status);
      if (coverFile) {
        formData.append('cover', coverFile);
      } else if (image_url) {
        formData.append('image_url', image_url);
      }
      formData.append('userId', userId);
      formData.append('description', selectedSynopsis);
      const response = await addBook(formData, userId, token, true);
      console.log('Réponse backend:', response);
      if (response.badge) {
        toast.custom(
          <div style={{
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img
              src="/img/hxh.gif"
              alt="manga badge"
              style={{
                width: 400,
                height: 400,
                display: 'block',
                objectFit: 'cover',
                background: 'transparent',
                margin: 0,
                padding: 0,
                border: 'none',
                borderRadius: 0,
                boxShadow: 'none',
              }}
            />
            <div style={{
              color: '#e63946',
              fontWeight: 900,
              fontSize: 32,
              marginTop: 18,
              textAlign: 'center',
              textShadow: '0 2px 8px #fff8'
            }}>
              New badge unlocked!
            </div>
            <div style={{
              color: '#222',
              fontWeight: 700,
              fontSize: 26,
              marginTop: 8,
              textAlign: 'center'
            }}>
              {response.badge.label || response.badge.nom}
            </div>
          </div>,
          { duration: 1300 }
        );
      }
      setSuccess(true);
      setTitre(''); setAuteur(''); setImageUrl(''); setNbPages(''); setNbTomes(''); setTomesLus(0); setCategorie(''); setStatus('to read'); setCoverFile(null); setCoverPreview(''); setSelectedManga(null); setSelectedSynopsis(''); setSearch(''); setResults([]);
      if (searchRef.current) {
        const input = searchRef.current.querySelector('input');
        if (input) input.blur();
      }
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f4f0',
        padding: '48px 32px 32px 32px',
        width: '100%',
        gap: 32,
        flexWrap: 'wrap',
      }}
    >
      <div style={{flex: 1, minWidth: 320, maxWidth: 420, width: '100%'}}>
        <div ref={searchRef} style={{ width: '100%', marginBottom: 30, position: 'relative', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 18, border: '1px solid #e3e6ee' }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block', color: '#223' }}>Search a manga</label>
          <input
            type="text"
            placeholder="Type a manga title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #bfc8d6', fontSize: 15, marginBottom: 0 }}
          />
          {loading && <div style={{ color: '#5396e8', marginTop: 4 }}>Searching...</div>}
          {results.length > 0 && (
            <ul style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 2px 12px #0001',
              padding: 0,
              margin: 0,
              listStyle: 'none',
              maxHeight: 220,
              overflowY: 'auto',
              marginTop: 8,
              left: 0,
              right: 0,
              top: 'unset',
            }}>
              {results.map(manga => (
                <li key={manga.mal_id} onClick={() => handleSelect(manga)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                  <img src={manga.images?.jpg?.image_url} alt={manga.title} width={40} style={{ borderRadius: 6 }} />
                  <span style={{ fontWeight: 500 }}>{manga.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

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
            opacity: isFormDisabled ? 0.5 : 1,
            pointerEvents: isFormDisabled ? 'none' : 'auto',
            filter: isFormDisabled ? 'grayscale(0.2)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s'
          }}
        >
          <h2 style={{
            marginBottom: 30,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#223'
          }}>
            ADD A BOOK
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
            required
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(coverPreview || image_url) && <img src={coverPreview || image_url} alt="cover preview" style={{ width: 110, margin: '10px auto', display: 'block', borderRadius: 10, boxShadow: '0 2px 12px #0002', border: '2px solid #e3e6ee' }} />}
          </div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="to read">To read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
          <input
            type="number"
            placeholder="Number of volumes (tomes)"
            value={nb_tomes}
            readOnly
            style={{ background: '#f7f8fa', color: '#888' }}
          />
          <input
            type="number"
            placeholder="Volumes read (tomes lus)"
            value={tomes_lus}
            min={0}
            max={nb_tomes || undefined}
            onChange={e => setTomesLus(e.target.value)}
          />
          <input
            type="text"
            placeholder="Book category"
            value={categorie}
            onChange={e => setCategorie(e.target.value)}
          />
          {selectedSynopsis && (
            <textarea
              value={selectedSynopsis}
              readOnly
              style={{
                padding: 12,
                borderRadius: 10,
                border: '1.5px solid #bfc8d6',
                fontSize: 15,
                background: '#f7f8fa',
                color: '#223',
                minHeight: 80
              }}
            />
          )}
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
      </div>
      {/* Formulaire manuel */}
      <div style={{flex: 1, minWidth: 320, maxWidth: 420, width: '100%', marginTop: -40}}>
        <ManualBookForm onBookAdded={onBookAdded} />
      </div>
    </div>
  );
};

export default BookForm; 