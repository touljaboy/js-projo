<script setup>
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import ConversationCard from '@/components/conversations/ConversationCard/ConversationCard.vue'
import ConversationsAddForm from '@/components/conversations/ConversationsAddForm/ConversationsAddForm.vue'

import { useConversations } from '@/composables/useConversations'

const {
  search,
  filteredConversations,
  addConversation,
  removeConversation,
} = useConversations()


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
