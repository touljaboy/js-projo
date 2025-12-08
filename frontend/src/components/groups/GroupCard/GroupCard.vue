<script setup>
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

defineProps({
  group: { type: Object, required: true },
});

defineEmits(["delete"]);
</script>

<template>
  <BaseCard as="article" class="card--group">
    <img :src="group.image" alt="Obrazek grupy" />

    <h3>{{ group.name }}</h3>
    <p>
      Status:
      <span v-if="group.isPublic">🔓 Publiczna</span>
      <span v-else>🔒 Prywatna</span>
    </p>

    <small class="muted">ID: {{ group.id }}</small>

    <button class="delete-btn" @click="$emit('delete', group.id)">
      Usuń
    </button>
  </BaseCard>
</template>

<style scoped src="./GroupCard.css"></style>
