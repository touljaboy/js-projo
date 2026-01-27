// Composable do zarządzania autoryzacją użytkownika
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:3000/v1'

// Funkcja pomocnicza do inicjalizacji użytkownika z localStorage
const initUserFromStorage = () => {
  const user = localStorage.getItem('currentUser')
  try {
    return user ? JSON.parse(user) : null
  } catch (e) {
    console.error('Błąd parsowania currentUser z localStorage:', e)
    return null
  }
}

// Stan globalny (współdzielony między wszystkimi komponentami)
const authToken = ref(localStorage.getItem('authToken') || null)
const currentUser = ref(initUserFromStorage())

export function useAuth() {
  const router = useRouter()

  // Sprawdź czy użytkownik jest zalogowany
  const isAuthenticated = () => {
    return !!authToken.value
  }

  // Sprawdź czy użytkownik ma rolę admina
  const isAdmin = () => {
    return currentUser.value?.role === 'admin'
  }

  // Załaduj dane użytkownika z localStorage przy starcie
  const initAuth = () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    
    if (token && user) {
      authToken.value = token
      currentUser.value = JSON.parse(user)
    }
  }

  // Rejestracja
  const register = async (username, password, email, pesel) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, pesel }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Błąd rejestracji')
      }

      const user = await response.json()
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logowanie
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Błąd logowania')
      }

      const data = await response.json()
      
      // Zapisz token i dane użytkownika (z rolą)
      authToken.value = data.token
      currentUser.value = data.user
      
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Wylogowanie
  const logout = async () => {
    try {
      if (authToken.value) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken.value}`,
          },
        })
      }
    } catch (error) {
      console.error('Błąd wylogowania:', error)
    } finally {
      // Wyczyść dane lokalne
      authToken.value = null
      currentUser.value = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      router.push('/login')
    }
  }

  // Inicjalizuj auth przy starcie
  if (!currentUser.value && authToken.value) {
    initAuth()
  }

  return {
    currentUser,
    authToken,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    initAuth
  }
}
