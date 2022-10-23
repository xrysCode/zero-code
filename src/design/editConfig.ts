export interface IPropDesc {
  property: string;
  type: string;
  name: string;
  enumList?: string[];
  defaultValue?: any;
  desc?: string;
}

class PropDesc implements IPropDesc {
  property: string;
  type: string;
  name: string;
  enumList?: string[];
  defaultValue?: any;
  desc?: string;
  constructor(
    property: string,
    type: string,
    name: string,
    enumList?: Array<string>,
    defaultValue?: any,
    desc?: string
  ) {
    this.property = property;
    this.name = name;
    this.type = type;
    this.desc = desc;
    this.enumList = enumList;
    this.defaultValue = defaultValue;
  }
}

export const el_table = {
  attrs: [
    new PropDesc(
      "data",
      "array",
      "显示的数据",
      undefined,
      undefined,
      "显示的数据"
    ),
    new PropDesc(
      "height",
      "string/number",
      "Table 的高度",
      undefined,
      undefined,
      " 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式"
    ),
    new PropDesc(
      "stripe",
      "boolean",
      "斑马纹",
      ["true", "false"],
      "false",
      "是否为斑马纹 table"
    ),
  ],
};

export const el_table_column = {
  attrs: [
    new PropDesc(
      "type",
      "string",
      "列的类型",
      ["selection", "index", "expand"],
      undefined,
      "对应列的类型。 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮"
    ),
    new PropDesc(
      "prop",
      "string",
      "字段名称",
      undefined,
      undefined,
      "对应列内容的字段名， 也可以使用 property属性"
    ),
    new PropDesc(
      "prop",
      "string/number",
      "列的宽度",
      undefined,
      undefined,
      "列的宽度"
    ),
  ],
};
//   { type: "input", label: "名称" },
//   { type: "input-number", label: "栅格宽度" },
//   { type: "input-number", label: "左侧间隔格数" },
//   { type: "input-number", label: "右移栅格数" },
//   { type: "input-number", label: "左移栅格数" },
// ];
