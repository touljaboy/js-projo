<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import ConversationCard from '@/components/conversations/ConversationCard/ConversationCard.vue'
import ConversationsAddForm from '@/components/conversations/ConversationsAddForm/ConversationsAddForm.vue'

// URL do API Conversations
const API_URL = 'http://localhost:3000/v1/convs'

const conversations = ref([])
const search = ref('')

// logikę ładowania wyodrębnić poza widoki (composable, na ostatnim wykładzie), a tu sam view i obsługa
// pomyśleć czy rozbić na komponenty (nadanie struktury), np komponent nagłówka i wtedy łatwiej modularnie dodawać
// README zaaktualizować

const loadConversations = async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Nie udało się pobrać rozmów.')
    conversations.value = await res.json()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const filteredConversations = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return conversations.value

  return conversations.value.filter((c) => {
    const id = String(c.id ?? '').toLowerCase()
    const a = String(c.user_a_id ?? '').toLowerCase()
    const b = String(c.user_b_id ?? '').toLowerCase()

    return id.includes(q) || a.includes(q) || b.includes(q)
  })
})

const addConversation = async (payload) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Błąd tworzenia rozmowy.')

    conversations.value.push(data)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const removeConversation = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Błąd usuwania.')
    }

    conversations.value = conversations.value.filter((c) => c.id !== id)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

onMounted(loadConversations)
</script>

<template>
  <div class="container">
    <PageHeader title="Rozmowy" v-model="search" searchPlaceholder="Wyszukaj..." />
    <ConversationsAddForm @submit="addConversation" />
    <div class="list-grid">
      <p v-if="filteredConversations.length === 0" class="muted">
        Brak konwersacji do wyświetlenia.
      </p>
      <ConversationCard
        v-for="c in filteredConversations"
        :key="c.id"
        :conv="c"
        @delete="removeConversation"
      />
    </div>
  </div>
</template>

<style scoped>
.list-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}
</style>
