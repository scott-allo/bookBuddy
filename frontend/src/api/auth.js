const API_URL = 'http://localhost:5000/api/auth';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la connexion');
  }
  return response.json();
}

export async function register(nom, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'inscription');
  }
  return response.json();
} 