UP_DOWN
<script lang="tsx">
import {
  defineComponent,
  h,
  resolveComponent,
  toRaw,
  createTextVNode as _createTextVNode,
} from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc } from "@/design/componentDesc";
import { Layout, RangeEnum, ComponentHead } from "@/design/componentDesc";
import { MsgDto, MsgType } from "./postMeaagae";
import * as DragHandler from "./designUtils";

export default defineComponent({
  // 重复使用这个组件来包罗所有的组件
  props: {
    renderData: { type: ComponentHead, required: true },
    preData: { type: ComponentHead }, //组件插槽都是这个
  },
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      //如果相同就选中
      if (DragHandler.dropInfo.draggingNode == toRaw(this.renderData)) {
        this.$el.dispatchEvent(new PointerEvent("click"));
      }
    });
  },
  render() {
    const __this = this;
    const selfCom = this.$.type;
    let isSelfFirst = true;

    function mixinAttrs(data: ComDesc | ComponentHead, slotArgs?: object): any {
      const mixinAttrs = { ...data.attrs };
      if (data.rangeFlag & RangeEnum.ComponentSlot) {
        mixinAttrs.class = ["design-slot-box"];
        mixinAttrs.ondragover = (ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, data as ComponentHead);
        mixinAttrs.ondragleave = (ev: DragEvent) =>
          DragHandler.dragleaveHandler(ev);
        mixinAttrs.ondrop = (ev: DragEvent) =>
          DragHandler.dropHandler(ev, data as ComponentHead); //任何数据释放后都选中这个框，触发点击选中
      }
      if (data.rangeFlag & RangeEnum.ComponentHead) {
        mixinAttrs.class = ["design-component-box"];
        mixinAttrs.draggable = null;
        mixinAttrs.ondragstart = (ev: DragEvent) =>
          DragHandler.dragstartHandler(ev, __this.renderData);
        mixinAttrs.ondragover = (ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, data as ComponentHead);
        mixinAttrs.ondrop = (ev: DragEvent) =>
          DragHandler.dropHandler(ev, data as ComponentHead); //组件需要找到上一级的list集合？？？？？？？？？？

        mixinAttrs.onClick = (ev: PointerEvent) =>
          DragHandler.clickHandler(
            ev,
            __this.renderData,
            () => (__this.isActive = !__this.isActive)
          );
      }
      //植入方法
      const methods = (data as ComDesc).methods;
      if (methods && methods.length > 0) {
        methods.forEach((m) => {
          mixinAttrs["on" + m.evenType] = (ev: Event) =>
            methodCacheMap.get(m.refKey)!(slotArgs);
        });
      }

      return mixinAttrs;
    }

    const methodCacheMap = new Map<string, Function>();
    function extractMethod(data: ComponentHead | ComDesc) {
      if (data.rangeFlag & RangeEnum.UP_DOWN) {
        const methodDesc = (data as ComponentHead).methodDesc;
        for (const key in methodDesc) {
          const fun = methodDesc[key];
          methodCacheMap.set(key, eval(fun));
        }
      }
    }

    function singleDepthRender(
      data: ComDesc | ComponentHead,
      preData?: ComDesc | ComponentHead,
      slotArgs?: object
    ): VNode {
      //不是自己，且遇到下一次 使用自身渲染
      if (!isSelfFirst && data.rangeFlag & RangeEnum.UP_DOWN) {
        return h(selfCom, { renderData: data, preData: preData });
      }
      data._preNode = preData;
      isSelfFirst = false;

      extractMethod(data);
      const newAttrs = mixinAttrs(data, slotArgs);
      const childSolts = {} as { [name: string]: any }; // { [key: string]: Function };

      const defaultSlots = [] as VNode[];
      if (data.list) {
        data.list.map((item) => {
          if (item.rangeFlag == RangeEnum.ComponentInnerSlot) {
            for (const key in item.attrs) {
              //去掉#
              childSolts[key.substr(1)] = (slotArgs: object) => {
                const slotArr = [];
                //当前级的文本
                const text = (data as ComDesc).text;
                if (text) {
                  slotArr.push(text);
                }
                //所有的下级渲染
                item.list.map((ic) => {
                  slotArr.push(singleDepthRender(ic, item, slotArgs));
                });
                return slotArr;
              };
            }
            return;
          }
          //其他都是默认放入
          defaultSlots.push(singleDepthRender(item, data));
        });
      }

      const text = (data as ComDesc).text;
      if (text) {
        defaultSlots.push(_createTextVNode(text));
      }
      if (defaultSlots.length > 0) {
        childSolts.default = () => defaultSlots;
      }
      return h(
        resolveComponent(data.componentTag) as ComponentHead,
        newAttrs,
        childSolts
      );
    }

    return (
      <div
        draggable
        onClick={(ev: MouseEvent) =>
          DragHandler.clickHandler(
            ev,
            __this.renderData,
            () => (__this.isActive = !__this.isActive)
          )
        }
        onDragstart={(ev: DragEvent) =>
          DragHandler.dragstartHandler(ev, __this.renderData)
        }
        onDragover={(ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, this.renderData as ComponentHead)
        }
        onDrop={(ev: DragEvent) =>
          DragHandler.dropHandler(ev, this.renderData as ComponentHead)
        }
      >
        <div class={["design-operate"]}>
          <delete
            onClick={(ev: PointerEvent) =>
              DragHandler.deleteHandler(ev, __this.renderData)
            }
          />
        </div>
        singleDepthRender(this.renderData!.list, this.preData),
      </div>
    );
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
