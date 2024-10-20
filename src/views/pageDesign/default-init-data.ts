import type { /*Slot, Slots,*/ VNode, DefineComponent } from 'vue'
import { useToRenderDataTree, useObj2StrJson } from './render-design-utils'
import RenderModeler from './RenderModeler.vue'

type Children = string | number | boolean | VNode | null | Children[]
type Slot = () => Children
type Slots = { [name: string]: Slot }

export enum ComponentType {
  button = 'button',
  card = 'card',
  table = 'table',
}
// type any
export interface MethodDesc {
  args?: string[] //函数参数
  methodBody: string | (... T)=> T
  closureArgs?: object //闭包参数
}

//组合组件和插槽都用div包裹。以便产生线框
export interface RenderDataTree {
  type?: ComponentType //类型用来打开什么类型的编辑器
  tagName: string
  props?: object | null
  children?:  { [key: string]: MethodDesc }//Children | Slot | Slots
  interceptFlag?: boolean

  // attrs: { [key: string]: object }
  // list: Array<ComDesc>
  // name?: string //名称
  // rangeFlag: RangeEnum //范围标识
  // methods?: { [key: string]: string }
}

// const defaultSetupData = (
//   renderDataTree: RenderDataTree,
//   // modelerOrViewerType: DefineComponent,
// ): RenderDataTree => {
//   return useJson2RenderDataTree(useObj2StrJson(renderDataTree), RenderModeler)
// }
export const buttonDefault: string = useObj2StrJson({
  type: ComponentType.button,
  tagName: 'el-button',
  children: {default:{ methodBody: () => '按钮' }},
  interceptFlag: true,
})

export const cardDefault: string = useObj2StrJson({
  type: ComponentType.card,
  tagName: 'el-card',
  props: { style: { maxWidth: '480px' } },
  children: {
    default: {methodBody:() => '内容区'},
    header: {methodBody:() => '头区'},
    footer: {methodBody:() => '尾区'},
  },
  interceptFlag: true,
})

const test=useToRenderDataTree(cardDefault, RenderModeler)

//todo 写一个转换器用来组合数据
export const cardButtonDefault: string = useObj2StrJson({
  type: ComponentType.card,
  tagName: 'el-card',
  props: { style: { 'max-Width': '480px' }, class: ['xxx'] },
  children: {
    // default: {methodBody:() => useToRenderDataTree(buttonDefault, RenderModeler)},
    default: {methodBody:() => buttonDefault, },// 封装这种函数的写法 转换为下面这种  这种结构导致方法执行失败，需要找一直直接得到对象的方式
    // default: () => {
    //   return {
    //     type: 'el-button',
    //     children: () => '按钮',
    //     interceptFlag: true,
    //   }
    // },
    header: {methodBody:() => '头区'},
    footer: {methodBody:() => {
      return {
        tagName: 'div',
        children: '尾区',
      }
    }},
  },
  interceptFlag: true,
})

console.log('a', cardButtonDefault)
// 回溯组件？
// export enum RangeEnum {
//   START = 'start', //有框
//   INNER = 'inner',
//   END = 'end',
//   DROP_SLOT = 'drop_slot',
// }
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
