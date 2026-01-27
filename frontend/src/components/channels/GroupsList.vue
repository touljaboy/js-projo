<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  groups: {
    type: Array,
    required: true
  },
  selectedGroup: {
    type: Object,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select', 'update:searchQuery', 'create'])
</script>

<template>
  <div class="groups-list">
    <div class="list-header">
      <h3>Grupy</h3>
      <button @click="emit('create')" class="create-btn">+ Nowa grupa</button>
    </div>
    <input
      type="search"
      :value="searchQuery"
      @input="emit('update:searchQuery', $event.target.value)"
      placeholder="Szukaj grup..."
      aria-label="Szukaj grup"
    />
    <ul>
      <li 
        v-for="group in groups" 
        :key="group.id"
        @click="emit('select', group)"
        :class="{ active: selectedGroup?.id === group.id }"
      >
        <div class="avatar">#</div>
        <span>{{ group.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.groups-list {
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  min-width: 250px;
  max-width: 300px;
}

.groups-list.hidden {
  display: none;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.list-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.create-btn {
  padding: 6px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.create-btn:hover {
  background: #45a049;
}

input[type='search'] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  margin-bottom: 5px;
}

li:hover {
  background: #f5f5f5;
}

li.active {
  background: #e3f2fd;
  font-weight: bold;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2196f3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .groups-list {
    max-width: 100%;
  }
}
</style>
