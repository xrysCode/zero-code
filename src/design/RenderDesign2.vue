<script lang="tsx">
import {
  defineComponent,
  h,
  resolveComponent,
  toRaw,
  createTextVNode as _createTextVNode,
  type Slot,
  type ConcreteComponent,
  type Slots,
} from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc } from "@/design/componentDesc";
import { Layout, RangeEnum, ComponentWrapper } from "@/design/componentDesc";
import { MsgDto, MsgType } from "./postMeaagae";
import * as DragHandler from "./designUtils";

export default defineComponent({
  // 重复使用这个组件来包罗所有的组件
  props: {
    renderData: { type: ComponentWrapper, required: true },
    preData: { type: ComponentWrapper }, //组件插槽都是这个
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

    const methodCacheMap = new Map<string, string>();
    function extractMethod(data: ComponentWrapper | ComDesc) {
      if (data.rangeFlag & RangeEnum.START) {
        const methodDesc = (data as ComponentWrapper).methodDesc;
        for (const key in methodDesc) {
          const funStr = methodDesc[key];
          methodCacheMap.set(key, funStr);
        }
      }
    }
    // 使用字符串构建 但是闭包参数和解。

    function mixinAttrs(
      data: ComDesc | ComponentWrapper,
      slotArgs?: string
    ): any {
      const mixinAttrs = { ...data.attrs };
      if (data.rangeFlag & RangeEnum.DROP_SLOT) {
        mixinAttrs.class = ["design-box"];
        mixinAttrs.ondragover = (ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, data as ComponentWrapper);
        mixinAttrs.ondragleave = (ev: DragEvent) =>
          DragHandler.dragleaveHandler(ev);
        mixinAttrs.ondrop = (ev: DragEvent) =>
          DragHandler.dropHandler(ev, data as ComponentWrapper); //任何数据释放后都选中这个框，触发点击选中
      }
      if (data.rangeFlag == RangeEnum.START) {
        mixinAttrs.class = ["design-box"];
        mixinAttrs.draggable = true;
        mixinAttrs.ondragstart = (ev: DragEvent) =>
          DragHandler.dragstartHandler(ev, __this.renderData);
        mixinAttrs.ondragover = (ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, data as ComponentWrapper);
        mixinAttrs.ondrop = (ev: DragEvent) =>
          DragHandler.dropHandler(ev, data as ComponentWrapper); //组件需要找到上一级的list集合？？？？？？？？？？

        mixinAttrs.onClick = (ev: PointerEvent) =>
          DragHandler.clickHandler(ev, __this.renderData);
      }
      //植入方法
      const methods = (data as ComDesc).methods;
      if (methods && methods.length > 0) {
        methods.forEach((m) => {
          mixinAttrs["on" + m.evenType] = (ev: Event) =>
            // $setup.handleClick(row) 如何闭包这个row
            //
            methodCacheMap.get(m.refKey)(slotArgs);
          //这里如何传递？？？？？？？？？？？？？？
        });
      }

      return mixinAttrs;
    }

    function singleDepthRender(
      data: ComDesc | ComponentWrapper,
      preData?: ComDesc | ComponentWrapper,
      slotArgs?: string
    ): VNode {
      //不是自己，且遇到下一次 使用自身渲染
      if (!isSelfFirst && data.rangeFlag === RangeEnum.START) {
        return h(selfCom, { renderData: data, preData: preData });
      }
      data._preNode = preData;
      isSelfFirst = false;

      extractMethod(data);
      const newAttrs = mixinAttrs(data, slotArgs);
      const childSolts = {} as { [name: string]: any }; // { [key: string]: Function };

      const defaultSlots = [] as VNode[];
      data.list.map((item) => {
        if (item.rangeFlag == RangeEnum.INNER_SOLT) {
          for (const key in item.attrs) {
            const v = item.attrs[key];
            const slotArr = [];
            //当前级的文本
            const text = (data as ComDesc).text;
            if (text) {
              slotArr.push(text);
            }
            //所有的下级渲染
            item.list.map((ic) => {
              slotArr.push(singleDepthRender(ic, item, v));
            });
            //去掉#
            // childSolts[key.substr(1)] = (v) => slotArr;
            childSolts[key.substr(1)] = eval(`${v} => slotArr`);
          }
          return;
        }
        //其他都是默认放入
        defaultSlots.push(singleDepthRender(item, data));
      });
      const text = (data as ComDesc).text;
      if (text) {
        defaultSlots.push(_createTextVNode(text));
      }
      if (defaultSlots.length > 0) {
        childSolts.default = () => defaultSlots;
      }
      return h(
        resolveComponent(data.componentTag) as ConcreteComponent,
        newAttrs,
        childSolts
      );
    }

    return singleDepthRender(this.$props.renderData!, this.preData);
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
