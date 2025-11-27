import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupsView from '../views/GroupsView.vue'
import UsersView from '../views/UsersView.vue'  // ✅ dodaj to
import UserGroupsView from "../views/UserGroupsView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView
    },
    {
      path: '/users',          // ✅ nowa ścieżka
      name: 'users',
      component: UsersView
    },
    {
      path: "/usergroups",
      name: "usergroups",
      component: UserGroupsView
    }

  ]
})

export default router
