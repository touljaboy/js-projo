<script setup>
import { defineProps, defineEmits, nextTick, watch, ref, onMounted } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true
  },
  messages: {
    type: Array,
    required: true
  },
  newMessage: {
    type: String,
    default: ''
  },
  getUserName: {
    type: Function,
    required: true
  },
  hasMoreMessages: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'update:newMessage', 'loadMore'])

const messagesContainer = ref(null)
const isLoadingMore = ref(false)
const isInitialLoad = ref(true)

// Przewiń do dołu po załadowaniu wiadomości
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Przy pierwszym załadowaniu - scrolluj na dół
onMounted(() => {
  scrollToBottom()
  isInitialLoad.value = false
})

// Obserwuj zmiany w wiadomościach
let previousMessageCount = 0
watch(() => props.messages.length, (newCount) => {
  const isNewMessage = newCount > previousMessageCount
  previousMessageCount = newCount
  
  // Scrolluj do dołu tylko jeśli to nowe wiadomości (nie "load more")
  if (isNewMessage && !isLoadingMore.value) {
    scrollToBottom()
  }
  isLoadingMore.value = false
})

// Przewiń do dołu po wysłaniu wiadomości
const handleSend = () => {
  emit('send')
  nextTick(() => scrollToBottom())
}

// Załaduj starsze wiadomości
const loadOlderMessages = () => {
  if (!isLoadingMore.value) {
    isLoadingMore.value = true
    emit('loadMore')
  }
}
</script>

<template>
  <div class="chat-content">
    <div class="chat-header">
      <h3># {{ group.name }}</h3>
    </div>
    
    <div ref="messagesContainer" class="messages-container">
      <button 
        v-if="hasMoreMessages" 
        @click="loadOlderMessages"
        class="load-more-btn"
        :disabled="isLoadingMore"
      >
        {{ isLoadingMore ? 'Ładowanie...' : '⬆ Załaduj starsze wiadomości' }}
      </button>
      
      <div v-for="msg in messages" :key="msg.message_id" class="message">
        <strong>{{ getUserName(msg.sender_id) }}:</strong> {{ msg.message_content }}
      </div>
    </div>

    <div class="message-input">
      <input
        :value="newMessage"
        @input="emit('update:newMessage', $event.target.value)"
        @keyup.enter="handleSend"
        type="text"
        placeholder="Napisz wiadomość..."
      />
      <button @click="handleSend">Wyślij</button>
    </div>
  </div>
</template>

<style scoped>
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  flex-shrink: 0;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
  min-height: 300px;
  max-height: 500px;
}

.load-more-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background: #e0e0e0;
  color: #333;
}

.load-more-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message strong {
  color: #2196f3;
  margin-right: 8px;
}

.message-input {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.message-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.95rem;
}

.message-input button {
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.message-input button:hover {
  background: #1976d2;
}
</style>
