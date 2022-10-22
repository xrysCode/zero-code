import { ComponentHead, type ComDesc, RangeEnum } from "@/design/componentDesc";
import { useRenderStore } from "@/stores/render";
import type { DefineComponent } from "vue";
import type RenderDesign from "./RenderDesign.vue";
import { MsgDto, MsgType } from "./postMeaagae";
import { addInitChildRoute } from "@/router";

enum DropType {
  before = "before",
  after = "after",
  inner = "inner",
}

class DropInfo {
  dropType?: DropType; //
  draggingNode?: ComponentHead;
  dropNode?: ComponentHead;
  isAdd: boolean = false;
  constructor(dropType?: DropType) {
    this.dropType = dropType;
  }
}

export const dropInfo = new DropInfo();

export const dragstartHandler = (
  ev: DragEvent,
  draggingNode: ComponentHead,
  isAdd: boolean = false
) => {
  ev.dataTransfer!.setData("text", "");
  dropInfo.draggingNode = draggingNode;
  dropInfo.isAdd = isAdd;
  dropInfo.dropNode = undefined;
  if (!isAdd) {
    //不是新增的时候重置
    dropInfo.dropType = undefined;
  }

  console.log("开始拖拽", dropInfo, ev);
};

/*
不是所有的地方都能拖动进入
1、越过组件：可以位于组件的前或后
2、越过插槽：可以进入内部
*/
export const dragoverHandler = (
  ev: DragEvent,
  dropComponentData: ComponentHead
) => {
  ev.stopPropagation();
  if (dropComponentData == dropInfo.draggingNode) {
    console.log("进入自己");
    return;
  }
  ev.preventDefault();
  const el = ev.currentTarget as Element;
  const dropIndicatorStyle = document.getElementById(
    "design-drop-indicator"
  )!.style;
  const position = el.getBoundingClientRect();
  let showInnerColer = false;
  if (dropComponentData.rangeFlag & RangeEnum.UP_INNER_DOWN) {
    //越过组件,在组件的前后插队
    const splitPoint1 = position.top + (position.bottom - position.top) * 0.25;
    const splitPoint2 = position.top + (position.bottom - position.top) * 0.75;
    if (ev.clientY < splitPoint1) {
      dropInfo.dropType = DropType.before;
      dropIndicatorStyle.top = `${position.top - 2}px`;
    } else if (ev.clientY > splitPoint2) {
      dropInfo.dropType = DropType.after;
      dropIndicatorStyle.top = `${position.bottom - 2}px`;
    } else {
      showInnerColer = true;
      dropInfo.dropType = DropType.inner;
    }
  } else if (dropComponentData.rangeFlag & RangeEnum.UP_DOWN) {
    //越过组件,在组件的前后插队
    const splitPoint = position.top + (position.bottom - position.top) * 0.5;
    if (ev.clientY < splitPoint) {
      dropInfo.dropType = DropType.before;
      dropIndicatorStyle.top = `${position.top - 2}px`;
    } else {
      dropInfo.dropType = DropType.after;
      dropIndicatorStyle.top = `${position.bottom - 2}px`;
    }
  }
  //  else if (dropComponentData.rangeFlag & RangeEnum.INNER_ROUTER) {
  //   //内部如果存在数据，那么展示的是最后组件的指示线
  //   dropInfo.dropType = DropType.inner;
  //   if (dropComponentData.list.length > 0) {
  //     position = el.lastElementChild!.getBoundingClientRect();
  //     dropIndicatorStyle.top = `${position.bottom - 2}px`;
  //   } else {
  //     showInnerColer = true;
  //   }
  // }
  if (showInnerColer) {
    el.classList.add("design-drop-inner");
    dropIndicatorStyle.display = "none";
  } else {
    el.classList.remove("design-drop-inner");
    dropIndicatorStyle.removeProperty("display");
    dropIndicatorStyle.left = `${position.left}px`;
    dropIndicatorStyle.width = `${position.width}px`;
  }
};

export const dragleaveHandler = (ev: DragEvent) => {
  ev.stopPropagation();
  (ev.currentTarget as Element).classList.remove("design-drop-inner");
  //   debugger;
};
//分几种情况，1、有的只能拖拽在里面：组件进入插槽，2、有的只能在上下：组件对应组件，3、满足即可上下也可内部的：组件对组件
//组件内部的元素项拖动，只能上下。
export const dropHandler = (
  ev: DragEvent,
  dropComponentData: ComponentHead
) => {
  ev.stopPropagation();
  ev.preventDefault();
  //   debugger;
  document.getElementById("design-drop-indicator")!.style.display = "none";
  (ev.currentTarget as Element).classList.remove("design-drop-inner");

  //组合数据
  dropInfo.dropNode = dropComponentData;
  console.log("结束拖拽", dropInfo, ev);
  if (dropInfo.draggingNode == dropInfo.dropNode) {
    console.log("相同的数据");
    return;
  }

  //截断原来的数据 删除原来的位置的组件
  const dragNode = dropInfo.draggingNode!;
  const preDragNode = dragNode?._preNode;
  if (preDragNode) {
    //新增来的没有这个值--
    const removeIndex = preDragNode.list.indexOf(dragNode);
    preDragNode.list.splice(removeIndex, 1);
  }

  if (dropInfo.dropType == DropType.inner) {
    dropComponentData.list.push(dragNode);

    //拖动节点是路由初始他，并刷新路由
    if (dragNode.rangeFlag & RangeEnum.ROUTER) {
      // const rootRouter = dropInfo.dropNode._root?.routerDesc;
      //第一次进入路由, 只能通过外部进入，不能通过路由标签进去
      addInitChildRoute(dropInfo.dropNode);
      // return;
    }
    return;
  }

  //找到父级的存放集合
  const preDropList = dropInfo.dropNode._preNode!.list;
  const i = preDropList.indexOf(dropComponentData);
  switch (dropInfo.dropType) {
    case DropType.before:
      preDropList.splice(i, 0, dragNode);
      break;
    case DropType.after:
      preDropList.splice(i + 1, 0, dragNode);
      break;
  }
};

////////////////////////////////////////////////////////

// let beforeClickEl: Element;
// let beforeClickVm: DefineComponent;
let beforeClickFun: Function;
const faultRecoverMap = new Map<Number, ComponentHead | ComDesc>();
/**
 * 点击将当前组件部分船出编辑
 */
export const clickHandler = (
  ev: PointerEvent | Event,
  activeData: ComponentHead,
  resetIsActive: Function
) => {
  ev.stopPropagation();
  if (beforeClickFun) {
    beforeClickFun();
  }

  beforeClickFun = resetIsActive;
  resetIsActive();
  // const el = ev.currentTarget as Element;
  // if (beforeClickEl) {
  //   beforeClickEl.classList.remove("design-active-box");
  // }
  // el.classList.add("design-active-box");
  // beforeClickEl = el;
  // debugger;
  //推送数据
  //待优化，为何clone失败
  // const strMsg = copyFragmentData(headerData);
  //   const store = useRenderStore();
  faultRecoverMap.clear();
  const fragmentData = copyFragmentData(activeData) as ComponentHead;
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

export const deleteHandler = (
  ev: PointerEvent | Event,
  activeData: ComponentHead
) => {
  ev.stopPropagation();
  const preDropList = activeData._preNode!.list;
  const i = preDropList.indexOf(activeData);
  preDropList.splice(i, 1);

  const win = window.top;
  win!.postMessage(
    //将跨域的组件过滤掉
    new MsgDto(
      MsgType.Edit,
      undefined,
      new ComponentHead("", RangeEnum.ComponentHead)
    ),
    "*"
    // win?.location.origin
    // "http://localhost:5173"
  );
  // debugger;
};

function copyFragmentData(
  component: ComponentHead | ComDesc
): ComponentHead | ComDesc {
  faultRecoverMap.set(component.editLink!, component);
  const copyData = { ...component };
  if (copyData.list && copyData.list.length > 0) {
    if (copyData.rangeFlag == RangeEnum.ComponentSlot) {
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

// export function recoverData2(newData: ComponentHead | ComDesc) {
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
  newData: ComponentHead | ComDesc
): ComponentHead | ComDesc {
  const old = faultRecoverMap.get(newData.editLink!);
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
  if (newData.rangeFlag == RangeEnum.ComponentSlot) {
    old.list = beforeList;
  }
  return old;
}

export function object2Str(data: any): string {
  return JSON.stringify(data, (key, value) => {
    if (key.startsWith("_")) {
      return undefined;
    }
    return value;
  });
}

export function cloneData<T>(data: T): T {
  return JSON.parse(object2Str(data));
}
