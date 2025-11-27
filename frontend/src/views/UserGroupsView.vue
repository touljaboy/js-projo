<script setup>
import { ref, onMounted } from "vue";

const API_URL = "http://localhost:3000/v1/usergroups";

// lista relacji
const userGroups = ref([]);

// filtry (query params)
const filterUserId = ref("");
const filterGroupId = ref("");

// pobieranie relacji (z filtrami)
const loadUserGroups = async () => {
  try {
    const params = new URLSearchParams();

const userIdStr = String(filterUserId.value ?? "").trim();
const groupIdStr = String(filterGroupId.value ?? "").trim();

if (userIdStr !== "") params.append("user_id", userIdStr);
if (groupIdStr !== "") params.append("group_id", groupIdStr);

    const url = params.toString()
      ? `${API_URL}?${params.toString()}`
      : API_URL;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Nie udało się pobrać relacji user-groups.");

    userGroups.value = await res.json();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// helper do ładnego formatu daty
const formatDate = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

onMounted(loadUserGroups);
</script>

<template>
  <div class="container">
    <h1>Grupy uzytkownikow</h1>

    <!-- Filtry -->
    <div class="filters">
      <input
        v-model="filterUserId"
        type="number"
        placeholder="Filtruj po id uzytkownika"
        @keyup.enter="loadUserGroups"
      />

      <input
        v-model="filterGroupId"
        type="number"
        placeholder="Filtruj po id grupy"
        @keyup.enter="loadUserGroups"
      />

      <button @click="loadUserGroups">Filtruj</button>
      <button class="secondary" @click="filterUserId=''; filterGroupId=''; loadUserGroups()">
        Wyczyść
      </button>
    </div>

    <!-- Lista -->
    <div class="list">
      <p v-if="userGroups.length === 0">Brak relacji do wyświetlenia.</p>

      <div v-for="rel in userGroups" :key="rel.id" class="card">
        <div class="row">
          <span class="label">ID relacji:</span>
          <span>{{ rel.id }}</span>
        </div>

        <div class="row">
          <span class="label">user_id:</span>
          <span>{{ rel.user_id }}</span>
        </div>

        <div class="row">
          <span class="label">group_id:</span>
          <span>{{ rel.group_id }}</span>
        </div>

        <div class="row muted">
          <span class="label">joined_at:</span>
          <span>{{ formatDate(rel.joined_at) }}</span>
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

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f0f0f0;
  border-radius: 8px;
  align-items: center;
}

.filters input {
  padding: 8px;
  flex: 1;
  min-width: 120px;
}

.filters button {
  padding: 8px 14px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.filters button.secondary {
  background: #999;
}

.filters button:hover {
  filter: brightness(0.95);
}

.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  padding: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.label {
  font-weight: 600;
}

.muted {
  color: #666;
  font-size: 13px;
  
}
</style>
