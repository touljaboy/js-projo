<script setup>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/user/UserHeader/UserHeader.vue'

const router = useRouter()
const { currentUser } = useAuth()
</script>

<template>
  <div class="container">
    <UserHeader />

    <div class="about-content">
      <h1>Yappchat</h1>
      
      <section class="info-section">
        <h2>Autorzy</h2>
        <ul class="authors-list">
          <li>Ernest Fudali</li>
          <li>Grzegorz Bielski</li>
          <li>Grzegorz Czarnopys</li>
          <li>Kacper Lewko</li>
        </ul>
      </section>

      <section class="info-section version">
        <p>2025</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  color: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.about-content {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

h2 {
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #2196F3;
  padding-bottom: 0.5rem;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section p {
  line-height: 1.6;
  color: #555;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.tech-stack {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.tech-item {
  flex: 1;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.tech-item h3 {
  margin: 0 0 0.5rem 0;
  color: #2196F3;
}

.tech-item p {
  margin: 0;
  color: #666;
}

.version {
  text-align: center;
  margin-top: 3rem;
  color: #999;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 9999px;
  border: 1px solid #ccc;
}

.friends-list ul,
.friends-add ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friends-list li,
.friends-add li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.avatar {
  background-color: #ccc;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: bold;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-btn {
  background-color: #a6f0a6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
  color: black;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #8add8a;
}

.footer {
  margin-top: 3rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  text-align: center;
  color: gray;
  font-size: 0.8rem;
}

.social-icons {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .about-content {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .tech-stack {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }

  .about-content {
    padding: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
