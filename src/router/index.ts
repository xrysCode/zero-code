import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Designer from "@/design/Designer.vue";
import RenderPortal from "@/design/RenderPortal.vue";
import RenderDesign from "@/design/RenderDesign.vue";
import { useRenderStore } from "@/stores/render";
import {
  clonStartDesign,
  RouterView,
  Table,
  // StartDesign,
  type ComponentHead,
} from "@/design/componentDesc";
import { queryAllData } from "@/design/saveDataUtils";
import type { Component } from "vue";

// const renderStore2 = useRenderStore();

const startRenderData = clonStartDesign();
startRenderData.list.push(Table);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /*{
      path: "/render",
      name: "/render:0",
      components: { default: RenderPortal },
      children: [
        {
          path: "/render",
          name: "/render:1",
          components: { default: RenderPortal },
          props: {
            default: { renderData: { ...StartDesign, fullPath: "/render" } },
          },
        },
        {
          path: "/render/aa",
          name: "/render/aa:0",
          components: { default: RenderPortal },
          props: {
            default: { renderData: { ...StartDesign, fullPath: "/render" } },
          },
        },
      ],
      props: { renderData: { ...StartDesign, fullPath: "/render" } },
    },*/
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
    // {
    //   path: "/test",
    //   name: "test",
    //   component: () => import("@/design/comWrapper/Test.vue"),
    // },
    {
      path: "/test",
      name: "test",
      component: RenderDesign,
      props: { renderData: { ...startRenderData, fullPath: "/render" } },
      //   children: [
      //     {
      //       path: "",
      //       name: "/render:1",
      //       components: { default: RenderDesign },
      //       props: {
      //         default: { renderData: { ...Layout } },
      //       },
      //     },
      //   ],
    },
  ],
});

router.beforeEach((to, from) => {
  // 初始化从后台
  const matched = to.matched;
  if (matched.length == 0) {
    const fullPath = to.fullPath as string;
    const allData = queryAllData(fullPath);
    //由最近的路由来开始新的页面
    // 初始化从后台

    if (allData.size == 0) {
      //没新建一个顶层路由
      const startRenderData = clonStartDesign();
      startRenderData.routerDesc = {
        fullPath,
        viewName: "default",
        level: 0,
      };
      allData.set(fullPath + ":0", {
        default: {
          renderData: startRenderData,
        },
      });
    }

    //默认子路由可能深度嵌套
    //解析当前路由
    const renderMap = useRenderStore().renderMap;
    const newRouterMap = new Map<number, any>();
    allData.forEach((value, key) => {
      // const routerDesc = Object.entries(value)[0][1].renderData.routerDesc;
      const components = {} as { [key: string]: Component };
      let level = null;
      for (const key in value) {
        components[key] = RenderDesign;
        level = value[key].renderData.routerDesc!.level;
      }
      const registName = fullPath + ":" + level;
      renderMap.set(registName, value);
      const newRouter = {
        path: fullPath,
        name: registName,
        components: components,
        //新路由数据
        props: renderMap.get(registName),
      };
      newRouterMap.set(level!, newRouter);
    });

    //寻找父路由
    let parentPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
    while (parentPath != "") {
      if (renderMap.has(parentPath + ":0")) {
        break;
      }
      parentPath = parentPath.substring(0, parentPath.lastIndexOf("/"));
    }
    //注册路由
    let parentRegistName = parentPath == "" ? "" : parentPath + ":0";
    for (let index = 0; index < newRouterMap.size; index++) {
      const newRouter = newRouterMap.get(index);
      if (parentRegistName == "") {
        router.addRoute(newRouter);
      } else {
        router.addRoute(parentRegistName, newRouter);
      }
      parentRegistName = newRouter.name;
    }
    router.replace({ path: fullPath });
    // return fullPath;
  }

  //切换路由连接路由
});

/**添加一个新路由作为原来的子路由默认 */
export const addInitChildRoute = (parentRouter: ComponentHead) => {
  //寻找路由深度
  let levelParent = 0;
  if (parentRouter._preRouteLink) {
    levelParent = parentRouter._preRouteLink._root!.routerDesc!.level;
  }
  // debugger;
  console.log("当前路由", router.currentRoute);
  const cr = router.currentRoute.value;
  const renderMap = useRenderStore().renderMap;
  const fullPath = cr.fullPath;

  const startRenderData = clonStartDesign();
  startRenderData.routerDesc = {
    fullPath,
    viewName: "default",
    level: levelParent + 1,
  };
  // startRenderData._preRouteLink = parentRouter;
  // parentRouter._nextRouteLink = startRenderData;

  const registName = fullPath + ":" + startRenderData.routerDesc.level;
  renderMap.set(registName, { default: { renderData: startRenderData } });
  const newRouter = {
    path: fullPath,
    name: registName,
    components: { default: RenderDesign },
    //新路由数据
    props: renderMap.get(registName),
  };
  // parentRouter._nextRouteLink=
  router.addRoute(cr.name!, newRouter);
  router.replace({ path: fullPath });
};

router.afterEach((to, from, failure) => {
  console.log("failed navigation", failure);
});

export default router;
