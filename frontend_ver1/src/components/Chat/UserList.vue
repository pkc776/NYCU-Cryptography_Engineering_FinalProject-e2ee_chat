<template>
<div class="divide-y">
  <div v-for="u in otherUsers" :key="u.username"
       @click="$emit('select', u.username)"
       :class="['p-3 cursor-pointer hover:bg-gray-100', active===u.username?'bg-gray-200':'']">
    <div class="flex justify-between items-center">
      <span class="font-medium">{{ u.username }}</span>
      <span class="text-sm text-gray-500">{{ u.status }}</span>
    </div>
  </div>
</div>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({ users:Array, active:String });
const auth = useAuthStore();

// 過濾掉當前用戶
const otherUsers = computed(() => {
  return props.users.filter(u => u.username !== auth.user.username);
});
</script>
