import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  DefineSetupFnComponent,
  resolveComponent,
} from 'vue'
import { h } from 'vue'
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
  return JSON.parse(dataRenderStr, (key: string, value: object) => {
    //将插槽函数包装   children:{default: {methodBody:() => '内容区'},==>children:{default:()=>xxx
    if ('children' == key) {
      return useProxyFunRender(value, modelerOrViewerType)
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
export const useProxyFunRender = (
  funSolt: { [key: string]: MethodDesc },
  modelerOrViewerType: DefineComponent,
) => {
  for (const key in funSolt) {
    const methoddesc = funSolt[key]
    const fn = restoreFunction(
      methoddesc.methodBody as string,
      methoddesc.closureArgs,
    )
    fn.originalTarget = methoddesc
    funSolt[key] = new Proxy(fn, {
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
        console.error('不应该这样取值')
        return target[property]
        // return null
      },
    })
  }
  return funSolt
}

const _convertData2StrHandler = (key: string, value: any) => {
  if (value instanceof Function) {
    //插槽的函数 1、可能是初始化设置的值这个时候是纯粹的函数，转字符串也是不对的
    //2、可能是运行的proxy,这个执行直接转换为渲染函数返回vnode
    if (value.originalTarget) {
      return value.originalTarget
    }
    if (key == 'methodBody') {
      //这里存在引用前一个初始化配置的那种数据 直接取出值来，重新构建函数
      return '()=>' + value()
    }
    debugger
    return value.originalTarget || value //() //.toString()
    // let valueResult
    // if (value.originalTarget != null) {
    //   valueResult = value.originalTarget //proxy
    // } else {
    //   valueResult = value //直接拿结果
    // }
    // // return value()
    // if (valueResult) {
    //   return '()=>' + valueResult.toString()
    // }
    // console.error('错误不是插槽数据')
    // return value.toString()
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
