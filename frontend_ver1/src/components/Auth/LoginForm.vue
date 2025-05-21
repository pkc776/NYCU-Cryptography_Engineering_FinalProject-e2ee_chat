<template>
<form @submit.prevent="go" class="space-y-4">
  <input v-model="username" placeholder="Username" class="w-full border p-2" />
  <button class="bg-blue-600 text-white w-full p-2">Login</button>
</form>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
const username=ref(''); const router=useRouter(); const auth=useAuthStore();
async function go(){ try{ await auth.login(username.value); router.push('/'); }catch{ alert('Login failed'); } }
</script>
