<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="组件库" name="components">
      <el-collapse v-model="activiteCollapses">
        <el-collapse-item title="基础组件" name="base">
          <div class="layout">
            <el-tooltip
              effect="dark"
              placement="bottom-start"
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
                @dragend="dragendHandler($event, item)"
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
import { buttonDefault } from './default-init-data'
import { ref } from 'vue'
import IconTooling from '@/components/icons/IconTooling.vue'
import type { RenderDataTree, ComponentType } from './default-init-data'
import type { Component } from 'vue'

interface ComponentInfo {
  icon: Component
  type: ComponentType
  showContent: string
  desc: string //功能简述
  dataRender: string
}
// debugger
const componentBase: [ComponentInfo] = [
  {
    icon: Search,
    type: 'button',
    showContent: '按钮',
    desc: '一个按钮',
    dataRender: buttonDefault,
  },
  {
    icon: Edit,
    type: 'input',
    showContent: '输入框',
    desc: '普通输入框',
    dataRender: buttonDefault,
  },
  {
    icon: Edit,
    type: 'input',
    showContent: '参数输入框',
    desc: '函数输入框',
    dataRender: buttonDefault,
  },
  {
    icon: Edit,
    type: 'input',
    showContent: '表格',
    desc: '表格',
    dataRender: buttonDefault,
  },
]

const activeTab = ref('components')
const activiteCollapses = ref(['base'])
const tipDisabled = ref(false)
const emits = defineEmits(['dragstartHandler', 'dragendHandler'])

function dragstartHandler(ev: DragEvent, componentInfo: ComponentInfo) {
  //   emits('dragstartHandler', ev, componentType)
  //   debugger
  //   ev.dataTransfer!.setData('text/plain', componentType)
  tipDisabled.value = true
  ev.dataTransfer!.setData('dataRender', componentInfo.dataRender)
  emits('dragstartHandler', ev)
  // console.log('设置数据')
  // ev.dataTransfer.dropEffect = 'move'
  //   this.$el.querySelector('#designPanel').style.zIndex = 1
  //   this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, componentInfo: ComponentInfo) {
  tipDisabled.value = false
  emits('dragendHandler', ev)
  // console.log('拖拽结束 去除选中状态', ev)
  //   emits('dragendHandler', ev, componentType)
  //   this.$el.querySelector('#designPanel').style.zIndex = -1
  //   this.$el.querySelector('#designPanelIframe').style.zIndex = 1
}
//     /////////////////////////////////////////////
//     function  dragoverHandler(ev: DragEvent) {
//       ev.preventDefault()

//       const el = this.$el.querySelector(
//         '#designPanelIframe',
//       ) as HTMLIFrameElement

//       const win = el.contentWindow

//       const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
//       // debugger;
//       // "http://localhost:5173/?iframe=true"
//       win!.postMessage(
//         new MsgDto(MsgType.dragover, evMeaagae, undefined),
//         this.designUrl,
//         // "http://localhost:5173"
//       )
//     },
//     function dropHandler(ev: DragEvent) {
//       //释放数据，并打开编辑框
//       const componentType = ev.dataTransfer!.getData('text/plain') as string
//       const el = this.$el.querySelector(
//         '#designPanelIframe',
//       ) as HTMLIFrameElement

//       const win = el.contentWindow
//       const evMeaagae = new PositionMsgDto(ev, el.getBoundingClientRect())
//       // "http://localhost:5173/?iframe=true"
//       win!.postMessage(
//         new MsgDto(MsgType.drop, evMeaagae, baseConfigData[componentType]),
//         this.designUrl,
//         // "http://localhost:5173"
//       )
//     },
//     function   dragleaveHandler(ev: DragEvent) {
//       const evMeaagae = new PositionMsgDto(ev)
//       const win = (
//         this.$el.querySelector('#designPanelIframe') as HTMLIFrameElement
//       ).contentWindow
//       // "http://localhost:5173/?iframe=true"
//       win!.postMessage(
//         new MsgDto(MsgType.dragleave, evMeaagae, undefined),
//         this.designUrl,
//       )
//     },
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
