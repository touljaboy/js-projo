<script setup>
import { useAuth } from '@/composables/useAuth'

const { currentUser, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

<template>
  <header class="header">
    <div class="user-info">
      <div class="user-avatar">{{ (currentUser?.user || 'U').charAt(0).toUpperCase() }}</div>
      <span class="user-name">{{ currentUser?.user || 'Użytkownik' }}</span>
    </div>
    <small class="site-name">Yappchat</small>
    <nav>
      <ul>
        <li><router-link to="/channels">Channels</router-link></li>
        <li><router-link to="/chat">Friends</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.header small {
  flex: 1;
}

.site-name {
  font-weight: bold;
  text-align: center;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1.5px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

nav ul li a {
  text-decoration: none;
  color: black;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

nav ul li a.active,
nav ul li a:hover,
nav ul li a.router-link-active {
  background-color: black;
  color: white;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 0.8rem;
  }

  nav ul {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  nav ul li a {
    font-size: 0.85rem;
  }

  .site-name {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }

  .user-name {
    font-size: 0.95rem;
  }

  .site-name {
    font-size: 1.2rem;
  }
}
</style>
