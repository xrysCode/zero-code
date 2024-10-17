<script lang="tsx">
import { defineComponent, h, resolveComponent } from 'vue'
import RenderWrapper from './RenderWrapper.vue'
import type { VNode, Component } from 'vue'

// import { useRenderStore } from "@/stores/render";
import type { DataRenderDesc } from './comDesc'
// import { Layout, RangeEnum } from '@/design/comDesc'
// import { MsgDto, MsgType } from './PostMeaagae'

export default defineComponent(
  (props: { dataRenderDesc: DataRenderDesc; renderHandler: Component }) => {
    // 就像在 <script setup> 中一样使用组合式 API
    // const store = useRenderStore();

    const dataRenderDesc = props.dataRenderDesc

    function singleRender(dataItem: DataRenderDesc): VNode | DataRenderDesc {
      if (dataItem == null || !dataItem.flag) {
        return dataItem
      }
      debugger
      // return h(RenderWrapper, dataItem.props, dataItem.children)
      return h(RenderWrapper, { dataRenderDesc: dataItem.children })
    }

    function depthFun(children): VNode | VNode[] {
      if (children instanceof Array) {
        return children.map(item => {
          return singleRender(item)
        })
      } else if (children instanceof Object) {
        // for()
        return singleRender(children)
      }
      return singleRender(children)
    }

    return () => {
      // 渲染函数或 JSX
      return h(
        resolveComponent(dataRenderDesc.type),
        dataRenderDesc.props,
        depthFun(dataRenderDesc.children),
      )
    }
  },
  // 目前仍然需要手动声明运行时的 props
  {
    props: ['dataRenderDesc', 'renderHandler'],
  },
)
</script>
<style lang="scss">
// .design{
//   outline: 1px dashed rgb(187, 187, 187);
// }
// .el-row {

//   margin-bottom: 20px;
// }
// .el-row:last-child {
//   margin-bottom: 0;
// }
// .el-col {
//   border-radius: 4px;
// }

// .grid-content {
//   border-radius: 4px;
//   min-height: 36px;
// }
</style>
