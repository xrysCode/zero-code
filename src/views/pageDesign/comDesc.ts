import type { /*Slot, Slots,*/ VNode } from 'vue'
import { defineComponent, h, resolveComponent } from 'vue'
import RenderWrapper from './RenderWrapper.vue'

type Children = string | number | boolean | VNode | null | Children[]
type Slot = () => Children
type Slots = { [name: string]: Slot }
//组合组件和插槽都用div包裹。以便产生线框
export interface DataRenderDesc {
  type: string
  props?: object | null
  children?: Children | Slot | Slots
  flag: boolean
  // attrs: { [key: string]: object }
  // list: Array<ComDesc>
  // name?: string //名称
  // rangeFlag: RangeEnum //范围标识
  // methods?: { [key: string]: string }
}
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
export const buttonDefault: DataRenderDesc = {
  type: 'el-button',
  children: () => '按钮',
  flag: true,
}

export const cardDefault: DataRenderDesc = {
  type: 'el-card',
  children: {
    default: () => '内容区',
    header: () => '头区',
    footer: () => '尾区',
    // style:{maxWidth: "480px"}
  },
  flag: true,
}

export const cardButtonDefault: DataRenderDesc = {
  type: 'el-card',
  props: { style: { 'max-Width': '480px' }, class: ['xxx'] },
  children: {
    default: () =>
      // new Proxy(buttonDefault, handler)
      {
        // debugger
        return buttonDefault
        // return h(
        //   resolveComponent(buttonDefault.type),
        //   buttonDefault.props,
        //   buttonDefault.children,
        // )
      },
    header: () => '头区',
    footer: () => '尾区',
  },
  flag: true,
}

const a = JSON.stringify(cardButtonDefault, (key, value) => {
  if (value instanceof Function) {
    // return value()
    return value.toString()
  }
  return value
})
console.log('a', a)
const b = JSON.parse(a, (k, v) => {
  if (typeof v === 'string' && v.startsWith('() => {')) {
    return eval(v)
  }
  return v
})
console.log('b', b)
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
