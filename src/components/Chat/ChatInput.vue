<template>
<form class="flex" @submit.prevent="send">
  <input v-model="text" class="flex-1 border p-2" placeholder="Type..." />
  <button class="bg-blue-600 text-white px-4">Send</button>
</form>
</template>
<script setup>
import { ref } from 'vue';
const emit = defineEmits(['send']); const text = ref('');
function send(){ if(!text.value.trim()) return; emit('send', text.value); text.value=''; }
</script>
