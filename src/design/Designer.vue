<template>
  <el-container style="height: 100%">
    <el-aside>
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="组件库" name="componentChoose">
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
                <li
                  draggable="true"
                  @dragstart="dragstartHandler($event, 'Menu')"
                  @dragend="dragendHandler($event, 'Menu')"
                >
                  <Menu />菜单
                </li>
                <li
                  draggable="true"
                  @dragstart="dragstartHandler($event, 'RouterView')"
                  @dragend="dragendHandler($event, 'RouterView')"
                >
                  <Grid />导航出口
                </li>
                <li><Grid />栅格</li>
                <li
                  draggable="true"
                  @dragstart="dragstartHandler($event, 'Table')"
                  @dragend="dragendHandler($event, 'Table')"
                >
                  <Grid />表格
                </li>
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
              </ul>
            </el-collapse-item>
            <el-collapse-item title="数据展示组件" name="1"> </el-collapse-item>
            <el-collapse-item title="其他组件" name="1"> </el-collapse-item>
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
        </div>
      </el-main>
    </el-container>

    <el-aside>
      <com-edit-wrapper
        :componentData="data"
        @updateEditData="updateEditData"
      />
    </el-aside>
  </el-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as baseConfigData from "./componentDesc";
import { MsgDto, MsgType, PositionMsgDto } from "@/design/postMeaagae";
// import MenuWrapper from '@/design/comWrapper/MenuWrapper.vue'
import ComEditWrapper from "./comWrapper/ComEditWrapper.vue";
import { ComponentWrapper, RangeEnum } from "./componentDesc";
import { cloneData } from "./designUtils";

export default defineComponent({
  // 启用了类型推导
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null,
    designUrl: { type: String, default: "http://localhost:5173/?iframe=true" },
  },
  components: { ComEditWrapper },

  data() {
    return {
      // activeTabName: "componentConfig",
      origin: "",
      // type: "",
      data: new ComponentWrapper("", RangeEnum.START),
      messageEvent: null as MessageEvent | null,
      // editData: {},
    };
  },
  mounted() {
    const __this = this;
    //接收消息
    window.onmessage = (event: MessageEvent) => {
      const msgDto = event.data as MsgDto;
      // console.log(msgDto, typeof msgDto, window);
      if (
        !(
          "operateType" in msgDto &&
          "editData" in msgDto &&
          "position" in msgDto
        )
      ) {
        return;
      }
      __this.origin = event.origin;
      __this.messageEvent = event;
      // debugger;
      switch (msgDto.operateType) {
        case MsgType.dragover:
          break;
        case MsgType.drop:
          break;
        case MsgType.dragleave:
          break;
        case MsgType.Edit:
          __this.data = msgDto.editData!;
          // componentConfigData.editDesc =
          //   ComponentDesc[`${msgDto!.editData!.type}Edit`]; //as EditConfig[];
          break;
      }
    };
  },
  methods: {
    updateEditData() {
      // debugger;
      this.messageEvent!.source!.postMessage(
        new MsgDto(MsgType.Edit, undefined, cloneData(this.data)),
        this.messageEvent!.origin
      );
    },
    test() {
      console.log(window.name);
    },
    dragstartHandler(ev: DragEvent, componentType: string) {
      //application/json  text/plain
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
      const componentType = ev.dataTransfer!.getData("text/plain") as string;
      //加载设置数据
      // this.data = baseConfigData[componentType] as ComponentWrapper;
      const configData = baseConfigData[componentType] as ComponentWrapper;

      //释放数据，并打开编辑框

      const el = this.$el.querySelector(
        "#designPanelIframe"
      ) as HTMLIFrameElement;

      const win = el.contentWindow;
      const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect());
      win!.postMessage(
        new MsgDto(MsgType.drop, evMeaagae, cloneData(configData)),
        this.designUrl
        // "http://localhost:5173"
      );
    },
    dragleaveHandler(ev: DragEvent) {
      const el = this.$el.querySelector(
        "#designPanelIframe"
      ) as HTMLIFrameElement;

      const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect());
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
