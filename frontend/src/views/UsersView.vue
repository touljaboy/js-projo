<script setup>
import { ref, onMounted } from "vue";

// jeśli nie używasz axiosa, to możesz go wywalić i zostać przy fetch
// import axios from "axios";

// Bazowy URL do API
const API_URL = "http://localhost:3000/v1/users"; 
// ^ zmień port/prefix jeśli masz inaczej

// stan listy usersów
const users = ref([]);

// formularz dodawania
const newUserName = ref("");
const newUserPass = ref("");

// ładowanie usersów z backendu
const loadUsers = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Nie udało się pobrać usersów.");
    users.value = await res.json();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// dodawanie usera
const addUser = async () => {
  if (newUserName.value.trim() === "" || newUserPass.value.trim() === "") return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: newUserName.value,
        password_hash: newUserPass.value, 
        // tu przekazujesz hash (mockowo tekst)
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Błąd dodawania użytkownika.");

    // dopisz nowego usera do listy bez przeładowywania
    users.value.push(data);

    // czyścimy formularz
    newUserName.value = "";
    newUserPass.value = "";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// usuwanie usera
const removeUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Błąd usuwania użytkownika.");

    users.value = users.value.filter((u) => u.id !== id);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

onMounted(loadUsers);
</script>

<template>
  <div class="container">
    <h1>Użytkownicy</h1>

    <div class="add-form">
      <input
        v-model="newUserName"
        placeholder="Login użytkownika..."
        type="text"
        @keyup.enter="addUser"
      />

      <input
        v-model="newUserPass"
        placeholder="Password hash..."
        type="text"
        @keyup.enter="addUser"
      />

      <button @click="addUser">Dodaj</button>
    </div>

    <div class="users-list">
      <p v-if="users.length === 0">Brak użytkowników.</p>

      <div v-for="u in users" :key="u.id" class="card">
        <div class="card-content">
          <h3>{{ u.user }}</h3>
          <p class="muted">ID: {{ u.id }}</p>
          <p class="muted">Created: {{ new Date(u.created_at).toLocaleString() }}</p>

          <p class="hash">hash: {{ u.password_hash }}</p>

          <button class="delete-btn" @click="removeUser(u.id)">
            Usuń
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  font-family: sans-serif;
}

.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  align-items: center;
}

.add-form input[type="text"] {
  padding: 8px;
  flex-grow: 1;
}

.add-form button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.add-form button:hover {
  background: #33a06f;
}

.users-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.card-content {
  padding: 12px;
}

.hash {
  font-family: monospace;
  background: #fafafa;
  padding: 6px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 8px;
}

.muted {
  color: #666;
  font-size: 13px;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
