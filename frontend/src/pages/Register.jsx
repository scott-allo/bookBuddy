import React, { useState } from 'react';

const Register = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // TODO: Appel à l'API pour s'inscrire
    alert('Inscription non implémentée');
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={e => setNom(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
    </div>
  );
};

export default Register; 