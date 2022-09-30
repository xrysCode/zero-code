import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";
import type { ComDesc } from "@/design/comDesc";
import { Layout } from "@/design/comDesc";

export const useRenderStore = defineStore("render", () => {
  // const renderArr:Array<ComDesc> = ref([]);

  const data: ComDesc = Layout;
  const renderData = ref(data);

  return { renderData };
});
