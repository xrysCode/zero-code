<template>
  展示设计
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="" width="50">
      <el-icon><Sort /></el-icon>
    </el-table-column>
    <el-table-column prop="date" label="字段" width="150" />
    <el-table-column prop="name" label="展示名称" width="120" />
    <el-table-column prop="state" label="是否操作列" width="100" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="row">
        <el-button link type="primary" size="small" @click="handleClick(row)"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  默认数据
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="" width="50">
      <el-icon><Sort /></el-icon>
    </el-table-column>
    <el-table-column prop="date" label="字段" width="150" />
    <el-table-column prop="name" label="展示名称" width="120" />
    <el-table-column prop="state" label="是否操作列" width="100" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="row">
        <el-button link type="primary" size="small" @click="handleClick(row)"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  数据源设置
  <div>
    <el-select placeholder="Select">
      <el-option label="get" value="get" />
      <el-option label="post" value="post" />
    </el-select>
    <el-input placeholder="接口地址" />
    <el-button>测试</el-button>
  </div>
  <el-form inline="true">
    <el-form-item></el-form-item>
    <el-form-item label=""> </el-form-item>
  </el-form>

  <el-tabs class="demo-tabs">
    <el-tab-pane label="请求头" name="first">User </el-tab-pane>
    <el-tab-pane label="请求参数" name="second">Config </el-tab-pane>
    <el-tab-pane label="body" name="second2">
      <el-radio-group class="ml-4">
        <el-radio label="1" size="large">x-www-form-urlencoded</el-radio>
        <el-radio label="2" size="large">form-data</el-radio>
        <el-radio label="3" size="large">raw</el-radio>

        <el-input>值</el-input>
      </el-radio-group>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
const handleClick = (row: any) => {
  console.log("click", row);
};

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
];
</script>
