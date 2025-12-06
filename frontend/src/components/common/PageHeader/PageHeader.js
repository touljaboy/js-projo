import SearchInput from "@/components/common/SearchInput/SearchInput.vue";


/**
 * PageHeader - komponent nagłówka widoku z wyszukiwarką
 * Przekazuje wartość wyszukiwania na zewnątrz
 *
 * @prop {string} title - tytuł widoku - mwymagany.
 * @prop {string} modelValue - aktualna fraza wyszukiwania dla v-model.
 * @prop {string} searchPlaceholder - placeholder w inputcie wyszukiwania.
 */
export default {
  components: { SearchInput },
  props: {
    title: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
    searchPlaceholder: {
      type: String,
      default: "Szukaj...",
    },
  },
  emits: ["update:modelValue"],
};
