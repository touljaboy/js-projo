import { ref, watch, onBeforeUnmount } from "vue";


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


  function startLoading() {
    isLoading.value = true;
    error.value = "";
  }


  function stopLoading() {
    isLoading.value = false;
  }


  function handleError(err) {
    if (err?.name === "AbortError") return;
    error.value = err?.message || "Błąd wyszukiwania.";
    console.error(err);
  }


  function renewAbortSignal() {
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();
    return abortCtrl.signal;
  }

 
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


  function runSearch(q = query.value) {
    executeSearch(q);
  }


  function scheduleDebouncedSearch(newVal) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runSearch(newVal.trim());
    }, debounceMs);
  }


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
