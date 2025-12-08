<script setup>
const props = defineProps({
  as: { type: String, default: "div" }, 
});
</script>

<template>
  <component :is="as" class="card">
    <div class="card-content">
      <slot />
    </div>
  </component>
</template>

