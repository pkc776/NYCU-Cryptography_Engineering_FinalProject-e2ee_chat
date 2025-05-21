<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-80">
    <LoginForm />
    <p class="text-center text-sm mt-4">No account? <router-link to="/register" class="text-blue-600">Register</router-link></p>
  </div>
</div>
</template>
<script setup>
import LoginForm from '../components/Auth/LoginForm.vue';
</script>
