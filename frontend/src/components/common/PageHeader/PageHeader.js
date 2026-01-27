import SearchInput from "@/components/common/SearchInput/SearchInput.vue";



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
