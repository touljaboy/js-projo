<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useChannels } from '@/composables/useChannels'
import { useRouter } from 'vue-router'
import GroupsList from '@/components/channels/GroupsList.vue'
import ChatWindow from '@/components/channels/ChatWindow.vue'
import CreateGroupModal from '@/components/channels/CreateGroupModal.vue'

const router = useRouter()
const { currentUser, logout, isAuthenticated } = useAuth()
const {
  searchGroups,
  selectedGroup,
  messages,
  newMessage,
  filteredGroups,
  hasMoreMessages,
  selectGroup,
  sendMessage,
  createGroup,
  getUserName,
  loadOlderMessages,
  initialize,
  cleanup
} = useChannels()

const showCreateGroupModal = ref(false)
const newGroupName = ref('')
const newGroupIsPublic = ref(true)
const newGroupPassword = ref('')
const showPasswordPrompt = ref(false)
const passwordInput = ref('')
const pendingGroup = ref(null)
const showGroupsList = ref(true)

const handleSelectGroup = async (group) => {
  const result = await selectGroup(group)
  
  if (result.needsPassword) {
    pendingGroup.value = group
    showPasswordPrompt.value = true
    passwordInput.value = ''
  }
}

const verifyPassword = async () => {
  if (!passwordInput.value.trim() || !pendingGroup.value) {
    alert('Wprowadź hasło')
    return
  }

  const isValid = await useChannels().verifyGroupPassword(
    pendingGroup.value.id,
    passwordInput.value
  )

  if (isValid) {
    showPasswordPrompt.value = false
    await selectGroup(pendingGroup.value)
  } else {
    alert('Nieprawidłowe hasło')
  }
}

const closePasswordPrompt = () => {
  showPasswordPrompt.value = false
  pendingGroup.value = null
  passwordInput.value = ''
}

const openCreateGroupModal = () => {
  newGroupName.value = ''
  newGroupIsPublic.value = true
  newGroupPassword.value = ''
  showCreateGroupModal.value = true
}

const closeCreateGroupModal = () => {
  showCreateGroupModal.value = false
}

const handleCreateGroup = async () => {
  const success = await createGroup({
    name: newGroupName.value,
    isPublic: newGroupIsPublic.value,
    password: newGroupPassword.value
  })
  
  if (success) {
    closeCreateGroupModal()
  }
}

const handleLogout = () => {
  logout()
}

onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  await initialize()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div class="container">
    <header class="header">
      <div class="user-info">
        <div class="user-avatar">{{ (currentUser?.user || 'U').charAt(0).toUpperCase() }}</div>
        <span class="user-name">{{ currentUser?.user || 'Użytkownik' }}</span>
      </div>
      <small class="site-name">Yappchat</small>
      <nav>
        <ul>
          <li><router-link to="/channels" class="active">Channels</router-link></li>
          <li><router-link to="/chat">Friends</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
        </ul>
      </nav>
    </header>

    <h1>Czaty grupowe</h1>

    <button class="toggle-panel-btn" @click="showGroupsList = !showGroupsList">
      {{ showGroupsList ? '◀ Ukryj grupy' : '▶ Pokaż grupy' }}
    </button>

    <div class="channels-wrapper">
      <GroupsList
        v-if="showGroupsList"
        :groups="filteredGroups"
        :selectedGroup="selectedGroup"
        :searchQuery="searchGroups"
        @update:searchQuery="searchGroups = $event"
        @select="handleSelectGroup"
        @create="openCreateGroupModal"
      />

      <div class="chat-window">
        <ChatWindow
          v-if="selectedGroup"
          :group="selectedGroup"
          :messages="messages"
          :newMessage="newMessage"
          :getUserName="getUserName"
          :hasMoreMessages="hasMoreMessages"
          @update:newMessage="newMessage = $event"
          @send="sendMessage"
          @loadMore="loadOlderMessages"
        />
        <div v-else class="no-selection">
          <p>Wybierz grupę, aby zobaczyć wiadomości</p>
        </div>
      </div>
    </div>

    <!-- Modal tworzenia grupy -->
    <CreateGroupModal
      :show="showCreateGroupModal"
      :groupName="newGroupName"
      :isPublic="newGroupIsPublic"
      :password="newGroupPassword"
      @update:groupName="newGroupName = $event"
      @update:isPublic="newGroupIsPublic = $event"
      @update:password="newGroupPassword = $event"
      @submit="handleCreateGroup"
      @close="closeCreateGroupModal"
    />

    <!-- Modal weryfikacji hasła -->
    <div v-if="showPasswordPrompt" class="modal-overlay" @click.self="closePasswordPrompt">
      <div class="modal-content">
        <h2>Grupa prywatna</h2>
        <p>Ta grupa wymaga hasła. Wprowadź hasło, aby uzyskać dostęp.</p>
        <input
          v-model="passwordInput"
          @keyup.enter="verifyPassword"
          type="password"
          placeholder="Hasło"
        />
        <div class="modal-actions">
          <button @click="verifyPassword" class="btn-primary">OK</button>
          <button @click="closePasswordPrompt" class="btn-secondary">Anuluj</button>
        </div>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.header small {
  flex: 1;
}

.site-name {
  font-weight: bold;
  text-align: center;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1.5px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

nav ul li a {
  text-decoration: none;
  color: black;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

nav ul li a.active,
nav ul li a:hover {
  background-color: black;
  color: white;
}

nav ul li a {
  text-decoration: none;
  color: inherit;
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
  max-height: 600px;
  overflow: hidden;
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
  overflow: hidden;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #999;
  font-size: 1.1rem;
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

  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }

  .user-name {
    font-size: 0.95rem;
  }

  .site-name {
    font-size: 1.2rem;
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
