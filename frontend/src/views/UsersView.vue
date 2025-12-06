<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import { useRemoteSearch } from '@/composables/useRemoteSearch'
import UserCard from '@/components/users/UserCard/UserCard.vue'
import UsersAddForm from '@/components/users/UsersAddForm/UsersAddForm.vue'

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

const addUser = async (payload) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Błąd dodawania użytkownika.')

    await runSearch(search.value)
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
    <UsersAddForm @submit="addUser" />
    <div class="users-list">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else-if="!isLoading && users.length === 0">Brak użytkowników.</p>
      <UserCard v-for="u in users" :key="u.id" :user="u" @delete="removeUser" />
    </div>
  </div>
</template>

<style scoped>
.users-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.error {
  grid-column: 1 / -1;
}
</style>
