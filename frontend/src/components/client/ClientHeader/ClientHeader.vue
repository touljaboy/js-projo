<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Strona Główna</RouterLink>
      <!-- <RouterLink to="/groups">Grupy</RouterLink>
      <RouterLink to="/conversations">Rozmowy</RouterLink>
      <RouterLink to="/messages">Wiadomości</RouterLink> -->
    </nav>
  </header>
</template>

<style scoped src="./ClientHeader.css"></style>