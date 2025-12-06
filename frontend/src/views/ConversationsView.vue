<script setup>
import { ref, onMounted, computed } from "vue";
import PageHeader from "@/components/common/PageHeader/PageHeader.vue";


// URL do API Conversations
const API_URL = "http://localhost:3000/v1/convs"; 

const conversations = ref([]);
const search = ref("");

// logikę ładowania wyodrębnić poza widoki (composable, na ostatnim wykładzie), a tu sam view i obsługa
// pomyśleć czy rozbić na komponenty (nadanie struktury), np komponent nagłówka i wtedy łatwiej modularnie dodawać
// README zaaktualizować

const userA = ref("");
const userB = ref("");


const loadConversations = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Nie udało się pobrać rozmów.");
    conversations.value = await res.json();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const filteredConversations = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return conversations.value;

  return conversations.value.filter((c) => {
    const id = String(c.id ?? "").toLowerCase();
    const a = String(c.user_a_id ?? "").toLowerCase();
    const b = String(c.user_b_id ?? "").toLowerCase();

    return id.includes(q) || a.includes(q) || b.includes(q);
  });
});

const addConversation = async () => {
  if (!userA.value || !userB.value) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_a_id: parseInt(userA.value), 
        user_b_id: parseInt(userB.value),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Błąd tworzenia rozmowy.");

    conversations.value.push(data);


    userA.value = "";
    userB.value = "";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const removeConversation = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd usuwania.");
    }

    conversations.value = conversations.value.filter((c) => c.id !== id);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

onMounted(loadConversations);
</script>

<template>
  <div class="container">
    <PageHeader
      title="Konwersacje"
      v-model="search"
      searchPlaceholder="Wyszukaj..."
    />
    <div class="add-form">
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
      <button @click="addConversation">Utwórz Chat</button>
    </div>

    <div class="list-grid">
      <p v-if="filteredConversations.length === 0" class="muted">
        Brak konwersacji do wyświetlenia.
      </p>

      <div v-for="c in filteredConversations" :key="c.id" class="card">
        <div class="card-content">
          <h3>Chat #{{ c.id }}</h3>
          <p class="muted">
             Uczestnicy: <strong>ID {{ c.user_a_id }}</strong> oraz <strong>ID {{ c.user_b_id }}</strong>
          </p>
          <p v-if="c.last_message_at" class="date-info">
             Ostatnia aktywność: {{ new Date(c.last_message_at).toLocaleString() }}
          </p>
          <p v-else class="date-info">Brak wiadomości</p>

          <button class="delete-btn" @click="removeConversation(c.id)">Usuń</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container { max-width: 700px; margin: 0 auto; font-family: sans-serif; }
.add-form { display: flex; gap: 10px; margin-bottom: 20px; padding: 20px; background: #f0f0f0; border-radius: 8px; align-items: center; }
.add-form input { padding: 8px; flex-grow: 1; }
.add-form button { padding: 8px 16px; background: #42b883; color: white; border: none; cursor: pointer; border-radius: 4px; }
.add-form button:hover { background: #33a06f; }
.list-grid { display: grid; grid-template-columns: 1fr; gap: 15px; } 
.card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white; }
.card-content { padding: 12px; }
.muted { color: #666; font-size: 14px; margin: 5px 0; }
.date-info { font-size: 12px; color: #888; font-style: italic; margin-bottom: 10px;}
.delete-btn { background: #ff4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
</style>