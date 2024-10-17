<template>
  <el-container style="height: 100svh">
    <el-aside class="aside"
      ><LeftOptions
        @dragstart-handler="dragstartHandler"
        @dragend-handler="dragendHandler"
      ></LeftOptions
    ></el-aside>
    <el-container>
      <el-header><TopOptions></TopOptions></el-header>
      <el-main>
        <iframe
          id="designPanelIframe"
          name="designPanelIframe"
          src="/system/designArea"
          style="height: 100dvh; width: 100%"
        ></iframe>
        <!-- <DesignArea></DesignArea> -->
        <!-- <div   @dragover="dragoverHandler"
          id="designPanel"
          @drop="dropHandler($event)"
          @dragover="dragoverHandler($event)"
          @dragleave="dragleaveHandler($event)"
        > -->
        <!-- 请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处。 -->
        <!-- </div> -->
      </el-main>
    </el-container>

    <el-aside class="aside"><RightOptions></RightOptions></el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import LeftOptions from './LeftOptions.vue'
import RightOptions from './RightOptions.vue'
import TopOptions from './TopOptions.vue'
import DesignArea from './DesignArea.vue'
import { defineComponent } from 'vue'
import * as baseConfigData from './comDesc'
// import { MsgDto, MsgType, PositionMsgDto } from '@/design/PostMeaagae'
// import MenuWrapper from '@/design/comWrapper/MenuWrapper.vue'
// import LayoutEditer from "./comWrapper/LayoutEditer.vue";

const props = defineProps({
  name: String,
  // id: [Number, String],
  // msg: { type: String, required: true },
  // metadata: null,
  // designUrl: { type: String, default: 'http://localhost:5173/?iframe=true' },
})

function dragstartHandler(ev: DragEvent, componentType: string) {
  console.log('开始', ev, componentType)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, componentType: string) {
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
<style scoped lang="scss">
.aside {
  width: clamp(200px, 15%, 250px);
}
// header,
// aside,
// main {
//   border: 1px dotted grey;
// }
// header {
//   height: 60px;
// }
// aside {
//   width: 250px;
// }
// svg {
//   width: 1em;
//   height: 1em;
//   margin-right: 6px;
//   vertical-align: text-top;
//   color: green;
// }
// ul {
//   /* display: flex;
//     flex-wrap: wrap;
//     align-items: center; */
//   margin: 0;
//   padding: 0;
// }
// li {
//   background-color: #f1f2f3;
//   display: block;
//   width: 115px;
//   float: left;
//   margin: 2px 6px 6px 0;
//   text-align: left;
//   /* justify-content: center; */
// }
// #designPanel,
// #designPanelIframe {
//   width: 100%;
//   height: 100%;
// }
// #designPanelIframe {
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 1;
// }
</style>
