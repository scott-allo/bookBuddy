import React, { useEffect, useState, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../api/user';

const genders = ['Male', 'Female', 'Other'];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Other');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserProfile(userId, token);
        setUser(data);
        setNom(data.nom);
        setEmail(data.email);
        setDateOfBirth(data.date_of_birth ? data.date_of_birth.substring(0, 10) : '');
        setGender(data.gender || 'Other');
        setAvatarUrl(data.avatar_url ? `http://localhost:5000${data.avatar_url}` : 'https://api.dicebear.com/7.x/bottts/svg?seed=BookBuddy');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchProfile();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await updateUserProfile(userId, {
        nom,
        email,
        password,
        date_of_birth: dateOfBirth,
        gender,
        avatar_url: avatarUrl
      }, token);
      setSuccess(true);
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadAvatar(userId, file, token);
      setAvatarUrl(`http://localhost:5000${res.avatar_url}`);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  if (!userId || !token) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="profile-container" style={{display: 'flex', gap: 40, alignItems: 'flex-start', padding: 40}}>
      <form onSubmit={handleSubmit} style={{flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20}}>
        <h2>Profil utilisateur</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nouveau mot de passe" />
        <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom complet" required />
        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} placeholder="Date de naissance" />
        <select value={gender} onChange={e => setGender(e.target.value)}>
          {genders.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button type="submit">Confirmer</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {success && <p style={{color: 'green'}}>Profil mis à jour !</p>}
      </form>
      <div style={{flex: 1, maxWidth: 300, textAlign: 'center'}}>
        <img src={avatarUrl} alt="avatar" style={{width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 10}} />
        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
          ref={fileInputRef}
        />
        <button
          type="button"
          style={{
            marginBottom: 10,
            cursor: 'pointer',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 32px',
            fontWeight: 600,
            fontSize: 18,
            boxShadow: '0 2px 8px #0001'
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Changer la photo
        </button>
        {uploading && <p>Envoi en cours...</p>}
        <button onClick={handleLogout} style={{marginTop: 10, background: '#fafafa', border: 'none', borderRadius: 10, padding: '10px 30px'}}>log out</button>
      </div>
    </div>
  );
};

export default Profile; 