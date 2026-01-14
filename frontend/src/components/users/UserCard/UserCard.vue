<script setup>
import { ref } from 'vue';
import BaseCard from "@/components/common/BaseCard/BaseCard.vue";

const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(["delete", "update"]);

const isEditing = ref(false);
const editedUser = ref("");
const editedPassword = ref("");
const editedRole = ref("");

const startEdit = () => {
  isEditing.value = true;
  editedUser.value = props.user.user;
  editedPassword.value = props.user.password_hash;
  editedRole.value = props.user.role || 'user';
};

const cancelEdit = () => {
  isEditing.value = false;
  editedUser.value = "";
  editedPassword.value = "";
  editedRole.value = "";
};

const saveEdit = () => {
  const payload = {};
  if (editedUser.value !== props.user.user) {
    payload.user = editedUser.value;
  }
  if (editedPassword.value !== props.user.password_hash) {
    payload.password_hash = editedPassword.value;
  }
  if (editedRole.value !== props.user.role) {
    payload.role = editedRole.value;
  }
  
  if (Object.keys(payload).length > 0) {
    emit("update", props.user.id, payload);
  }
  isEditing.value = false;
};
</script>

<template>
  <BaseCard as="article" class="card--user">
    <div v-if="!isEditing">
      <h3>{{ props.user.user }}</h3>

      <p class="muted">ID: {{ props.user.id }}</p>
      <p class="muted">Role: <strong>{{ props.user.role || 'user' }}</strong></p>
      <p class="muted">
        Created: {{ new Date(props.user.created_at).toLocaleString() }}
      </p>

      <p class="hash">hash: {{ props.user.password_hash }}</p>

      <div class="button-group">
        <button class="edit-btn" @click="startEdit">
          Edytuj
        </button>
        <button class="delete-btn" @click="emit('delete', props.user.id)">
          Usuń
        </button>
      </div>
    </div>

    <div v-else class="edit-mode">
      <h3>Edycja użytkownika</h3>
      
      <label>
        Login:
        <input v-model="editedUser" type="text" />
      </label>
      
      <label>
        Password hash:
        <input v-model="editedPassword" type="text" />
      </label>
      
      <label>
        Rola:
        <select v-model="editedRole">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <div class="button-group">
        <button class="save-btn" @click="saveEdit">
          Zapisz
        </button>
        <button class="cancel-btn" @click="cancelEdit">
          Anuluj
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.button-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.edit-btn, .save-btn {
  background-color: #0969da;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover, .save-btn:hover {
  background-color: #0860ca;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background-color: #5c636a;
}

.delete-btn {
  background-color: #cf222e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #a40e26;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-mode label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.edit-mode input,
.edit-mode select {
  padding: 6px 10px;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 14px;
}

.edit-mode input:focus,
.edit-mode select:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.15);
}

.hash {
  font-family: monospace;
  font-size: 12px;
  color: #57606a;
  word-break: break-all;
}

.muted {
  color: #57606a;
  font-size: 14px;
  margin: 4px 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .edit-btn, .save-btn, .cancel-btn, .delete-btn {
    width: 100%;
    padding: 10px 12px;
    font-size: 15px;
  }

  .edit-mode input,
  .edit-mode select {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 10px;
  }
}
</style>
