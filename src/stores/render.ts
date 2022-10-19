import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { RangeEnum, type ComDesc } from "@/design/componentDesc";
import {
  Layout,
  clonStartDesign,
  ComponentHead,
  Menu,
  Table,
} from "@/design/componentDesc";
import { queryData, type RenderComponentProps } from "@/design/saveDataUtils";
import * as DragHandler from "@/design/designUtils";

export const useRenderStore = defineStore("render", () => {
  // let data = JSON.parse(localStorage.getItem("renderData")!);
  // if (data == null) {
  //   data = StartDesign;
  // }
  // const renderData = ref(data);

  // const renderMap = reactive(new Map<string,Map<string, ComponentHead>>());
  const renderMap = reactive(new Map<string, RenderComponentProps>());

  const getAndInitData = (
    fullPath: string,
    viewName?: string //没有这个参数代表不是新建子路由
  ): RenderComponentProps => {
    // debugger;
    let registName = fullPath;
    if (viewName) {
      registName = fullPath + ":" + viewName;
    } else {
      viewName = "default";
    }

    let dataObj = renderMap.get(registName);
    if (!dataObj) {
      dataObj = queryData(registName);
      if (!dataObj) {
        const startRenderData = clonStartDesign();
        startRenderData.routerDesc = {
          fullPath,
          viewName,
          registName,
        };
        dataObj = {
          default: {
            renderData: startRenderData,
          },
        };
      }
      renderMap.set(registName, dataObj);
    }
    return renderMap.get(registName)!;
  };

  const changeDataMap = reactive(new Map<string, ComponentHead>());
  // const getData = () => {};
  return { renderMap, getAndInitData, changeDataMap };
});
