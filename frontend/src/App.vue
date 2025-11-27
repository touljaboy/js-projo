<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Strona Główna</RouterLink>
      <RouterLink to="/groups">Grupy</RouterLink>
      <RouterLink to="/users">Użytkownicy</RouterLink>    
      <RouterLink to="/usergroups">Grupy użytkowników</RouterLink>

    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* Prosty styl dla nawigacji */
header {
  background-color: #333;
  padding: 1rem;
  margin-bottom: 2rem;
}

nav {
  display: flex;
  gap: 20px;
  justify-content: center;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

nav a:hover {
  text-decoration: underline;
  color: #42b883;
}

/* Styl dla aktywnego linku (Vue dodaje tę klasę automatycznie) */
nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>