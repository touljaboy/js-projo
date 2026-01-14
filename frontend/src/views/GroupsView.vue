<script setup>
import PageHeader from '@/components/common/PageHeader/PageHeader.vue'
import GroupCard from '@/components/groups/GroupCard/GroupCard.vue'
import GroupsAddForm from '@/components/groups/GroupsAddForm/GroupsAddForm.vue'

import { useGroups } from '@/composables/useGroups'

const {
  groups,
  search,
  filteredGroups,
  fetchGroups,
  addGroup,
  removeGroup
} = useGroups()
</script>

<template>
  <div class="container">
    <PageHeader title="Grupy" v-model="search" searchPlaceholder="Wyszukaj..." />

    <GroupsAddForm @submit="addGroup" />

    <div class="groups-list">
      <p v-if="filteredGroups.length === 0">Ładowanie lub brak grup...</p>

      <GroupCard
        v-for="g in filteredGroups"
        :key="g.id"
        :group="g"
        @delete="removeGroup"
      />
    </div>
  </div>
</template>

<style scoped>
.groups-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Responsive grid */
@media (max-width: 768px) {
  .groups-list {
    grid-template-columns: 1fr;
  }
}
</style>
