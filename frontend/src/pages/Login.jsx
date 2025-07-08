import React, { useState } from 'react';
import { login } from '../api/auth';
import './Login.css';

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
    if (
      jsonResult.data[0]?.images?.jpg !== undefined &&
      jsonResult.data[0]?.images?.jpg?.large_image_url !== undefined
    ) {
      const largeImage = jsonResult.data[0].images.jpg.large_image_url;
      console.log(jsonResult.data[0].images.jpg.image_url, 'ici manga image');
      console.log(largeImage, 'ici manga image large');
    } else {
      console.log(jsonResult.data[0].images, 'cpicpui');
      console.log('Image not found');
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookBuddy</span>
        </div>
        <div className="login-image-mask">
          <img
            src="/img/power.jpg"
            alt="Power Chainsaw Man"
            className="login-illustration"
          />
          <img
            src="/img/Bulles.png"
            alt="Bulle overlay"
            className="bubble-overlay"
          />
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h2 className="login-title">Log in</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          {error && <p className="login-error">{error}</p>}
          <div className="login-links">
            <a href="#" className="login-link">Forgot password?</a>
          </div>
          <div className="login-register">
            Need an account? <a href="/register">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
