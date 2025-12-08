<script setup>
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(["delete"]);
</script>

<template>
  <BaseCard as="article" class="card--user">
    <h3>{{ props.user.user }}</h3>

    <p class="muted">ID: {{ props.user.id }}</p>
    <p class="muted">
      Created: {{ new Date(props.user.created_at).toLocaleString() }}
    </p>

    <p class="hash">hash: {{ props.user.password_hash }}</p>

    <button class="delete-btn" @click="emit('delete', props.user.id)">
      Usuń
    </button>
  </BaseCard>
</template>
