<template>
  <el-container style="height: 100%">
    <el-aside>
      <el-tabs>
        <el-tab-pane label="组件库" name="first">
          <el-collapse>
            <el-collapse-item title="基础组件" name="1">
              <ul>
                <li
                  draggable="true"
                  @dragstart="dragstartHandler($event, 'Layout')"
                  @dragend="dragendHandler($event, 'Layout')"
                >
                  布局容器
                </li>
                <li><Menu />菜单</li>
                <li><Grid />栅格</li>
                <li draggable="true"><Grid />表格</li>
                <li>弹框窗口</li>

                <li>输入框</li>
                <li>文本输入框</li>
                <li>单选项</li>
                <li>下拉选项</li>
                <li>按钮</li>
                <li>按钮</li>
                <li>页面文本</li>
                <li>分隔线</li>
              </ul>
            </el-collapse-item>
            <el-collapse-item title="导航组件" name="1">
              <ul>
                <li>
                  <el-icon><Grid /></el-icon>栅格
                </li>
                <li>表格</li>
                <li>弹框窗口</li>

                <li>输入框</li>
                <li>文本输入框</li>
                <li>单选项</li>
                <li>下拉选项</li>
                <li>按钮</li>
                <li>按钮</li>
                <li>页面文本</li>
                <li>分隔线</li>
              </ul>
            </el-collapse-item>
            <el-collapse-item title="数据展示组件" name="1">
              <div>
                Consistent with real life: in line with the process and logic of
                real life, and comply with languages and habits that the users
                are used to;
              </div>
            </el-collapse-item>
            <el-collapse-item title="其他组件" name="1">
              <div>
                Consistent with real life: in line with the process and logic of
                real life, and comply with languages and habits that the users
                are used to;
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane label="设计模板" name="second">Config</el-tab-pane>
      </el-tabs>
    </el-aside>

    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <div style="position: relative; height: 100%; width: 100%">
          <!-- <div >请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处。</div> -->
          <!-- <menu-wrapper></menu-wrapper> -->
          <div
            id="designPanel"
            @drop="dropHandler($event)"
            @dragover="dragoverHandler($event)"
            @dragleave="dragleaveHandler($event)"
          >
            请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处。
          </div>
          <iframe
            id="designPanelIframe"
            name="designPanelIframe"
            :src="designUrl"
          ></iframe>
          <!-- display: none; -->
          <div
            id="drop-indicator"
            class="el-tree__drop-indicator"
            style="top: 120px; left: 42px; height: 6px; z-index: 5"
          ></div>
        </div>
      </el-main>
    </el-container>

    <el-aside>
      <el-tabs>
        <el-tab-pane label="组件设置" name="first">
          <layout-editer></layout-editer>
        </el-tab-pane>
        <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as baseConfigData from "./comDesc";
import { MsgDto, MsgType, PositionMsgDto } from "@/design/PostMeaagae";
// import MenuWrapper from '@/design/comWrapper/MenuWrapper.vue'
// import LayoutEditer from "./comWrapper/LayoutEditer.vue";

export default defineComponent({
  // 启用了类型推导
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null,
    designUrl: { type: String, default: "http://localhost:5173/?iframe=true" },
  },
  // components: { LayoutEditer },
  mounted() {
    // this.name // 类型：string | undefined
    // this.id // 类型：number | string | undefined
    // this.msg // 类型：string
    // this.metadata // 类型：any
    // this.$nextTick(() => {
    //   const ifWin = (this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement).contentWindow
    //   // ifWin!.addEventListener('message', () => {
    //   //   debugger
    //   // }, false)
    // })
  },
  methods: {
    test() {
      console.log(window.name);
    },
    dragstartHandler(ev: DragEvent, componentType: string) {
      ev.dataTransfer!.setData("text/plain", componentType);
      // ev.dataTransfer.dropEffect = 'move'
      this.$el.querySelector("#designPanel").style.zIndex = 1;
      this.$el.querySelector("#designPanelIframe").style.zIndex = -1;
    },
    dragendHandler(ev: DragEvent, ty: string) {
      // console.log("拖拽结束", ev);
      this.$el.querySelector("#designPanel").style.zIndex = -1;
      this.$el.querySelector("#designPanelIframe").style.zIndex = 1;
    },
    /////////////////////////////////////////////
    dragoverHandler(ev: DragEvent) {
      ev.preventDefault();

      const el = this.$el.querySelector(
        "#designPanelIframe"
      ) as HTMLIFrameElement;

      const win = el.contentWindow;

      const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect());
      // debugger;
      // "http://localhost:5173/?iframe=true"
      win!.postMessage(
        new MsgDto(MsgType.dragover, evMeaagae, undefined),
        this.designUrl
        // "http://localhost:5173"
      );
    },
    dropHandler(ev: DragEvent) {
      //释放数据，并打开编辑框
      const componentType = ev.dataTransfer!.getData("text/plain") as string;
      const el = this.$el.querySelector(
        "#designPanelIframe"
      ) as HTMLIFrameElement;

      const win = el.contentWindow;
      const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect());
      // "http://localhost:5173/?iframe=true"
      win!.postMessage(
        new MsgDto(MsgType.drop, evMeaagae, baseConfigData[componentType]),
        this.designUrl
        // "http://localhost:5173"
      );
    },
    dragleaveHandler(ev: DragEvent) {
      const evMeaagae = new PositionMsgDto(ev);
      const win = (
        this.$el.querySelector("#designPanelIframe") as HTMLIFrameElement
      ).contentWindow;
      // "http://localhost:5173/?iframe=true"
      win!.postMessage(
        new MsgDto(MsgType.dragleave, evMeaagae, undefined),
        this.designUrl
      );
    },
  },
});
</script>
<style scoped>
header,
aside,
main {
  border: 1px dotted grey;
}
header {
  height: 60px;
}
aside {
  width: 250px;
}
svg {
  width: 1em;
  height: 1em;
  margin-right: 6px;
  vertical-align: text-top;
  color: green;
}
ul {
  /* display: flex;
    flex-wrap: wrap;
    align-items: center; */
  margin: 0;
  padding: 0;
}
li {
  background-color: #f1f2f3;
  display: block;
  width: 115px;
  float: left;
  margin: 2px 6px 6px 0;
  text-align: left;
  /* justify-content: center; */
}
#designPanel,
#designPanelIframe {
  width: 100%;
  height: 100%;
}
#designPanelIframe {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>
