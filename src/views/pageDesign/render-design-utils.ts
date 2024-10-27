import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  DefineSetupFnComponent,
} from 'vue'
import { h, resolveComponent } from 'vue'
import type { MethodDesc, RenderDataTree } from './default-init-data'

/**
 * 转换字符串为渲染树 顺序由上到下，里到外
 * 对插槽等转成渲染函数
 * @param dataRenderStr 渲染字符串
 * @returns
 */
export const useToRenderDataTree = (
  dataRenderStr: string,
  modelerOrViewerType: DefineComponent | DefineSetupFnComponent<T>,
  _argsContext,
  _funContext,
): RenderDataTree => {
  return JSON.parse(dataRenderStr, (key: string, value) => {
    if ('_context' == key) {
      //上下文 模拟一个上下文环境提供给后续渲染树使用
    }
    //将插槽函数包装   children?:  { [key: string]: [RenderDataTree|string] },==>children:{default:()=>xxx
    if ('children' == key) {
      for (const key in value) {
        const slotInfoArr = value[key] as [RenderDataTree | string]
        const fun = () => {
          const slotInfoProxyArr = []
          //组装虚拟节点
          for (const slotInfo of slotInfoArr) {
            let vnode = slotInfo
            if (typeof slotInfo == 'object') {
              slotInfo.parent = value
              if (slotInfo.interceptFlag == true) {
                vnode = h(modelerOrViewerType, { renderDataTree: slotInfo })
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
        value[key] = new Proxy(fun, {})
      }
    }
    return value
  })
}

export const useToRenderDataTree2 = (
  dataRenderStr: string,
  modelerOrViewerType: DefineComponent | DefineSetupFnComponent<T>,
  _argsContext,
  _funContext,
): RenderDataTree => {
  return JSON.parse(dataRenderStr, (key: string, value) => {
    if ('_context' == key) {
      //上下文 模拟一个上下文环境提供给后续渲染树使用
    }
    //将插槽函数包装   children?:  { [key: string]: [RenderDataTree|string] },==>children:{default:()=>xxx
    if ('children' == key) {
      for (const key in value) {
        const slotInfoArr = value[key] as [RenderDataTree | string]
        const fun = () => {
          const slotInfoProxyArr = []
          //组装虚拟节点
          for (const slotInfo of slotInfoArr) {
            let vnode = slotInfo
            if (typeof slotInfo == 'object') {
              slotInfo.parent = value
              if (slotInfo.interceptFlag == true) {
                vnode = h(modelerOrViewerType, { renderDataTree: slotInfo })
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
        value[key] = new Proxy(fun, {})
      }
    }
    return value
  })
}

export const restoreFunction = (methodStr: string, closureArgs?: object) => {
  let result = ''
  if (closureArgs) {
    result = 'const {' + Object.keys(closureArgs).join(',') + '}=closureArgs;'
  }
  return eval(result + methodStr)
}

const _convertData2StrHandler = (key: string, value: any) => {
  if (value.parent) {
    return
  }
  if (value instanceof Function) {
    //插槽的函数
    return value.data
  }
  return value
}
/**
 * 转换渲染数据对象为字符串
 * @param dataRenderDesc 渲染数据对象
 * @returns
 */
export const useObj2StrJson = (dataRenderDesc: RenderDataTree) => {
  return JSON.stringify(dataRenderDesc, _convertData2StrHandler)
}
