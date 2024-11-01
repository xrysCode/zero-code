<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="组件设置" name="base">
      <layout-editer>{{ JSON.stringify(activeRanderData) }}</layout-editer>
    </el-tab-pane>
    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeRanderData = defineModel()
const activeTab = ref('base')

// const props = defineProps(['renderDataTree'])
// const emits = defineEmits(['changeData'])
</script>
<script lang="ts">
import { getDesignUniqueId } from '@/api/design-api'
const tableData: RenderDataTree = {
  tagName: 'el-table',
  props: {
    ':data': 'reactiveObject',
    style: { width: '100%' },
  },
  children: {
    default: [
      {
        tagName: 'el-table-column',
        props: { prop: 'date', label: 'Date', width: '150' },
        // interceptFlag: true,
      },
    ],
  },
  interceptFlag: true,
}

export const tableDataStr = JSON.stringify(tableData)
export const tableDataId = JSON.parse(tableDataStr, (k, v) => {
  if (v instanceof Object && v.tagName != null) {
    v.id = getDesignUniqueId()
  }
  return v
})
console.log(tableDataId)
</script>
