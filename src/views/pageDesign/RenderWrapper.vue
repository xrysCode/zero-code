<template>
  <div
    style="height: 100dvh; width: 100%"
    @dragover="dragoverHandler($event)"
    @drop="dropHandler($event)"
    @dragleave="dragleaveHandler($event)"
  >
    <Render :data-render-desc="dataRenderDesc"></Render>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, h, inject } from 'vue'
import Render from './Render.vue'
import * as baseConfigData from './comDesc'
import type { DataRenderDesc } from './comDesc'
// import { MsgDto, MsgType, PositionMsgDto } from '@/design/PostMeaagae'
// import MenuWrapper from '@/design/comWrapper/MenuWrapper.vue'
// import LayoutEditer from "./comWrapper/LayoutEditer.vue";

const { dataRenderDesc } = defineProps<{ dataRenderDesc: DataRenderDesc }>()
const pointerRef = inject('pointerRef')
console.log(pointerRef)
function dragstartHandler(ev: DragEvent, dataRenderDesc: DataRenderDesc) {
  console.log('开始', ev, dataRenderDesc)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, dataRenderDesc: DataRenderDesc) {
  console.log('拖拽结束', ev)
  // this.$el.querySelector('#designPanel').style.zIndex = -1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = 1
}
//     /////////////////////////////////////////////
// function dragoverHandler(ev: DragEvent) {
//   // debugger
//   ev.preventDefault()
//   console.log('拖拽结束', ev)
// const el = this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement

// const win = el.contentWindow

// const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
// debugger;
// "http://localhost:5173/?iframe=true"
// win!.postMessage(
//   new MsgDto(MsgType.dragover, evMeaagae, undefined),
//   this.designUrl,
//   // "http://localhost:5173"
// )
// }
//     function dropHandler(ev: DragEvent) {
//       //释放数据，并打开编辑框
//       const componentType = ev.dataTransfer!.getData('text/plain') as string
//       const el = this.$el.querySelector(
//         '#designPanelIframe',
//       ) as HTMLIFrameElement

//       const win = el.contentWindow
//       const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
//       // "http://localhost:5173/?iframe=true"
//       win!.postMessage(
//         new MsgDto(MsgType.drop, evMeaagae, baseConfigData[componentType]),
//         this.designUrl,
//         // "http://localhost:5173"
//       )
//     },
//     function   dragleaveHandler(ev: DragEvent) {
//       const evMeaagae = new PositionMsgDto(ev)
//       const win = (
//         this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement
//       ).contentWindow
//       // "http://localhost:5173/?iframe=true"
//       win!.postMessage(
//         new MsgDto(MsgType.dragleave, evMeaagae, undefined),
//         this.designUrl,
//       )
//     },
</script>
<style scoped lang="scss"></style>
