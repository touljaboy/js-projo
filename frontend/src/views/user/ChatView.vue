<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/user/UserHeader/UserHeader.vue'

const router = useRouter()
const { currentUser, logout, isAuthenticated } = useAuth()

const searchConversations = ref('')
const searchUsers = ref('')
const conversations = ref([])
const users = ref([])
const selectedConversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const showConversationsList = ref(true)
const showUsersList = ref(true)
let messagesInterval = null

const API_URL = 'http://localhost:3000/v1'

// Pobierz konwersacje użytkownika
const fetchConversations = async () => {
  try {
    const response = await fetch(`${API_URL}/convs`)
    if (response.ok) {
      const allConvs = await response.json()
      // Filtruj konwersacje dla zalogowanego użytkownika
      conversations.value = allConvs.filter(
        c => c.user_a_id === currentUser.value?.id || c.user_b_id === currentUser.value?.id
      )
    }
  } catch (error) {
    console.error('Błąd pobierania konwersacji:', error)
  }
}

// Pobierz użytkowników
const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`)
    if (response.ok) {
      users.value = await response.json()
      console.log('Pobrano użytkowników:', users.value.length, users.value)
    } else {
      console.error('Błąd odpowiedzi przy pobieraniu użytkowników:', response.status)
    }
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error)
  }
}

// Pobierz wiadomości konwersacji
const fetchConversationMessages = async (convId) => {
  try {
    const response = await fetch(`${API_URL}/messages`)
    if (response.ok) {
      const allMessages = await response.json()
      const convMessages = allMessages.filter(m => m.conversation_id === convId)
      
      // Sprawdź czy są nowi użytkownicy w wiadomościach
      const userIds = new Set(convMessages.map(m => m.sender_id))
      const hasUnknownUsers = Array.from(userIds).some(id => 
        !users.value.find(u => u.id === id)
      )
      
      // Jeśli są nowi użytkownicy, odśwież listę
      if (hasUnknownUsers) {
        await fetchUsers()
      }
      
      messages.value = convMessages
    }
  } catch (error) {
    console.error('Błąd pobierania wiadomości:', error)
  }
}

// Wybierz konwersację
const selectConversation = async (conv) => {
  selectedConversation.value = conv
  await fetchConversationMessages(conv.id)
  
  // Uruchom auto-odświeżanie wiadomości
  if (messagesInterval) {
    clearInterval(messagesInterval)
  }
  messagesInterval = setInterval(() => {
    if (selectedConversation.value) {
      fetchConversationMessages(selectedConversation.value.id)
    }
  }, 3000) // Odśwież co 3 sekundy
}

// Wyślij wiadomość
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: selectedConversation.value.id,
        sender_id: currentUser.value?.id || 1,
        message_content: newMessage.value,
      }),
    })

    if (response.ok) {
      newMessage.value = ''
      await fetchConversationMessages(selectedConversation.value.id)
    } else {
      const errorData = await response.json()
      console.error('Błąd wysyłania wiadomości:', errorData)
      alert('Błąd wysyłania wiadomości: ' + (errorData.error || 'Nieznany błąd'))
    }
  } catch (error) {
    console.error('Błąd wysyłania wiadomości:', error)
    alert('Błąd połączenia z serwerem')
  }
}

// Rozpocznij nową konwersację
const startConversation = async (user) => {
  if (user.id === currentUser.value?.id) {
    alert('Nie możesz rozpocząć konwersacji sam ze sobą!')
    return
  }

  try {
    const response = await fetch(`${API_URL}/convs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_a_id: currentUser.value?.id,
        user_b_id: user.id,
      }),
    })

    if (response.ok) {
      const newConv = await response.json()
      await fetchConversations()
      // Automatycznie wybierz nową konwersację
      await selectConversation(newConv)
    } else {
      const errorData = await response.json()
      alert('Błąd tworzenia konwersacji: ' + (errorData.error || 'Nieznany błąd'))
    }
  } catch (error) {
    console.error('Błąd tworzenia konwersacji:', error)
    alert('Błąd połączenia z serwerem')
  }
}

// Zwróć nazwę użytkownika na podstawie ID
const getUserName = (userId) => {
  if (!users.value || users.value.length === 0) {
    console.warn('Lista użytkowników jest pusta!')
    return `User ${userId}`
  }
  const user = users.value.find(u => u.id === userId)
  if (!user) {
    console.warn(`Nie znaleziono użytkownika o ID ${userId}`, 'Dostępni użytkownicy:', users.value)
    return `User ${userId}`
  }
  return user.user
}

// Zwróć nazwę użytkownika w konwersacji
const getConversationName = (conv) => {
  const otherUserId = conv.user_a_id === currentUser.value?.id ? conv.user_b_id : conv.user_a_id
  return getUserName(otherUserId)
}

const filteredConversations = computed(() =>
  conversations.value.filter(c => {
    const name = getConversationName(c)
    return name.toLowerCase().includes(searchConversations.value.toLowerCase())
  })
)

const filteredUsers = computed(() =>
  users.value.filter(u =>
    u.user.toLowerCase().includes(searchUsers.value.toLowerCase()) &&
    u.id !== currentUser.value?.id
  )
)

const handleLogout = () => {
  logout()
}

onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  // Najpierw pobierz użytkowników, potem konwersacje
  await fetchUsers()
  await fetchConversations()
})

onBeforeUnmount(() => {
  // Wyczyść interval przy opuszczaniu komponentu
  if (messagesInterval) {
    clearInterval(messagesInterval)
  }
})
</script>

<template>
  <div class="container">
    <UserHeader />

    <h1>Wiadomości prywatne</h1>

    <div class="toggle-buttons">
      <button class="toggle-panel-btn" @click="showConversationsList = !showConversationsList">
        {{ showConversationsList ? '◀ Ukryj konwersacje' : '▶ Pokaż konwersacje' }}
      </button>
      <button class="toggle-panel-btn" @click="showUsersList = !showUsersList">
        {{ showUsersList ? 'Ukryj użytkowników ▶' : '◀ Pokaż użytkowników' }}
      </button>
    </div>

    <div class="chat-wrapper">
      <!-- Lista konwersacji -->
      <div class="conversations-list" :class="{ hidden: !showConversationsList }">
        <h3>Konwersacje</h3>
        <input
          type="search"
          v-model="searchConversations"
          placeholder="Szukaj konwersacji..."
          aria-label="Szukaj konwersacji"
        />
        <ul>
          <li 
            v-for="conv in filteredConversations" 
            :key="conv.id"
            @click="selectConversation(conv)"
            :class="{ active: selectedConversation?.id === conv.id }"
          >
            <div class="avatar">{{ getConversationName(conv).charAt(0).toUpperCase() }}</div>
            <span>{{ getConversationName(conv) }}</span>
          </li>
        </ul>
      </div>

      <!-- Okno czatu -->
      <div class="chat-window">
        <div v-if="selectedConversation" class="chat-content">
          <div class="chat-header">
            <h3>{{ getConversationName(selectedConversation) }}</h3>
          </div>
          
          <div class="messages-container">
            <div v-for="msg in messages" :key="msg.message_id" class="message">
              <strong>{{ msg.sender_id === currentUser?.id ? 'Ty' : getUserName(msg.sender_id) }}:</strong> {{ msg.message_content }}
            </div>
          </div>

          <div class="message-input">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Napisz wiadomość..."
            />
            <button @click="sendMessage">Wyślij</button>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>Wybierz konwersację lub rozpocznij nową</p>
        </div>
      </div>

      <!-- Lista użytkowników do dodania -->
      <div class="users-list" :class="{ hidden: !showUsersList }">
        <h3>Rozpocznij czat</h3>
        <input
          type="search"
          v-model="searchUsers"
          placeholder="Szukaj użytkownika..."
          aria-label="Szukaj użytkownika"
        />
        <ul>
          <li v-for="user in filteredUsers" :key="user.id">
            <button @click="startConversation(user)" class="add-btn">+</button>
            <span>{{ user.user }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  color: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.chat-wrapper {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-height: 500px;
}

.conversations-list,
.users-list {
  width: 220px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
}

.conversations-list h3,
.users-list h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.conversations-list input,
.users-list input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.conversations-list ul,
.users-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.conversations-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.3rem;
}

.conversations-list li:hover {
  background: #e0e0e0;
}

.conversations-list li.active {
  background: #2196F3;
  color: white;
}

.users-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.avatar {
  background-color: #ccc;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-weight: bold;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.add-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: #45a049;
}

.chat-window {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background: #f5f5f5;
}

.chat-header h3 {
  margin: 0;
}

.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 400px;
}

.message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
}

.message strong {
  color: #2196F3;
}

.message-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.message-input input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.message-input button {
  padding: 0.6rem 1.2rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:hover {
  background: #1976D2;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.add-btn {
  background-color: #a6f0a6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
  color: black;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #8add8a;
}

.footer {
  margin-top: 3rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  text-align: center;
  color: gray;
  font-size: 0.8rem;
}

.social-icons {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.toggle-buttons {
  display: none;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.toggle-panel-btn {
  padding: 0.6rem 1rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
}

.toggle-panel-btn:hover {
  background: #1976D2;
}

/* Responsive styles */
@media (max-width: 768px) {
  .toggle-buttons {
    display: flex;
  }

  .header {
    flex-direction: column;
    gap: 0.8rem;
  }

  nav ul {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  nav ul li a {
    font-size: 0.85rem;
  }

  .site-name {
    font-size: 1.4rem;
  }

  .chat-wrapper {
    position: relative;
  }

  .conversations-list,
  .users-list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 280px;
    max-width: 80%;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    z-index: 10;
  }

  .conversations-list {
    left: 0;
  }

  .conversations-list.hidden {
    transform: translateX(-100%);
  }

  .users-list {
    right: 0;
  }

  .users-list.hidden {
    transform: translateX(100%);
  }

  .chat-window {
    width: 100%;
  }

  .conversations-list input,
  .users-list input {
    font-size: 16px;
  }

  .message-input input {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .toggle-panel-btn {
    font-size: 0.85rem;
    padding: 0.75rem 0.8rem;
  }

  .conversations-list,
  .users-list {
    width: 260px;
    max-width: 85%;
  }

  .message-input {
    flex-direction: column;
  }

  .message-input button {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>
