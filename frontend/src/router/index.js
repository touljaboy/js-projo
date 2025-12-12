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
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: { requiresGuest: true }
    },
    {
      path: '/channels',
      name: 'channels',
      component: ChannelsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true }
    },
    // Admin routes
    {
      path: '/admin',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/groups',
      name: 'groups',
      component: GroupsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/admin/usergroups",
      name: "usergroups",
      component: UserGroupsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
      path: '/admin/messages',
      name: 'messages',
      component: MessagesView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
      path: '/admin/conversations',
      name: 'conversations',
      component: ConversationsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken')
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isAdmin = currentUser?.role === 'admin'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    // Redirect to channels if route requires admin and user is not admin
    next('/channels')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to channels if route is for guests only and user is authenticated
    next('/channels')
  } else {
    next()
  }
})

export default router
