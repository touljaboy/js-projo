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
      path: '/users',          
      name: 'users',
      component: UsersView
    },
    {
      path: "/usergroups",
      name: "usergroups",
      component: UserGroupsView
    },
    { 
      path: '/messages',
      name: 'messages',
      component: MessagesView 
    },
    { 
      path: '/conversations',
      name: 'conversations',
      component: ConversationsView 
    }

  ]
})

export default router
