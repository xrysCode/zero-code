<script lang="tsx" setup>
import { defineComponent, h, resolveComponent } from 'vue'
import type { VNode } from 'vue'
import RenderWrapper from './RenderWrapper.vue'
// import { useRenderStore } from "@/stores/render";
import type { DataRenderDesc } from './comDesc'
// import { Layout, RangeEnum } from '@/design/comDesc'
import { MsgDto, MsgType } from './PostMeaagae'

class DragInfo {
  dropType: String
  constructor(dropType: String) {
    this.dropType = dropType
  }
}

const dragInfo = new DragInfo('')
// const ondragover = (ev: DragEvent) => {
//   console.log('接收到的事件', ev)
//   ev.stopPropagation()
//   const el = ev.currentTarget as Element

//   //竖直方向线位置
//   const dropElPosition = el.getBoundingClientRect()
//   const interval = dropElPosition.bottom - dropElPosition.top
//   const prevPoint = dropElPosition.top + interval * 0.25
//   const nextPoint = dropElPosition.top + interval * 0.75
//   const dropIndicatorElStyle = document.getElementById(
//     'drop-design-indicator',
//   )!.style

//   if (ev.clientY < prevPoint) {
//     //clientY
//     dragInfo.dropType = 'before'
//     dropIndicatorElStyle.top = `${dropElPosition.top - 2}px`
//     dropIndicatorElStyle.left = `${dropElPosition.left}px`
//     dropIndicatorElStyle.width = `${dropElPosition.width}px`
//     dropIndicatorElStyle.removeProperty('display')
//     el.classList.remove('drag-design-inner')
//   } else if (ev.clientY > nextPoint) {
//     dragInfo.dropType = 'after'
//     dropIndicatorElStyle.top = `${dropElPosition.top - 2}px`
//     dropIndicatorElStyle.left = `${dropElPosition.left}px`
//     dropIndicatorElStyle.width = `${dropElPosition.width}px`
//     dropIndicatorElStyle.removeProperty('display')
//     el.classList.remove('drag-design-inner')
//   } else {
//     dragInfo.dropType = 'inner'
//     dropIndicatorElStyle.display = 'none'
//     el.classList.add('drag-design-inner')
//   }

//   //   debugger;
// }

// const ondragleave = (ev: DragEvent) => {
//   //   console.log("接收到的事件", e);
//   //   e.currentTarget.style
//   ev.stopPropagation()
//   const el = ev.currentTarget as Element
//   el.classList.remove('drag-design-inner')
//   const dropIndicatorElStyle = document.getElementById(
//     'drop-design-indicator',
//   )!.style
//   dropIndicatorElStyle.display = 'none'
//   //   debugger;
// }
// const ondrop = (ev: DragEvent) => {
//   ev.stopPropagation()
//   ev.preventDefault()
//   console.log('接收到的事件', dragInfo, ev)
//   //   e.currentTarget.style
//   const el = ev.currentTarget as Element
//   el.classList.remove('drag-design-inner')
//   const dropIndicatorElStyle = document.getElementById(
//     'drop-design-indicator',
//   )!.style
//   dropIndicatorElStyle.display = 'none'
//   //   debugger;
// }
//.design-click-box
let beforeClickElSet = new Set<Element>()
const onclick = (ev: PointerEvent) => {
  const el = ev.currentTarget as Element
  el.classList.add('design-click-box')

  beforeClickElSet.forEach(beforeEl => {
    if (beforeEl != el) {
      beforeEl.classList.remove('design-click-box')
    }
  })
  beforeClickElSet.clear()
  beforeClickElSet.add(el)

  console.log(ev)
}

defineComponent({
  mounted() {
    let beforeElSet = new Set<Element>()
    window.onmessage = (event: MessageEvent) => {
      const msgDto = event.data as MsgDto
      console.log(msgDto, typeof msgDto, window)
      if (!('type' in msgDto && 'type' in msgDto && 'position' in msgDto)) {
        return
      }
      //   if (msgDto.hasOwnProperty("xx")!(msgDto.type&& instanceof MsgDto)) {
      //     return;
      //   }
      let el: Element
      switch (msgDto.type) {
        case MsgType.dragover:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y,
          ) as Element

          beforeElSet.forEach(beforeEl => {
            if (beforeEl != el) {
              const classList = beforeEl.classList
              classList.remove('drag-design-inner')
              //   classList.remove("drag-design-indicator");
            }
          })
          if (beforeElSet.has(el)) {
            el!.dispatchEvent(new DragEvent('dragover', msgDto.position))
          } else {
            beforeElSet.add(el)
            el!.dispatchEvent(new DragEvent('dragleave', msgDto.position))
          }

          break
        case MsgType.drop:
          el = document.elementFromPoint(
            msgDto.position!.x,
            msgDto.position!.y,
          ) as Element
          el!.dispatchEvent(new DragEvent('drop', msgDto.position))

          break
        case MsgType.Edit:
          break
      }

      // document.elementFromPoint(a.x, a.y)
      // document.dispatchEvent()
      // debugger
      console.log(event, window)
    }
  },

  render() {
    // const store = useRenderStore();

    function singleRender(data: DataRenderDesc): VNode {
      let attrs = data.attrs
      if (
        data.rangeFlag === RangeEnum.DROP_SLOT ||
        data.rangeFlag == RangeEnum.START
      ) {
        attrs.ondragover = ondragover
        attrs.ondragleave = ondragleave
        attrs.ondrop = ondrop
        attrs.onclick = onclick
      }

      return h(resolveComponent(data.componentTag), attrs, depthFun(data.list))
    }

    function depthFun(data: ComDesc | ComDesc[]): VNode | VNode[] {
      if (data instanceof Array) {
        return data.map(item => {
          return singleRender(item)
        })
      } else {
        return singleRender(data)
      }
    }
    //   <div
    //     id="drop-indicator"
    //     class="el-tree__drop-indicator"
    //     style="top: 120px; left: 42px; height: 6px; z-index: 5 display: none;"
    //   ></div>
    return
  },
})
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
