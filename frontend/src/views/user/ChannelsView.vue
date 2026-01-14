<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/user/UserHeader/UserHeader.vue'

const router = useRouter()
const { currentUser, logout, isAuthenticated } = useAuth()

const searchGroups = ref('')
const searchUsers = ref('')
const groups = ref([])
const users = ref([])
const selectedGroup = ref(null)
const messages = ref([])
const newMessage = ref('')
const showCreateGroupModal = ref(false)
const newGroupName = ref('')
const newGroupIsPublic = ref(true)
const newGroupPassword = ref('')
const showPasswordPrompt = ref(false)
const passwordInput = ref('')
const pendingGroup = ref(null)
const showGroupsList = ref(true)
let messagesInterval = null

const API_URL = 'http://localhost:3000/v1'

// Pobierz grupy
const fetchGroups = async () => {
  try {
    const response = await fetch(`${API_URL}/groups`)
    if (response.ok) {
      groups.value = await response.json()
    }
  } catch (error) {
    console.error('Błąd pobierania grup:', error)
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

// Pobierz wiadomości grupy
const fetchGroupMessages = async (groupId) => {
  try {
    const response = await fetch(`${API_URL}/messages`)
    if (response.ok) {
      const allMessages = await response.json()
      // Filtruj wiadomości dla wybranej grupy (backend używa receiver_group_id)
      const groupMessages = allMessages.filter(m => m.receiver_group_id === groupId)
      
      // Sprawdź czy są nowi użytkownicy w wiadomościach
      const userIds = new Set(groupMessages.map(m => m.sender_id))
      const hasUnknownUsers = Array.from(userIds).some(id => 
        !users.value.find(u => u.id === id)
      )
      
      // Jeśli są nowi użytkownicy, odśwież listę
      if (hasUnknownUsers) {
        await fetchUsers()
      }
      
      messages.value = groupMessages
    }
  } catch (error) {
    console.error('Błąd pobierania wiadomości:', error)
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
  // Jeśli grupa jest prywatna, sprawdź czy użytkownik jest twórcą lub ma już dostęp
  if (!group.is_public) {
    // Twórca grupy ma automatyczny dostęp
    const isCreator = group.creator_id === currentUser.value?.id
    // Sprawdź czy użytkownik już wcześniej zweryfikował dostęp
    const hasAccess = hasVerifiedAccess(group.id)
    
    if (!isCreator && !hasAccess) {
      // Pokaż prompt o hasło
      pendingGroup.value = group
      passwordInput.value = ''
      showPasswordPrompt.value = true
      return
    }
  }
  
  // Grupa publiczna lub użytkownik ma dostęp - można wejść od razu
  await joinGroup(group)
}

const joinGroup = async (group) => {
  selectedGroup.value = group
  await fetchGroupMessages(group.id)
  
  // Uruchom auto-odświeżanie wiadomości
  if (messagesInterval) {
    clearInterval(messagesInterval)
  }
  messagesInterval = setInterval(() => {
    if (selectedGroup.value) {
      fetchGroupMessages(selectedGroup.value.id)
    }
  }, 3000) // Odśwież co 3 sekundy
}

const verifyAndJoinGroup = async () => {
  if (!pendingGroup.value || !passwordInput.value) {
    alert('Podaj hasło')
    return
  }

  try {
    const response = await fetch(`${API_URL}/groups/${pendingGroup.value.id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: passwordInput.value,
      }),
    })

    if (response.ok) {
      // Zapisz dostęp do grupy w localStorage
      addVerifiedGroup(pendingGroup.value.id)
      
      showPasswordPrompt.value = false
      await joinGroup(pendingGroup.value)
      pendingGroup.value = null
      passwordInput.value = ''
    } else {
      const errorData = await response.json()
      alert('Błąd: ' + (errorData.error || 'Nieprawidłowe hasło'))
    }
  } catch (error) {
    console.error('Błąd weryfikacji hasła:', error)
    alert('Błąd połączenia z serwerem')
  }
}

const closePasswordPrompt = () => {
  showPasswordPrompt.value = false
  pendingGroup.value = null
  passwordInput.value = ''
}

// Wyślij wiadomość
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedGroup.value) return

  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: currentUser.value?.id || 1,
        receiver_group_id: selectedGroup.value.id,
        message_content: newMessage.value,
      }),
    })

    if (response.ok) {
      newMessage.value = ''
      await fetchGroupMessages(selectedGroup.value.id)
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

// Stwórz nową grupę
const openCreateGroupModal = () => {
  newGroupName.value = ''
  newGroupIsPublic.value = true
  newGroupPassword.value = ''
  showCreateGroupModal.value = true
}

const closeCreateGroupModal = () => {
  showCreateGroupModal.value = false
}

const createGroup = async () => {
  if (!newGroupName.value.trim()) {
    alert('Podaj nazwę grupy')
    return
  }

  if (!newGroupIsPublic.value && !newGroupPassword.value.trim()) {
    alert('Grupa prywatna wymaga hasła')
    return
  }

  try {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newGroupName.value,
        is_public: newGroupIsPublic.value,
        password: newGroupIsPublic.value ? null : newGroupPassword.value,
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
      closeCreateGroupModal()
    } else {
      const errorData = await response.json()
      alert('Błąd tworzenia grupy: ' + (errorData.error || 'Nieznany błąd'))
    }
  } catch (error) {
    console.error('Błąd tworzenia grupy:', error)
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

const handleLogout = () => {
  logout()
}

let groupsRefreshInterval = null

onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  // Najpierw pobierz użytkowników, potem grupy
  await fetchUsers()
  await fetchGroups()
  
  // Automatyczne odświeżanie listy grup co 5 sekund
  groupsRefreshInterval = setInterval(() => {
    fetchGroups()
  }, 5000)
})

onBeforeUnmount(() => {
  // Wyczyść interwały przy opuszczaniu komponentu
  if (messagesInterval) {
    clearInterval(messagesInterval)
  }
  if (groupsRefreshInterval) {
    clearInterval(groupsRefreshInterval)
  }
})
</script>

<template>
  <div class="container">
    <UserHeader />

    <h1>Czaty grupowe</h1>

    <button class="toggle-panel-btn" @click="showGroupsList = !showGroupsList">
      {{ showGroupsList ? '◀ Ukryj grupy' : '▶ Pokaż grupy' }}
    </button>

    <div class="channels-wrapper">
      <!-- Lista grup -->
      <div class="groups-list" :class="{ hidden: !showGroupsList }">
        <div class="list-header">
          <h3>Grupy</h3>
          <button @click="openCreateGroupModal" class="create-btn">+ Nowa grupa</button>
        </div>
        <input
          type="search"
          v-model="searchGroups"
          placeholder="Szukaj grup..."
          aria-label="Szukaj grup"
        />
        <ul>
          <li 
            v-for="group in filteredGroups" 
            :key="group.id"
            @click="selectGroup(group)"
            :class="{ active: selectedGroup?.id === group.id }"
          >
            <div class="avatar">#</div>
            <span>{{ group.name }}</span>
          </li>
        </ul>
      </div>

      <!-- Okno czatu -->
      <div class="chat-window">
        <div v-if="selectedGroup" class="chat-content">
          <div class="chat-header">
            <h3># {{ selectedGroup.name }}</h3>
          </div>
          
          <div class="messages-container">
            <div v-for="msg in messages" :key="msg.message_id" class="message">
              <strong>{{ getUserName(msg.sender_id) }}:</strong> {{ msg.message_content }}
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
          <p>Wybierz grupę, aby zobaczyć wiadomości</p>
        </div>
      </div>
    </div>

    <!-- Modal tworzenia grupy -->
    <div v-if="showCreateGroupModal" class="modal-overlay" @click="closeCreateGroupModal">
      <div class="modal-content" @click.stop>
        <h2>Utwórz nową grupę</h2>
        
        <form @submit.prevent="createGroup">
          <div class="form-group">
            <label>Nazwa grupy:</label>
            <input v-model="newGroupName" type="text" required placeholder="Wpisz nazwę grupy" />
          </div>

          <div class="form-group">
            <label class="radio-label">
              <input type="radio" v-model="newGroupIsPublic" :value="true" />
              Publiczna (każdy może dołączyć)
            </label>
            <label class="radio-label">
              <input type="radio" v-model="newGroupIsPublic" :value="false" />
              Prywatna (wymaga hasła)
            </label>
          </div>

          <div v-if="!newGroupIsPublic" class="form-group">
            <label>Hasło:</label>
            <input v-model="newGroupPassword" type="password" required placeholder="Wpisz hasło grupy" />
          </div>

          <div class="modal-buttons">
            <button type="button" @click="closeCreateGroupModal" class="btn-cancel">Anuluj</button>
            <button type="submit" class="btn-create">Utwórz</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal weryfikacji hasła grupy -->
    <div v-if="showPasswordPrompt" class="modal-overlay" @click="closePasswordPrompt">
      <div class="modal-content" @click.stop>
        <h2>🔒 Grupa prywatna</h2>
        <p>Grupa "{{ pendingGroup?.name }}" jest prywatna. Podaj hasło aby dołączyć.</p>
        
        <form @submit.prevent="verifyAndJoinGroup">
          <div class="form-group">
            <label>Hasło:</label>
            <input v-model="passwordInput" type="password" required placeholder="Wpisz hasło grupy" autofocus />
          </div>

          <div class="modal-buttons">
            <button type="button" @click="closePasswordPrompt" class="btn-cancel">Anuluj</button>
            <button type="submit" class="btn-create">Dołącz</button>
          </div>
        </form>
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

.channels-wrapper {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-height: 500px;
}

.groups-list {
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.create-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.create-btn:hover {
  background: #45a049;
}

.groups-list input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.groups-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.groups-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.3rem;
}

.groups-list li:hover {
  background: #e0e0e0;
}

.groups-list li.active {
  background: #2196F3;
  color: white;
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

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  margin-right: 0.5rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel,
.btn-create {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-create {
  background: #4CAF50;
  color: white;
}

.btn-create:hover {
  background: #45a049;
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

.toggle-panel-btn {
  display: none;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.toggle-panel-btn:hover {
  background: #1976D2;
}

/* Responsive styles */
@media (max-width: 768px) {
  .toggle-panel-btn {
    display: block;
    width: 100%;
  }

  .channels-wrapper {
    position: relative;
  }

  .groups-list {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 280px;
    max-width: 80%;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .groups-list.hidden {
    transform: translateX(-100%);
  }

  .chat-window {
    width: 100%;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .modal-content h2 {
    font-size: 1.3rem;
  }

  .form-group input[type="text"],
  .form-group input[type="password"] {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  .groups-list {
    width: 260px;
    max-width: 85%;
  }

  .message-input {
    flex-direction: column;
  }

  .message-input input {
    font-size: 16px;
  }

  .message-input button {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>
