import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Area
    {
      path: "/home",
      name: "home",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: false },
      children: [
        {
          path: "",
          name: "home-index",
          component: () => import("@/modules/home/pages/HomeView.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "/terms",
          name: "terms",
          component: () => import("@/shared/pages/terms/TermsView.vue"),
        },
        {
          path: "/privacy",
          name: "privacy",
          component: () => import("@/shared/pages/privacy/PrivacyView.vue"),
        },
        {
          path: "/cookies",
          name: "cookies",
          component: () => import("@/shared/pages/cookies/CookiesView.vue"),
        },
        {
          path: "/about",
          name: "about",
          component: () => import("@/shared/pages/about/AboutView.vue"),
        },
      ],
    },

    // Redirect root to /home
    {
      path: "/",
      redirect: "/home",
    },

    // auth Area
    {
      path: "/auth",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/modules/auth/LoginView.vue"),
        },
      ],
    },

    // Main App Area
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        // Authenticated Area
        {
          path: "/dashboard",
          name: "dashboard",
          component: () =>
            import("@/modules/dashboard/pages/DashboradView.vue"),
        },
        {
          path: "/notifications",
          name: "notifications",
          component: () => import("@/modules/notifications/pages/NotificationsView.vue"),
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("@/modules/profile/pages/ProfileView.vue"),
        },
        {
          path: "/notices-pt2030",
          name: "notices-pt2030",
          component: () => import("@/modules/notices-pt2030/pages/NoticesPt2030View.vue"),
          meta: { skipPermissionCheck: true },
        },
        {
          path: "/notices-pt2030/:code",
          name: "notices-pt2030-detail",
          component: () => import("@/modules/notices-pt2030/pages/NoticesPt2030DetailView.vue"),
          meta: { skipPermissionCheck: true },
        },
      ],
    },
    // Admin Area (Admin Layout)
    {
      path: "/admin",
      component: () => import("@/layouts/AdminLayout.vue"),
      meta: { requiresAuth: true, permission: "ADMIN" },
      children: [
        {
          path: "users",
          name: "admin-users",
          component: () => import("@/modules/admin/users/pages/UsersView.vue"),
        },
        {
          path: "roles",
          name: "admin-roles",
          component: () => import("@/modules/admin/roles/pages/RolesView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Middleware das rotas (Para modificar permissão precisa alterar em admin/roles)
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  
  // carrega o user se tem token e ainda não carregou
  if (authStore.token && !authStore.user) {
    await authStore.checkAuth();
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // rotas públicas
  if (!requiresAuth) {
    // se já está logado e tenta ir ao login, manda pro app
    if (to.name === "login" && authStore.isAuthenticated) return "/dashboard";
    return true;
  }

  // precisa auth e não está logado
  if (!authStore.isAuthenticated) {
    return { name: "login" };
  }

  // logado tentando ir pro login
  if (to.path === "/auth/login") {
    return "/";
  }

  // dashboard sempre liberado (mantive exatamente como você tinha)
  if (to.name === "home") {
    return true;
  }

  // sem user carregado -> trava
  if (!authStore.user) {
    return "/home";
  }

  // valida por permission = route.name
  const routeName = to.name ? String(to.name) : null;

  // se rota não tem "name", por segurança não entra
  if (!routeName) {
    return "/home";
  }

  if (!to.meta.skipPermissionCheck && !authStore.hasPermission(routeName)) {
    console.warn("Access denied. Missing permission:", routeName);
    return "/home";
  }

  return true;
});

export default router;
