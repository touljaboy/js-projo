<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import UserGroupCard from '@/components/userGroups/UserGroupCard/UserGroupCard.vue'
import UserGroupsAddForm from '@/components/userGroups/UserGroupsAddForm/UserGroupsAddForm.vue'

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

const createRel = async (payload) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error('Błąd dodawania')
    await loadUserGroups()
    resetForm()
  } catch (err) {
    alert(err.message)
  }
}

const updateRel = async (payload) => {
  if (!editingId.value) return

  try {
    const res = await fetch(`${API_URL}/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    <PageHeader title="Grupy użytkowników" v-model="search" searchPlaceholder="Wyszukaj..." />

    <UserGroupsAddForm
      :editingId="editingId"
      :initialUserId="formUserId"
      :initialGroupId="formGroupId"
      @create="createRel"
      @update="updateRel"
      @cancel="resetForm"
    />

    <div class="list">
      <p v-if="filteredUserGroups.length === 0" class="muted">Brak relacji do wyświetlenia.</p>
      <UserGroupCard
        v-for="rel in filteredUserGroups"
        :key="rel.id"
        :rel="rel"
        :formatDate="formatDate"
        @edit="startEdit"
        @delete="deleteRel"
      />
    </div>
  </div>
</template>

<style scoped>
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

.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>
