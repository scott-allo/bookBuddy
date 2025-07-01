import React, { useState } from 'react';
import { login } from '../api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  const getNaruto = async () => {
    const result = await fetch('https://api.jikan.moe/v4/manga?q=berserk&limit=1');
    const jsonResult = await result.json();
    console.log(jsonResult.data, 'ici manga');
    console.log(jsonResult.data[0], 'ici manga');
    if (jsonResult.data[0]?.images?.jpg !== undefined && jsonResult.data[0]?.images?.jpg?.large_image_url !== undefined){
      const largeImage = jsonResult.data[0].images.jpg.large_image_url
      console.log(jsonResult.data[0].images.jpg.image_url, 'ici manga image');
      console.log(largeImage, 'ici manga image large');
    }
    else{
      
      console.log(data[0].images,'cpicpui')
      console.log('Image not found');
    }
  }

  return (
    <div className="login-container">
      <button onClick={getNaruto}>disneyxd</button>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <p>Pas encore de compte ? <a href="/register">Créer un compte</a></p>
    </div>
  );
};

export default Login; 