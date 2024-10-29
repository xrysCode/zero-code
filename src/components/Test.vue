<template>
  <div class="parent">
    <Test2 ref="pointerRef" :p1="pName" @sub="sub"></Test2>
    <Test3 ref="pointerRef" :p1="pName" @sub="sub"></Test3>
  </div>
</template>

<script lang="ts" setup>
import Test2 from './Test2.vue'
import Test3 from './Test3.vue'
import { useTemplateRef, onMounted, ref, provide } from 'vue'
const pName = ref('user111')
const pRef = useTemplateRef('pointerRef')
debugger
provide('in', 'test')
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
