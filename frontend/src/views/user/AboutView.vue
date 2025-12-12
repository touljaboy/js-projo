<script setup>
import { ref, computed } from 'vue'

const currentUser = ref('user1, user2')
const searchFriends = ref('')
const searchAdd = ref('')

const friendsList = ref([
  { id: 1, name: 'Carl Johnson', initials: 'CJ' },
  { id: 2, name: 'Kevin Lux', initials: 'KL' },
  { id: 3, name: 'Gabriel Barilla', initials: 'GB' },
  { id: 4, name: 'Ebenezer Frickface', initials: 'EF' },
  { id: 5, name: 'Kyle Gass', initials: 'KG' },
  { id: 6, name: 'Michael Jackson', initials: 'MJ' },
])

// Filtry po lewej i prawej kolumnie
const filteredFriends = computed(() =>
  friendsList.value.filter(f =>
    f.name.toLowerCase().includes(searchFriends.value.toLowerCase())
  )
)

const filteredAddable = computed(() =>
  friendsList.value.filter(f =>
    f.name.toLowerCase().includes(searchAdd.value.toLowerCase())
  )
)

const addFriend = (friend) => {
  alert(`Dodano kolegę: ${friend.name}`)
  // Tutaj możesz dodać logikę dodawania do listy znajomych backendowo
}
</script>

<template>
  <div class="container">
    <header class="header">
      <small>{{ currentUser }}</small>
      <small class="site-name">Site name</small>
      <nav>
        <ul>
          <li><a href="#">Channels</a></li>
          <li><a href="#">Friends</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#" class="active">About</a></li>
        </ul>
      </nav>
    </header>

    <h1>Hello GUYS!</h1>

    <div class="friends-wrapper">
      <div class="friends-list">
        <input
          type="search"
          v-model="searchFriends"
          placeholder="Wyszukaj kolegę"
          aria-label="Wyszukaj kolegę"
        />
        <ul>
          <li v-for="friend in filteredFriends" :key="friend.id">
            <div class="avatar">{{ friend.initials }}</div>
            <span>{{ friend.name }}</span>
          </li>
        </ul>
      </div>

      <div class="friends-add">
        <input
          type="search"
          v-model="searchAdd"
          placeholder="Dodaj kolegę"
          aria-label="Dodaj kolegę"
        />
        <ul>
          <li v-for="friend in filteredAddable" :key="friend.id">
            <button @click="addFriend(friend)" class="add-btn">ADD</button>
            <span>{{ friend.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <footer class="footer">
      <small>Site name</small>
      <div class="social-icons">
        <span>🐦</span> <span>🔗</span> <span>📸</span> <span>🎥</span>
      </div>
      <small>Authors, Date</small>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  color: #000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.header small {
  flex: 1;
}

.site-name {
  font-weight: bold;
  text-align: center;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

nav ul li a {
  text-decoration: none;
  color: black;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

nav ul li a.active,
nav ul li a:hover {
  background-color: black;
  color: white;
}

h1 {
  margin-bottom: 2rem;
}

.friends-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.friends-list,
.friends-add {
  flex: 1;
}

.friends-list input,
.friends-add input {
  width: 100%;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 9999px;
  border: 1px solid #ccc;
}

.friends-list ul,
.friends-add ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friends-list li,
.friends-add li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.avatar {
  background-color: #ccc;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: bold;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-btn {
  background-color: #a6f0a6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
  color: black;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #8add8a;
}

.footer {
  margin-top: 3rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  text-align: center;
  color: gray;
  font-size: 0.8rem;
}

.social-icons {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
