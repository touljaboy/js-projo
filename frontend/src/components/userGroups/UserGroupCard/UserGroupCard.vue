<script setup>
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

const props = defineProps({
  rel: { type: Object, required: true },
  formatDate: { type: Function, required: true },
});

const emit = defineEmits(["edit", "delete"]);
</script>

<template>
  <BaseCard as="article" class="card--rel">
    <div class="info">
      <div><strong>ID:</strong> {{ props.rel.id }}</div>
      <div><strong>User:</strong> {{ props.rel.user_id }}</div>
      <div><strong>Group:</strong> {{ props.rel.group_id }}</div>
      <div class="date">{{ props.formatDate(props.rel.joined_at) }}</div>
    </div>

    <div class="actions">
      <button class="edit-btn" @click="emit('edit', props.rel)">Edytuj</button>
      <button class="delete-btn" @click="emit('delete', props.rel.id)">Usuń</button>
    </div>
  </BaseCard>
</template>

<style scoped src="./UserGroupCard.css"></style>
