import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import { RangeEnum, type ComDesc } from "@/design/componentDesc";
import {
  Layout,
  StartDesign,
  ComponentWrapper,
  Menu,
} from "@/design/componentDesc";

export const useRenderStore = defineStore("render", () => {
  // const renderArr:Array<ComDesc> = ref([]);

  const data = Menu;
  const renderData = ref(data);
  // const activeComponent = reactive({
  //   //多个值，要找到元值  记录原来的位置
  //   index: -1,
  //   component: new ComponentWrapper("", RangeEnum.START, ""),
  // });

  return { renderData };
});
