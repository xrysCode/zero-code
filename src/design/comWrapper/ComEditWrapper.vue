<template>
  <el-tabs v-model="componentConfigData.activeTabName">
    <el-tab-pane label="高级设置" name="componentConfig">
      <!-- :allow-drop="allowDrop"
            :allow-drag="allowDrag" -->
      <el-tree
        :data="componentData.list"
        draggable
        default-expand-all
        node-key="link"
        :props="{ children: 'list' }"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.componentTag.replaceAll("-", "_") }}</span>
            <span>
              <a style="margin-left: 8px" @click="openDialogHander(data, true)">
                新增
              </a>
              <a
                style="margin-left: 8px"
                @click="openDialogHander(data, false)"
              >
                编辑
              </a>
            </span>
          </span>
        </template>
      </el-tree>
    </el-tab-pane>

    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>

    <el-dialog v-model="componentConfigData.openDialog" title="数据编辑">
      <el-form :model=" (componentConfigData.editData as ComDesc).attrs">
        <el-form-item
          v-for="(v, k) in editConfig[
            componentConfigData.editData.componentTag.replaceAll('-', '_')
          ].attrs"
          :label="v.name"
          :key="v.property"
        >
          <el-input
            v-model="(componentConfigData.editData as ComDesc).attrs[v.property]"
          />
          <!-- <el-input-number
            v-else
            v-model="(componentConfigData.editData as ComDesc).attrs[k]"
          /> -->
        </el-form-item>

        <!-- <el-form-item
          v-for="v,k in (componentConfigData.editData as ComDesc).attrs "
          :label="k"
          :key="k"
        >
          <el-input
            v-if="v instanceof String"
            v-model="(componentConfigData.editData as ComDesc).attrs[k]"
          />
          <el-input-number
            v-else
            v-model="(componentConfigData.editData as ComDesc).attrs[k]"
          /> 
        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="componentConfigData.openDialog = false"
            >Cancel</el-button
          >
          <el-button type="primary" @click="sendSave">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </el-tabs>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { MsgDto, MsgType } from "../postMeaagae";
import {
  ComponentHead,
  RangeEnum,
  EditConfig,
  type ComDesc,
} from "../componentDesc";
import type { IPropDesc } from "@/design/editConfig";
import * as editConfig from "@/design/editConfig";

const props = defineProps({
  componentData: { type: ComponentHead, required: true },
});
const emit = defineEmits(["updateEditData"]);

const componentConfigData = reactive({
  activeTabName: "componentConfig",
  openDialog: false,
  editData: null as ComDesc | null,
});

const openDialogHander = (data: ComDesc, isAdd: Boolean) => {
  componentConfigData.openDialog = true;
  componentConfigData.editData = data;
};
const sendSave = () => {
  componentConfigData.openDialog = false;
  emit("updateEditData");
};

watch(
  props.componentData,
  () => {
    /* 深层级变更状态所触发的回调 */
    const el = document.getElementById(
      "#designPanelIframe"
    ) as HTMLIFrameElement;
    debugger;
    // el.contentWindow?.postMessage(props.data, props.origin);
  },
  {
    deep: true, // 默认：false
    flush: "post",
  }
); // 默认：'pre'});
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
