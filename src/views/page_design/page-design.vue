<template>
  <el-container style="height: 100svh">
    <el-aside class="aside"><LeftOptions></LeftOptions></el-aside>
    <el-container>
      <el-header><TopOptions></TopOptions></el-header>
      <el-main>
        <iframe
          id="designIframe"
          name="designIframe"
          ref="designIframe"
          src="/system/designArea"
          style="height: 100dvh; width: 100%"
          @click="
            () => {
              alert('xx')
            }
          "
        ></iframe>
      </el-main>
    </el-container>

    <el-aside class="aside">
      <component
        v-if="activeRanderData"
        :is="activeComponent"
        v-model="activeRanderData"
      ></component>
      <el-empty
        v-else
        description="选中设计区域组件, 以便进行更加详细的设计。"
      />
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import LeftOptions from './left-options.vue'
// import RightOptions from './RightOptions.vue'
import TopOptions from './top-options.vue'
import {
  defineComponent,
  useTemplateRef,
  onMounted,
  reactive,
  ref,
  computed,
} from 'vue'
import type { DefineComponent } from 'vue'
import * as defaultData from './default-init-data'
import type { RenderDataTree } from './default-init-data'
// import { getDesignUniqueId } from '@/api/design-api'

// 所有右侧的编辑组件
const rightEditComponents = import.meta.glob('./component-desc/*.vue')
const componentObj = {}
for (const path in rightEditComponents) {
  const componentName = path.replace(/.+\/([a-z-]+)\.vue/, '$1')
  componentObj[componentName] = rightEditComponents[path]
}

const activeComponent = computed(
  () => componentObj[activeRanderData.value.tagName + '-edit'],
)
//完整的树形图 通过最后消息去获取结果

//激活的树形图
// const activeRenderDataTree = renderDataTree

const designIframe = useTemplateRef('designIframe')
onMounted(() => {
  //完成渲染后，将请求接口的数据传递给渲染器
  const el = designIframe.value as HTMLIFrameElement
  el.currentW
})

const activeRanderData = ref<RenderDataTree>()

window.addEventListener(
  'message',
  messageEvent => {
    if (messageEvent.source.name != 'designIframe') {
      return
    }
    activeRanderData.value = JSON.parse(messageEvent.data)
    console.log('外部收到的数据', activeRanderData.value)
  },
  false,
)
// renderDataTree.value.tagName

// const props = defineProps({
//   name: String,
//   // id: [Number, String],
//   // msg: { type: String, required: true },
//   // metadata: null,
//   // designUrl: { type: String, default: 'http://localhost:5173/?iframe=true' },
// })
// const changeData = () => {}

// function dragendHandler(ev: DragEvent, componentType: string) {
//   console.log('拖拽结束', ev)
//   // this.$el.querySelector('#designPanel').style.zIndex = -1
//   // this.$el.querySelector('#designPanelIframe').style.zIndex = 1
// }
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
