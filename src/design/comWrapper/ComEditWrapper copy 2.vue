<template>
  <el-tabs v-model="componentConfigData.activeTabName">
    <el-tab-pane label="组件设置" name="componentConfig">
      <component :is="editComponent" :data="componentConfigData.data" />
    </el-tab-pane>
    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { type MsgDto, MsgType } from "../PostMeaagae";
// ComponentWrapper
import { ComponentWrapper, RangeEnum, EditConfig } from "../comDesc";
import * as ComponentDesc from "@/design/comDesc";
// import { computed } from "@vue/reactivity";

const componentConfigData = reactive({
  activeTabName: "componentConfig",
  origin: "",
  type: "",
  data: new ComponentWrapper("", RangeEnum.START),
  // editDesc: [new EditConfig("", "", "", "")],
});

const editComponent = computed(() => {
  // debugger;
  return componentConfigData.type + "Editer";
});

onMounted(() => {
  window.onmessage = (event: MessageEvent) => {
    componentConfigData.origin = event.origin;
    const msgDto = event.data as MsgDto;
    // console.log(msgDto, typeof msgDto, window);
    if (
      !("operateType" in msgDto && "editData" in msgDto && "position" in msgDto)
    ) {
      return;
    }
    // let el: Element;
    // debugger;
    // operateType能是编辑
    switch (msgDto.operateType) {
      case MsgType.dragover:
        break;
      case MsgType.drop:
        break;
      case MsgType.dragleave:
        break;
      case MsgType.Edit:
        componentConfigData.type = msgDto.editData!.type;
        componentConfigData.data = msgDto.editData!;
        // componentConfigData.editDesc =
        //   ComponentDesc[`${msgDto!.editData!.type}Edit`]; //as EditConfig[];
        break;
    }
  };
}),
  watch(
    componentConfigData.data,
    () => {
      /* 深层级变更状态所触发的回调 */
      const el = document.getElementById(
        "#designPanelIframe"
      ) as HTMLIFrameElement;
      debugger;
      el.contentWindow?.postMessage(
        componentConfigData.data,
        componentConfigData.origin
      );
    },
    {
      deep: true, // 默认：false
      flush: "post",
    }
  ); // 默认：'pre'});
</script>
