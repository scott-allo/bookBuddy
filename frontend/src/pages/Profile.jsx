import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api/user';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserProfile(userId, token);
        setUser(data);
        setNom(data.nom);
        setEmail(data.email);
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
      await updateUserProfile(userId, { nom, email, password }, token);
      setSuccess(true);
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userId || !token) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profil utilisateur</h2>
      {loading && <p>Chargement...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {user && (
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nouveau mot de passe" />
            <button type="submit">Mettre à jour</button>
          </form>
          {success && <p style={{color: 'green'}}>Profil mis à jour !</p>}
          <div style={{marginTop: 30}}>
            <h3>Badges</h3>
            {user.badges && user.badges.length > 0 ? (
              <ul>
                {user.badges.map(badge => (
                  <li key={badge._id}>
                    <img src={badge.icone_url} alt={badge.nom} style={{width: 30, marginRight: 10}} />
                    {badge.nom} - {badge.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun badge pour le moment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile; 