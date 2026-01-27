import { ref, onMounted, computed } from 'vue'
import { authFetch } from '@/utils/authFetch'

const API_URL = 'http://localhost:3000/v1/messages'

export function useMessages() {
  const messages = ref([])
  const search = ref('')
  const loading = ref(false)
  const currentPage = ref(0)
  const hasMore = ref(true)

  const loadMessages = async (options = {}) => {
    const { 
      limit = 50, 
      offset = 0, 
      conversation_id, 
      receiver_group_id 
    } = options

    try {
      loading.value = true
      const params = new URLSearchParams({ 
        limit, 
        offset: offset || currentPage.value * limit 
      })
      
      if (conversation_id) params.append('conversation_id', conversation_id)
      if (receiver_group_id) params.append('receiver_group_id', receiver_group_id)

      const res = await authFetch(`${API_URL}?${params}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Nie udało się pobrać wiadomości.')
      }
      
      const data = await res.json()
      
      // Obsługa nowego formatu z paginacją
      if (data.messages) {
        messages.value = offset === 0 ? data.messages : [...messages.value, ...data.messages]
        hasMore.value = data.pagination?.hasMore || false
      } else {
        messages.value = data
      }
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async (options = {}) => {
    if (!hasMore.value || loading.value) return
    currentPage.value++
    await loadMessages(options)
  }

  const filteredMessages = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return messages.value

    return messages.value.filter((m) => {
      const sender = String(m.sender_id ?? '').toLowerCase()
      const conv = String(m.conversation_id ?? '').toLowerCase()
      const content = String(m.message_content ?? '').toLowerCase()

      return sender.includes(q) || conv.includes(q) || content.includes(q)
    })
  })

  const sendMessage = async (payload) => {
    try {
      const res = await authFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd wysyłania wiadomości.')

      messages.value.push(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const removeMessage = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd usuwania.')
      }
      messages.value = messages.value.filter((m) => m.message_id !== id)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  onMounted(loadMessages)

  return {
    messages,
    search,
    loading,
    hasMore,
    filteredMessages,
    loadMessages,
    loadMore,
    sendMessage,
    removeMessage,
  }
}
