import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  // DefineSetupFnComponent,
} from 'vue'
import { h } from 'vue'
import type { RenderDataTree } from './default-init-data'

/**
 * 转换字符串为渲染树
 * 对插槽等转成渲染函数
 * @param dataRenderStr 渲染字符串
 * @returns
 */
export const useJson2RenderDataTree = (
  dataRenderStr: string,
  modelerOrViewerType: DefineComponent,
): RenderDataTree => {
  return JSON.parse(dataRenderStr, (key: string, value: any) => {
    //将插槽函数包装
    if (typeof value == 'string' && value.startsWith('()')) {
      // return useRenderProxy(eval(value))
      return useProxyFunRender(eval(value), modelerOrViewerType)
    }
    return value
  })
}
export const useProxyFunRender = (
  funSolt: Function,
  modelerOrViewerType: DefineComponent,
) => {
  return new Proxy(funSolt, {
    apply: target => {
      //, thisArg: any, argArray: any[]
      const slotData = target()
      //中断再次使用源渲染器,一遍包装指示器及分层定位
      if (slotData.interceptFlag == true) {
        return h(modelerOrViewerType, { renderDataTree: slotData })
      }

      return slotData
    },
    // has: (target, prop: string) => {
    //   //标记是否渲染代理对象 用于json转换
    //   if ('isProxy' == prop) {
    //     return true
    //   }
    //   return Reflect.has(target, prop)
    // },
    get: (target, property: string) => {
      if (property == 'originalTarget') {
        return target
      }
      debugger
      return target[property]
      // return null
    },
  })
}

const _convertData2StrHandler = (key: string, value: any) => {
  if (value instanceof Function) {
    //插槽的函数
    const originalTarget = value().originalTarget
    // return value()
    if (originalTarget) {
      return originalTarget.toString()
    }
    console.error('错误不是插槽数据')
    return value.toString()
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
