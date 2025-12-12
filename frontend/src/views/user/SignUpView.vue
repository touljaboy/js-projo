<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const username = ref('')
const password = ref('')
const repeat = ref('')
const email = ref('')
const pesel = ref('')
const isRobot = ref(false)
const confirmationSent = ref(false)
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  
  if (!isRobot.value) {
    error.value = 'Proszę potwierdzić, że nie jesteś robotem.'
    return
  }

  if (password.value !== repeat.value) {
    error.value = 'Hasła nie są identyczne.'
    return
  }

  if (!username.value || !password.value || !email.value) {
    error.value = 'Proszę wypełnić wszystkie wymagane pola.'
    return
  }

  isLoading.value = true
  const result = await register(username.value, password.value, email.value, pesel.value)
  isLoading.value = false

  if (result.success) {
    confirmationSent.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="signup-container">
    <header class="header">
      <h1>Yappchat</h1>
      <p class="description">
        We are glad you’re here to join us! You are not in safe hands as we pay no attention at all to our security. Please, do not use too complex passwords as they take up more space in our database. Use something simple like ‘password1’ to secure your account with us.
      </p>
    </header>

    <form @submit.prevent="handleSubmit" class="form">
      <label>
        username:
        <input v-model="username" type="text" placeholder="Value" required />
      </label>

      <label>
        password:
        <input v-model="password" type="password" placeholder="Value" required />
      </label>

      <label>
        repeat:
        <input v-model="repeat" type="password" placeholder="Value" required />
      </label>

      <label>
        email:
        <input v-model="email" type="email" placeholder="Value" required />
      </label>

      <label>
        pesel:
        <input v-model="pesel" type="text" placeholder="Value" required />
      </label>

      <label class="captcha-label">
        <input type="checkbox" v-model="isRobot" />
        CAPTCHA - I AM A ROBOT
      </label>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit" class="signup-button" :disabled="isLoading">
        {{ isLoading ? 'Rejestracja...' : 'Sign up for 1$' }}
      </button>
    </form>

    <p v-if="confirmationSent" class="confirmation-msg">
      Rejestracja pomyślna! Za chwilę zostaniesz przekierowany do strony logowania.
    </p>

  </div>
</template>

<style scoped>
.signup-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  color: black;
  font-family: Arial, sans-serif;
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

.header small {
  font-size: 0.75rem;
  color: gray;
  display: block;
  margin-bottom: 0.5rem;
}

h1 {
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.9rem;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.form label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form input[type="text"],
.form input[type="password"],
.form input[type="email"] {
  width: 100%;
  padding: 0.4rem 0.5rem;
  font-size: 1rem;
  margin-top: 0.2rem;
  box-sizing: border-box;
}

.captcha-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.signup-button {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.signup-button:hover {
  background-color: #222;
}

.confirmation-msg {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: green;
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
</style>
