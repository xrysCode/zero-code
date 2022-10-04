//组合组件和插槽都用div包裹。以便产生线框
export interface ComDesc {
  componentTag: string;
  attrs: { [key: string]: any };
  list: Array<ComDesc | ComponentWrapper>;
  // name?: string; //名称
  rangeFlag: RangeEnum; //范围标识

  methods?: { [key: string]: string };

  _preNode?: ComDesc | ComponentWrapper;
  link?: number;
}
// 回溯组件？
export enum RangeEnum {
  START = "start", //有框
  INNER = "inner",
  END = "end", //结束
  DROP_SLOT = "drop_slot", //需要有进入的框,表示有子级
}
// interface MethodDesc{
//   [key: string]: string
// }

export class ComponentWrapper implements ComDesc {
  type: string; //组件名称英文
  name?: string; //组件名称
  componentTag = "div";
  rangeFlag: RangeEnum;
  list: ComDesc[] = [];

  attrs: { [key: string]: any } = {};
  // props: object = {};
  defaultData?: object = {};
  methodDesc?: { [key: string]: string };

  _preNode?: ComDesc | ComponentWrapper;
  link: number;
  increment_cursor: number = 0;
  constructor(type: string, rangeFlag: RangeEnum, link: number, name?: string) {
    this.type = type;
    this.rangeFlag = rangeFlag;
    this.name = name ? name : type;
    this.link = link;
    // this.attrs = { class: "design-box" };
    // if (rangeFlag === RangeEnum.DROP_SLOT || rangeFlag == RangeEnum.START) {
    //   this.dragMethods = { ondragover: ondragoverStr };
    // }
  }
}

export const Layout = new ComponentWrapper("Layout", RangeEnum.START, 0);
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
    link: ++Layout.increment_cursor,
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
        link: ++Layout.increment_cursor,
        list: [
          new ComponentWrapper(
            "Layout",
            RangeEnum.DROP_SLOT,
            ++Layout.increment_cursor
          ),
        ],
      },
      {
        componentTag: "el-col",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
        },
        rangeFlag: RangeEnum.INNER,
        link: ++Layout.increment_cursor,
        list: [
          new ComponentWrapper(
            "Layout",
            RangeEnum.DROP_SLOT,
            ++Layout.increment_cursor
          ),
        ],
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
    link: ++Layout.increment_cursor,
    list: [
      {
        componentTag: "el-col",
        attrs: {},
        rangeFlag: RangeEnum.INNER,
        link: ++Layout.increment_cursor,
        list: [
          new ComponentWrapper(
            "Layout",
            RangeEnum.DROP_SLOT,
            ++Layout.increment_cursor
          ),
        ],
      },
    ],
  },
];

export class EditConfig {
  type: string;
  componentTag: string;
  key: string;
  label: string;
  constructor(type: string, componentTag: string, key: string, label: string) {
    this.type = type;
    this.componentTag = componentTag;

    this.key = key;
    this.label = label;
  }
}

export const LayoutEdit = [
  new EditConfig("el-input", "div", "input", "名称"),
  new EditConfig("el-input-number", "el-row", "gutter", "栅格间隔"),
  new EditConfig("el-input-number", "el-col", "span", "栅格宽度"),
  new EditConfig("el-input-number", "el-col", "offset", "左侧间隔格数"),
  new EditConfig("el-input-number", "el-col", "push", "右移栅格数"),
  new EditConfig("el-input-number", "el-col", "pull", "左移栅格数"),
  // new EditConfig("input-number","el-col","",""),
  // new EditConfig("","","",""),
];

// export class Layout
// {
//   :
// }
