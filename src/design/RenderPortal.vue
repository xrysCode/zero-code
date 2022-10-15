<script lang="tsx">
import { defineComponent, h, resolveComponent } from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc } from "@/design/componentDesc";
import {
  Layout,
  RangeEnum,
  ComponentHead,
  StartDesign,
} from "@/design/componentDesc";
import * as DragHandler from "./designUtils";
import { MsgDto, MsgType } from "./postMeaagae";
import Render from "./RenderDesign.vue";

export default defineComponent({
  components: { Render },

  data() {
    return {
      renderData: {},
    };
  },
  mounted() {
    const store = useRenderStore();

    let beforeElSet = new Set<Element>();
    window.onmessage = (event: MessageEvent) => {
      const msgDto = event.data as MsgDto;
      if (
        !(
          "operateType" in msgDto &&
          "editData" in msgDto &&
          "position" in msgDto
        )
      ) {
        return;
      }
      let el: Element;
      switch (
        msgDto.operateType //这里是被设计的，里面含拖拽，点击选中，发送的数据，同时也接收回传修改后的数据
      ) {
        case MsgType.dragover:
          el! = document.elementFromPoint(
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
            el.dispatchEvent(new DragEvent("dragover", msgDto.position));
          } else {
            beforeElSet.add(el);
            el.dispatchEvent(new DragEvent("dragleave", msgDto.position));
          }

          break;
        case MsgType.drop:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y
          ) as Element;

          // eslint-disable-next-line no-case-declarations
          const dropEv = new DragEvent("drop", {
            ...msgDto.position,
            dataTransfer: new DataTransfer(),
          });
          //后置填充开始的数据，然后由事件触发结束，执行默认拖动结束
          DragHandler.dragstartHandler(dropEv, msgDto.editData!, true);
          el.dispatchEvent(dropEv);
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
          //更新数据
          // eslint-disable-next-line no-case-declarations
          const newData = DragHandler.recoverData(msgDto.editData!);
          console.log("编辑的数据消息", newData);
          // store.recoverData(msgDto.editData!);
          break;
      }
    };
  },

  render() {
    const store = useRenderStore();
    store.$subscribe(
      (mutation, state) => {
        localStorage.setItem(
          "renderData",
          DragHandler.object2Str(state.renderData)
        );
      },
      { deep: true }
    );
    return [
      <div
        id="design-drop-indicator"
        class="design-drop-indicator"
        style="display: none"
      ></div>,
      <Render renderData={store.renderData} />,
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
