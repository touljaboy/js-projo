import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupsView from '../views/GroupsView.vue'
import UsersView from '../views/UsersView.vue'  
import UserGroupsView from "../views/UserGroupsView.vue";
import MessagesView from '../views/MessagesView.vue'
import ConversationsView from '../views/ConversationsView.vue'
import LoginView from '@/views/user/LoginView.vue';
import SignUpView from '@/views/user/SignUpView.vue';
import ChannelsView from '@/views/user/ChannelsView.vue';
import ChatView from '@/views/user/ChatView.vue';
import FriendsView from '@/views/user/FriendsView.vue';
import AboutView from '@/views/user/AboutView.vue';

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
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/channels',
      name: 'channels',
      component: ChannelsView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }

  ]
})

export default router
