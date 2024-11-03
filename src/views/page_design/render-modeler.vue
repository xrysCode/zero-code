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
import { restoreFunction, useObj2StrJson } from './render-design-utils'
import RenderModeler from './render-modeler.vue'

// import { MsgDto, MsgType, PositionMsgDto } from '@/design/PostMeaagae'

interface OldActiveEditData {
  isActive: Ref<boolean, boolean>
  currentTarget: HTMLElement
}
let oldActiveEditData: OldActiveEditData
let activeRenderDataTree: RenderDataTree
// const map = new WeakMap<string, RenderDataTree>()
const emptyRenderData: RenderDataTree = {
  id: 'empty',
  tagName: 'el-empty',
  props: {
    description: '请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处。',
  },
}
const startRenderData: RenderDataTree = {
  id: '0',
  tagName: 'div',
  props: { style: { height: '100dvh', width: '100%' } },
  children: {
    default: [emptyRenderData],
  },
}

window.addEventListener(
  'message',
  messageEvent => {
    if (messageEvent.source.name != 'designIframe') {
      return
    }
    startRenderData.value = JSON.parse(messageEvent.data)
  },
  false,
)
const indexMap = new Map<string, RenderDataTree>()

function convertProps(
  renderDataTree: RenderDataTree,
  _argsContext: ArgsContext,
  _funContext: FunContext,
) {
  const _props = renderDataTree.props ? { ...renderDataTree.props } : {}
  for (const key in renderDataTree.props) {
    const value = _props[key] as string
    if (key == 'v-model') {
      _props.modelValue = eval(`_argsContext.${value}`) //_argsContext 类似于$setup
      _props['onUpdate:modelValue'] = eval(
        `$event =>{_argsContext.${value}=$event}`,
      )
      // _props['onUpdate:modelValue'] = eval(
      //   `(value) => emit('update:modelValue', value)`,
      // )
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
}

//递归的组合渲染数据
function convertSolts(
  renderDataTree: RenderDataTree,
  _argsContext: ArgsContext,
  _funContext: FunContext,
  _slotValue?: object, //todo 将来变成多个插槽变量的时候需要使用一个对象+参数的形式
) {
  convertProps(renderDataTree, _argsContext, _funContext) //解析props得到最新绑定的结果
  indexMap.set(renderDataTree.id!, renderDataTree)
  const children = renderDataTree.children
  for (const key in children) {
    let slotInfoArr = children[key] as (RenderDataTree | string)[]
    if (key == '_ctx') {
      continue
    }
    //第一次的调用需要解析替换成为渲染函数后面再次调用的时候已经是函数了 _ctx是框架的
    if (slotInfoArr instanceof Function) {
      //为了表格插槽参数多次调用的能够准确
      slotInfoArr = slotInfoArr.data
      // continue
    }

    const fun = (scope: object | undefined) => {
      if (scope == null) {
        scope = _slotValue
      } else {
        _slotValue = scope
      }
      const slotInfoProxyArr = []
      //组装虚拟节点
      for (const slotInfo of slotInfoArr) {
        let vnode = slotInfo
        if (typeof slotInfo == 'object') {
          slotInfo._parent = renderDataTree
          if (slotInfo.interceptFlag == true) {
            vnode = h(RenderModeler, { renderDataTree: slotInfo })
          } else {
            convertSolts(slotInfo, _argsContext, _funContext, scope)
            vnode = h(
              slotInfo.tagName.indexOf('-') > 0
                ? resolveComponent(slotInfo.tagName)
                : slotInfo.tagName,
              slotInfo._props,
              slotInfo.children, //这里要转换为渲染函数
            )
          }
        } else if (slotInfo.startsWith('{{') && slotInfo.endsWith('}}')) {
          if (scope == null) {
            console.log('插槽取值null')
            continue
          }
          //字符串
          vnode = eval(slotInfo.substring(2, slotInfo.length - 2))
        }
        slotInfoProxyArr.push(vnode)
      }
      return slotInfoProxyArr //返回结果
    }
    fun.data = slotInfoArr
    children[key] = new Proxy(fun, {})
  }
}
export default defineComponent(
  (props: { renderDataTree: RenderDataTree }, other) => {
    // const pointerRef = inject('pointerRef')
    // console.log(pointerRef)
    const isActive = ref(false)

    let renderDataTree = props.renderDataTree
    if (renderDataTree == null) {
      renderDataTree = startRenderData
    }
    // renderDataTree._ctx = getCurrentInstance()

    /**数据渲染解析 */
    let _argsContext = inject('_argsContext', {}) as ArgsContext
    let _funContext = inject('_funContext', {}) as FunContext
    if (renderDataTree.context != null) {
      _argsContext = {}
      _funContext = {}
      provide('_argsContext', _argsContext)
      provide('_funContext', _funContext)
      for (const key in renderDataTree.context) {
        switch (key) {
          case 'reactive':
            _argsContext.reactiveObject = reactive(renderDataTree.context[key]!)
            break
          case 'ref':
            const refInfo = renderDataTree.context.ref!
            for (const nameRef in refInfo) {
              _argsContext[(nameRef + 'Ref') as `${string}Ref`] = ref(
                refInfo[nameRef],
              )
            }
            break
          default: //余下的都视为函数 事件监听器应以 onXxx 的形式书写
            _funContext[key] = renderDataTree.context[key]
        }
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
    }
    const triggerRender = ref(1)

    return () => {
      //解析属性数据，各种绑定及函数等
      convertSolts(renderDataTree, _argsContext, _funContext)
      triggerRender.value = triggerRender.value
      // 渲染函数
      return [
        h(
          'div',
          {
            // style: { display: 'inline-block' },
            class: ['designContainer'],
            onClick: ev => activeEdit(ev, isActive),
            onDragover: dragoverHandler,
            onDrop: ev =>
              dropHandler(ev, renderDataTree, triggerRender, isActive),
            // onDragleave:dragleaveHandler($event),
          },
          [
            h(
              renderDataTree.tagName.indexOf('-') > 0
                ? resolveComponent(renderDataTree.tagName)
                : renderDataTree.tagName,
              renderDataTree._props,
              renderDataTree.children,
            ),

            isActive.value
              ? h(ElIcon, { class: 'editShow' }, [
                  h(Rank, { onMousedown: activeDrag }),
                  h(CaretTop /*{ onMousedown: parentActive }*/),
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

const activeEdit = (event: MouseEvent, isActive: Ref) => {
  // @ts-expect-error 自定义为了冒泡不干涉 冒泡中已经处理
  if (event._activeEdit == true) {
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
  activeRenderDataTree = renderDataTree
  //传递数据
  window.parent.postMessage(
    useObj2StrJson(renderDataTree),
    window.parent.origin,
  )
}
// const parentActive = (event: MouseEvent) => {
//       if (renderDataTree._parent) {
//         // renderDataTree.parent._ctx=
//         // event.currentTarget=
//         activeEdit(event)
//       }
//     }
// const { renderDataTree } = defineProps<{ renderDataTree: RenderDataTree }>()
function dragstartHandler(ev: DragEvent, renderDataTree: RenderDataTree) {
  console.log('开始', ev, renderDataTree)
  // ev.dataTransfer!.setData('text/plain', componentType)
  // ev.dataTransfer.dropEffect = 'move'
  // this.$el.querySelector('#designPanel').style.zIndex = 1
  // this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
//激活拖拽
const activeDrag = (event: MouseEvent) => {
  const element = event.currentTarget! as HTMLElement
  element.parentElement.parentElement.draggable = true
}

//     /////////////////////////////////////////////
let dragoverElement: HTMLElement
let pointerType: string
function clearBeforePointer() {
  if (dragoverElement != null) {
    dragoverElement.classList.remove(
      'pointer-left',
      'pointer-right',
      'pointer-top',
      'pointer-bottom',
      'pointer-internal',
    )
  }
}
//事件在可拖动的元素或者被选择的文本被拖进一个有效的放置目标时（每几百毫秒）触发。
function dragoverHandler(ev: DragEvent) {
  ev.preventDefault()
  clearBeforePointer()
  dragoverElement = ev.currentTarget as HTMLElement
  const xUnit = dragoverElement.offsetWidth / 5
  const yUnit = dragoverElement.offsetHeight / 3
  if (ev.clientX <= dragoverElement.offsetLeft + xUnit) {
    dragoverElement.classList.add('pointer-left')
    pointerType = 'before'
  } else if (ev.clientX >= dragoverElement.offsetLeft + 4 * xUnit) {
    dragoverElement.classList.add('pointer-right')
    pointerType = 'after'
  } else if (ev.clientY < dragoverElement.offsetTop + yUnit) {
    dragoverElement.classList.add('pointer-top')
    pointerType = 'before'
  } else if (ev.clientY < dragoverElement.offsetTop + 2 * yUnit) {
    dragoverElement.classList.add('pointer-internal')
    pointerType = 'internal'
  } else {
    dragoverElement.classList.add('pointer-bottom')
    pointerType = 'after'
  }
}
//释放数据，并打开编辑框
function dropHandler(
  ev: DragEvent,
  targetDataTree: RenderDataTree,
  triggerRender: Ref<number>,
  isActive: Ref,
) {
  ev.preventDefault()
  clearBeforePointer()
  const isAdd = ev.dataTransfer!.getData('isAdd')
  if (isAdd == 'true' && targetDataTree.id == '0') {
    //删除默认的空渲染
    const firstArr = targetDataTree.children!.default.data as RenderDataTree[]
    for (let index = 0; index < firstArr.length; index++) {
      if (firstArr[index] && firstArr[index].id == 'empty') {
        firstArr.splice(index, 1)
      }
    }
  }
  isActive.value = true
  triggerRender.value = triggerRender.value + 1
  const moveDataTreeStr = ev.dataTransfer!.getData('datarender')
  const moveDataTree = JSON.parse(moveDataTreeStr) as RenderDataTree
  window.parent.postMessage(moveDataTreeStr, '*')
  console.log('打开数据', moveDataTreeStr)
  if (targetDataTree.id == '0') {
    const firstArr = targetDataTree.children!.default.data as RenderDataTree[]
    firstArr.push(moveDataTree)
    return
  }
  const parentChildrens = targetDataTree._parent?.children
  let position: number
  let parentChildrensArr: (RenderDataTree | string)[]
  outerLoop: for (const soltKey in parentChildrens) {
    const childrenList = parentChildrens[soltKey] as (RenderDataTree | string)[]
    for (let index = 0; index < childrenList.length; index++) {
      if (targetDataTree == childrenList[index]) {
        position = index
        parentChildrensArr = childrenList
        break outerLoop
      }
    }
  }

  switch (pointerType) {
    case 'before':
      parentChildrensArr!.splice(position!, 0, moveDataTree)
      break
    case 'after':
      parentChildrensArr!.splice(position! + 1, 0, moveDataTree)
      break
    case 'internal':
      break
  }
}
// function   dragleaveHandler(ev: DragEvent) {
//   const evMeaagae = new PositionMsgDto(ev)
//   const win = (
//     this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement
//   ).contentWindow
//   // "http://localhost:5173/?iframe=true"
//   win!.postMessage(
//     new MsgDto(MsgType.dragleave, evMeaagae, undefined),
//     this.designUrl,
//   )
// },
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
.pointer-left {
  border-left: 3px solid var(--el-color-primary);
}
.pointer-right {
  border-right: 3px solid var(--el-color-primary);
}
.pointer-top {
  border-top: 3px solid var(--el-color-primary);
}
.pointer-bottom {
  border-bottom: 3px solid var(--el-color-primary);
}
.pointer-internal {
  background-color: var(--el-color-primary);
}
.editShow {
  background-color: var(--el-color-primary);
  // font-size: 1em;
  width: 4em; //三个图标宽度
  top: 0px;
  left: 0px;
  position: absolute;
  z-index: 1;
}
// .editHide {
//   display: none;
// }
</style>
