import { ref, onMounted, computed } from 'vue'

const API_URL = 'http://localhost:3000/v1/groups'

export function useGroups() {
  const groups = ref([])
  const search = ref('')

  const getImageUrl = (name) => {
    return `https://picsum.photos/seed/${name}/200/150`
  }

  const fetchGroups = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()

      groups.value = data.map((group) => ({
        ...group,
        isPublic: group.is_public,
        image: getImageUrl(group.name),
      }))
    } catch (error) {
      console.error('Błąd pobierania grup:', error)
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          is_public: payload.isPublic,
        }),
      })

      if (response.ok) {
        const savedGroup = await response.json()

        groups.value.push({
          ...savedGroup,
          isPublic: savedGroup.is_public,
          image: getImageUrl(savedGroup.name),
        })
      } else {
        const err = await response.json()
        console.error('Błąd backendu:', err)
      }
    } catch (error) {
      console.error('Błąd dodawania grupy:', error)
    }
  }

  const removeGroup = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        groups.value = groups.value.filter((group) => group.id !== id)
      }
    } catch (error) {
      console.error('Błąd usuwania grupy:', error)
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
