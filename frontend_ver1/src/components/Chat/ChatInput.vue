<template>
<form @submit.prevent="go" class="flex gap-2">
  <input v-model="text" 
         :disabled="loading"
         placeholder="輸入訊息..." 
         class="flex-1 border rounded px-3 py-2 disabled:bg-gray-100" />
  <button :disabled="loading || !text.trim()" 
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
    {{ loading ? '發送中...' : '發送' }}
  </button>
</form>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ loading: Boolean });
const emit = defineEmits(['send']);
const text = ref('');

// 監聽 loading 狀態
watch(() => props.loading, (newValue) => {
  if (!newValue) {
    text.value = ''; // 當發送完成時清空輸入框
  }
});

async function go() {
  if (!text.value.trim() || props.loading) return;
  const msg = text.value;
  emit('send', msg);
}
</script>
