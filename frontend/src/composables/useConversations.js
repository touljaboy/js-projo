import { ref, onMounted, computed } from 'vue'

const API_URL = 'http://localhost:3000/v1/convs'


export function useConversations() {
  const conversations = ref([])
  const search = ref('')

    const loadConversations = async () => {
    try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Nie udało się pobrać rozmów.')
        conversations.value = await res.json()
    } catch (err) {
        console.error(err)
        alert(err.message)
    }
    }

    const filteredConversations = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return conversations.value

    return conversations.value.filter((c) => {
        const id = String(c.id ?? '').toLowerCase()
        const a = String(c.user_a_id ?? '').toLowerCase()
        const b = String(c.user_b_id ?? '').toLowerCase()

        return id.includes(q) || a.includes(q) || b.includes(q)
    })
    })

    const addConversation = async (payload) => {
    try {
        const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Błąd tworzenia rozmowy.')

        conversations.value.push(data)
    } catch (err) {
        console.error(err)
        alert(err.message)
    }
    }

    const removeConversation = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd usuwania.')
        }

        conversations.value = conversations.value.filter((c) => c.id !== id)
    } catch (err) {
        console.error(err)
        alert(err.message)
    }
    }

    onMounted(loadConversations)

    return {
        conversations,
        search,
        filteredConversations,
        loadConversations,
        addConversation,
        removeConversation,
    }
}