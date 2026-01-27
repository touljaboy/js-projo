<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  groupName: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'close',
  'submit',
  'update:groupName',
  'update:isPublic',
  'update:password'
])
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>Utwórz nową grupę</h2>
      
      <label>
        Nazwa grupy:
        <input
          type="text"
          :value="groupName"
          @input="emit('update:groupName', $event.target.value)"
          placeholder="Wprowadź nazwę grupy"
        />
      </label>

      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="isPublic"
          @change="emit('update:isPublic', $event.target.checked)"
        />
        Publiczna grupa
      </label>

      <label v-if="!isPublic">
        Hasło:
        <input
          type="password"
          :value="password"
          @input="emit('update:password', $event.target.value)"
          placeholder="Wprowadź hasło"
        />
      </label>

      <div class="modal-actions">
        <button @click="emit('submit')" class="btn-primary">Utwórz</button>
        <button @click="emit('close')" class="btn-secondary">Anuluj</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

label {
  display: block;
  margin-bottom: 15px;
  font-weight: 500;
  color: #555;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
