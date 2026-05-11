import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authService, type AuthResponse } from "@/services/authService";
import type { User } from "@/services/userService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role);

  async function checkAuth() {
    if (!token.value) {
      user.value = null;
      return false;
    }

    if (user.value) return true;

    try {
      const userData = await authService.getMe();
      user.value = userData;
      return true;
    } catch (e) {
      logout();
      return false;
    }
  }

  async function login(username: string, pass: string) {
    try {
      const resp: AuthResponse = await authService.login(username, pass);

      token.value = resp.token;
      user.value = resp.user;

      localStorage.setItem("token", resp.token);
      if (resp.refreshToken) {
        localStorage.setItem("refreshToken", resp.refreshToken);
      }

      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/auth/login";
  }

  function hasRole(requiredRole: string | string[]) {
    if (!user.value) return false;

    if (user.value.role === "ADMIN") return true;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.value.role);
    }
    return user.value.role === requiredRole;
  }

  function hasPermission(permission: string) {
    if (!user.value) return false;
    if (user.value.role === "ADMIN") return true;

    if (user.value.permissions?.includes("all")) return true;
    return user.value.permissions?.includes(permission) || false;
  }

  function hasComponentPermission(key: string) {
    if (!user.value) return false;
    if (user.value.role === "ADMIN") return true;
    return !(user.value.component_permissions?.includes(key) ?? false);
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    hasRole,
    checkAuth,
    hasPermission,
    hasComponentPermission,
  };
});
