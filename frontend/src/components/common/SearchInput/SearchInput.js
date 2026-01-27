import { computed } from "vue";


export function useSearchInput(props, emit) {
  const query = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
  });

  function clear() {
    query.value = "";
  }

  return {
    query,
    clear,
  };
}
