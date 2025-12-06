<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import { useRemoteSearch } from '@/composables/useRemoteSearch'

// Bazowy URL do API
const API_URL = 'http://localhost:3000/v1/users'

const fetchUsersApi = async (q, signal) => {
  const res = await fetch(API_URL, { signal })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Błąd pobierania użytkowników.')

  const query = q.trim().toLowerCase()
  if (!query) return data

  return data.filter((u) => (u.user ?? '').toLowerCase().includes(query))
}

const {
  query: search,
  results: users,
  isLoading,
  error,
  runSearch,
} = useRemoteSearch(fetchUsersApi, {
  debounceMs: 300,
  immediate: true,
})

const newUserPass = ref('')

const addUser = async () => {
  if (newUserName.value.trim() === "" || newUserPass.value.trim() === "") return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: newUserName.value,
        password_hash: newUserPass.value,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Błąd dodawania użytkownika.");

    newUserName.value = ''
    newUserPass.value = ''

  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const removeUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Błąd usuwania użytkownika.')

    await runSearch(search.value)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}
</script>

<template>
  <div class="container">
    <PageHeader
      title="Użytkownicy"
      v-model="search"
      searchPlaceholder="Wyszukaj..."
      :loading="isLoading"
    />

    <div class="add-form">
      <input
        v-model="newUserName"
        placeholder="Login użytkownika..."
        type="text"
        @keyup.enter="addUser"
      />

      <input
        v-model="newUserPass"
        placeholder="Password hash..."
        type="text"
        @keyup.enter="addUser"
      />

      <button @click="addUser">Dodaj</button>
    </div>

    <div class="users-list">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else-if="!isLoading && users.length === 0">Brak użytkowników.</p>

      <div v-for="u in users" :key="u.id" class="card">
        <div class="card-content">
          <h3>{{ u.user }}</h3>
          <p class="muted">ID: {{ u.id }}</p>
          <p class="muted">Created: {{ new Date(u.created_at).toLocaleString() }}</p>

          <p class="hash">hash: {{ u.password_hash }}</p>

          <button class="delete-btn" @click="removeUser(u.id)">Usuń</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  font-family: sans-serif;
}

.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  align-items: center;
}

.add-form input[type="text"] {
  padding: 8px;
  flex-grow: 1;
}

.add-form button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.add-form button:hover {
  background: #33a06f;
}

.users-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.card-content {
  padding: 12px;
}

.hash {
  font-family: monospace;
  background: #fafafa;
  padding: 6px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 8px;
}

.muted {
  color: #666;
  font-size: 13px;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.error {
  color: #c00;
  margin: 8px 0;
  grid-column: 1 / -1;
}
</style>
