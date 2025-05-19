<template>
<div class="flex flex-col h-full">
  <div class="flex-1 overflow-y-auto p-2 flex flex-col" ref="box">
    <ChatBubble v-for="(m,i) in msgs" :key="i" :message="m" :mine="m.from===me" />
  </div>
  <ChatInput @send="send" />
</div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import ChatBubble from './ChatBubble.vue';
import ChatInput from './ChatInput.vue';

const props = defineProps({ partner:String });
const chat = useChatStore(); const auth=useAuthStore();
const me = auth.user.username;
const msgs = ref(chat.messages[props.partner]||[]);
const box = ref(null);
watch(()=>chat.messages[props.partner], v=>{ msgs.value=v||[]; scroll(); });
function scroll(){ nextTick(()=>{ if(box.value) box.value.scrollTop=box.value.scrollHeight; }); }
async function send(text){ await chat.send(props.partner, text, auth); scroll(); }
</script>
