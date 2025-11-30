import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupsView from '../views/GroupsView.vue'
import UsersView from '../views/UsersView.vue'  
import UserGroupsView from "../views/UserGroupsView.vue";
import MessagesView from '../views/MessagesView.vue'
import ConversationsView from '../views/ConversationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin/groups',
      name: 'groups',
      component: GroupsView
    },
    {
      path: '/admin/users',          
      name: 'users',
      component: UsersView
    },
    {
      path: "/admin/usergroups",
      name: "usergroups",
      component: UserGroupsView
    },
    { 
      path: '/admin/messages',
      name: 'messages',
      component: MessagesView 
    },
    { 
      path: '/admin/conversations',
      name: 'conversations',
      component: ConversationsView 
    }

  ]
})

export default router
