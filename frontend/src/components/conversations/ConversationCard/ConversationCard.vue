<script setup>
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

const props = defineProps({
  conv: { type: Object, required: true },
});

const emit = defineEmits(["delete"]);
</script>

<template>
  <BaseCard as="article" class="card--conv">
    <h3>Chat #{{ props.conv.id }}</h3>

    <p class="muted">
      Uczestnicy:
      <strong>ID {{ props.conv.user_a_id }}</strong>
      oraz
      <strong>ID {{ props.conv.user_b_id }}</strong>
    </p>

    <p v-if="props.conv.last_message_at" class="date-info">
      Ostatnia aktywność:
      {{ new Date(props.conv.last_message_at).toLocaleString() }}
    </p>
    <p v-else class="date-info">Brak wiadomości</p>

    <button class="delete-btn" @click="emit('delete', props.conv.id)">
      Usuń
    </button>
  </BaseCard>
</template>

<style scoped src="./ConversationCard.css"></style>
