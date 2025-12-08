<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/admin">Strona Główna</RouterLink>
      <RouterLink to="/admin/groups">Grupy</RouterLink>
      <RouterLink to="/admin/users">Użytkownicy</RouterLink>
      <RouterLink to="/admin/usergroups">Grupy użytkowników</RouterLink>
      <RouterLink to="/admin/conversations">Rozmowy</RouterLink>
      <RouterLink to="/admin/messages">Wiadomości</RouterLink>
    </nav>
  </header>
</template>

<style scoped src="./AdminHeader.css"></style>