/** 提供设计区的门户，这里提供一个遮罩效果，用来指示上下左右中 */
<template>
  <div style="height: 100dvh; width: 100%" @dragover="dragoverHandler">
    <RenderModeler
      v-if="renderDataTree"
      :render-data-tree="renderDataTree"
    ></RenderModeler>
    <el-empty
      v-else
      description="请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处。"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, provide } from 'vue'
import RenderModeler from './RenderModeler.vue'
// import RenderWrapper from './RenderModeler2'
import * as defaultData from './default-init-data'
import type { RenderDataTree } from './default-init-data'
import { useToRenderDataTree } from './render-design-utils'

const renderDataTree = ref<RenderDataTree>(
  useToRenderDataTree(defaultData.testDataStr, RenderModeler),
)
// debugger
// const pointerRef = useTemplateRef('pointerRef')
// provide('pointerRef', pointerRef)
// console.log('xx', cardButtonDefault)
function dragstartHandler(ev: DragEvent, componentType: string) {
  ev.dataTransfer!.setData('text/plain', componentType)
  ev.dataTransfer!.dropEffect = 'move'
  //   this.$el.querySelector('#designPanel').style.zIndex = 1
  //   this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, componentType: string) {
  console.log('拖拽结束', ev)
  this.$el.querySelector('#designPanel').style.zIndex = -1
  this.$el.querySelector('#designPanelIframe').style.zIndex = 1
}
//     /////////////////////////////////////////////
function dragoverHandler(ev: DragEvent) {
  ev.preventDefault() // 阻止默认行为以允许放置
  if (ev.dataTransfer == null) {
    return
  }
  const target = ev.target! as HTMLElement
  const style = pointerRef.value!.style
  //   const componentType = ev.dataTransfer!.getData('componentType')
  console.log('----------', target.offsetTop, ev)
  //高度分成三段
  if (ev.clientY < target.offsetHeight / 3) {
    style.top = target.offsetTop + 'px'
    target.classList.remove('el-tree__drop-indicator')
  } else if (ev.clientY < (target.offsetHeight / 3) * 2) {
    target.classList.add('el-tree__drop-indicator')
  } else {
    style.top = target.offsetHeight + 'px'
    target.classList.remove('el-tree__drop-indicator')
  }

  //   style.top = ev.clientY + 'px'
  //   style.left = ev.clientX + 'px'
  style.left = target.offsetLeft + 'px'
  style.width = target.offsetWidth + 'px'
  //   const el = this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement

  //   const win = el.contentWindow

  //   const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
  //   // debugger;
  //   // "http://localhost:5173/?iframe=true"
  //   win!.postMessage(
  //     new MsgDto(MsgType.dragover, evMeaagae, undefined),
  //     this.designUrl,
  //     // "http://localhost:5173"
  //   )
}
function dropHandler(ev: DragEvent) {
  const target = ev.target! as HTMLElement
  target.classList.remove('el-tree__drop-indicator')
  //释放数据，并打开编辑框
  //   const componentType = ev.dataTransfer!.getData('text/plain') as string
  //   const el = this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement
  //   const win = el.contentWindow
  //   const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
  //   // "http://localhost:5173/?iframe=true"
  //   win!.postMessage(
  //     new MsgDto(MsgType.drop, evMeaagae, baseConfigData[componentType]),
  //     this.designUrl,
  //     // "http://localhost:5173"
  //   )
}
function dragleaveHandler(ev: DragEvent) {
  //   const evMeaagae = new PositionMsgDto(ev)
  //   const win = (
  //     this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement
  //   ).contentWindow
  //   // "http://localhost:5173/?iframe=true"
  //   win!.postMessage(
  //     new MsgDto(MsgType.dragleave, evMeaagae, undefined),
  //     this.designUrl,
  //   )
}
</script>
