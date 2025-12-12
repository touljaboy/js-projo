<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login: authLogin } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const login = async () => {
  error.value = ''
  isLoading.value = true

  if (!username.value || !password.value) {
    error.value = 'Proszę wypełnić wszystkie pola'
    isLoading.value = false
    return
  }

  const result = await authLogin(username.value, password.value)
  isLoading.value = false

  if (result.success) {
    router.push('/channels')
  } else {
    error.value = result.error
  }
}

const signup = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="login-container">
    <header class="header">
      <h1>Yappchat</h1>
      <p class="description">
        Witaj z powrotem!
      </p>
    </header>

    <form @submit.prevent="login" class="form">
      <label>
        username:
        <input v-model="username" type="text" placeholder="Value" required />
      </label>

      <label>
        password:
        <input v-model="password" type="password" placeholder="Value" required />
      </label>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit" class="login-button" :disabled="isLoading">
        {{ isLoading ? 'Logowanie...' : 'Log In' }}
      </button>
      
      <p class="signup-link">
        Nie masz konta? <a @click.prevent="signup" href="#">Zarejestruj się</a>
      </p>
    </form>

  </div>
</template>

<style scoped>
.login-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  color: black;
  font-family: Arial, sans-serif;
}

.header small {
  font-size: 0.75rem;
  color: gray;
  display: block;
  margin-bottom: 0.5rem;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  letter-spacing: 2px;
}

.description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
}

.form input {
  margin-top: 0.3rem;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.9rem;
  margin: 0;
  padding: 0.5rem;
  background: #ffebee;
  border-radius: 4px;
}

.login-button {
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #333;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.signup-link a {
  color: #2196F3;
  cursor: pointer;
  text-decoration: underline;
}

.signup-link a:hover {
  color: #0b7dda;
}

.footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: gray;
}

.social-icons {
  display: flex;
  gap: 0.5rem;
}

.social-icons span {
  cursor: pointer;
}
</style>
