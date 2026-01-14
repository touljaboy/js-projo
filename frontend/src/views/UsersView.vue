<script setup>
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import UserCard from '@/components/users/UserCard/UserCard.vue'
import UsersAddForm from '@/components/users/UsersAddForm/UsersAddForm.vue'

import { useUsers } from '@/composables/useUsers'

const {
  search,
  users,
  isLoading,
  error,
  addUser,
  updateUser,
  removeUser
} = useUsers()
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
      <UserCard 
        v-for="u in users" 
        :key="u.id" 
        :user="u" 
        @update="updateUser"
        @delete="removeUser" 
      />
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

/* Responsive grid */
@media (max-width: 768px) {
  .users-list {
    grid-template-columns: 1fr;
  }
}
</style>
