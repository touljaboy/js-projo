<script setup>
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import MessageCard from '@/components/messages/MessageCard/MessageCard.vue'
import MessagesAddForm from '@/components/messages/MessagesAddForm/MessagesAddForm.vue'

import { useMessages } from '@/composables/useMessages'

const { search, filteredMessages, sendMessage, removeMessage } = useMessages()
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
