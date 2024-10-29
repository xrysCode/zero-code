<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select
        v-model="formInline.region"
        placeholder="Activity zone"
        clearable
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-date-picker
        v-model="formInline.date"
        type="date"
        placeholder="Pick a date"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit($event, '测试')"
        >Query</el-button
      >
    </el-form-item>
  </el-form>
  <Test22></Test22>
</template>

<script lang="ts" setup>
import { reactive, inject, provide } from 'vue'
import Test22 from './Test22.vue'
const props = defineProps(['p1'])
const formInline = reactive({
  user: '',
  region: '',
  date: '',
})
formInline.user = props.p1

const emits = defineEmits(['sub'])
provide('in2', 'test2')
// const in=inject("in")
const onSubmit = (event, arg) => {
  console.log('submit!', event, arg, formInline)
  emits('sub', event, arg, formInline)
  console.log('submit!', event, arg, JSON.stringify(formInline))
}
defineExpose({
  formInline,
})
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
