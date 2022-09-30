//组合组件和插槽都用div包裹。以便产生线框
export interface ComDesc {
  componentTag: string;
  attrs: { [key: string]: object };
  list: Array<ComDesc>;
  name?: string; //名称
  rangeFlag: RangeEnum; //范围标识

  methods?: { [key: string]: string };
}
// 回溯组件？
export enum RangeEnum {
  START = "start", //有框
  INNER = "inner",
  END = "end",
  DROP_SLOT = "drop_slot",
}
// interface MethodDesc{
//   [key: string]: string
// }

export class ComponentWrapper implements ComDesc {
  componentTag = "div";
  list: ComDesc[] = [];
  rangeFlag: RangeEnum;
  attrs: { class: string; ondragover?: Function };
  name?: string;
  defaultData?: object = {};
  methods?: { [key: string]: string };
  // dragMethods?: { [key: string]: string };
  constructor(name: string, rangeFlag: RangeEnum) {
    this.rangeFlag = rangeFlag;
    this.name = name;
    this.attrs = { class: "design-box" };
    // if (rangeFlag === RangeEnum.DROP_SLOT || rangeFlag == RangeEnum.START) {
    //   this.dragMethods = { ondragover: ondragoverStr };
    // }
  }
}
const ondragover = ((e: DragEvent) => {
  console.log("接收到的事件", e);
}).toString();

export const Layout = new ComponentWrapper("layout", RangeEnum.START);
Layout.list = [
  {
    //config: {},
    componentTag: "el-row",
    attrs: {
      gutter: 1,
      justify: "start",
      align: "top",
    },
    rangeFlag: RangeEnum.INNER,
    // text: '一级',
    list: [
      {
        componentTag: "el-col",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          style: { height: "1Rem" },
        },
        rangeFlag: RangeEnum.INNER,
        list: [new ComponentWrapper("layout", RangeEnum.DROP_SLOT)],
      },
      {
        componentTag: "el-col",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
        },
        rangeFlag: RangeEnum.INNER,
        list: [new ComponentWrapper("layout", RangeEnum.DROP_SLOT)],
      },
    ],
  },
  {
    componentTag: "el-row",
    attrs: {
      gutter: 1,
      justify: "start",
      align: "top",
      // class: "design-box",
    },
    rangeFlag: RangeEnum.INNER,
    list: [
      {
        componentTag: "el-col",
        attrs: {},
        rangeFlag: RangeEnum.INNER,
        list: [new ComponentWrapper("layout", RangeEnum.DROP_SLOT)],
      },
    ],
  },
];

// export class Layout
// {
//   :
// }
