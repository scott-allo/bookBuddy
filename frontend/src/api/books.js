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

export async function addBook(book, userId, token, isMultipart = false) {
  let options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: null
  };
  if (isMultipart) {
    options.body = book; // book est un FormData
    // NE PAS mettre Content-Type, le navigateur le gère
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({ ...book, userId });
  }
  const response = await fetch(`${API_URL}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'ajout du livre');
  }
  return response.json();
} 