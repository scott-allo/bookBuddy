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
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100vw',
      minHeight: '100vh',
      background: '#faf9f2',
      boxSizing: 'border-box',
    }}>
      {/* Formulaire à gauche */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginLeft: 80,
          marginTop: -40,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 20 }}>User profile</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ padding: 12, fontSize: 16 }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" autoComplete="new-password" style={{ padding: 12, fontSize: 16 }} />
        <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Full name" required style={{ padding: 12, fontSize: 16 }} />
        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} placeholder="Date of birth" style={{ padding: 12, fontSize: 16 }} />
        <select value={gender} onChange={e => setGender(e.target.value)} style={{ padding: 12, fontSize: 16 }}>
          {genders.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button type="submit" style={{
          marginTop: 16,
          fontSize: 18,
          padding: '14px 0',
          borderRadius: 10,
          background: '#7398ea',
          color: '#fff',
          border: 'none',
          fontWeight: 700
        }}>Confirm</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Profile updated!</p>}
      </form>

      {/* Colonne centrale (avatar + boutons) centrée */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
        gap: 20,
      }}>
        {avatarUrl && (
          <img src={avatarUrl} alt="avatar" style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 4px 24px #0001'
          }} />
        )}
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
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            cursor: 'pointer',
            background: '#7398ea',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '14px 32px',
            fontWeight: 600,
            fontSize: 18,
            boxShadow: '0 2px 8px #0001'
          }}
        >
          Change Photo
        </button>
        {uploading && <p>Uploading...</p>}
        <button onClick={handleLogout} style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 10,
          padding: '12px 32px',
          fontSize: 18,
          fontWeight: 600,
          color: '#333',
          boxShadow: '0 2px 8px #0001'
        }}>log out</button>
      </div>

      {/* ESPACEUR */}
      <div style={{ width: 0 }} />

      {/* Badges à droite */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: 490,
        paddingRight: 10,
        width: 400,
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 36,
          width: 360,
          justifyItems: 'center',
        }}>
          {[
            { key: 'lecture-1-livre', img: '/badges/badge1.jpg', label: 'First book' },
            { key: 'lecture-3-livres', img: '/badges/badge2.jpg', label: '3 books' },
            { key: 'lecture-5-livres', img: '/badges/badge3.jpg', label: '5 books' },
            { key: 'lecture-7-livres', img: '/badges/badge4.jpg', label: '7 books' },
            { key: 'lecture-10-livres', img: '/badges/badge5.jpg', label: '10 books' },
          ].map(badge => {
            const unlocked = user && user.badges && user.badges.some(b => b.nom && b.nom === badge.key);
            return (
              <div key={badge.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={badge.img}
                  alt={badge.label}
                  style={{
                    width: 180,
                    height: 230,
                    opacity: unlocked ? 1 : 0.2,
                    filter: unlocked ? 'none' : 'grayscale(1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=?'; }}
                />
                <span style={{ fontSize: 16, color: unlocked ? '#222' : '#aaa', marginTop: 8 }}>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile; 