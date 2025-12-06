<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  editingId: { type: [Number, null], default: null },
  initialUserId: { type: [String, Number], default: "" },
  initialGroupId: { type: [String, Number], default: "" },
});

const emit = defineEmits(["create", "update", "cancel"]);

// lokalny stan inputów
const formUserId = ref("");
const formGroupId = ref("");

// gdy widok zmienia tryb (startEdit/resetForm) -> synchronizujemy inputy
watch(
  () => [props.editingId, props.initialUserId, props.initialGroupId],
  () => {
    formUserId.value = props.initialUserId ?? "";
    formGroupId.value = props.initialGroupId ?? "";
  },
  { immediate: true }
);

const onSubmit = () => {
  if (!formUserId.value || !formGroupId.value) return;

  const payload = {
    user_id: Number(formUserId.value),
    group_id: Number(formGroupId.value),
  };

  if (props.editingId) {
    emit("update", payload);
  } else {
    emit("create", payload);
  }

  // czyścimy tylko po create; po update widok i tak zresetuje propsy
  if (!props.editingId) {
    formUserId.value = "";
    formGroupId.value = "";
  }
};

const onCancel = () => {
  emit("cancel");
};
</script>

<template>
  <form class="panel form" :class="{ editing: editingId }" @submit.prevent="onSubmit">
    <h3>
      {{ editingId ? "Edycja relacji #" + editingId : "Nowa relacja" }}
    </h3>

    <div class="inputs">
      <input
        v-model="formUserId"
        type="number"
        placeholder="Podaj ID Usera"
      />
      <input
        v-model="formGroupId"
        type="number"
        placeholder="Podaj ID Grupy"
      />

      <button v-if="!editingId" type="submit" class="primary">
        Dodaj
      </button>

      <div v-else>
        <button type="submit" class="warning">Zapisz</button>
        <button type="button" class="secondary" @click="onCancel">
          Anuluj
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped src="./UserGroupsAddForm.css"></style>
