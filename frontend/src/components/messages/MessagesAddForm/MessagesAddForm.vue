<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const conversationId = ref("");
const senderId = ref("");
const content = ref("");

const onSubmit = () => {
  if (!conversationId.value || !senderId.value || !content.value.trim()) return;

  emit("submit", {
    conversation_id: Number(conversationId.value),
    sender_id: Number(senderId.value),
    receiver_group_id: null,
    message_content: content.value,
  });

  // reset pól po wysłaniu
  content.value = "";
};
</script>

<template>
  <form class="add-form add-form--column" @submit.prevent="onSubmit">
    <div class="inputs-row">
      <input
        v-model="conversationId"
        placeholder="ID Rozmowy"
        type="number"
        style="width: 100px;"
      />
      <input
        v-model="senderId"
        placeholder="ID Nadawcy"
        type="number"
        style="width: 100px;"
      />
    </div>

    <input
      v-model="content"
      placeholder="Treść wiadomości..."
      type="text"
      style="width: 100%;"
    />

    <button type="submit">Wyślij</button>
  </form>
</template>

<style scoped src="./MessagesAddForm.css"></style>
