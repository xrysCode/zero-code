import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  DefineSetupFnComponent,
} from 'vue'
import { h, resolveComponent } from 'vue'
// import RenderWrapper from './RenderWrapper.vue'
// import

type Children = string | number | boolean | VNode | null | Children[]
type Slot = () => Children
type Slots = { [name: string]: Slot }
//组合组件和插槽都用div包裹。以便产生线框
export interface RenderDataTree {
  type: string
  props?: object | null
  children?: Children | Slot | Slots
  interceptFlag: boolean
  // attrs: { [key: string]: object }
  // list: Array<ComDesc>
  // name?: string //名称
  // rangeFlag: RangeEnum //范围标识
  // methods?: { [key: string]: string }
}
// DefineSetupFnComponent

class RenderProxyHandler implements ProxyHandler {
  //<() => RenderDataTree>
  renderComponentType: DefineSetupFnComponent | DefineComponent

  constructor(renderComponentType: DefineSetupFnComponent | DefineComponent) {
    this.renderComponentType = renderComponentType
  }
  apply(target) {
    //, thisArg: any, argArray: any[]
    const renderDataTree = target()
    if (renderDataTree.interceptFlag == true) {
      return h(renderComponentType, { renderDataTree: renderDataTree })
    }
    return renderDataTree
  }
  has(target, prop: string) {
    //标记是否渲染代理对象 用于json转换
    if ('isProxy' == prop) {
      return true
    }
    return Reflect.has(target, prop)
  }
}
// const handler: ProxyHandler<() => RenderDataTree> = {

// }
/**
 * 转换函数调用，以便渲染
 * @param target 插槽
 * @returns
 */
export const useRenderProxy = (
  target: () => RenderDataTree,
  renderComponentType: DefineSetupFnComponent | DefineComponent,
) => {
  return new Proxy(target, new RenderProxyHandler(renderComponentType))
}

const convertData2StrHandler = (key: string, value: any) => {
  if (value instanceof Function) {
    // return value()
    return value.toString()
  }
  return value
}
/**
 * 转换渲染数据对象为字符串
 * @param dataRenderDesc 渲染数据对象
 * @returns
 */
export const useJSONstringify = (dataRenderDesc: RenderDataTree) => {
  return JSON.stringify(dataRenderDesc, convertData2StrHandler)
}

const convertStr2ObjHandler = (key: string, value: any) => {
  if (typeof value == 'string' && value.startsWith('()')) {
    return useRenderProxy(eval(value))
  }
  return value
}
/**
 * 转换字符串为渲染树
 * @param dataRenderStr 渲染字符串
 * @returns
 */
export const useParseData = (dataRenderStr: string): RenderDataTree => {
  return JSON.parse(dataRenderStr, convertStr2ObjHandler)
}

const defaultSetupData = (renderDataTree: RenderDataTree): RenderDataTree => {
  return useParseData(useJSONstringify(renderDataTree))
}
export const buttonDefault: RenderDataTree = defaultSetupData({
  type: 'el-button',
  children: () => '按钮',
  interceptFlag: true,
})

export const cardDefault: RenderDataTree = defaultSetupData({
  type: 'el-card',
  children: {
    default: () => '内容区',
    header: () => '头区',
    footer: () => '尾区',
    // style:{maxWidth: "480px"}
  },
  interceptFlag: true,
})

export const cardButtonDefault: RenderDataTree = defaultSetupData({
  type: 'el-card',
  props: { style: { 'max-Width': '480px' }, class: ['xxx'] },
  children: {
    default: () => buttonDefault,
    header: () => '头区',
    footer: () => '尾区',
  },
  interceptFlag: true,
})

// 回溯组件？
export enum RangeEnum {
  START = 'start', //有框
  INNER = 'inner',
  END = 'end',
  DROP_SLOT = 'drop_slot',
}
// interface MethodDesc{
//   [key: string]: string
// }

// export class ComponentWrapper implements DataRenderDesc {
//   type = 'div'
//   list: ComDesc[] = []
//   rangeFlag: RangeEnum
//   attrs: { class: string; ondragover?: Function }
//   name?: string
//   defaultData?: object = {}
//   methods?: { [key: string]: string }
//   // dragMethods?: { [key: string]: string };

//   constructor(name: string, rangeFlag: RangeEnum) {
//     this.rangeFlag = rangeFlag
//     this.name = name
//     this.attrs = { class: 'design-box' }
//     // if (rangeFlag === RangeEnum.DROP_SLOT || rangeFlag == RangeEnum.START) {
//     //   this.dragMethods = { ondragover: ondragoverStr };
//     // }
//   }
//   children?: Children | Slot | Slots | undefined
//   flag: boolean
//   props: any
// }
// 完整参数签名
// function h(
//   type: string | Component,
//   props?: object | null,
//   children?: Children | Slot | Slots
// ): VNode

// export const Layout = new ComponentWrapper('layout', RangeEnum.START)
// Layout.list = [
//   {
//     //config: {},
//     componentTag: 'el-row',
//     attrs: {
//       gutter: 1,
//       justify: 'start',
//       align: 'top',
//     },
//     rangeFlag: RangeEnum.INNER,
//     // text: '一级',
//     list: [
//       {
//         componentTag: 'el-col',
//         attrs: {
//           span: 12,
//           offset: 0,
//           push: 0,
//           style: { height: '1Rem' },
//         },
//         rangeFlag: RangeEnum.INNER,
//         list: [new ComponentWrapper('layout', RangeEnum.DROP_SLOT)],
//       },
//       {
//         componentTag: 'el-col',
//         attrs: {
//           span: 12,
//           offset: 0,
//           push: 0,
//         },
//         rangeFlag: RangeEnum.INNER,
//         list: [new ComponentWrapper('layout', RangeEnum.DROP_SLOT)],
//       },
//     ],
//   },
//   {
//     componentTag: 'el-row',
//     attrs: {
//       gutter: 1,
//       justify: 'start',
//       align: 'top',
//       // class: "design-box",
//     },
//     rangeFlag: RangeEnum.INNER,
//     list: [
//       {
//         componentTag: 'el-col',
//         attrs: {},
//         rangeFlag: RangeEnum.INNER,
//         list: [new ComponentWrapper('layout', RangeEnum.DROP_SLOT)],
//       },
//     ],
//   },
// ]

// export class Layout
// {
//   :
// }
