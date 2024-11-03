import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/test',
      name: 'test',
      // component: () => import('../components/Test.vue'),
      component: () => import('../components/Test.vue'),
    },
    {
      path: '/test2',
      name: 'test2',
      // component: () => import('../components/Test.vue'),
      component: () =>
        import('../views/page_design/component-desc/el-table-edit.vue'),
    },
    {
      path: '/system',
      // name: 'pageDesign',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/pageDesign/PageDesign.vue'),
      children: [
        {
          path: 'pageDesign',
          name: 'pageDesign',
          component: () => import('../views/page_design/page-design.vue'),
        },
        {
          path: 'designArea',
          name: 'designArea',
          component: () => import('../views/page_design/render-modeler.vue'),
        },
      ],
    },
  ],
})

export default router
