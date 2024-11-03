<template>
  <div>
    <el-table
      :data="data.children.default"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: '_children' }"
    >
      <el-table-column prop="props.prop" label="props.label" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <!-- <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table> -->
  </div>
</template>
<script lang="ts" setup>
import { treeProps } from 'element-plus/es/components/tree-v2/src/virtual-tree.mjs'

interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

// const load = (
//   row: User,
//   treeNode: unknown,
//   resolve: (data: User[]) => void,
// ) => {
//   setTimeout(() => {
//     resolve([
//       {
//         id: 31,
//         date: '2016-05-01',
//         name: 'wangxiaohu',
//         address: 'No. 189, Grove St, Los Angeles',
//       },
//       {
//         id: 32,
//         date: '2016-05-01',
//         name: 'wangxiaohu',
//         address: 'No. 189, Grove St, Los Angeles',
//       },
//     ])
//   }, 1000)
// }

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const data = {
  tagName: 'el-table',
  props: { ':data': 'reactiveObject', stripe: true, style: { width: '100%' } },
  children: {
    default: [
      {
        tagName: 'el-table-column',
        props: { prop: 'date', label: '示例日期', width: '150' },
      },
      {
        tagName: 'el-table-column',
        props: { prop: 'name', label: '名字', width: '120' },
      },
      {
        tagName: 'el-table-column',
        props: { label: '地址信息' },
        // children: {
        //   default: [
        //     {
        //       tagName: 'el-table-column',
        //       props: { prop: 'state', label: '省', width: '120' },
        //     },
        //     {
        //       tagName: 'el-table-column',
        //       props: { prop: 'city', label: '市', width: '120' },
        //     },
        //     {
        //       tagName: 'el-table-column',
        //       props: { width: '120' },
        //       children: {
        //         header: ['详细地址'],
        //         default: [
        //           {
        //             tagName: 'div',
        //             children: { default: ['{{scope.row.address}}'] },
        //             _children: ['{{scope.row.address}}'],
        //           },
        //         ],
        //       },
        //       _children: [
        //         {
        //           tagName: 'div',
        //           children: { default: ['{{scope.row.address}}'] },
        //           _children: ['{{scope.row.address}}'],
        //         },
        //       ],
        //     },
        //   ],
        // },
        _children: [
          {
            tagName: 'el-table-column',
            props: { prop: 'state', label: '省', width: '120' },
          },
          {
            tagName: 'el-table-column',
            props: { prop: 'city', label: '市', width: '120' },
          },
          {
            tagName: 'el-table-column',
            props: { width: '120' },
            children: {
              header: ['详细地址'],
              default: [
                {
                  tagName: 'div',
                  children: { default: ['{{scope.row.address}}'] },
                  _children: ['{{scope.row.address}}'],
                },
              ],
            },
            _children: [
              {
                tagName: 'div',
                children: { default: ['{{scope.row.address}}'] },
                _children: ['{{scope.row.address}}'],
              },
            ],
          },
        ],
      },
    ],
  },
  interceptFlag: true,
}
// const tableData1: User[] = [
//   {
//     id: 1,
//     date: '2016-05-02',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     id: 2,
//     date: '2016-05-04',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     id: 3,
//     date: '2016-05-01',
//     name: 'wangxiaohu',
//     hasChildren: true,
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     id: 4,
//     date: '2016-05-03',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
// ]
</script>
