<script lang="ts">
/** 建模设计器 组合组件和插槽都用div包裹。以便产生线框*/
import {
  defineComponent,
  h,
  provide,
  inject,
  resolveComponent,
  ref,
  reactive,
  getCurrentInstance,
  withCtx,
} from 'vue'
import type { Ref } from 'vue'
// import * as baseConfigData from './default-init-data'
import type {
  RenderDataTree,
  ArgsContext,
  FunContext,
} from './default-init-data'
import { ElIcon } from 'element-plus'
import {
  Delete,
  Edit,
  Rank,
  CaretTop,
  CaretBottom,
} from '@element-plus/icons-vue'
import { restoreFunction } from './render-design-utils'
import RenderModeler from './RenderModeler.vue'

// import { MsgDto, MsgType, PositionMsgDto } from '@/design/PostMeaagae'

interface OldActiveEditData {
  isActive: Ref<boolean, boolean>
  currentTarget: HTMLElement
}
let oldActiveEditData: OldActiveEditData
export default defineComponent(
  (props: { renderDataTree: RenderDataTree }, other) => {
    // const pointerRef = inject('pointerRef')
    // console.log(pointerRef)
    const isActive = ref(false)
    const activeEdit = (event: MouseEvent) => {
      // @ts-expect-error 自定义为了冒泡不干涉
      if (event._activeEdit == true) {
        //冒泡中已经处理
        return
      }
      // @ts-expect-error 自定义为了冒泡不干涉
      event._activeEdit = true
      if (oldActiveEditData != null) {
        oldActiveEditData.isActive.value = false
        oldActiveEditData.currentTarget.classList.remove('clickContainer')
      }
      isActive.value = true
      const element = event.currentTarget as HTMLElement
      oldActiveEditData = { isActive, currentTarget: element }
      element.classList.add('clickContainer')
    }
    const renderDataTree = props.renderDataTree
    renderDataTree._ctx = getCurrentInstance()
    const parentActive = (event: MouseEvent) => {
      if (renderDataTree.parent) {
        // renderDataTree.parent._ctx=
        // event.currentTarget=
        activeEdit(event)
      }
    }

    const _context = renderDataTree.context //: RenderDataTree['context']
    let _argsContext: ArgsContext
    let _funContext: FunContext
    for (const key in _context) {
      switch (key) {
        case 'reactive':
          _argsContext.reactiveObject = reactive(_context[key]!)
          break
        case 'ref':
          const refInfo = _context.ref!
          for (const nameRef in refInfo) {
            _argsContext[(nameRef + 'Ref') as `${string}Ref`] = ref(
              refInfo[nameRef],
            )
          }
          break
        default: //余下的都视为函数 事件监听器应以 onXxx 的形式书写
          _funContext[key] = _context[key]
      }
    }
    provide('reactiveObject', _argsContext)
    return () => {
      //嵌套的上下文如何处理 这里变成多个上下文

      if (renderDataTree.context != null) {
        //重置
        _argsContext = {}
        _funContext = {}
      }

      //运行
      for (const funName in _funContext) {
        const fun = restoreFunction(
          _funContext[funName] as string,
          _argsContext,
        )
        fun.data = _funContext[funName]
        _funContext[funName] = fun
      }

      //解析属性数据，各种绑定及函数等
      const _props = { ...renderDataTree.props }
      for (const key in renderDataTree.props) {
        const value = _props[key] as string
        if (key == 'v-model') {
          _props.modelValue = eval(`_argsContext.${value}`) //_argsContext 类似于$setup
          const f = eval(`$event =>{_argsContext.${value}=$event}`)

          _props['onUpdate:modelValue'] = f
          delete _props[key]
        } else if (key.startsWith(':')) {
          _props[key.substring(1)] = eval(`_argsContext.${value}`) || value
          delete _props[key]
        } else if (key.startsWith('@')) {
          const funName = 'on' + key.substring(1)
          _props[funName] = _funContext[value]
          delete _props[key]
        }
      }
      renderDataTree._props = _props

      const _children = renderDataTree.children
      for (const key in _children) {
        const slotInfoArr = _children[key] as [RenderDataTree | string]
        const fun = () => {
          const slotInfoProxyArr = []
          //组装虚拟节点
          for (const slotInfo of slotInfoArr) {
            let vnode = slotInfo
            if (typeof slotInfo == 'object') {
              slotInfo.parent = renderDataTree
              if (slotInfo.interceptFlag == true) {
                vnode = h(RenderModeler, { renderDataTree: slotInfo })
              } else {
                vnode = h(
                  resolveComponent(slotInfo.tagName),
                  slotInfo._props,
                  slotInfo.children,
                )
              }
            }
            slotInfoProxyArr.push(vnode)
          }
          return slotInfoProxyArr //返回结果
        }
        fun.data = slotInfoArr
        _children[key] = new Proxy(fun, {})
      }

      // resolveRenderData(renderDataTree)

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
              renderDataTree._props,
              renderDataTree.children,
            ),

            isActive.value
              ? h(ElIcon, { class: 'editShow' }, [
                  h(Rank, { onMousedown: activeDrag }),
                  h(CaretTop, { onMousedown: parentActive }),
                  h(CaretBottom, {
                    /*onMousedown: childActive*/
                  }),
                  h(Delete, {}),
                ])
              : null,
          ],
        ),
      ]
    }
  },
  // 目前仍然需要手动声明运行时的 props
  {
    props: ['renderDataTree'],
    // emits: ['t1'],
  },
)

// const { renderDataTree } = defineProps<{ renderDataTree: RenderDataTree }>()
function dragstartHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
  console.log('开始', ev, renderDataTree)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}

const activeDrag = (event: MouseEvent) => {
  const element = event.currentTarget! as HTMLElement
  element.parentElement.parentElement.draggable = true
}

function dragendHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
  console.log('拖拽结束', ev)
  // this.$el.querySelector('#designPanel').style.zIndex = -1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = 1
}
//     /////////////////////////////////////////////
// function dragoverHandler(ev: DragEvent) {

//   ev.preventDefault()
//   console.log('拖拽结束', ev)
// const el = this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement

// const win = el.contentWindow

// const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())

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
