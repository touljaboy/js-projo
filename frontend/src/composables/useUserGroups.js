import { ref, onMounted, computed } from 'vue'
import { authFetch } from '@/utils/authFetch'

const API_URL = 'http://localhost:3000/v1/usergroups'

export function useUserGroups() {
  const userGroups = ref([])
  const search = ref('')
  const formUserId = ref('')
  const formGroupId = ref('')
  const editingId = ref(null)

  const filteredUserGroups = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return userGroups.value

    return userGroups.value.filter((rel) => {
      const u = String(rel.user_id ?? '').toLowerCase()
      const g = String(rel.group_id ?? '').toLowerCase()
      return u.includes(q) || g.includes(q)
    })
  })

  const loadUserGroups = async () => {
    try {
      const res = await authFetch(API_URL)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd pobierania')
      userGroups.value = data
    } catch (err) {
      alert(err.message)
    }
  }

  const createRel = async (payload) => {
    try {
      const res = await authFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd dodawania')
      await loadUserGroups()
      resetForm()
    } catch (err) {
      alert(err.message)
    }
  }

  const updateRel = async (payload) => {
    if (!editingId.value) return

    try {
      const res = await authFetch(`${API_URL}/${editingId.value}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd aktualizacji')
      await loadUserGroups()
      resetForm()
    } catch (err) {
      alert(err.message)
    }
  }

  const deleteRel = async (id) => {
    if (!confirm('Usunąć?')) return

    try {
      const res = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd usuwania')
      await loadUserGroups()
      if (editingId.value === id) resetForm()
    } catch (err) {
      alert(err.message)
    }
  }

  const startEdit = (rel) => {
    editingId.value = rel.id
    formUserId.value = rel.user_id
    formGroupId.value = rel.group_id
  }

  const resetForm = () => {
    editingId.value = null
    formUserId.value = ''
    formGroupId.value = ''
  }

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString()
    } catch {
      return d
    }
  }

  onMounted(loadUserGroups)

  return {
    userGroups,
    search,
    filteredUserGroups,
    formUserId,
    formGroupId,
    editingId,
    loadUserGroups,
    createRel,
    updateRel,
    deleteRel,
    startEdit,
    resetForm,
    formatDate,
  }
}
