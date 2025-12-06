<script setup>
import { ref, onMounted, computed  } from "vue";
import PageHeader from "@/components/common/PageHeader/PageHeader.vue";


const API_URL = "http://localhost:3000/v1/messages"; 

const messages = ref([]);

const search = ref("");

const filteredMessages = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return messages.value;

  return messages.value.filter((m) => {
    const sender = String(m.sender_id ?? "").toLowerCase();
    const conv = String(m.conversation_id ?? "").toLowerCase();
    const content = String(m.message_content ?? "").toLowerCase();

    return (
      sender.includes(q) ||
      conv.includes(q) ||
      content.includes(q)
    );
  });
});

const conversationId = ref("");
const senderId = ref("");
const content = ref("");


const loadMessages = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Nie udało się pobrać wiadomości.");
    messages.value = await res.json();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const sendMessage = async () => {
  if (!conversationId.value || !senderId.value || !content.value) return;

  try {
    const payload = {
      conversation_id: parseInt(conversationId.value),
      sender_id: parseInt(senderId.value),
      receiver_group_id: null, 
      message_content: content.value,

    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Błąd wysyłania wiadomości.");

    messages.value.push(data);


    content.value = "";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const removeMessage = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd usuwania.");
    }
    messages.value = messages.value.filter((m) => m.message_id !== id);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

onMounted(loadMessages);
</script>

<template>
  <div class="container">
    <PageHeader
      title="Wiadomości"
      v-model="search"
      searchPlaceholder="Wyszukaj..."
    />

    <div class="add-form">
      <div class="inputs-row">
          <input v-model="conversationId" placeholder="ID Rozmowy" type="number" style="width: 100px;" />
          <input v-model="senderId" placeholder="ID Nadawcy" type="number" style="width: 100px;" />
      </div>
      <input
        v-model="content"
        placeholder="Treść wiadomości..."
        type="text"
        @keyup.enter="sendMessage"
        style="width: 100%;"
      />
      <button @click="sendMessage">Wyślij</button>
    </div>

    <div class="messages-list">
      <p v-if="filteredMessages.length === 0" class="muted">
        Brak wiadomości do wyświetlenia.
      </p>
      <div v-for="m in filteredMessages" :key="m.message_id" class="msg-card">
        <div class="msg-header">
            <span class="sender">User ID: {{ m.sender_id }}</span>
            <span class="meta">Conv ID: {{ m.conversation_id }} | {{ new Date(m.sent_at).toLocaleString() }}</span>
        </div>
        <div class="msg-body">
            {{ m.message_content }}
        </div>
        <button class="delete-btn-sm" @click="removeMessage(m.message_id)">x</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 700px; margin: 0 auto; font-family: sans-serif; }


.add-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; padding: 20px; background: #f0f0f0; border-radius: 8px; }
.inputs-row { display: flex; gap: 10px; }
.add-form input { padding: 8px; }
.add-form button { padding: 8px 16px; background: #42b883; color: white; border: none; cursor: pointer; border-radius: 4px; align-self: flex-start;}
.add-form button:hover { background: #33a06f; }

.messages-list { display: flex; flex-direction: column; gap: 10px; }
.msg-card { border: 1px solid #ddd; border-radius: 8px; background: white; padding: 10px; position: relative; }

.msg-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #666; }
.sender { font-weight: bold; color: #333; }
.msg-body { font-size: 15px; }

.delete-btn-sm { 
    position: absolute; top: 5px; right: 5px; 
    background: transparent; color: #ff4444; border: 1px solid #ff4444; 
    border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; 
    display: flex; align-items: center; justify-content: center;
}
.delete-btn-sm:hover { background: #ff4444; color: white; }
</style>