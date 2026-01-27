<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUsers } from '@/composables/useUsers'
import { useConversations } from '@/composables/useConversations'

const router = useRouter()
const { currentUser, logout, isAuthenticated } = useAuth()
const { users, isLoading, error, runSearch } = useUsers()
const { conversations, addConversation, loadConversations } = useConversations()

const searchAdd = ref('')

// Załaduj użytkowników i konwersacje po zamontowaniu
onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  await runSearch('')
  await loadConversations()
})

// Filtruj użytkowników do dodania (wszyscy oprócz zalogowanego)
const filteredAddable = computed(() => {
  if (!users.value) return []
  
  return users.value.filter(u => {
    // Wyłącz aktualnie zalogowanego użytkownika
    if (u.id === currentUser.value?.id) return false
    
    // Filtruj po wyszukiwanej frazie
    if (searchAdd.value) {
      return u.user.toLowerCase().includes(searchAdd.value.toLowerCase())
    }
    
    return true
  })
})

// Rozpocznij czat z wybranym użytkownikiem
const startChat = async (user) => {
  try {
    // Sprawdź czy konwersacja już istnieje
    const existingConv = conversations.value?.find(conv => 
      (conv.user_a_id === currentUser.value.id && conv.user_b_id === user.id) ||
      (conv.user_b_id === currentUser.value.id && conv.user_a_id === user.id)
    )
    
    if (existingConv) {
      // Przekieruj do istniejącej konwersacji
      router.push({ path: '/chat', query: { conversationId: existingConv.id } })
    } else {
      // Utwórz nową konwersację
      await addConversation({
        user_a_id: currentUser.value.id,
        user_b_id: user.id
      })
      
      // Odśwież listę konwersacji
      await loadConversations()
      
      // Znajdź nowo utworzoną konwersację
      const newConv = conversations.value.find(conv => 
        (conv.user_a_id === currentUser.value.id && conv.user_b_id === user.id) ||
        (conv.user_b_id === currentUser.value.id && conv.user_a_id === user.id)
      )
      
      if (newConv) {
        router.push({ path: '/chat', query: { conversationId: newConv.id } })
      }
    }
  } catch (err) {
    console.error('Błąd rozpoczynania czatu:', err)
    alert('Nie udało się rozpocząć czatu')
  }
}

// Pobierz inicjały użytkownika
const getInitials = (username) => {
  if (!username) return '?'
  const parts = username.split(/[_\s-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return username.substring(0, 2).toUpperCase()
}

const handleLogout = () => {
  logout()
}
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
          <li><router-link to="/channels">Channels</router-link></li>
          <li><router-link to="/chat" class="active">Friends</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
        </ul>
      </nav>
    </header>

    <h1>Znajomi i Rozmowy</h1>

    <div class="friends-wrapper">
      <!-- Panel "Rozpocznij czat" -->
      <div class="friends-add">
        <h3>Rozpocznij czat</h3>
        <input
          type="search"
          v-model="searchAdd"
          placeholder="Wyszukaj użytkownika..."
          aria-label="Wyszukaj użytkownika"
        />
        
        <div v-if="isLoading" class="loading">Ładowanie użytkowników...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <ul v-else-if="filteredAddable.length > 0">
          <li v-for="user in filteredAddable" :key="user.id">
            <div class="avatar">{{ getInitials(user.user) }}</div>
            <span>{{ user.user }}</span>
            <button @click="startChat(user)" class="chat-btn">💬 Czat</button>
          </li>
        </ul>
        <div v-else class="no-results">
          <p>Brak użytkowników do wyświetlenia</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <small>YapChat - The Whole Team</small>
      <small>2026</small>
    </footer>
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

.site-name {
  font-weight: bold;
  text-align: center;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1.5px;
  flex: 1;
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

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}

.friends-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex: 1;
}

.friends-add {
  flex: 1;
  max-width: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f9f9f9;
}

.friends-add input {
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.friends-add ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
}

.friends-add li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.friends-add li:hover {
  background: #f5f5f5;
}

.avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.friends-add li span {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.chat-btn {
  background: #2196F3;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.chat-btn:hover {
  background: #1976D2;
}

.loading,
.error,
.no-results {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
  padding: 1rem;
}

.footer {
  margin-top: 3rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  text-align: center;
  color: gray;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 0.8rem;
  }

  nav ul {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .site-name {
    font-size: 1.4rem;
  }

  .friends-add {
    max-width: 100%;
  }
}
</style>
