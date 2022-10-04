<script lang="tsx">
import { defineComponent, h, resolveComponent } from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc,  } from "@/design/comDesc";
import { Layout, RangeEnum ,ComponentWrapper} from "@/design/comDesc";
import { MsgDto, MsgType } from "./PostMeaagae";
import store from "element-plus/es/components/table/src/store";

class DropInfo {
  dropType: String; //before、after、inner
  constructor(dropType: String) {
    this.dropType = dropType;
  }
}

const dropInfo = new DropInfo("");
const ondragover = (ev: DragEvent) => {
  console.log("接收到的事件", ev);
  ev.stopPropagation();
  //   e.currentTarget.style
  const el = ev.currentTarget as Element;
  const dropIndicatorStyle = document.getElementById(
    "design-drop-indicator"
  )!.style;

  const position = el.getBoundingClientRect();
  const interval = position.bottom - position.top;
  const upPoint = position.top + interval * 0.25;
  const downPoint = position.top + interval * 0.75;
  if (ev.clientY < upPoint) {
    dropInfo.dropType = "before";
    el.classList.remove("design-drop-inner");
    dropIndicatorStyle.removeProperty("display");
    dropIndicatorStyle.top = `${position.top - 2}px`;
    dropIndicatorStyle.left = `${position.left}px`;
    dropIndicatorStyle.width = `${position.width}px`;
  } else if (ev.clientY > downPoint) {
    dropInfo.dropType = "after";
    el.classList.remove("design-drop-inner");
    dropIndicatorStyle.removeProperty("display");
    dropIndicatorStyle.top = `${position.bottom - 2}px`;
    dropIndicatorStyle.left = `${position.left}px`;
    dropIndicatorStyle.width = `${position.width}px`;
  } else {
    dropInfo.dropType = "inner";
    el.classList.add("design-drop-inner");
    dropIndicatorStyle.display = "none";
  }
  // debugger;
};

const ondragleave = (ev: DragEvent) => {
  //   console.log("接收到的事件", e);
  //   e.currentTarget.style
  ev.stopPropagation();

  (ev.currentTarget as Element).classList.remove("design-drop-inner");

  //   debugger;
};
const ondrop = (ev: DragEvent) => {
  ev.stopPropagation();
  ev.preventDefault();

  document.getElementById("design-drop-indicator")!.style.display = "none";
  (ev.currentTarget as Element).classList.remove("design-drop-inner");

  console.log("接收到的事件", dropInfo, ev);
  //   e.currentTarget.style

  //   debugger;
};

let activeComponent = null;
let beforeClick: Element | null = null;
const onclick = (ev: PointerEvent | Event, headerData: ComponentWrapper) => {
  //PointerEvent
  const el = ev.currentTarget as Element;
  if (beforeClick != el && beforeClick != null) {
    beforeClick.classList.remove("design-active-box");
  }
  el.classList.add("design-active-box");
  beforeClick = el;
  activeComponent = headerData;
  // debugger;
};

export default defineComponent({

  // 重复使用这个组件来包罗所有的组件
  props: {
    cptWrapper: ComponentWrapper,
  },


  mounted() {
    let beforeElSet = new Set<Element>();
    window.onmessage = (event: MessageEvent) => {
      const msgDto = event.data as MsgDto;
      console.log(msgDto, typeof msgDto, window);
      if (!("type" in msgDto && "type" in msgDto && "position" in msgDto)) {
        return;
      }
      let el: Element;
      switch (msgDto.type) {
        case MsgType.dragover:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y
          ) as Element;

          beforeElSet.forEach((beforeEl) => {
            if (beforeEl != el) {
              beforeElSet.delete(beforeEl);
              beforeEl.classList.remove("design-drop-inner");
            }
          });
          if (beforeElSet.has(el)) {
            el!.dispatchEvent(new DragEvent("dragover", msgDto.position));
          } else {
            beforeElSet.add(el);
            el!.dispatchEvent(new DragEvent("dragleave", msgDto.position));
          }

          break;
        case MsgType.drop:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y
          ) as Element;
          // const dragEv = new DragEvent("drop", msgDto.position);
          // dragEv.dataTransfer = el!.dispatchEvent();

          break;
        case MsgType.dragleave:
          beforeElSet.forEach((beforeEl) => {
            beforeElSet.delete(beforeEl);
            beforeEl.classList.remove("design-drop-inner");
          });
          document.getElementById("design-drop-indicator")!.style.display =
            "none";
          break;
        case MsgType.Edit:
          break;
      }

      // debugger
      console.log(event, window);
    };
  },

  render() {
    const store = useRenderStore();

    function singleRender(
      data: ComDesc | ComponentWrapper,
      headerData: ComponentWrapper
    ): VNode {
      let attrs = data.attrs;
      if (
        data.rangeFlag === RangeEnum.DROP_SLOT ||
        data.rangeFlag == RangeEnum.START
      ) {
        attrs.ondragover = ondragover;
        attrs.ondragleave = ondragleave;
        attrs.ondrop = ondrop;
        attrs.class = ["design-box"];
        // attrs.onClick = onclick(event, headerData);
        attrs.onClick = (this.$event, store) => onclick(ev, store);
      }

      return h(resolveComponent(data.componentTag), attrs, depthFun(data.list));
    }

    function depthFun(
      data: ComDesc | ComDesc[] | ComponentWrapper | ComponentWrapper[]
    ): VNode | VNode[] {
      if (data instanceof Array) {
        return data.map((item) => {
          return singleRender(item);
        });
      } else {
        return singleRender(data);
      }
    }
    // {
    //   ondragover;
    //   ondragleave;
    //   ondrop;
    // }
    return [
      <div
        id="design-drop-indicator"
        class="design-drop-indicator"
        style="display: none"
      ></div>,
      depthFun(store.renderData),
    ];
  },
});
</script>

<!-- <style lang="scss">
      // .design{
      //   outline: 1px dashed rgb(187, 187, 187);
      // }
    .el-row {
    
      margin-bottom: 20px;
    }
    .el-row:last-child {
      margin-bottom: 0;
    }
    .el-col {
      border-radius: 4px;
    }
    
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
    </style> -->
