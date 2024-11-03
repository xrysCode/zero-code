<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="组件库" name="components">
      <el-collapse v-model="activiteCollapses">
        <el-collapse-item title="基础组件" name="base">
          <div class="layout">
            <el-tooltip
              effect="dark"
              placement="bottom-end"
              v-for="(item, i) in componentBase"
              :key="i"
              :content="item.desc"
              :disabled="tipDisabled"
            >
              <el-button
                size="small"
                :icon="item.icon"
                class="layout-item"
                draggable="true"
                @dragstart="dragstartHandler($event, item)"
              >
                {{ item.showContent }}
              </el-button>
            </el-tooltip>
          </div>
        </el-collapse-item>
        <el-collapse-item title="导航组件" name="1">
          导航组件
        </el-collapse-item>
        <el-collapse-item title="自定义组合组件" name="1">
          <div>Consistent</div>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>

    <el-tab-pane label="设计模板" name="second">Config</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
// import { ElButton } from 'element-plus'
// import { buttonDefault } from './default-init-data'
import { ref } from 'vue'
import IconTooling from '@/components/icons/IconTooling.vue'
import type { RenderDataTree, ComponentInfo } from './default-init-data'
import type { Component } from 'vue'

const componentDescs = import.meta.glob('./component-desc/*.vue', {
  eager: true,
  import: 'componentInfo',
})
const componentBase: ComponentInfo[] = []
for (const path in componentDescs) {
  componentBase.push(componentDescs[path])
}

const activeTab = ref('components')
const activiteCollapses = ref(['base'])
const tipDisabled = ref(false)
const emits = defineEmits(['dragstartHandler'])

function dragstartHandler(ev: DragEvent, componentInfo: ComponentInfo) {
  //   emits('dragstartHandler', ev, componentType)
  //   debugger
  //   ev.dataTransfer!.setData('text/plain', componentType)
  tipDisabled.value = true
  const dataRender = JSON.stringify(componentInfo.dataRender())
  ev.dataTransfer!.setData('dataRender', dataRender)
  ev.dataTransfer!.setData('isAdd', 'true')
  // ev.dataTransfer!.setData('dataRender2', { a: 'a', b: () => 'bbb' })//只能是字符串，这个变成了tostring的结果
  emits('dragstartHandler', ev, dataRender)
  // console.log('设置数据')
  // ev.dataTransfer.dropEffect = 'move'
  //   this.$el.querySelector('#designPanel').style.zIndex = 1
  //   this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.layout-item {
  flex: 1;
  width: 45%;
  margin: 1px;
}
</style>
