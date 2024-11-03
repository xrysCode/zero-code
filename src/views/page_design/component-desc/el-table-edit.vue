<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="基础设置" name="base">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="表格设置" name="table">
          <el-checkbox
            v-model="activeRanderData.props.highlightCurrentRow"
            label="高亮当前行"
            size="small"
          />
          <el-checkbox
            v-model="activeRanderData.props.stripe"
            label="斑马纹table"
            size="small"
          />
        </el-collapse-item>
        <el-collapse-item title="列设置" name="column">
          <!-- <el-tree
            style="max-width: 600px"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :data="activeRanderData.children.default"
            :props="{ label: 'props.label', children: 'children.default' }"
            draggable
            default-expand-all
            node-key="id"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ data.props.label }}</span>
                <span>
                </span>
              </span>
            </template>
          </el-tree> -->
          <el-table
            :data="activeRanderData.children.default"
            style="width: 100%"
            default-expand-all
            :tree-props="{ children: '_children' }"
          >
            <!-- :tree-props="{ children: 'children' }" -->
            <el-table-column prop="props.label" label="列名" draggable="true" />
            <el-table-column prop="name" label="类型" />
            <el-table-column prop="props.prop" label="编码" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="数据源" name="second">数据源</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type {
  AllowDropType,
  NodeDropType,
} from 'element-plus/es/components/tree/src/tree.type'

const activeRanderData = defineModel()
if (activeRanderData.value == null) {
  const table = JSON.parse(tableDataStr, (key, value) => {
    if (value.children) {
      value._children = value.children.default
    }
    return value
  })
  activeRanderData.value = table
}
const activeTab = ref('base')
const activeCollapse = ref('table')
console.log(activeRanderData.value, JSON.stringify(activeRanderData.value))
// const handleDragStart = (node: Node, ev: DragEvents) => {
//   console.log('drag start', node)
// }
// const handleDragEnter = (
//   draggingNode: Node,
//   dropNode: Node,
//   ev: DragEvents,
// ) => {
//   console.log('tree drag enter:', dropNode.label)
// }
// const handleDragLeave = (
//   draggingNode: Node,
//   dropNode: Node,
//   ev: DragEvents,
// ) => {
//   console.log('tree drag leave:', dropNode.label)
// }
// const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
//   console.log('tree drag over:', dropNode.label)
// }
// const handleDragEnd = (
//   draggingNode: Node,
//   dropNode: Node,
//   dropType: NodeDropType,
//   ev: DragEvents,
// ) => {
//   console.log('tree drag end:', dropNode && dropNode.label, dropType)
// }
// const handleDrop = (
//   draggingNode: Node,
//   dropNode: Node,
//   dropType: NodeDropType,
//   ev: DragEvents,
// ) => {
//   console.log('tree drop:', dropNode.label, dropType)
// }
// const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
//   if (dropNode.data.label === 'Level two 3-1') {
//     return type !== 'inner'
//   } else {
//     return true
//   }
// }
// const allowDrag = (draggingNode: Node) => {
//   return !draggingNode.data.label.includes('Level three 3-1-1')
// }

// const props = defineProps(['renderDataTree'])
// const emits = defineEmits(['changeData'])
// defineExpose(useDefaultData)
</script>
/** 这个是默认的初始化数据 */
<script lang="ts">
import { getDesignUniqueId } from '@/api/design-api'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import type { ComponentInfo, RenderDataTree } from '../default-init-data'

const tableData: RenderDataTree = {
  context: {
    reactive: [
      {
        date: '2016-05-03',
        name: '张三',
        state: '广东省',
        city: '深圳市',
        address: 'xxx街道32号楼',
      },
    ],
    // // ref:[""],
    Submit: `($event) => {
      console.log('submit!',$event,reactiveObject)
    }`,
  },
  tagName: 'el-table',
  props: {
    ':data': 'reactiveObject',
    stripe: true,
    style: { width: '100%' },
  },
  children: {
    default: [
      {
        tagName: 'el-table-column',
        props: { prop: 'date', label: '示例日期', width: '150' },
      },
      {
        tagName: 'el-table-column',
        props: {
          prop: 'name',
          label: '名字',
          width: '120',
        },
      },
      {
        tagName: 'el-table-column',
        props: {
          label: '地址信息',
        },
        children: {
          default: [
            {
              tagName: 'el-table-column',
              props: {
                prop: 'state',
                label: '省',
                width: '120',
              },
            },
            {
              tagName: 'el-table-column',
              props: {
                prop: 'city',
                label: '市',
                width: '120',
              },
            },
            {
              tagName: 'el-table-column',
              props: { width: '120' },
              children: {
                header: [
                  {
                    tagName: 'div',
                    children: { default: ['详细地址'] },
                    interceptFlag: true,
                  },
                ],
                default: [
                  {
                    tagName: 'div',
                    children: { default: ['{{scope.row.address}}'] },
                    interceptFlag: true,
                  },
                ],
              },
            },
          ],
        },
        // interceptFlag: true,
      },
    ],
  },

  interceptFlag: true,
}

const tableDataStr = JSON.stringify(tableData)

export const componentInfo: ComponentInfo = {
  icon: Search,
  showContent: '表格',
  desc: '表格设计',
  dataRender: () => {
    return JSON.parse(tableDataStr, (k, v) => {
      if (v instanceof Object && v.tagName != null) {
        getDesignUniqueId().then(id => (v.id = id))
      }
      return v
    })
  },
}
// console.log(useDefaultData())
</script>
