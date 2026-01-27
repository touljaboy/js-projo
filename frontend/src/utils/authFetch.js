// Utility do wykonywania zapytań HTTP z automatycznym dodawaniem tokena autoryzacji

/**
 * Wykonuje zapytanie fetch z automatycznym dodaniem tokena z localStorage
 * @param {string} url - URL endpointa
 * @param {object} options - Opcje fetch (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('authToken')
  
  const headers = {
    ...options.headers,
  }

  // Dodaj token jeśli istnieje
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Dodaj Content-Type dla JSON jeśli jest body
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
