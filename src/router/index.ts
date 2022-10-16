import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Designer from "@/design/Designer.vue";
import RenderPortal from "@/design/RenderPortal.vue";
import RenderDesign from "@/design/RenderDesign.vue";
import { useRenderStore } from "@/stores/render";
import type { ComponentHead } from "@/design/componentDesc";
// import { queryData } from "@/design/saveDataUtils";
import type { Component } from "vue";

// const renderStore2 = useRenderStore();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/render",
    //   name: "/render",
    //   component: RenderPortal,
    //   // children: [
    //   //   // {
    //   //   //   path: "",
    //   //   //   component: RenderPortal,
    //   //   // },
    //   //   {
    //   //     path: "/inner",
    //   //     component: () => import("@/design/comWrapper/Test.vue"),
    //   //   },
    //   // ],
    //   props: { renderData: { ...StartDesign, fullPath: "/render" } },
    // },
    // {
    //   path: "/",
    //   name: "RenderPortal0",
    //   component: RenderPortal,
    // },
    {
      path: "/design",
      name: "designer",
      component: Designer,
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/design/comWrapper/Test.vue"),
    },
  ],
});

interface RenderComponentProps {
  [key: string]: { renderData: ComponentHead };
}

router.beforeEach((to, from) => {
  // 初始化
  const renderStore = useRenderStore();
  const renderMap = renderStore.renderMap;
  const matched = to.matched;

  if (matched.length == 0) {
    //由最近的路由来开始新的页面
    const components = {} as { [key: string]: Component };
    const renderData = renderStore.getAndInitData(
      to.fullPath,
      to.fullPath as string
    );
    const componentPropsData = {} as RenderComponentProps;
    for (const key in renderData) {
      components[key] = RenderDesign;
      componentPropsData[key] = { renderData: renderData[key] };
    }
    const newRouter = {
      path: to.fullPath,
      name: to.fullPath,
      components: components,
      //新路由数据
      props: componentPropsData,
    };
    // /a->/a/b
    let path = to.fullPath.substring(0, to.fullPath.lastIndexOf("/"));
    while (path != "") {
      if (renderMap.has(path)) {
        // router.addRoute(from.name, newRouter);
        router.addRoute(path, newRouter);
        return to.fullPath;
      }
      path = path.substring(0, path.lastIndexOf("/"));
    }
    //最外层都没有的情况 /a->/b
    router.addRoute(newRouter);
    return to.fullPath;
  }
});

/**添加一个新路由作为原来的子路由 */
export const addInitChildRoute = () => {
  console.log("当前路由", router.currentRoute);
  const cr = router.currentRoute.value;
  const renderStore = useRenderStore();
  const routerName = cr.fullPath + ":default";
  const renderData = renderStore.getAndInitData(cr.fullPath, routerName);
  // for (const key in renderData) {
  //   components[key] = RenderDesign;
  // }
  const newRouter = {
    path: cr.fullPath,
    name: routerName,
    components: { default: RenderDesign },
    //新路由数据
    props: { default: { renderData: renderData } },
  };

  router.addRoute(cr.name!, newRouter);
};

export default router;
