const API_URL = 'http://localhost:5000/api/books';

export async function getUserBooks(userId, token) {
  const response = await fetch(`${API_URL}?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des livres');
  }
  return response.json();
}

export async function addBook(book, userId, token) {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ...book, userId })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'ajout du livre');
  }
  return response.json();
} 