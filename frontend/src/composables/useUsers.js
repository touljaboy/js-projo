
import { ref } from 'vue'
import { useRemoteSearch } from '@/composables/useRemoteSearch'

const API_URL = 'http://localhost:3000/v1/users'

export function useUsers() {
  const fetchUsersApi = async (q, signal) => {
    const res = await fetch(API_URL, { signal })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Błąd pobierania użytkowników.')

    const query = q.trim().toLowerCase()
    if (!query) return data

    return data.filter((u) => (u.user ?? '').toLowerCase().includes(query))
  }

  const {
    query: search,
    results: users,
    isLoading,
    error,
    runSearch,
  } = useRemoteSearch(fetchUsersApi, {
    debounceMs: 300,
    immediate: true,
  })

  const addUser = async (payload) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd dodawania użytkownika.')
      await runSearch(search.value)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const removeUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd usuwania użytkownika.')
      await runSearch(search.value)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return {
    search,
    users,
    isLoading,
    error,
    runSearch,
    addUser,
    removeUser,
  }
}
