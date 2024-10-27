<template>
  <div class="parent">
    <Test2 ref="pointerRef" :p1="pName" @sub="sub"></Test2>
    <Test3 @a-click="w('外部')"></Test3>
  </div>
</template>

<script lang="ts" setup>
import Test2 from './Test2.vue'
import Test3 from './Test3.vue'
import { useTemplateRef, onMounted, ref } from 'vue'
const pName = ref('user111')
const pRef = useTemplateRef('pointerRef')
onMounted(() => {
  console.log(pRef)
})
const sub = (event, arg, data) => {
  console.log(event, arg, data)
}
const w = (ev, wb) => {
  console.log('父', ev, wb)
}
</script>
