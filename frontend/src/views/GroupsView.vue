<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import GroupCard from '@/components/groups/GroupCard/GroupCard.vue'
import GroupsAddForm from '@/components/groups/GroupsAddForm/GroupsAddForm.vue'

const API_URL = 'http://localhost:3000/v1/groups'

const groups = ref([])

const search = ref('')

const getImageUrl = (name) => {
  return `https://picsum.photos/seed/${name}/200/150`
}

const fetchGroups = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()

    groups.value = data.map((group) => ({
      ...group,
      isPublic: group.is_public,
      image: getImageUrl(group.name),
    }))
  } catch (error) {
    console.error('Błąd pobierania grup:', error)
  }
}

const filteredGroups = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return groups.value

  return groups.value.filter((g) => {
    const name = String(g.name ?? '').toLowerCase()
    const id = String(g.id ?? '').toLowerCase()
    return name.includes(q) || id.includes(q)
  })
})

const addGroup = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        is_public: payload.isPublic,
      }),
    })

    if (response.ok) {
      const savedGroup = await response.json()

      groups.value.push({
        ...savedGroup,
        isPublic: savedGroup.is_public,
        image: getImageUrl(savedGroup.name),
      })
    } else {
      const err = await response.json()
      console.error('Błąd backendu:', err)
    }
  } catch (error) {
    console.error('Błąd dodawania grupy:', error)
  }
}

const removeGroup = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      groups.value = groups.value.filter((group) => group.id !== id)
    }
  } catch (error) {
    console.error('Błąd usuwania grupy:', error)
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<template>
  <div class="container">
    <PageHeader title="Grupy" v-model="search" searchPlaceholder="Wyszukaj..." />
    
    <GroupsAddForm @submit="addGroup" />

    <div class="groups-list">
    <p v-if="groups.length === 0">Ładowanie lub brak grup...</p>
      <GroupCard v-for="g in filteredGroups" :key="g.id" :group="g" @delete="removeGroup" />
    </div>
  </div>
</template>

<style scoped>
.groups-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
</style>
