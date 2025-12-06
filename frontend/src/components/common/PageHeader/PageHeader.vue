<script src="./PageHeader.js"></script>

<template>
  <div class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>

    <div class="page-header__search-row">
      <SearchInput
        :model-value="modelValue"
        @update:modelValue="(v) => $emit('update:modelValue', v)"
        :placeholder="searchPlaceholder"
        class="page-header__search"
      />
    </div>
  </div>
</template>

<style scoped src="./PageHeader.css"></style>
