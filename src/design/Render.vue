<script lang="ts">
import { defineComponent, h, resolveComponent } from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc } from "@/design/comDesc";
import { Layout, RangeEnum } from "@/design/comDesc";
import { MsgDto, MsgType } from "./PostMeaagae";

const ondragover = (ev: DragEvent) => {
  console.log("接收到的事件", ev);
  ev.stopPropagation();
  //   e.currentTarget.style
  const el = ev.currentTarget as Element;
  el.classList.add("diag-inner");

  //   debugger;
};

const ondragleave = (ev: DragEvent) => {
  //   console.log("接收到的事件", e);
  //   e.currentTarget.style
  ev.stopPropagation();
  const el = ev.currentTarget as Element;
  el.classList.remove("diag-inner");

  //   debugger;
};
const ondrop = (ev: DragEvent) => {
  ev.stopPropagation();
  ev.preventDefault();
  console.log("接收到的事件", ev);
  //   e.currentTarget.style
  const el = ev.currentTarget as Element;
  el.classList.remove("diag-inner");

  //   debugger;
};

export default defineComponent({
  mounted() {
    let beforeElSet = new Set<Element>();
    window.onmessage = (event: MessageEvent) => {
      const msgDto = event.data as MsgDto;
      console.log(msgDto, typeof msgDto, window);
      if (!("type" in msgDto && "type" in msgDto && "position" in msgDto)) {
        return;
      }
      //   if (msgDto.hasOwnProperty("xx")!(msgDto.type&& instanceof MsgDto)) {
      //     return;
      //   }
      let el: Element;
      switch (msgDto.type) {
        case MsgType.dragover:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y
          ) as Element;

          beforeElSet.forEach((beforeEl) => {
            if (beforeEl != el) {
              beforeEl.classList.remove("diag-inner");
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
          el!.dispatchEvent(new DragEvent("drop", msgDto.position));

          break;
        case MsgType.Edit:
          break;
      }

      // document.elementFromPoint(a.x, a.y)
      // document.dispatchEvent()
      // debugger
      console.log(event, window);
    };
  },

  render() {
    const store = useRenderStore();

    function singleRender(data: ComDesc): VNode {
      let attrs = data.attrs;
      if (
        data.rangeFlag === RangeEnum.DROP_SLOT ||
        data.rangeFlag == RangeEnum.START
      ) {
        attrs.ondragover = ondragover;
        attrs.ondragleave = ondragleave;
        attrs.ondrop = ondrop;
      }

      return h(resolveComponent(data.componentTag), attrs, depthFun(data.list));
    }

    function depthFun(data: ComDesc | ComDesc[]): VNode | VNode[] {
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
    return h("div", { {
      ondragover;
      ondragleave;
      ondrop;
    } }, depthFun(store.renderData));
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
