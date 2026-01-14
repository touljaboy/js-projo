<script setup>
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import UserGroupCard from '@/components/userGroups/UserGroupCard/UserGroupCard.vue'
import UserGroupsAddForm from '@/components/userGroups/UserGroupsAddForm/UserGroupsAddForm.vue'

import { useUserGroups } from '@/composables/useUserGroups'

const {
  search,
  filteredUserGroups,
  formUserId,
  formGroupId,
  editingId,
  createRel,
  updateRel,
  deleteRel,
  startEdit,
  resetForm,
  formatDate
} = useUserGroups()
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

/* Responsive grid */
@media (max-width: 768px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
