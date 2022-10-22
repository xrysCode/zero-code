import type { list } from "postcss";

// 组件整体-上下、路由-上内下、插槽-内
export enum RangeEnum {
  ENTRY = 1 << 0, //入口
  START = 1 << 1, //分割标记，组件开始
  NONE = 1 << 2, //无效果

  DRAG = 1 << 3, //允许拖动
  UP_DOWN = 1 << 4, //效果可在上下安放
  UP_INNER_DOWN = 1 << 5, //上中下

  ROUTER = 1 << 6, //路由和插槽样式不同
  SLOT_OUT = 1 << 7,
  SLOT_INNER = 1 << 8,

  ComponentPortal = UP_INNER_DOWN | ENTRY,
  ComponentHead = UP_DOWN | DRAG | START,
  ComponentSlot = SLOT_OUT | UP_INNER_DOWN,
  ComponentInner = NONE,
  ComponentInnerSlot = SLOT_INNER,
  ComponentRouter = ROUTER | UP_INNER_DOWN | START,
  ComponentInnerRouter = ROUTER,
}

//组合组件和插槽都用div包裹。以便产生线框
export interface ComDesc {
  componentTag: string;
  attrs: { [key: string]: any };
  list: Array<ComDesc | ComponentHead>;
  // name?: string; //名称
  rangeFlag: RangeEnum; //范围标识

  text?: string;
  methods?: [{ evenType: string; refKey: string }]; //引用methodDesc

  _preNode?: ComDesc | ComponentHead;
  _root?: ComponentHead;
  link?: number;
}

interface RouterDesc {
  fullPath: string; //路由的全路劲
  viewName: string; //路由视图的名字
  level: number; //层级深度
  // registName: string; //路由注册的名字；fullPath+:+level 以区别父级
  // routerViewCount?: number;
  // constructor() {}
}

export class ComponentHead {
  type: string; //组件名称英文
  name?: string; //组件名称
  // componentTag = "div";
  rangeFlag: RangeEnum;
  routerDesc?: RouterDesc;

  attrs: { [key: string]: any } = {};
  // props: object = {};
  defaultData?: object = {};
  methodDesc?: { [key: string]: string };
  list: Array<ComDesc | ComponentHead> = [];

  _preNode?: ComDesc | ComponentHead; //组件连通
  _root?: ComponentHead;

  // _preRouteLink?: ComponentHead; //路由连通 使用渲染的数据
  // _nextRouteLink?: ComponentHead; //路由连通
  // _rootLink?: ComponentHead;
  // _root?: ComponentHead;
  editLink: number = 0; //编辑连接
  increment_cursor: number = 0;
  constructor(type: string, rangeFlag: RangeEnum, name?: string) {
    this.type = type;
    this.rangeFlag = rangeFlag;
    this.name = name ? name : type;
  }
}

export class SlotWrapper implements ComDesc {
  componentTag = "div";
  rangeFlag = RangeEnum.ComponentSlot;

  attrs: { [key: string]: any } = {};
  list: ComDesc[] = [];

  _preNode?: ComDesc | ComponentHead;
  _root?: ComponentHead;
  link: number;
  increment_cursor: number = 0;
  constructor(link: number) {
    this.link = link;
  }
}

// export const StartDesign = new ComponentHead(
//   "StartDesign",
//   RangeEnum.ComponentPortal
// );
// StartDesign.attrs = {
//   // class: ["design-component-box"],
//   style: { height: "100%" },
// };
export const clonStartDesign = () => {
  const StartDesign = new ComponentHead(
    "StartDesign",
    RangeEnum.ComponentPortal
  );
  StartDesign.attrs = {
    // class: ["design-component-box"],
    style: { height: "100%" },
  };
  return StartDesign;
};

export const RouterView = new ComponentHead(
  "RouterView",
  RangeEnum.ComponentRouter,
  "路由出口"
);
// RouterView.attrs.class = ["design-router-box"];
RouterView.list = [
  {
    componentTag: "RouterView",
    attrs: {
      name: "default",
      // route: undif
    },
    rangeFlag: RangeEnum.ComponentInnerRouter,
    editLink: ++RouterView.increment_cursor,
    list: [],
  },
];

export const Layout = new ComponentHead("Layout", RangeEnum.ComponentHead);
Layout.list = [
  {
    componentTag: "el-row",
    attrs: {
      gutter: 1,
      justify: "start",
      align: "top",
    },
    rangeFlag: RangeEnum.ComponentInner,
    editLink: ++Layout.increment_cursor,
    list: [
      {
        componentTag: "el-col",
        attrs: {},
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Layout.increment_cursor,
        list: [new SlotWrapper(++Layout.increment_cursor)],
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
    rangeFlag: RangeEnum.ComponentInner,
    editLink: ++Layout.increment_cursor,
    list: [
      {
        componentTag: "el-col",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          style: { height: "1Rem" },
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Layout.increment_cursor,
        list: [new SlotWrapper(++Layout.increment_cursor)],
      },
      {
        componentTag: "el-col",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Layout.increment_cursor,
        list: [new SlotWrapper(++Layout.increment_cursor)],
      },
    ],
  },
];
// Layout.list[1].list[0].list[0].list.push(RouterView);

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

export const Menu = new ComponentHead("Menu", RangeEnum.ComponentHead, "菜单");
Menu.list = [
  {
    componentTag: "el-menu",
    attrs: {
      "default-active": 1,
      mode: "horizontal",
      router: true,
    },
    rangeFlag: RangeEnum.ComponentInner,
    editLink: ++Menu.increment_cursor,
    list: [
      {
        componentTag: "el-menu-item",
        attrs: {
          index: "/a/b",
        },
        text: "Processing Center",
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Menu.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-sub-menu",
        attrs: {
          index: "2",
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Menu.increment_cursor,
        list: [
          {
            componentTag: "template",
            attrs: {
              "#title": null,
            },
            text: "Workspace",
            rangeFlag: RangeEnum.ComponentInnerSlot,
            editLink: ++Menu.increment_cursor,
            list: [],
          },

          {
            componentTag: "el-menu-item",
            attrs: {
              index: "/a/a",
            },
            text: "item one",
            rangeFlag: RangeEnum.ComponentInner,
            editLink: ++Menu.increment_cursor,
            list: [],
          },
          {
            componentTag: "el-menu-item",
            attrs: {
              index: "/a/b",
            },
            text: "item two",
            rangeFlag: RangeEnum.ComponentInner,
            editLink: ++Menu.increment_cursor,
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
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Menu.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-menu-item",
        attrs: {
          index: "/a",
        },
        text: "Orders",
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Menu.increment_cursor,
        list: [],
      },
    ],
  },
];

export const Table = new ComponentHead("Table", RangeEnum.UP_DOWN, "表格");
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
    rangeFlag: RangeEnum.ComponentInner,
    editLink: ++Table.increment_cursor,

    list: [
      {
        componentTag: "el-table-column",
        attrs: {
          fixed: "",
          prop: "date",
          label: "Date",
          width: "250",
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Table.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-table-column",
        attrs: {
          prop: "name",
          label: "Name",
          width: "200",
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Table.increment_cursor,
        list: [],
      },
      {
        componentTag: "el-table-column",
        attrs: {
          prop: "address",
          label: "Address",
          width: "600",
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Table.increment_cursor,
        list: [],
      },

      {
        componentTag: "el-table-column",
        attrs: {
          fixed: "right",
          label: "Operations",
          width: "120",
        },
        rangeFlag: RangeEnum.ComponentInner,
        editLink: ++Table.increment_cursor,
        list: [
          {
            componentTag: "template",
            attrs: {
              //{ row, column, $index }
              "#default": "row",
            },
            rangeFlag: RangeEnum.ComponentInnerSlot,
            editLink: ++Table.increment_cursor,
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
                rangeFlag: RangeEnum.ComponentInner,
                editLink: ++Table.increment_cursor,
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
                rangeFlag: RangeEnum.ComponentInner,
                editLink: ++Table.increment_cursor,
                list: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
