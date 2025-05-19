<template>
<div>
  <div v-for="u in users" :key="u.username"
       @click="$emit('select', u.username)"
       :class="['p-2 cursor-pointer', active===u.username?'bg-gray-200':'']">
    {{ u.username }}
  </div>
</div>
</template>
<script setup>
defineProps({ users:Array, active:String });
</script>
