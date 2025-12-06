<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'

const API_URL = 'http://localhost:3000/v1/usergroups'

const userGroups = ref([])

const search = ref('')

const filteredUserGroups = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return userGroups.value

  return userGroups.value.filter((rel) => {
    const u = String(rel.user_id ?? '').toLowerCase()
    const g = String(rel.group_id ?? '').toLowerCase()
    return u.includes(q) || g.includes(q)
  })
})

const formUserId = ref('')
const formGroupId = ref('')
const editingId = ref(null)

const loadUserGroups = async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Błąd pobierania')
    userGroups.value = await res.json()
  } catch (err) {
    alert(err.message)
  }
}

const createRel = async () => {
  if (!formUserId.value || !formGroupId.value) return

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: Number(formUserId.value),
        group_id: Number(formGroupId.value),
      }),
    })

    if (!res.ok) throw new Error('Błąd dodawania')
    await loadUserGroups()
    resetForm()
  } catch (err) {
    alert(err.message)
  }
}

const updateRel = async () => {
  if (!editingId.value) return

  try {
    const res = await fetch(`${API_URL}/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: Number(formUserId.value),
        group_id: Number(formGroupId.value),
      }),
    })

    if (!res.ok) throw new Error('Błąd aktualizacji')
    await loadUserGroups()
    resetForm()
  } catch (err) {
    alert(err.message)
  }
}

const deleteRel = async (id) => {
  if (!confirm('Usunąć?')) return

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Błąd usuwania')

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
</script>

<template>
  <div class="container">
    <PageHeader
      title="UserGroups"
      v-model="search"
      searchPlaceholder="Wyszukaj..."
    />

    <div class="panel form" :class="{ editing: editingId }">
      <h3>{{ editingId ? 'Edycja relacji #' + editingId : 'Nowa relacja' }}</h3>
      <div class="inputs">
        <input v-model="formUserId" type="number" placeholder="Podaj ID Usera" />
        <input v-model="formGroupId" type="number" placeholder="Podaj ID Grupy" />

        <button v-if="!editingId" @click="createRel" class="primary">Dodaj</button>
        <div v-else>
          <button @click="updateRel" class="warning">Zapisz</button>
          <button @click="resetForm" class="secondary">Anuluj</button>
        </div>
      </div>
    </div>

    <div class="list">
      <p v-if="filteredUserGroups.length === 0" class="muted">Brak relacji do wyświetlenia.</p>
      <div v-for="rel in filteredUserGroups" :key="rel.id" class="card">
        <div class="info">
          <div><strong>ID:</strong> {{ rel.id }}</div>
          <div><strong>User:</strong> {{ rel.user_id }}</div>
          <div><strong>Group:</strong> {{ rel.group_id }}</div>
          <div class="date">{{ formatDate(rel.joined_at) }}</div>
        </div>
        <div class="actions">
          <button @click="startEdit(rel)" class="edit-btn">Edytuj</button>
          <button @click="deleteRel(rel.id)" class="delete-btn">Usuń</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}
.panel {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
.form.editing {
  border-color: #ffa500;
  background: #fff8e1;
}
.inputs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background: #42b883;
}
button.secondary {
  background: #777;
}
button.warning {
  background: #ffa500;
  color: black;
}
button.edit-btn {
  background: #3498db;
  margin-right: 5px;
}
button.delete-btn {
  background: #e74c3c;
}

.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}
.date {
  font-size: 0.85em;
  color: #666;
  margin-top: 5px;
}
.actions {
  display: flex;
}
</style>
