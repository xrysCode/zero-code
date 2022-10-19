import { useRenderStore } from "@/stores/render";
import type { ComponentHead } from "./componentDesc";
import * as DragHandler from "./designUtils";
import { Layout, Menu, Table } from "@/design/componentDesc";

export interface RenderComponentProps {
  //key viewName
  [key: string]: { renderData: ComponentHead };
}
export const saveData = (dataAll: RenderComponentProps, registName: string) => {
  // useRenderStore().renderMap.get();
  //   const routerDesc = data.routerDesc!;
  //   const fullPath = routerDesc.fullPath;
  //   let oldData = JSON.parse(localStorage.getItem(fullPath)!);
  //   if (!oldData) {
  //     oldData = {};
  //   }
  //   oldData[routerDesc.nameView] = data;
  //   localStorage.setItem(fullPath, DragHandler.object2Str(oldData));

  localStorage.setItem(registName, DragHandler.object2Str(dataAll));
};

export const queryData = (registName: string): RenderComponentProps => {
  return JSON.parse(localStorage.getItem(registName)!);
};
/**
 *
 * @param fullPath
 * @returns 当前路由及默认的子级路由
 */
export const queryAllData = (
  fullPath: string
): Map<string, RenderComponentProps> => {
  const data = new Map<string, RenderComponentProps>();
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)!;
    if (key == fullPath || (key + ":").startsWith(fullPath)) {
      data.set(key, JSON.parse(localStorage.getItem(key)!));
    }
  }
  return data;
};
/*{
      path: "/render",
      name: "/render",
      components: { default: RenderPortal },
      children: [
        {
          path: "/render",
          name: "/render:default",
          components: { default: RenderPortal },
          props: {
            default: { renderData: { ...StartDesign, fullPath: "/render" } },
          },
        },
        {
          path: "/render/aa",
          name: "/render/aa",
          components: { default: RenderPortal },
          props: {
            default: { renderData: { ...StartDesign, fullPath: "/render" } },
          },
        },
      ],
      props: { renderData: { ...StartDesign, fullPath: "/render" } },
    },*/
