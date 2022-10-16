import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { RangeEnum, type ComDesc } from "@/design/componentDesc";
import {
  Layout,
  StartDesign,
  ComponentHead,
  Menu,
  Table,
} from "@/design/componentDesc";
import { queryData } from "@/design/saveDataUtils";
import * as DragHandler from "@/design/designUtils";

export const useRenderStore = defineStore("render", () => {
  // let data = JSON.parse(localStorage.getItem("renderData")!);
  // if (data == null) {
  //   data = StartDesign;
  // }
  // const renderData = ref(data);

  // const renderMap = reactive(new Map<string,Map<string, ComponentHead>>());
  const renderMap = reactive(
    new Map<string, { [key: string]: ComponentHead }>()
  );

  const getAndInitData = (
    fullPath: string,
    routerName: string
  ): { [key: string]: ComponentHead } => {
    let dataObj = renderMap.get(routerName);
    if (!dataObj) {
      dataObj = queryData(routerName);
      if (!dataObj) {
        dataObj = {};
        dataObj.default = {
          ...StartDesign,
          routerDesc: { fullPath: fullPath, nameView: routerName },
        };
      }
      renderMap.set(routerName, dataObj);
    }
    return renderMap.get(routerName)!;
  };

  // const getCloneData = (
  //   fullPath: string,
  //   routerName: string
  // ): { [key: string]: ComponentHead } => {
  //   const dataObj = renderMap.get(routerName);
  //   return DragHandler.cloneData(dataObj)!;
  // };
  // const homePage = "/render";
  // const routerData = queryData(homePage);
  // renderMap.set(homePage, routerData);
  const changeDataMap = reactive(new Map<string, ComponentHead>());
  // const getData = () => {};
  return { renderMap, getAndInitData, changeDataMap };
});
