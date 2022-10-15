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

export const useRenderStore = defineStore("render", () => {
  let data = JSON.parse(localStorage.getItem("renderData")!);
  if (data == null) {
    data = StartDesign;
  }
  const renderData = ref(data);
  return { renderData };
});
