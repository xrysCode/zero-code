<template>
  <el-tabs v-model="componentConfigData.activeTabName">
    <el-tab-pane label="组件设置" name="componentConfig">
      <el-form :model="componentConfigData.editDesc">
        <!-- new EditConfig("input-number", "el-row", "gutter", "栅格间隔"), new
        EditConfig("input-number", "el-col", "span", "栅格宽度"), new
        EditConfig("input-number", "el-col", "offset", "左侧间隔格数"), new
        EditConfig("input-number", "el-col", "push", "右移栅格数"), new
        EditConfig("input-number", "el-col", "pull", "左移栅格数"), -->
        <el-form-item
          v-for="(item, i) in componentConfigData.editDesc"
          :key="i"
          :label="item.label"
        >
          <!-- <el-input v-model=".name" /> -->
          <component :is="item.type" v-model="item.key" />
        </el-form-item>

        <!-- <el-form-item label="名称">
          <el-input v-model="focomponentConfigData.editDesc.name" />
        </el-form-item>
        <el-form-item label="栅格宽度">
          <el-input-number :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="左侧间隔格数">
          <el-input-number :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="右移栅格数">
          <el-input-number :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="左移栅格数">
          <el-input-number :min="1" :max="10" />
        </el-form-item> -->
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { type MsgDto, MsgType } from "../PostMeaagae";
// ComponentWrapper
import { ComponentWrapper, RangeEnum, EditConfig } from "../comDesc";
import * as ComponentDesc from "@/design/comDesc";

const componentConfigData = reactive({
  activeTabName: "componentConfig",
  origin: "",
  type: "",
  data: new ComponentWrapper("", RangeEnum.START),
  editDesc: [new EditConfig("", "", "", "")],
});

onMounted(() => {
  window.onmessage = (event: MessageEvent) => {
    componentConfigData.origin = event.origin;
    const msgDto = event.data as MsgDto;
    console.log(msgDto, typeof msgDto, window);
    if (!("type" in msgDto && "type" in msgDto && "position" in msgDto)) {
      return;
    }
    // let el: Element;
    // debugger;
    //只可能是编辑
    switch (msgDto.type) {
      case MsgType.dragover:
        break;
      case MsgType.drop:
        break;
      case MsgType.dragleave:
        break;
      case MsgType.Edit:
        componentConfigData.type = msgDto.type;
        componentConfigData.data = msgDto.editData!;
        componentConfigData.editDesc =
          ComponentDesc[`${msgDto!.editData!.type}Edit`]; //as EditConfig[];
        break;
    }
  };
}),
  watch(componentConfigData.data, () => {
    /* 深层级变更状态所触发的回调 */
    const el = document.getElementById(
      "#designPanelIframe"
    ) as HTMLIFrameElement;
    debugger;
    el.contentWindow?.postMessage(
      componentConfigData.data,
      componentConfigData.origin
    );
  });
</script>
