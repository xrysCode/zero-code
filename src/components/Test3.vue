<template>
  <div @click="aClick">点击测试</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isBoolean = ref(true)
const aClick = $event => {
  console.log($event, isBoolean)
  isBoolean.value = !isBoolean.value
  emits('aClick', $event)
}
const emits = defineEmits(['aClick'])
</script>
