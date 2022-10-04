<template>
  栅格布局
  {{ props.data.type }}
  <el-tree
    :allow-drop="allowDrop"
    :data="props.data"
    draggable
    default-expand-all
    node-key="link"
    children="list"
    lable="componentTag"
  />

  <!--
     :allow-drag="allowDrag"
     @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop" -->
  <!-- 
  <el-form :model="form" label-width="120px">
    <el-form-item label="名称">
      <el-input v-model="form.name" />
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
    </el-form-item>
  </el-form> -->
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { type MsgDto, MsgType } from "../PostMeaagae";
// ComponentWrapper
import { ComponentWrapper, RangeEnum, EditConfig } from "../comDesc";
import * as ComponentDesc from "@/design/comDesc";

const props = defineProps({
  data: { type: ComponentWrapper, required: true },
});
debugger;
const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  if (dropNode.data.label === "Level two 3-1") {
    return type !== "inner";
  } else {
    return true;
  }
};
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes("Level three 3-1-1");
};
// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const onSubmit = () => {
  console.log("submit!");
};
</script>
