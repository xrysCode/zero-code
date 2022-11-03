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
import { ElMessage } from "element-plus";
// import { Top } from "@element-plus/icons-vue/components";

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
      //路由包装才给包装的样式
      if (data.rangeFlag == RangeEnum.ComponentRouter) {
        mixinAttrs.class.push("design-router-box");
      }
      if (data.rangeFlag & RangeEnum.SLOT_OUT) {
        mixinAttrs.class.push("design-slot-box");
      }

      //允许拖拽
      if (data.rangeFlag & RangeEnum.DRAG) {
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

    function childDepthRender(
      data: ComDesc | ComponentHead,
      preData: ComDesc | ComponentHead,
      slotArgs?: object
      // 函数
    ): VNode {
      data._preNode = preData;
      data._root = preData?._root;

      //不是自己，且遇到下一次 使用自身渲染
      if (data.rangeFlag & RangeEnum.START) {
        return h(selfCom, { renderData: data, preData: preData });
      }

      data = data as ComDesc;
      const newAttrs = mixinAttrs(data, slotArgs);
      if (data.rangeFlag & RangeEnum.ROUTER) {
        return h(resolveComponent(data.componentTag), newAttrs);
      }

      //组合插槽先
      const childSoltFuns = {} as { [name: string]: Function };
      const defaultSlots = [] as VNode[];
      const dataList = data.list;
      for (let index = 0; index < dataList.length; index++) {
        const item = dataList[index] as ComDesc;
        if (item.rangeFlag & RangeEnum.SLOT_INNER) {
          //内部插槽，提取出来。
          for (const key in item.attrs) {
            //去掉#
            childSoltFuns[key.substr(1)] = (slotArgs: object) => {
              const slotArr = [];
              if (item.text) {
                slotArr.push(item.text);
              }
              //所有的下级提级渲染
              item.list.forEach((c) => {
                slotArr.push(childDepthRender(c, item, slotArgs));
              });
              return slotArr;
            };
          }
          continue;
        }

        defaultSlots.push(childDepthRender(item, data, slotArgs));
      }
      //其他都是默认放入
      if (data.text) {
        defaultSlots.push(_createTextVNode(data.text));
      }
      if (defaultSlots.length > 0) {
        childSoltFuns.default = () => defaultSlots;
      }
      return h(
        resolveComponent(data.componentTag) as ComponentHead,
        newAttrs,
        childSoltFuns
      );
    }

    const newAttrs = mixinAttrs(this.renderData, undefined);
    // <bottom
    //           style="width: 1rem; height: 1rem; margin-right: 8px"
    //           onClick={(ev: PointerEvent) =>
    //             DragHandler.deleteHandler(ev, _renderData)
    //           }
    //         />
    return (
      <div {...newAttrs} class={this.isActive ? "design-active-box" : ""}>
        {this.isActive ? (
          <div class={["design-operate-left"]}>
            <top
              style="width: 1rem; height: 1rem; margin-right: 8px"
              onClick={(ev: PointerEvent) => this.activeComponent(ev, "pre")}
            />
            <edit style="width: 1rem; height: 1rem; margin-right: 8px" />
            <rank
              style="width: 1rem; height: 1rem; margin-right: 8px"
              onMousedown={(ev: PointerEvent) =>
                (ev.target.parentElement.parentElement.draggable = true)
              }
              onMouseleave={(ev: PointerEvent) => {
                this.isActive = true;
                ev.target.parentElement.parentElement.removeAttribute(
                  "draggable"
                );
              }}
            />
          </div>
        ) : undefined}
        {this.isActive ? (
          <div class={["design-operate-right"]}>
            <delete
              style="width: 1rem; height: 1rem; margin-right: 8px"
              onClick={(ev: PointerEvent) =>
                DragHandler.deleteHandler(ev, _renderData)
              }
            />
          </div>
        ) : undefined}

        {_renderData.list.map((item) => {
          return childDepthRender(item, _renderData);
        })}
      </div>
    );
  },

  methods: {
    activeComponent(ev: PointerEvent, type: string) {
      // this.isActive = !this.isActive;
      let activeData = this.renderData;

      let activeThis = this;
      if (type == "pre") {
        activeThis = activeThis.$parent;
        while (activeThis) {
          if (
            activeThis.renderData &&
            activeThis.renderData.rangeFlag & RangeEnum.START
          ) {
            activeData = activeThis.renderData;
            break;
          }
          if (activeThis.$parent == null) {
            break;
          }
          activeThis = activeThis.$parent;
        }
      }
      if (activeThis.renderData != activeData) {
        ElMessage("已无上一级.");
        return;
      }
      DragHandler.clickHandler(ev, activeData, () => {
        activeThis.isActive = !activeThis.isActive;
      });
    },
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
