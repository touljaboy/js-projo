<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader/AdminHeader.vue'
import ClientHeader from "@/components/client/ClientHeader/ClientHeader.vue";


const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <AdminHeader v-if="isAdminRoute" />
  <ClientHeader v-else />
  <main>
    <RouterView />
  </main>
</template>
