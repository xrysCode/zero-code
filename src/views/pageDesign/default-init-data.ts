import type {
  /*Slot, Slots,*/ VNode,
  DefineComponent,
  Reactive,
  Ref,
} from 'vue'
import { useToRenderDataTree, useObj2StrJson } from './render-design-utils'
import RenderModeler from './RenderModeler.vue'

// type Children = string | number | boolean | VNode | null | Children[]
// type Slot = () => Children
// type Slots = { [name: string]: Slot }

export enum ComponentType {
  button = 'button',
  card = 'card',
  table = 'table',
}

/**
 * 两种方式
 * 1、用div包裹设计要数，好处布局方便，缺点，子元素可能需要很小的宽度，但是父元素占了整行,拖动大小识别传递给子困难
 * 2、直接对元素使用设计要数，好处完全依赖子元素特点，缺点如何布局设计要数位置
 */
//组合组件和插槽都用div包裹。以便产生线框
export interface RenderDataTree {
  type?: ComponentType //类型用来打开什么类型的编辑器 对于渲染没有用
  //当前的上下文环境用来初始化函数及各种响应式数据，以便形成闭包,同时使用渲染组件特点来初始化他
  context?: {
    reactive?: object //在使用的时候引用名为 reactiveObject
    ref?: { [key: string]: string | number | boolean | null } //在使用的时候引用名为 xxxRef， key名字 value 值
  } & {
    [key: string]: string //key是函数名 value是string类型的箭头函数
  }
  tagName: string
  // 事件监听器应以 onXxx 的形式书写
  props?: { [key: string]: string | object | boolean } //这里可能有函数需要初始化，函数key全部是@开头，后面编译后变成on开头，value为_context中的'函数的引用'名
  // _props?: { [key: string]: string | object } //内部转换后的props 用于渲染端，无需填写，自动转换
  children?: { [key: string]: (RenderDataTree | string)[] } //插槽渲染数据说明,代理转换为渲染函数
  interceptFlag?: boolean
  _parent?: RenderDataTree
  _ctx?: unknown //当前级的实例
  // rangeFlag: RangeEnum //范围标识
  // methods?: { [key: string]: string }
}
export interface ArgsContext {
  reactiveObject?: Reactive<object | []>
  [key: `${string}Ref`]: Ref
}
export interface FunContext {
  [key: string]: string | ((...args: []) => void)
}

//todo 写一个转换器用来组合数据
const testData: RenderDataTree = {
  type: ComponentType.card,
  context: {
    reactive: {
      user: '',
      region: '',
      date: '',
    },
    // // ref:[""],
    Submit: `($event) => {
      console.log('submit!',$event,reactiveObject)
    }`,
  },
  tagName: 'el-form',
  props: {
    ':inline': true,
    ':model': 'reactiveObject',
    class: 'demo-form-inline',
  },
  children: {
    default: [
      {
        tagName: 'el-form-item',
        props: { label: 'Approved by' },
        children: {
          default: [
            {
              tagName: 'el-input',
              props: {
                'v-model': 'reactiveObject.user',
                placeholder: 'Approved by',
                clearable: true,
              },
              interceptFlag: true,
              // children: { default: [] },
            },
          ],
        },
        interceptFlag: true,
      },
      {
        tagName: 'el-form-item',
        children: {
          default: [
            {
              tagName: 'el-button',
              props: {
                type: 'primary',
                '@Click': 'Submit',
              },
              children: { default: ['Query'] },
              interceptFlag: true,
            },
          ],
        },
        interceptFlag: true,
      },
    ], // 封装这种函数的写法 转换为下面这种  这种结构导致方法执行失败，需要找一直直接得到对象的方式
  },

  interceptFlag: true,
}
export const testDataStr = JSON.stringify(testData)
// console.log('testDataStr', testDataStr)
// debugger
// let a=useToRenderDataTree(testDataStr,RenderModeler)
// let b=useObj2StrJson(a)
// console.log('b', b)

// export const cardDefault: string = useObj2StrJson({
//   type: ComponentType.card,
//   tagName: 'el-card',
//   props: { style: { maxWidth: '480px' } },
//   children: {
//     default: {methodBody:() => '内容区'},
//     header: {methodBody:() => '头区'},
//     footer: {methodBody:() => '尾区'},
//   },
//   interceptFlag: true,
// })
export const buttonDefault: string = useObj2StrJson({
  type: ComponentType.button,
  tagName: 'el-button',
  children: { default: ['按钮'] },
  interceptFlag: true,
})
// const test=useToRenderDataTree(cardDefault, RenderModeler)

// 回溯组件？
// export enum RangeEnum {
//   START = 'start', //有框
//   INNER = 'inner',
//   END = 'end',
//   DROP_SLOT = 'drop_slot',
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
