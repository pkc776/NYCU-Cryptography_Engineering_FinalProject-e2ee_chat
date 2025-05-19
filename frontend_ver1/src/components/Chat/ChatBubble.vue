<template>
<div :class="cls">
  <p>{{ message.text }}</p>
  <small class="text-xs text-gray-600">{{ new Date(message.ts).toLocaleTimeString() }}</small>
</div>
</template>
<script setup>
defineProps({ message:Object, mine:Boolean });
const cls = computed(()=> mine
  ? 'self-end bg-blue-500 text-white rounded-lg p-2 m-1 max-w-xs'
  : 'self-start bg-gray-200 text-black rounded-lg p-2 m-1 max-w-xs');
import { computed } from 'vue';
</script>
