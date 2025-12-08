import { computed } from "vue";


/**
 * Tworzy reaktywną wartość query opartą o v-model:
 * - Ppobiera z props.modelValue
 * - zapis emituje update:modelValue
 *
 * Dzięki temu SearchInput pozostaje prostym komponentem UI,
 * a obsługa v-model jest zamknięta w composable.
 *
 * @param {Object} props
 * @param {Function} emit 
 *
 * @returns {Object}
 * @returns {import('vue').ComputedRef<string>} 
 * @returns {Function}
 */
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
