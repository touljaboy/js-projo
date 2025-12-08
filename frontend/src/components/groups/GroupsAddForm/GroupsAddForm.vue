<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const newGroupName = ref("");
const newGroupIsPublic = ref(false);

const onSubmit = () => {
  if (!newGroupName.value.trim()) return;

  emit("submit", {
    name: newGroupName.value,
    isPublic: newGroupIsPublic.value,
  });

  // reset
  newGroupName.value = "";
  newGroupIsPublic.value = false;
};
</script>

<template>
  <form class="add-form" @submit.prevent="onSubmit">
    <input
      v-model="newGroupName"
      placeholder="Wpisz nazwę grupy..."
      type="text"
    />

    <label class="checkbox">
      <input type="checkbox" v-model="newGroupIsPublic" />
      Publiczna?
    </label>

    <button type="submit">Dodaj</button>
  </form>
</template>

<style scoped src="./GroupsAddForm.css"></style>
