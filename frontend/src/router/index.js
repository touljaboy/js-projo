import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupsView from '../views/GroupsView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 2. Dodaj konfigurację nowej ścieżki
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView
    }
  ]
})

export default router