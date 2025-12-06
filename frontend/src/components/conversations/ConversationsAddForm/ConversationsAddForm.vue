<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const userA = ref("");
const userB = ref("");

const onSubmit = () => {
  if (!userA.value || !userB.value) return;

  emit("submit", {
    user_a_id: Number(userA.value),
    user_b_id: Number(userB.value),
  });

  userA.value = "";
  userB.value = "";
};
</script>

<template>
  <form class="add-form" @submit.prevent="onSubmit">
    <input
      v-model="userA"
      placeholder="ID User A"
      type="number"
    />
    <input
      v-model="userB"
      placeholder="ID User B"
      type="number"
    />
    <button type="submit">Utwórz Chat</button>
  </form>
</template>

<style scoped src="./ConversationsAddForm.css"></style>
