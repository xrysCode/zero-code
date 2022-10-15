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
    // this.$nextTick(() => {
    //   //如果相同就选中
    //   if (DragHandler.dropInfo.draggingNode == toRaw(this.renderData)) {
    //     this.$el.dispatchEvent(new PointerEvent("click"));
    //   }
    // });
  },
  render() {
    const __this = this;
    const selfCom = this.$.type;
    const _renderData = this.renderData;
    const _preData = this.preData;

    if (!_preData) {
      _renderData._preNode = _renderData;
      _renderData._root = _renderData;
    } else {
      _renderData._preNode = _preData;
      _renderData._root = _preData._root;
    }

    function mixinAttrs(data: ComDesc | ComponentHead, slotArgs?: object): any {
      const mixinAttrs = { ...data.attrs };
      mixinAttrs.class = mixinAttrs.class ? mixinAttrs.class : [];

      //组件样式
      if (data.rangeFlag & (RangeEnum.ENTRY | RangeEnum.START)) {
        mixinAttrs.class.push("design-component-box");
        if (data.rangeFlag & RangeEnum.START) {
          mixinAttrs.onClick = (ev: MouseEvent) =>
            DragHandler.clickHandler(
              ev,
              data as ComponentHead,
              () => (__this.isActive = !__this.isActive)
            );
        }
      }
      if (data.rangeFlag & RangeEnum.ROUTER) {
        mixinAttrs.class.push("design-router-box");
      }
      if (data.rangeFlag & RangeEnum.SLOT_OUT) {
        mixinAttrs.class.push("design-slot-box");
      }

      //允许拖拽
      if (data.rangeFlag & RangeEnum.DRAG) {
        mixinAttrs.draggable = true;
        mixinAttrs.onDragstart = (ev: DragEvent) =>
          DragHandler.dragstartHandler(ev, _renderData);
      }
      //拖拽浮动效果
      if (data.rangeFlag & (RangeEnum.UP_DOWN | RangeEnum.UP_INNER_DOWN)) {
        mixinAttrs.ondragover = (ev: DragEvent) =>
          DragHandler.dragoverHandler(ev, data as ComponentHead);
        mixinAttrs.ondragleave = (ev: DragEvent) =>
          DragHandler.dragleaveHandler(ev);
        mixinAttrs.ondrop = (ev: DragEvent) =>
          DragHandler.dropHandler(ev, data as ComponentHead);
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
    const methodDesc = this.renderData.methodDesc;
    for (const key in methodDesc) {
      const fun = methodDesc[key];
      methodCacheMap.set(key, eval(fun));
    }

    function singleDepthRender(
      dataList: Array<ComDesc | ComponentHead>,
      preData?: ComDesc | ComponentHead,
      slotArgs?: object
    ): VNode[] {
      if (!dataList || dataList.length == 0) {
        return [];
      }
      return dataList.map((item) => {
        //不是自己，且遇到下一次 使用自身渲染
        if (item.rangeFlag & RangeEnum.START) {
          return h(selfCom, { renderData: item, preData: preData });
        }
        item = item as ComDesc;
        item._preNode = preData;
        item._root = preData?._root;

        const newAttrs = mixinAttrs(item, slotArgs);

        const childSoltFuns = {} as { [name: string]: any }; // { [key: string]: Function };
        //内部插槽
        if (item.rangeFlag & RangeEnum.ComponentInnerSlot) {
          for (const key in item.attrs) {
            //去掉#
            childSoltFuns[key.substr(1)] = (slotArgs: object) => {
              const slotArr = [];
              const text = (item as ComDesc).text;
              if (text) {
                slotArr.push(text);
              }
              //所有的下级提级渲染
              slotArr.push(...singleDepthRender(item.list, item, slotArgs));
              return slotArr;
            };
          }
        } else {
          //其他都是默认放入
          //  const defaultSlots singleDepthRender(item.list, item, slotArgs)
          //当前级的文本
          childSoltFuns.default = () => {
            const defaultSlots = [] as VNode[];
            const text = (item as ComDesc).text;
            if (text) {
              defaultSlots.push(_createTextVNode(text));
            }
            defaultSlots.push(...singleDepthRender(item.list, item, slotArgs));
            return defaultSlots;
          };
        }

        return h(
          resolveComponent(item.componentTag) as ComponentHead,
          newAttrs,
          childSoltFuns
        );
      });
    }
    const newAttrs = mixinAttrs(this.renderData, undefined);
    return (
      <div {...newAttrs} class={this.isActive ? "design-active-box" : ""}>
        {this.isActive ? (
          <div class={["design-operate"]}>
            <delete
              style="width: 1rem; height: 1rem; margin-right: 8px"
              onClick={(ev: PointerEvent) =>
                DragHandler.deleteHandler(ev, _renderData)
              }
            />
          </div>
        ) : undefined}

        {singleDepthRender(_renderData.list, _renderData)}
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
