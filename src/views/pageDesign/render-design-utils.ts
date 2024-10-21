import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  DefineSetupFnComponent,
} from 'vue'
import { h, resolveComponent } from 'vue'
import type { MethodDesc, RenderDataTree } from './default-init-data'

/**
 * 转换字符串为渲染树
 * 对插槽等转成渲染函数
 * @param dataRenderStr 渲染字符串
 * @returns
 */
export const useToRenderDataTree = (
  dataRenderStr: string,
  modelerOrViewerType: DefineComponent | DefineSetupFnComponent<T>,
): RenderDataTree => {
  return JSON.parse(dataRenderStr, (key: string, value) => {
    if ('_context' == key) {
      //上下文 模拟一个上下文环境提供给后续渲染树使用
    }
    //将插槽函数包装   children?:  { [key: string]: [RenderDataTree|string] },==>children:{default:()=>xxx
    if ('children' == key) {
      for (const key in value) {
        // useProxyFunRender(slotInfo, modelerOrViewerType)
        const slotInfoArr = value[key] as [RenderDataTree | string]
        const slotInfoProxyArr = []
        //组合函数字符串
        for (const slotInfo of slotInfoArr) {
          let vnode = slotInfo
          if (typeof slotInfo == 'object') {
            vnode = h(
              resolveComponent(slotInfo.tagName),
              slotInfo.props,
              slotInfo.children,
            )
          }
          slotInfoProxyArr.push(vnode)
        }
        const fun = () => slotInfoProxyArr
        fun.data = slotInfoArr
        value[key] = new Proxy(fun, {})
      }
    }
    return value
  })
}
const restoreFunction = (methodStr: string, closureArgs?: object) => {
  let result = ''
  if (closureArgs) {
    result = 'const {' + Object.keys(closureArgs).join(',') + '}=closureArgs;'
  }
  return eval(result + methodStr)
}

const _convertData2StrHandler = (key: string, value: any) => {
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
