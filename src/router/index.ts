import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/index.vue'
import Reactive from '../modules/capi/reactive.vue'
import Watch from '../modules/capi/watch.vue'

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
    },
    {
      path: '/watch',
      component: Watch
    }
  ],
});

export default router;
