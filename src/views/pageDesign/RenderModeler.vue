<script lang="ts">
/** 建模设计器 组合组件和插槽都用div包裹。以便产生线框*/
import { defineComponent, h, inject, resolveComponent, ref } from 'vue'
// import * as baseConfigData from './default-init-data'
import type { RenderDataTree } from './default-init-data'
import { ElIcon } from 'element-plus'
import {
  Delete,
  Edit,
  Rank,
  CaretTop,
  CaretBottom,
} from '@element-plus/icons-vue'

// import { MsgDto, MsgType, PositionMsgDto } from '@/design/PostMeaagae'
// import MenuWrapper from '@/design/comWrapper/MenuWrapper.vue'
// import LayoutEditer from "./comWrapper/LayoutEditer.vue";
// import {<el-icon><Delete /></el-icon>}
// const { renderDataTree } = defineProps<{ renderDataTree: RenderDataTree }>()
function dragstartHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
  console.log('开始', ev, renderDataTree)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
const isActive = ref(false)
const activeEdit = (event: MouseEvent) => {
  // if (isActive.value == true) {
  //   return
  // }
  isActive.value = true
  const element = event.currentTarget as HTMLElement
  element.classList.add('clickContainer')
}
const activeDrag = (event: MouseEvent) => {
  const element = event.currentTarget! as HTMLElement
  element.parentElement.parentElement.draggable = true
}
export default defineComponent(
  (props: { renderDataTree: RenderDataTree }) => {
    // const pointerRef = inject('pointerRef')
    // console.log(pointerRef)

    const renderDataTree = props.renderDataTree
    console.log('上下文', renderDataTree.context)
    return () => {
      // 渲染函数
      return [
        h(
          'div',
          {
            // style: { display: 'inline-block' },
            class: ['designContainer'],
            onClick: activeEdit,
            //       onDragover:dragoverHandler($event)
            // onDrop:dropHandler($event)
            // onDragleave:dragleaveHandler($event),
          },
          [
            h(
              resolveComponent(renderDataTree.tagName),
              renderDataTree.props,
              renderDataTree.children,
            ),
            [
              isActive.value
                ? h(ElIcon, { class: 'editShow' }, [
                    h(Rank, { onMousedown: activeDrag }),
                    h(CaretTop),
                    h(CaretBottom),
                    h(Delete),
                  ])
                : null,
            ],
          ],
        ),
      ]
    }
  },
  // 目前仍然需要手动声明运行时的 props
  {
    props: ['renderDataTree'],
  },
)

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
</script>
<style lang="scss">
.designContainer {
  width: auto;
  position: relative;
}
.clickContainer {
  outline: 2px solid var(--el-color-primary);
  border-radius: 4px; //var(--el-card-border-radius);
  resize: both;
  overflow: auto; //scroll
}
.editShow {
  background-color: var(--el-color-primary);
  // font-size: 1em;
  width: 4em; //三个图标宽度
  top: 0px;
  left: 0px;
  position: absolute;
}
// .editHide {
//   display: none;
// }
</style>
