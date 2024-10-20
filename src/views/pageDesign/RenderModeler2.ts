/** 建模设计器 组合组件和插槽都用div包裹。以便产生线框*/
import { defineComponent, h, inject, resolveComponent } from 'vue'
import type { SetupContext } from 'vue'
import type { RenderDataTree } from './default-init-data'
type FComponentProps = {
  renderDataTree: RenderDataTree
}

type Events = {
  sendMessage(message: string): void
}

export default function RenderModeler2(
  props: FComponentProps,
  context: SetupContext<Events>,
) {
  const pointerRef = inject('pointerRef')
  console.log(pointerRef)
  const renderDataTree = props.renderDataTree

  // 渲染函数或 JSX
  return h(
    resolveComponent(renderDataTree.tagName),
    renderDataTree.props,
    renderDataTree.children,
  )
}
RenderModeler2.props = {
  renderDataTree: {
    // type: RenderDataTree,
    required: true,
  },
}
RenderModeler2.emits = {
  sendMessage: (value: unknown) => typeof value === 'string',
}
RenderModeler2.displayName = 'MyModeler'

function dragstartHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
  console.log('开始', ev, renderDataTree)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
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
