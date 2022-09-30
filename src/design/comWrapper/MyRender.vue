<!-- <template>
  <el-row class="design">
    <el-col :span="24" class="design"><div class="grid-content ep-bg-purple-dark" /></el-col>
  </el-row>
  <el-row class="design">
    <el-col :span="12" class="design"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="12" class="design"><div class="grid-content ep-bg-purple-light" /></el-col>
  </el-row>

        <component v-for="item,i in configData" :is="item.componentTag" :key="i" class="design-box">
            <template #title>{{i.text}}</template>
        </component>
</template> -->

<script lang="ts">
import { defineComponent, h, resolveComponent } from "vue";
// import { ElRow, ElCol } from "element-plus";

export default defineComponent({
  // 启用了类型推导
  props: {
    msg: { type: String, required: true },
  },
  data() {
    return {
      configData: [
        {
          // config: {},
          componentTag: "el-row",
          attrs: {
            gutter: 1,
            justify: "start",
            align: "top",
            // class: "design-box",
          },
          // text: '一级',
          list: [
            {
              // config: {},
              componentTag: "el-col",
              attrs: {
                span: 12,
                offset: 0,
                push: 0,
                class: "design-box",
              },
              // text: '一级',
              list: [],
            },
            {
              //config: {},
              componentTag: "el-col",
              attrs: {
                span: 12,
                offset: 0,
                push: 0,
              },
              // text: '一级',
              list: [],
            },
          ],
        },
        {
          componentTag: "el-row",
          attrs: {
            gutter: 1,
            justify: "start",
            align: "top",
            // class: "design-box",
          },
          // text: '一级',
          list: [
            {
              // config: {},
              componentTag: "el-col",
              attrs: { class: "design-box" },
              // text: '一级',
              list: [],
            },
          ],
        },
      ],
    };
  },
  render() {
    // return <ElRow  class="design-box">
    //         <el-col  class="design-box">
    //           <div>xxx</div>
    //         </el-col >
    //       </ElRow>

    return h(
      "div",
      { class: "design-box" },
      this.configData.map((row) => {
        return h(
          resolveComponent(row.componentTag),
          row.attrs,
          row.list.map((col) => {
            return h(
              resolveComponent(col.componentTag),
              col.attrs,
              h("div", "xxx")
            );
          })
        );
      })
    );
  },
  // mounted () {
  //   this.name // 类型：string | undefined
  //   this.id // 类型：number | string | undefined
  //   this.msg // 类型：string
  //   this.metadata // 类型：any
  // }
});
</script>

<!-- <style lang="scss">
      // .design{
      //   outline: 1px dashed rgb(187, 187, 187);
      // }
    .el-row {
    
      margin-bottom: 20px;
    }
    .el-row:last-child {
      margin-bottom: 0;
    }
    .el-col {
      border-radius: 4px;
    }
    
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
    </style> -->
