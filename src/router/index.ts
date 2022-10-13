import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Designer from "@/design/Designer.vue";
import RenderPortal from "@/design/RenderPortal.vue";
import RenderDesign from "@/design/RenderDesign.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/render",
      name: "RenderPortal",
      component: RenderPortal,
      children: [
        // {
        //   path: "",
        //   component: RenderPortal,
        // },
        {
          path: "/inner",
          component: () => import("@/design/comWrapper/Test.vue"),
        },
      ],
    },
    {
      path: "/",
      name: "RenderPortal0",
      component: RenderPortal,
    },
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
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

router.beforeEach((to, from) => {
  // debugger;
  // if (!hasNecessaryRoute(to)) {
  // const newRouter = { path: to.fullPath, component: RenderDesign, props: {renderData: JSON.parse(localStorage.getItem(""))} };
  // router.addRoute(newRouter);
  // 触发重定向
  //   return to.fullPath;
  // }
});

export default router;
