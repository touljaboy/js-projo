<script setup>
import { defineProps, defineEmits, toRefs } from "vue";
import { useSearchInput } from "./SearchInput";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Szukaj...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { query, clear } = useSearchInput(props, emit);

const { placeholder, disabled, clearable } = toRefs(props);
</script>

<template>
  <div class="search-input">
    <input
      v-model="query"
      :placeholder="placeholder"
      :disabled="disabled"
      type="text"
      class="search-input__field"
    />

    <button
      v-if="clearable && query.length"
      @click="clear"
      type="button"
      class="search-input__clear"
      aria-label="Wyczyść wyszukiwanie"
      title="Wyczyść"
    >
      ×
    </button>
  </div>
</template>

<style scoped src="./SearchInput.css"></style>
