<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import MessageCard from '@/components/messages/MessageCard/MessageCard.vue'
import MessagesAddForm from '@/components/messages/MessagesAddForm/MessagesAddForm.vue'

const API_URL = 'http://localhost:3000/v1/messages'

const messages = ref([])

const search = ref('')

const filteredMessages = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return messages.value

  return messages.value.filter((m) => {
    const sender = String(m.sender_id ?? '').toLowerCase()
    const conv = String(m.conversation_id ?? '').toLowerCase()
    const content = String(m.message_content ?? '').toLowerCase()

    return sender.includes(q) || conv.includes(q) || content.includes(q)
  })
})

const loadMessages = async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Nie udało się pobrać wiadomości.')
    messages.value = await res.json()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const sendMessage = async (payload) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Błąd wysyłania wiadomości.')

    messages.value.push(data)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const removeMessage = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Błąd usuwania.')
    }
    messages.value = messages.value.filter((m) => m.message_id !== id)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

onMounted(loadMessages)
</script>

<template>
  <div class="container">
    <PageHeader title="Wiadomości" v-model="search" searchPlaceholder="Wyszukaj..." />

    <MessagesAddForm @submit="sendMessage" />

    <MessageCard
      v-for="m in filteredMessages"
      :key="m.message_id"
      :message="m"
      @delete="removeMessage"
    />
  </div>
</template>

<style scoped>
.inputs-row {
  display: flex;
  gap: 10px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
