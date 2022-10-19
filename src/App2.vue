<!-- <template>
  <RouterView />
</template> -->

<script lang="tsx">
import { RouterLink, RouterView } from "vue-router";
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
import * as DragHandler from "@/design/designUtils";
import { saveData } from "@/design/saveDataUtils";
import { MsgDto, MsgType } from "@/design/postMeaagae";
import router from "./router";
import type { RenderComponentProps } from "@/design/saveDataUtils";
// import RenderDesign from "@/design/RenderDesign.vue";

export default defineComponent({
  // props: {
  //   renderData: { type: ComponentHead, required: true },
  // },
  components: { RouterView },
  data() {
    // return {
    //   renderData: {},
    // };
  },
  mounted() {
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
        case MsgType.SAVE:
          const store = useRenderStore();
          localStorage.clear();
          store.renderMap.forEach((v, k) => {
            saveData(v, k);
          });
          break;
      }
    };
  },

  render() {
    const store = useRenderStore();
    // store.$subscribe(
    //   (mutation, state) => {
    //     const value = mutation.events.newValue; //as RenderComponentProps;
    //     // const root = value._root!;
    //     let routerData = null;
    //     let registName = null;
    //     if (value.rangeFlag >= 0) {
    //       const routerRoot = (value as ComDesc)._root as ComponentHead;
    //       if (!routerRoot) {
    //         //未渲染使用的数据
    //         console.log("未保存数据", value);
    //         return;
    //       }
    //       const routerDesc = routerRoot.routerDesc!;
    //       registName = routerDesc.registName;
    //       routerData = state.renderMap.get(registName);
    //     } else {
    //       const com = Object.entries(value)[0][1].renderData as ComponentHead;
    //       registName = com.routerDesc!.fullPath;
    //       routerData = value;
    //     }

    //     saveData(routerData, registName);
    //   },
    //   { deep: true }
    // );

    return [
      <div
        id="design-drop-indicator"
        class="design-drop-indicator"
        style="display: none"
      ></div>,
      // <RenderDesign renderData={store.renderData} />,
      // <RenderDesign renderData={this.renderData} />,
      <RouterView />,
    ];
  },
});
</script>
