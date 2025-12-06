<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const newUserName = ref("");
const newUserPass = ref("");

const onSubmit = () => {
  if (!newUserName.value.trim() || !newUserPass.value.trim()) return;

  emit("submit", {
    user: newUserName.value,
    password_hash: newUserPass.value,
  });

  newUserName.value = "";
  newUserPass.value = "";
};
</script>

<template>
  <form class="add-form" @submit.prevent="onSubmit">
    <input
      v-model="newUserName"
      placeholder="Login użytkownika..."
      type="text"
    />

    <input
      v-model="newUserPass"
      placeholder="Password hash..."
      type="text"
    />

    <button type="submit">Dodaj</button>
  </form>
</template>

<style scoped src="./UsersAddForm.css"></style>
