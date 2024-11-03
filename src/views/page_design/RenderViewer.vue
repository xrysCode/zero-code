/** 页面展示器 */
<script lang="tsx">
import { defineComponent, h, resolveComponent } from 'vue'
import type { VNode, Component } from 'vue'
// import { useRenderProxy } from './default-init-data'
// import { useRenderStore } from "@/stores/render";
import type { RenderDataTree } from './default-init-data'
// import { Layout, RangeEnum } from '@/design/comDesc'
// import { MsgDto, MsgType } from './PostMeaagae'

export default defineComponent(
  (props: { renderDataTree: RenderDataTree }) => {
    function singleRender(childrenItem): VNode | RenderDataTree {
      if (childrenItem == null) {
        return childrenItem
      }
      // return h(RenderWrapper, dataItem.props, dataItem.children)
      return h(RenderWrapper, { renderDataTree: renderDataTree })
    }

    function depthFun(children): VNode | VNode[] {
      if (children instanceof Array) {
        return children.map(item => {
          return singleRender(item)
        })
      }
      return singleRender(children)
    }

    const renderDataTree = props.renderDataTree
    return () => {
      // 渲染函数或 JSX
      return h(
        resolveComponent(renderDataTree.tagName),
        renderDataTree.props,
        depthFun(renderDataTree.children),
      )
    }
  },
  // 目前仍然需要手动声明运行时的 props
  {
    props: ['renderDataTree'],
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
