<template>
<div class="flex flex-col h-full">
  <div class="flex-1 overflow-y-auto p-4 flex flex-col space-y-4" ref="box">
    <div v-if="msgs.length === 0" class="text-center text-gray-500">
      開始聊天吧！
    </div>
    <div v-for="(m,i) in msgs" :key="i" :class="m.from === me ? 'self-end' : 'self-start'">
      <div :class="m.from === me ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'" class="rounded-lg p-2 m-1 max-w-xs">
        <p>{{ m.text }}</p>
        <small class="text-xs opacity-75">{{ new Date(m.ts).toLocaleTimeString() }}</small>
      </div>
    </div>
  </div>
  <div class="border-t p-4">
    <ChatInput @send="send" :loading="sending" />
  </div>
</div>
</template>
<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import ChatInput from './ChatInput.vue';

const props = defineProps({ partner:String });
const chat = useChatStore();
const auth = useAuthStore();
const me = auth.user.username;
const msgs = ref([]);
const box = ref(null);
const sending = ref(false);
let messageInterval;

// 更新訊息列表
function updateMessages() {
  console.log('Updating messages for partner:', props.partner);
  console.log('Current messages in store:', chat.messages[props.partner]);
  msgs.value = chat.messages[props.partner] || [];
  console.log('Updated local messages:', msgs.value);
}

// 監聽訊息變化
watch(()=>chat.messages[props.partner], (v) => {
  console.log('Messages changed:', v);
  updateMessages();
  scroll();
}, { deep: true, immediate: true });

// 監聽聊天對象變化
watch(()=>props.partner, async (newPartner) => {
  if (newPartner) {
    console.log('Partner changed to:', newPartner);
    await chat.fetchOffline(auth);
    updateMessages();
    scroll();
  }
});

// 自動滾動到底部
function scroll(){ 
  nextTick(()=>{ 
    if(box.value) box.value.scrollTop = box.value.scrollHeight; 
  }); 
}

// 發送訊息
async function send(text){ 
  if (!text.trim()) return;
  if (sending.value) return;
  
  try {
    sending.value = true;
    console.log('Attempting to send message:', { to: props.partner, text });
    
    // 發送到伺服器
    await chat.send(props.partner, text, auth);
    console.log('Message sent successfully');
    
    // 重新獲取訊息
    await chat.fetchOffline(auth);
    updateMessages();
    scroll();
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('發送訊息失敗，請重試');
  } finally {
    sending.value = false;
  }
}

// 定期檢查新訊息
async function checkNewMessages() {
  if (props.partner) {
    try {
      await chat.fetchOffline(auth);
      updateMessages();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }
}

onMounted(async () => {
  if (props.partner) {
    await chat.fetchOffline(auth);
    updateMessages();
    scroll();
  }
  // 每3秒檢查一次新訊息
  messageInterval = setInterval(checkNewMessages, 3000);
});

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval);
  }
});
</script>
