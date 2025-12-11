<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Proszę wypełnić wszystkie pola'
    return
  }

  // Tutaj możesz wywołać backend do logowania
  console.log('Username:', username.value, 'Password:', password.value)
}

const signup = () => {
  // Możesz przekierować do strony rejestracji
  console.log('Sign Up clicked')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Logowanie</h2>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Wprowadź username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Wprowadź hasło"
            required
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="buttons">
          <button type="submit">Log In</button>
          <button type="button" @click="signup" class="signup-btn">Sign Up</button>
        </div>
      </form>
    </div>

    <footer class="footer">
      <p>© 2025 Moja Aplikacja. Wszystkie prawa zastrzeżone.</p>
    </footer>
  </div>
</template>

