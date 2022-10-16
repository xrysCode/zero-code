import { useRenderStore } from "@/stores/render";
import type { ComponentHead } from "./componentDesc";
import * as DragHandler from "./designUtils";
import { Layout, StartDesign, Menu, Table } from "@/design/componentDesc";

interface RenderComponentProps {
  [key: string]: { renderData: ComponentHead };
}
export const saveData = (data: RenderComponentProps, fullPath: string) => {
  // useRenderStore().renderMap.get();
  //   const routerDesc = data.routerDesc!;
  //   const fullPath = routerDesc.fullPath;
  //   let oldData = JSON.parse(localStorage.getItem(fullPath)!);
  //   if (!oldData) {
  //     oldData = {};
  //   }
  //   oldData[routerDesc.nameView] = data;
  //   localStorage.setItem(fullPath, DragHandler.object2Str(oldData));
  localStorage.setItem(fullPath, DragHandler.object2Str(data));
};

export const queryData = (
  fullPath: string
): { [key: string]: ComponentHead } => {
  return JSON.parse(localStorage.getItem(fullPath)!);
};
