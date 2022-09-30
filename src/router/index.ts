import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Designer from "@/design/Designer.vue";
import Reaner from "@/design/Render.vue";
import LayoutWrapper from "@/design/comWrapper/LayoutWrapper.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Reaner",
      component: Reaner,
    },
    {
      path: "/design",
      name: "designer",
      component: Designer,
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/design/comWrapper/LayoutEditer.vue"),
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

export default router;
