<script lang="ts">
/** 建模设计器 组合组件和插槽都用div包裹。以便产生线框*/
import {
  defineComponent,
  h,
  inject,
  resolveComponent,
  ref,
  reactive,
} from 'vue'
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
//嵌套的上下文如何处理 这里变成多个上下文
let _context: RenderDataTree['_context']
let _argsContext: ArgsContext
let _funContext: FunContext
// let parent = null
const resolveRenderData = (renderDataTree: RenderDataTree) => {
  if (renderDataTree._context != null) {
    //重置
    _context = renderDataTree._context
    _argsContext = {}
    _funContext = {}
  }

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
  //运行
  for (const funName in _funContext) {
    const fun = restoreFunction(_funContext[funName] as string, _argsContext)
    fun.data = _funContext[funName]
    _funContext[funName] = fun
  }

  //解析属性数据，各种绑定及函数等
  const _props = renderDataTree.props

  const _newProps = { ..._props }

  for (const key in _props) {
    if (key == 'v-model') {
      const value = _props[key] as string
      _newProps.modelValue = _argsContext[value]
      _newProps['onUpdate:modelValue'] = $event =>
        (_argsContext[value] = $event)
      delete _newProps[key]
    } else if (key.startsWith(':')) {
      _newProps[key.substring(1)] = _props[key]
      delete _newProps[key]
    } else if (key.startsWith('@')) {
      const funName = 'on' + key.substring(1)
      _newProps[funName] = _funContext[_props[key]]
      delete _newProps[key]
    }
  }

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
              slotInfo.props,
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

    return _newProps
  }
}

export default defineComponent(
  (props: { renderDataTree: RenderDataTree }, other) => {
    // const pointerRef = inject('pointerRef')
    // console.log(pointerRef)
    const renderDataTree = props.renderDataTree
    const _newProps = resolveRenderData(renderDataTree)

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
              _newProps,
              renderDataTree.children,
            ),

            isActive.value
              ? h(ElIcon, { class: 'editShow' }, [
                  h(Rank, { onMousedown: activeDrag }),
                  h(CaretTop),
                  h(CaretBottom),
                  h(Delete),
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
