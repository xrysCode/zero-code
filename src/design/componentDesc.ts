//组合组件和插槽都用div包裹。以便产生线框
export interface ComDesc {
  componentTag: string;
  attrs: { [key: string]: any };
  list: Array<ComDesc | ComponentWrapper>;
  // name?: string; //名称
  rangeFlag: RangeEnum; //范围标识

  text?: string;
  methods?: [{ evenType: string; refKey: string }]; //引用methodDesc

  _preNode?: ComDesc | ComponentWrapper;
  link?: number;
}
// 回溯组件？
export enum RangeEnum {
  START = 1 << 0, //"start", //有框
  INNER = 1 << 1, //"inner",
  INNER_SOLT = 1 << 2, //"inner",
  END = 1 << 3, //"end", //结束
  DROP_SLOT = 1 << 4, //"drop_slot", //需要有进入的框,表示有子级
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
export const StartDesign = new ComponentWrapper(
  "StartDesign",
  RangeEnum.START | RangeEnum.DROP_SLOT,
  0
);
StartDesign.attrs.style = { height: "100%" };

export const Layout = new ComponentWrapper("Layout", RangeEnum.START, 0);
Layout.list = [
  {
    componentTag: "el-row",
    attrs: {
      gutter: 1,
      justify: "start",
      align: "top",
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
  {
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

export const Menu = new ComponentWrapper("Menu", RangeEnum.START, 0, "菜单");
Menu.list = [
  {
    componentTag: "el-menu",
    attrs: {
      "default-active": 1,
      mode: "horizontal",
      router: true,
    },
    rangeFlag: RangeEnum.INNER,
    link: ++Menu.increment_cursor,
    list: [
      {
        componentTag: "el-menu-item",
        attrs: {
          index: "/rander/inner",
        },
        text: "Processing Center",
        rangeFlag: RangeEnum.END,
        link: ++Menu.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-sub-menu",
        attrs: {
          index: "2",
        },
        rangeFlag: RangeEnum.INNER,
        link: ++Menu.increment_cursor,
        list: [
          {
            componentTag: "template",
            attrs: {
              "#title": null,
            },
            text: "Workspace",
            rangeFlag: RangeEnum.INNER_SOLT,
            link: ++Menu.increment_cursor,
            list: [],
          },

          {
            componentTag: "el-menu-item",
            attrs: {
              index: "/a/a",
            },
            text: "item one",
            rangeFlag: RangeEnum.END,
            link: ++Menu.increment_cursor,
            list: [],
          },
          {
            componentTag: "el-menu-item",
            attrs: {
              index: "/a/b",
            },
            text: "item two",
            rangeFlag: RangeEnum.END,
            link: ++Menu.increment_cursor,
            list: [],
          },
        ],
      },
      {
        componentTag: "el-menu-item",
        attrs: {
          index: "/a/c",
          disabled: "",
        },
        text: "Info",
        rangeFlag: RangeEnum.END,
        link: ++Menu.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-menu-item",
        attrs: {
          index: "/a/d",
        },
        text: "Orders",
        rangeFlag: RangeEnum.END,
        link: ++Menu.increment_cursor,
        list: [],
      },
    ],
  },
];

export const Table = new ComponentWrapper("Table", RangeEnum.START, 0, "表格");
Table.defaultData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
];
Table.methodDesc = {
  handleClick: `(row) => {
     console.log("click",row)
    }`,
};
Table.list = [
  {
    componentTag: "el-table",
    attrs: {
      data: Table.defaultData,
    },
    rangeFlag: RangeEnum.INNER,
    link: ++Table.increment_cursor,

    list: [
      {
        componentTag: "el-table-column",
        attrs: {
          fixed: "",
          prop: "date",
          label: "Date",
          width: "250",
        },
        rangeFlag: RangeEnum.END,
        link: ++Table.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-table-column",
        attrs: {
          prop: "name",
          label: "Name",
          width: "200",
        },
        rangeFlag: RangeEnum.END,
        link: ++Table.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-table-column",
        attrs: {
          prop: "address",
          label: "Address",
          width: "600",
        },
        rangeFlag: RangeEnum.END,
        link: ++Table.increment_cursor,
        list: [],
      },

      {
        componentTag: "el-table-column",
        attrs: {
          fixed: "right",
          label: "Operations",
          width: "120",
        },
        rangeFlag: RangeEnum.INNER,
        link: ++Table.increment_cursor,
        list: [
          {
            componentTag: "template",
            attrs: {
              //{ row, column, $index }
              "#default": "row",
            },
            rangeFlag: RangeEnum.INNER_SOLT,
            link: ++Menu.increment_cursor,
            list: [
              {
                componentTag: "el-button",
                attrs: {
                  link: "",
                  type: "primary",
                  size: "small",
                },
                text: "Detail",
                methods: [{ evenType: "click", refKey: "handleClick" }],
                rangeFlag: RangeEnum.END,
                link: ++Table.increment_cursor,
                list: [],
              },
              {
                componentTag: "el-button",
                attrs: {
                  link: "",
                  type: "primary",
                  size: "small",
                },
                text: "Edit",
                rangeFlag: RangeEnum.END,
                link: ++Table.increment_cursor,
                list: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const RouterView = new ComponentWrapper(
  "RouterView",
  RangeEnum.START | RangeEnum.END,
  0,
  "路由出口"
);
RouterView.attrs.style = { border: "1px solid red", height: "100%" };
