<template>
  <el-tabs>
    <el-tab-pane label="组件设置" name="first">
      <layout-editer></layout-editer>
    </el-tab-pane>
    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeRanderData = defineModel()

const props = defineProps(['renderDataTree'])
const emits = defineEmits(['changeData'])
window.onmessage = (event: MessageEvent) => {
  console.log(event.data, typeof event.data, window)
  // if (!(event.data instanceof MsgDto)) {
  //   return
  // }
  // document.elementFromPoint(a.x, a.y)
  // document.dispatchEvent()
  // debugger
  console.log(event, window)
}
</script>
