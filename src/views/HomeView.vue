<template>
<div class="flex h-screen">
  <aside class="w-60 border-r">
    <UserList :users="auth.users" :active="active" @select="active=$event" />
  </aside>
  <main class="flex-1 flex flex-col">
    <header class="p-2 border-b flex justify-between items-center">
      <h1 class="font-bold">{{ active || 'Select a user' }}</h1>
      <SecurityBadge v-if="active" />
    </header>
    <section class="flex-1">
      <ChatWindow v-if="active" :partner="active" />
    </section>
  </main>
</div>
</template>
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import UserList from '../components/Chat/UserList.vue';
import ChatWindow from '../components/Chat/ChatWindow.vue';
import SecurityBadge from '../components/Security/SecurityBadge.vue';
const active = ref(null);
const auth = useAuthStore();
</script>
