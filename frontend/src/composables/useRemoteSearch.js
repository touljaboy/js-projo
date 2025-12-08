import { ref, watch, onBeforeUnmount } from "vue";

/**
 * useRemoteSearch reużywalny composable do wyszukiwania po API.
 * Zapewnia debounce, loader, obsługę błędów i cancel poprzednich requestów.
 *
 * @param {Function} fetcher
 * @param {Object} options
 * @param {number} options.debounceMs 
 * @param {boolean} options.immediate 
 * @param {string} options.initialQuery 
 */
export function useRemoteSearch(fetcher, options = {}) {
  const {
    debounceMs = 300,
    immediate = true,
    initialQuery = "",
  } = options;

  const query = ref(initialQuery);
  const results = ref([]);
  const isLoading = ref(false);
  const error = ref("");

  let debounceTimer = null;
  let abortCtrl = null;

  /**
   * Ustawia stan ładowania i czyści błąd.
   */
  function startLoading() {
    isLoading.value = true;
    error.value = "";
  }

  /**
   * Wyłącza stan ładowania.
   */
  function stopLoading() {
    isLoading.value = false;
  }

  /**
   * Obsługuje błąd z fetchera.
   *
   * @param {any} err 
   */
  function handleError(err) {
    if (err?.name === "AbortError") return;
    error.value = err?.message || "Błąd wyszukiwania.";
    console.error(err);
  }

  /**
   * Anuluje poprzedni request
   * i tworzy nowy AbortController.
   *
   * @returns {AbortSignal} 
   */
  function renewAbortSignal() {
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();
    return abortCtrl.signal;
  }

  /**
   * Wykonuje właściwe wyszukiwanie po API i zapisuje wyniki.
   *
   * @param {string} query - fraza wyszukiwania
   */
  async function executeSearch(query) {
    const signal = renewAbortSignal();
    startLoading();

    try {
      const data = await fetcher(query, signal);
      results.value = data;
    } catch (err) {
      handleError(err);
    } finally {
      stopLoading();
    }
  }

  /**
   * Publiczna funkcja do ręcznego uruchomienia wyszukiwania
   *
   * @param {string} [q=query.value] 
   */
  function runSearch(q = query.value) {
    executeSearch(q);
  }

  /**
   * Ustawia debounce, opóźnia wywołanie searcha,
   * a przy kolejnej zmianie czyści poprzedni timer.
   *
   * @param {string} newVal
   */
  function scheduleDebouncedSearch(newVal) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runSearch(newVal.trim());
    }, debounceMs);
  }

  /**
   * Czyści timery i anuluje request przy odmontowaniu widoku.
   * 
   */
  function cleanup() {
    clearTimeout(debounceTimer);
    if (abortCtrl) abortCtrl.abort();
  }

  watch(query, scheduleDebouncedSearch);
  onBeforeUnmount(cleanup);
  if (immediate) {
    runSearch(initialQuery);
  }

  return {
    query,
    results,
    isLoading,
    error,
    runSearch,
  };
}
