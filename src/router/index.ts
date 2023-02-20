import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/index.vue'
import Reactive from '../modules/capi/reactive.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/reactive',
      component: Reactive
    }
  ],
});

export default router;
