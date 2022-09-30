<template>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :mode="configData.attrs.mode"
      :collapse="configData.attrs.collapse"
      @open="handleOpen"
      @close="handleClose"
    >
        <div v-if="configData.attrs.mode=='vertical'" @click="handExpandOrFold">
            <el-icon v-if="configData.attrs.collapse"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
        </div>

        <component v-for="i in configData.widgetList" :is="i.comType" :key="i.id">
            <template #title>{{i.text}}</template>
        </component>

        <!-- <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>Info</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item> -->
    </el-menu>
  </template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
} from '@element-plus/icons-vue'

const configData = ref({
  id: '',
  comType: 'ElMenu',
  attrs: {
    mode: 'vertical',
    collapse: false,
    default_openeds: []
  },
  widgetList: [{
    comType: 'el-sub-menu',
    attrs: {
      index: '2'
    },
    text: '一级',
    widgetList: [{
      comType: 'el-sub-menu',
      attrs: {
        index: '22'
      },
      text: 'Workspace',
      widgetList: [{
        comType: 'el-menu-item',
        attrs: {
          index: '221'
        },
        text: 'item'
      }
      ]
    }]
  }]

})

const handExpandOrFold = () => {
  configData.value.attrs.collapse = !configData.value.attrs.collapse
}
const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const render = () => {
  return h('div', '[h(Foo), h(Bar)')
}
</script>

  <style>
  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  } */
  </style>

function handExpandOrFold() {
  throw new Error('Function not implemented.')
}
