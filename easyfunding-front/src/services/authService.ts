import type { User } from "./userService";
import api from "@/core/api";

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface LoginPayload {
  access: string;
  refresh: string;
}

export const authService = {
  async login(
    username_input: string,
    password_input: string,
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginPayload>("/api/token/", {
        username: username_input,
        password: password_input,
      });

      const { access, refresh } = response.data;

      // salva tokens
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      // ✅ garante que o getMe logo em seguida vai autenticado
      api.defaults.headers.common.Authorization = `Bearer ${access}`;

      const user = await this.getMe();

      return {
        user,
        token: access,
        refreshToken: refresh,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Falha na autenticação. Verifique suas credenciais.");
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await api.get<{
        id: number;
        username: string;
        email: string;
        is_admin: boolean;
        role: string;
        permissions: string[];
        component_permissions: string[];
      }>("/api/auth/me/");

      const { id, username, email, is_admin, role, permissions, component_permissions } =
        response.data;

      return {
        id,
        name: username,
        email,
        role: role || (is_admin ? "ADMIN" : "USER"),
        permissions: permissions || [],
        component_permissions: component_permissions || [],
        avatar: `https://i.pravatar.cc/150?u=${id}`,
      };
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw new Error("Sessão inválida ou expirada");
    }
  },

  logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
};
