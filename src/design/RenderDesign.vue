<script lang="tsx">
import { defineComponent, h, resolveComponent, toRaw } from "vue";
import type { VNode } from "vue";
import { useRenderStore } from "@/stores/render";
import type { ComDesc } from "@/design/comDesc";
import { Layout, RangeEnum, ComponentWrapper } from "@/design/comDesc";
import { MsgDto, MsgType } from "./PostMeaagae";
import * as DragHandler from "./drag";

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

    function singleRender(
      data: ComDesc | ComponentWrapper,
      preData?: ComDesc | ComponentWrapper
    ): VNode {
      //不是自己，且遇到下一次 使用自身渲染
      if (!isSelfFirst && data.rangeFlag === RangeEnum.START) {
        return h(
          selfCom,
          { renderData: data, preData: preData },
          depthFun(data.list, data)
        );
      }
      data._preNode = preData;
      isSelfFirst = false;

      let mixinAttrs = { ...data.attrs };
      if (data.rangeFlag === RangeEnum.DROP_SLOT) {
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

      return h(
        resolveComponent(data.componentTag),
        mixinAttrs,
        depthFun(data.list, data)
      );
    }

    function depthFun(
      data: ComDesc | ComDesc[] | ComponentWrapper | ComponentWrapper[],
      preData?: ComDesc | ComponentWrapper
    ): VNode | VNode[] {
      if (data instanceof Array) {
        return data.map((item) => {
          return singleRender(item, preData);
        });
      } else {
        return singleRender(data, preData);
      }
    }

    return depthFun(this.$props.renderData!, this.preData);
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
