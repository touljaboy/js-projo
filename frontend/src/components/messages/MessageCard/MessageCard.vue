<script setup>
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

defineProps({
  message: { type: Object, required: true },
});

defineEmits(["delete"]);
</script>

<template>
  <BaseCard class="card--msg">
    <div class="msg-header">
      <span class="sender">User ID: {{ message.sender_id }}</span>
      <span class="meta">
        Conv ID: {{ message.conversation_id }} |
        {{ new Date(message.sent_at).toLocaleString() }}
      </span>
    </div>

    <div class="msg-body">
      {{ message.message_content }}
    </div>

    <button class="delete-btn" @click="$emit('delete', message.message_id)">
      Usuń
    </button>
  </BaseCard>
</template>

<style scoped src="./MessageCard.css"></style>

