const API_URL = 'http://localhost:5000/api/users';

export async function getUserProfile(userId, token) {
  const response = await fetch(`${API_URL}/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération du profil');
  }
  return response.json();
}

export async function updateUserProfile(userId, data, token) {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
  }
  return response.json();
} 