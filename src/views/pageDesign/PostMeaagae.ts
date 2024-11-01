// interface HistoryState {
// }
import type { RenderDataTree } from './default-init-data'

export function startListener() {
  window.onmessage = (event: MessageEvent) => {
    console.log(event.data, typeof event.data, window)
    if (!(event.data instanceof MsgDto)) {
      return
    }
    // document.elementFromPoint(a.x, a.y)
    // document.dispatchEvent()
    // debugger
    console.log(event, window)
  }

  //   window.addEventListener('message', (event: MessageEvent) => {
  //     if (event.source === window) {
  //       return
  //     }

  //     // debugger
  //     console.log(event, window)
  //   })
}

export enum MsgType {
  dragover = 'dragover',
  drop = 'drop',
  dragleave = 'dragleave',
  Edit = 'edit',
}

export class MsgDto {
  type: MsgType
  position?: PositionMsgDto
  editData?: RenderDataTree

  constructor(
    type: MsgType,
    position?: PositionMsgDto,
    editData?: ComponentWrapper,
  ) {
    this.type = type
    this.position = position
    this.editData = editData
  }
}

export class PositionMsgDto {
  //   comType: string
  bubbles: boolean
  cancelable: boolean
  composed: boolean
  type: string
  clientX: number
  clientY: number
  x: number
  y: number
  constructor(ev: DragEvent, dOMRect: DOMRect) {
    //, componentType:string
    //   this.comType = componentType

    this.bubbles = ev.bubbles
    this.cancelable = ev.cancelable
    this.composed = ev.composed
    this.type = ev.type

    this.clientX = ev.clientX - dOMRect.x
    this.clientY = ev.clientY - dOMRect.y
    // dataTransfer: ev.dataTransfer,
    this.x = ev.x - dOMRect.x
    this.y = ev.y - dOMRect.y
    //   fun: () => {
    //     console.log('--')
    //   }
  }
  //   fun: () => {
  //     console.log('--')
  //   }
}

//释放并编辑，传递初始化数据
// export class EditMsgDto {
//   data: ComDesc;
//   constructor(data: ComDesc) {
//     this.data = data;
//   }
// }
