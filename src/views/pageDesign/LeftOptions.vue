<template>
  <el-aside>
    <el-tabs>
      <el-tab-pane label="组件库" name="first">
        <el-collapse>
          <el-collapse-item title="基础组件" name="1">
            <el-button
              v-for="(item, i) in componentBase"
              size="small"
              :icon="item.icon"
              draggable="true"
              @dragstart="dragstartHandler($event, item)"
              @dragsend="dragendHandler"
              :key="i"
            >
              {{ item.text }}
            </el-button>
            <ul>
              <li
                draggable="true"
                @dragstart="dragstartHandler($event, 'Layout')"
                @dragend="dragendHandler($event, 'Layout')"
              >
                布局容器
              </li>
              <li><Menu />菜单</li>
              <li><Grid />栅格</li>
              <li draggable="true"><Grid />表格</li>
              <li>弹框窗口</li>

              <li>输入框</li>
              <li>文本输入框</li>
              <li>单选项</li>
              <li>下拉选项</li>
              <li>按钮</li>
              <li>按钮</li>
              <li>页面文本</li>
              <li>分隔线</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="导航组件" name="1">
            <ul>
              <li>
                <el-icon> <Grid /> </el-icon>栅格
              </li>
              <li>表格</li>
              <li>弹框窗口</li>

              <li>输入框</li>
              <li>文本输入框</li>
              <li>单选项</li>
              <li>下拉选项</li>
              <li>按钮</li>
              <li>按钮</li>
              <li>页面文本</li>
              <li>分隔线</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="数据展示组件" name="1">
            <div>
              Consistent with real life: in line with the process and logic of
              real life, and comply with languages and habits that the users are
              used to;
            </div>
          </el-collapse-item>
          <el-collapse-item title="其他组件" name="1">
            <div>
              Consistent with real life: in line with the process and logic of
              real life, and comply with languages and habits that the users are
              used to;
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane label="设计模板" name="second">Config</el-tab-pane>
    </el-tabs>
  </el-aside>
</template>

<script lang="ts" setup>
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { buttonDefault } from './comDesc'
import type { DataRenderDesc } from './comDesc'
import type { Component } from 'vue'

interface ComponentInfo {
  icon: object //Component
  type: string
  text: string
  dataRender: DataRenderDesc
}
// debugger
const componentBase: [ComponentInfo] = [
  {
    icon: Search,
    type: 'button',
    text: '按钮',
    dataRender: buttonDefault,
  },
  {
    icon: Edit,
    type: 'input',
    text: '单行输入',
    dataRender: buttonDefault,
  },
]
const emits = defineEmits(['dragstartHandler', 'dragendHandler'])

function dragstartHandler(ev: DragEvent, componentInfo) {
  //   emits('dragstartHandler', ev, componentType)
  //   debugger
  //   ev.dataTransfer!.setData('text/plain', componentType)
  ev.dataTransfer!.setData('componentInfo', componentInfo)
  console.log('设置数据')
  // ev.dataTransfer.dropEffect = 'move'
  //   this.$el.querySelector('#designPanel').style.zIndex = 1
  //   this.$el.querySelector('#designPanelIframe').style.zIndex = -1
}
function dragendHandler(ev: DragEvent, componentType: string) {
  console.log('拖拽结束 去除选中状态', ev)
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
