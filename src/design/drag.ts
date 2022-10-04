import {
  //   Layout,
  //   RangeEnum,
  type ComponentWrapper,
  type ComDesc,
  RangeEnum,
} from "@/design/comDesc";
import { useRenderStore } from "@/stores/render";
import { MsgDto, MsgType } from "./PostMeaagae";

enum DropType {
  before = "before",
  after = "after",
  inner = "inner",
}

class DropInfo {
  dropType: DropType; //
  draggingNode?: ComponentWrapper;
  dropNode?: ComponentWrapper;
  constructor(dropType: DropType) {
    this.dropType = dropType;
  }
}

export const dropInfo = new DropInfo(DropType.after);

export const dragstartHandler = (
  ev: DragEvent,
  draggingNode: ComponentWrapper
) => {
  ev.dataTransfer!.setData("text", "");
  dropInfo.draggingNode = draggingNode;
};

/*
不是所有的地方都能拖动进入
1、越过组件：可以位于组件的前或后
2、越过插槽：可以进入内部
*/
export const dragoverHandler = (
  ev: DragEvent,
  dropComponentData: ComponentWrapper
) => {
  ev.stopPropagation();
  const el = ev.currentTarget as Element;
  const dropIndicatorStyle = document.getElementById(
    "design-drop-indicator"
  )!.style;

  if (dropComponentData.rangeFlag == RangeEnum.DROP_SLOT) {
    dropInfo.dropType = DropType.inner;
    el.classList.add("design-drop-inner");
    dropIndicatorStyle.display = "none";
    return;
  }
  //越过组件
  const position = el.getBoundingClientRect();
  const splitPoint = position.top + (position.bottom - position.top) * 0.5;
  if (ev.clientY < splitPoint) {
    dropInfo.dropType = DropType.before;
    dropIndicatorStyle.top = `${position.top - 2}px`;
  } else {
    dropInfo.dropType = DropType.after;
    dropIndicatorStyle.top = `${position.bottom - 2}px`;
  }
  el.classList.remove("design-drop-inner");
  dropIndicatorStyle.removeProperty("display");
  dropIndicatorStyle.left = `${position.left}px`;
  dropIndicatorStyle.width = `${position.width}px`;
  // debugger;
};

export const dragleaveHandler = (ev: DragEvent) => {
  //   console.log("接收到的事件", e);
  //   e.currentTarget.style
  ev.stopPropagation();

  (ev.currentTarget as Element).classList.remove("design-drop-inner");

  //   debugger;
};
//分几种情况，1、有的只能拖拽在里面：组件进入插槽，2、有的只能在上下：组件对应组件，3、满足即可上下也可内部的：组件对组件
//组件内部的元素项拖动，只能上下。
export const dropHandler = (
  ev: DragEvent,
  dropComponentData: ComponentWrapper
) => {
  ev.stopPropagation();
  ev.preventDefault();
  //   debugger;
  document.getElementById("design-drop-indicator")!.style.display = "none";
  (ev.currentTarget as Element).classList.remove("design-drop-inner");

  //组合数据
  dropInfo.dropNode = dropComponentData;
  console.log("接收到的事件", dropInfo, ev);
  //截断原来的数据 删除原来的位置的组件
  const dragNode = dropInfo.draggingNode!;
  const preDragNode = dragNode?._preNode;
  if (preDragNode) {
    const ri = preDragNode.list.indexOf(dragNode);
    preDragNode.list.splice(ri, 1);
  }
  //找打父级的存放集合
  const preDropList = dropInfo.dropNode._preNode!.list;
  const i = preDropList.indexOf(dropComponentData);
  switch (dropInfo.dropType) {
    case DropType.inner:
      dropComponentData.list.push(dropInfo.draggingNode!);
      break;
    case DropType.before:
      preDropList.splice(i, 0, dragNode);
      break;
    case DropType.after:
      preDropList.splice(i + 1, 0, dragNode);
      break;
  }
};

////////////////////////////////////////////////////////

let beforeClickEl: Element;
const faultRecoverMap = new Map<Number, ComponentWrapper | ComDesc>();
/**
 * 点击将当前组件部分船出编辑
 */
export const clickHandler = (
  ev: PointerEvent | Event,
  activeData: ComponentWrapper
) => {
  ev.stopPropagation();
  const el = ev.currentTarget as Element;
  if (beforeClickEl) {
    beforeClickEl.classList.remove("design-active-box");
  }
  el.classList.add("design-active-box");
  beforeClickEl = el;

  //推送数据
  //待优化，为何clone失败
  // const strMsg = copyFragmentData(headerData);
  //   const store = useRenderStore();
  faultRecoverMap.clear();
  const fragmentData = copyFragmentData(activeData) as ComponentWrapper;
  const win = window.top;
  win!.postMessage(
    //将跨域的组件过滤掉
    new MsgDto(MsgType.Edit, undefined, cloneData(fragmentData)),
    "*"
    // win?.location.origin
    // "http://localhost:5173"
  );
  // debugger;
};
function copyFragmentData(
  component: ComponentWrapper | ComDesc
): ComponentWrapper | ComDesc {
  faultRecoverMap.set(component.link!, component);
  const copyData = { ...component };
  if (copyData.list.length > 0) {
    if (copyData.rangeFlag == RangeEnum.DROP_SLOT) {
      //截断
      copyData.list = [];
      return copyData;
    }
    copyData.list = copyData.list.map((com) => {
      return copyFragmentData(com);
    });
  }

  return copyData;
}

// export function recoverData2(newData: ComponentWrapper | ComDesc) {
//   const old = faultRecoverMap.get(newData.link!);
//   //用新值覆盖
//   const mixin = { ...old, ...newData };
//   mixin.list = newData.list.map((com) => {
//     return recoverData(com);
//   });
//   //恢复值
//   if (newData.rangeFlag == RangeEnum.DROP_SLOT) {
//     mixin.list = old!.list;
//   }
//   return mixin;
// }
export function recoverData(
  newData: ComponentWrapper | ComDesc
): ComponentWrapper | ComDesc {
  const old = faultRecoverMap.get(newData.link!);
  if (!old) {
    return newData;
  }
  const beforeList = old.list;
  old.list = newData.list.map((com) => {
    return recoverData(com);
  });
  for (const key in old) {
    if (key != "list") {
      old[key] = newData[key];
    }
  }
  //恢复值
  if (newData.rangeFlag == RangeEnum.DROP_SLOT) {
    old.list = beforeList;
  }
  return old;
}

export function cloneData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (key.startsWith("_")) {
        return null;
      }
      return value;
    })
  );
}
