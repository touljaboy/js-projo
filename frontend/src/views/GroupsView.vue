<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'


const API_URL = 'http://localhost:3000/v1/groups'

const groups = ref([])

const search = ref('')

const newGroupName = ref('')
const newGroupIsPublic = ref(false)

const getImageUrl = (name) => {
  return `https://picsum.photos/seed/${name}/200/150`
}

const fetchGroups = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    
    groups.value = data.map(group => ({
      ...group,
      isPublic: group.is_public, 
      image: getImageUrl(group.name) 
    }))
  } catch (error) {
    console.error("Błąd pobierania grup:", error)
  }
}

const filteredGroups = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return groups.value

  return groups.value.filter(g => {
    const name = String(g.name ?? '').toLowerCase()
    const id = String(g.id ?? '').toLowerCase()
    return name.includes(q) || id.includes(q)
  })
})


const addGroup = async () => {
  if (newGroupName.value.trim() === '') return

  const payload = {
    name: newGroupName.value,
    isPublic: newGroupIsPublic.value
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const savedGroup = await response.json()
      
      groups.value.push({
        ...savedGroup,
        isPublic: savedGroup.is_public,
        image: getImageUrl(savedGroup.name)
      })

      newGroupName.value = ''
      newGroupIsPublic.value = false
    }
  } catch (error) {
    console.error("Błąd dodawania grupy:", error)
  }
}

const removeGroup = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      groups.value = groups.value.filter(group => group.id !== id)
    }
  } catch (error) {
    console.error("Błąd usuwania grupy:", error)
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<template>
    <div class="container">
        <PageHeader
          title="Grupy"
          v-model="search"
          searchPlaceholder="Wyszukaj..."
        />

        <div class="add-form">
            <input 
            v-model="newGroupName" 
            placeholder="Wpisz nazwę grupy..." 
            type="text"
            @keyup.enter="addGroup" 
            />

            <label>
            <input type="checkbox" v-model="newGroupIsPublic">
            Publiczna?
            </label>

            <button @click="addGroup">Dodaj</button>
        </div>

        <div class="groups-list">
            <p v-if="filteredGroups.length === 0" class="muted">
              Ładowanie lub brak grup...
            </p>
            <div v-for="group in filteredGroups" :key="group.id" class="card">
                <img :src="group.image" alt="Obrazek grupy" />

                <div class="card-content">
                    <h3>{{ group.name }}</h3>
                    <p>
                    Status: 
                    <span v-if="group.isPublic">🔓 Publiczna</span>
                    <span v-else>🔒 Prywatna</span>
                    </p>
                    <small style="color: grey;">ID: {{ group.id }}</small>

                    <button class="delete-btn" @click="removeGroup(group.id)">Usuń</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 0 auto; font-family: sans-serif; }
.add-form { display: flex; gap: 10px; margin-bottom: 20px; padding: 20px; background: #f0f0f0; border-radius: 8px; align-items: center; }
.add-form input[type="text"] { padding: 8px; flex-grow: 1; }
.add-form button { padding: 8px 16px; background: #42b883; color: white; border: none; cursor: pointer; border-radius: 4px; }
.add-form button:hover { background: #33a06f; }

.groups-list { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.card img { width: 100%; height: 150px; object-fit: cover; }
.card-content { padding: 10px; display: flex; flex-direction: column;}
.delete-btn { background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;}
</style>