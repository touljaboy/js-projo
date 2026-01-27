// Utility do wykonywania zapytań HTTP z automatycznym dodawaniem tokena autoryzacji
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
