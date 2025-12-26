import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView/HomeView.vue";
import ProductView from "@/views/ProductView/ProductView.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },

        {
          path: "/products",
          name: "products",
          component: ProductView,
        },
      ],
    },
  ],
});

export default router;
