<template>
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
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

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
