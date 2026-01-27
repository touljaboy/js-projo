import { ref, onMounted, computed } from 'vue'
import { authFetch } from '@/utils/authFetch'

const API_URL = 'http://localhost:3000/v1/groups'

export function useGroups() {
  const groups = ref([])
  const search = ref('')

  const getImageUrl = (name) => {
    return `https://picsum.photos/seed/${name}/200/150`
  }

  const fetchGroups = async () => {
    try {
      const response = await authFetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd pobierania grup')
      }

      groups.value = data.map((group) => ({
        ...group,
        isPublic: group.is_public,
        image: getImageUrl(group.name),
      }))
    } catch (error) {
      console.error('Błąd pobierania grup:', error)
      alert(error.message)
    }
  }

  const filteredGroups = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return groups.value

    return groups.value.filter((g) => {
      const name = String(g.name ?? '').toLowerCase()
      const id = String(g.id ?? '').toLowerCase()
      return name.includes(q) || id.includes(q)
    })
  })

  const addGroup = async (payload) => {
    try {
      const response = await authFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name,
          is_public: payload.isPublic,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        groups.value.push({
          ...data,
          isPublic: data.is_public,
          image: getImageUrl(data.name),
        })
      } else {
        throw new Error(data.error || 'Błąd dodawania grupy')
      }
    } catch (error) {
      console.error('Błąd dodawania grupy:', error)
      alert(error.message)
    }
  }

  const removeGroup = async (id) => {
    try {
      const response = await authFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        groups.value = groups.value.filter((group) => group.id !== id)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Błąd usuwania grupy')
      }
    } catch (error) {
      console.error('Błąd usuwania grupy:', error)
      alert(error.message)
    }
  }

  onMounted(fetchGroups)

  return {
    groups,
    search,
    filteredGroups,
    fetchGroups,
    addGroup,
    removeGroup,
  }
}
