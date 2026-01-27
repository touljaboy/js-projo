// Composable do zarządzania kanałami grup i wiadomościami
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { authFetch } from '@/utils/authFetch'
import { useAuth } from '@/composables/useAuth'

const API_URL = 'http://localhost:3000/v1'

export function useChannels() {
  const { currentUser } = useAuth()
  
  const searchGroups = ref('')
  const searchUsers = ref('')
  const groups = ref([])
  const users = ref([])
  const selectedGroup = ref(null)
  const messages = ref([])
  const newMessage = ref('')
  const hasMoreMessages = ref(false)
  const oldestMessageId = ref(null)
  const newestMessageId = ref(null)
  
  let messagesInterval = null
  let groupsRefreshInterval = null

  // Pobierz grupy
  const fetchGroups = async () => {
    try {
      const response = await authFetch(`${API_URL}/groups`)
      if (response.ok) {
        groups.value = await response.json()
      } else {
        const error = await response.json()
        console.error('Błąd pobierania grup:', error)
      }
    } catch (error) {
      console.error('Błąd pobierania grup:', error)
    }
  }

  // Pobierz użytkowników
  const fetchUsers = async () => {
    try {
      const response = await authFetch(`${API_URL}/users`)
      if (response.ok) {
        users.value = await response.json()
      } else {
        console.error('Błąd odpowiedzi przy pobieraniu użytkowników')
      }
    } catch (error) {
      console.error('Błąd pobierania użytkowników:', error)
    }
  }

  // Pobierz wiadomości grupy
  const fetchGroupMessages = async (groupId, loadMore = false, onlyNew = false) => {
    console.log('fetchGroupMessages wywołana:', { groupId, loadMore, onlyNew })
    try {
      const params = new URLSearchParams({
        receiver_group_id: groupId,
        limit: 50
      })
      
      // Jeśli ładujemy starsze wiadomości, użyj before_id
      if (loadMore && oldestMessageId.value) {
        params.append('before_id', oldestMessageId.value)
      }
      
      // Jeśli sprawdzamy tylko nowe wiadomości (auto-refresh)
      if (onlyNew && newestMessageId.value) {
        params.set('limit', 100) // Zwiększ limit dla nowych
      }
      
      console.log('Zapytanie API:', `${API_URL}/messages?${params}`)
      
      const response = await authFetch(`${API_URL}/messages?${params}`)
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Otrzymane dane:', data)
        const newMessages = data.messages || data
        
        if (onlyNew) {
          // Auto-refresh - dodaj tylko wiadomości nowsze niż mamy
          const freshMessages = newMessages.filter(msg => 
            msg.message_id > (newestMessageId.value || 0)
          )
          if (freshMessages.length > 0) {
            messages.value = [...messages.value, ...freshMessages]
            console.log(`Auto-refresh: dodano ${freshMessages.length} nowych wiadomości`)
          }
        } else if (loadMore) {
          // Dodaj starsze wiadomości na początek tablicy
          messages.value = [...newMessages, ...messages.value]
          // Aktualizuj metadata dla load more
          hasMoreMessages.value = data.pagination?.hasMore || false
          oldestMessageId.value = data.pagination?.oldestMessageId || null
        } else {
          // Zastąp wszystkie wiadomości (pierwsze załadowanie)
          messages.value = newMessages
          // Aktualizuj metadata dla normalnego ładowania
          hasMoreMessages.value = data.pagination?.hasMore || false
          oldestMessageId.value = data.pagination?.oldestMessageId || null
        }
        
        // Aktualizuj newestMessageId (zawsze)
        if (messages.value.length > 0) {
          newestMessageId.value = Math.max(...messages.value.map(m => m.message_id))
        }
        
        console.log('Pobrano wiadomości:', {
          count: newMessages.length,
          hasMore: hasMoreMessages.value,
          oldestId: oldestMessageId.value,
          loadMore
        })
        
        // Sprawdź czy są nowi użytkownicy w wiadomościach
        const userIds = new Set(newMessages.map(m => m.sender_id))
        const hasUnknownUsers = Array.from(userIds).some(id => 
          !users.value.find(u => u.id === id)
        )
        
        // Jeśli są nowi użytkownicy, odśwież listę
        if (hasUnknownUsers) {
          await fetchUsers()
        }
      }
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error)
    }
  }
  
  // Załaduj starsze wiadomości
  const loadOlderMessages = async () => {
    if (selectedGroup.value && hasMoreMessages.value) {
      await fetchGroupMessages(selectedGroup.value.id, true)
    }
  }

  // Pomocnicze funkcje dla zarządzania dostępem do grup
  const getVerifiedGroups = () => {
    const stored = localStorage.getItem('verifiedGroups')
    return stored ? JSON.parse(stored) : []
  }

  const addVerifiedGroup = (groupId) => {
    const verified = getVerifiedGroups()
    if (!verified.includes(groupId)) {
      verified.push(groupId)
      localStorage.setItem('verifiedGroups', JSON.stringify(verified))
    }
  }

  const hasVerifiedAccess = (groupId) => {
    return getVerifiedGroups().includes(groupId)
  }

  // Wybierz grupę
  const selectGroup = async (group) => {
    // Sprawdź czy grupa jest prywatna i czy użytkownik ma dostęp
    if (!group.is_public && !hasVerifiedAccess(group.id)) {
      return { needsPassword: true, group }
    }

    selectedGroup.value = group
    await fetchGroupMessages(group.id)

    // Automatyczne odświeżanie wiadomości co 3 sekundy
    if (messagesInterval) {
      clearInterval(messagesInterval)
    }
    messagesInterval = setInterval(() => {
      if (selectedGroup.value) {
        fetchGroupMessages(selectedGroup.value.id, false, true) // onlyNew = true
      }
    }, 3000)

    return { needsPassword: false }
  }

  // Weryfikuj hasło grupy
  const verifyGroupPassword = async (groupId, password) => {
    try {
      const response = await authFetch(`${API_URL}/groups/${groupId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        addVerifiedGroup(groupId)
        return true
      }
      return false
    } catch (error) {
      console.error('Błąd weryfikacji hasła:', error)
      return false
    }
  }

  // Wyślij wiadomość
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedGroup.value) {
      return
    }

    try {
      const response = await authFetch(`${API_URL}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          sender_id: currentUser.value?.id,
          receiver_group_id: selectedGroup.value.id,
          message_content: newMessage.value.trim(),
        }),
      })

      if (response.ok) {
        newMessage.value = ''
        await fetchGroupMessages(selectedGroup.value.id)
      } else {
        const errorData = await response.json()
        alert('Błąd wysyłania wiadomości: ' + (errorData.error || 'Nieznany błąd'))
      }
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error)
      alert('Błąd połączenia z serwerem')
    }
  }

  // Stwórz nową grupę
  const createGroup = async (groupData) => {
    if (!groupData.name.trim()) {
      alert('Podaj nazwę grupy')
      return false
    }

    if (!groupData.isPublic && !groupData.password.trim()) {
      alert('Grupa prywatna wymaga hasła')
      return false
    }

    try {
      const response = await authFetch(`${API_URL}/groups`, {
        method: 'POST',
        body: JSON.stringify({
          name: groupData.name,
          is_public: groupData.isPublic,
          password: groupData.isPublic ? null : groupData.password,
          creator_id: currentUser.value?.id,
        }),
      })

      if (response.ok) {
        const newGroup = await response.json()
        // Jeśli to grupa prywatna, zapisz ją jako zweryfikowaną (twórca ma automatyczny dostęp)
        if (!newGroup.is_public) {
          addVerifiedGroup(newGroup.id)
        }
        await fetchGroups()
        return true
      } else {
        const errorData = await response.json()
        alert('Błąd tworzenia grupy: ' + (errorData.error || 'Nieznany błąd'))
        return false
      }
    } catch (error) {
      console.error('Błąd tworzenia grupy:', error)
      alert('Błąd połączenia z serwerem')
      return false
    }
  }

  // Zwróć nazwę użytkownika na podstawie ID
  const getUserName = (userId) => {
    if (!users.value || users.value.length === 0) {
      return `User ${userId}`
    }
    const user = users.value.find(u => u.id === userId)
    return user ? user.user : `User ${userId}`
  }

  // Computed properties
  const filteredGroups = computed(() =>
    groups.value.filter(g =>
      g.name.toLowerCase().includes(searchGroups.value.toLowerCase())
    )
  )

  const filteredUsers = computed(() =>
    users.value.filter(u =>
      u.user.toLowerCase().includes(searchUsers.value.toLowerCase())
    )
  )

  // Initialization and cleanup
  const initialize = async () => {
    await fetchUsers()
    await fetchGroups()
    
    // Automatyczne odświeżanie listy grup co 5 sekund
    groupsRefreshInterval = setInterval(() => {
      fetchGroups()
    }, 5000)
  }

  const cleanup = () => {
    if (messagesInterval) {
      clearInterval(messagesInterval)
    }
    if (groupsRefreshInterval) {
      clearInterval(groupsRefreshInterval)
    }
  }

  return {
    // State
    searchGroups,
    searchUsers,
    groups,
    users,
    selectedGroup,
    messages,
    newMessage,
    hasMoreMessages,
    
    // Computed
    filteredGroups,
    filteredUsers,
    
    // Methods
    fetchGroups,
    fetchUsers,
    selectGroup,
    verifyGroupPassword,
    sendMessage,
    createGroup,
    getUserName,
    loadOlderMessages,
    initialize,
    cleanup
  }
}
