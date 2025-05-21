<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-80">
    <RegisterForm />
    <p class="text-center text-sm mt-4">Already registered? <router-link to="/login" class="text-blue-600">Login</router-link></p>
  </div>
</div>
</template>
<script setup>
import RegisterForm from '../components/Auth/RegisterForm.vue';
</script>
