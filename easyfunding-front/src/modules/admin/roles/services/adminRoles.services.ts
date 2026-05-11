import { roleService } from "@/services/roleService";
import { userService } from "@/services/userService";
import type { Role, User } from "../adminRoles.types";

export const adminRolesService = {
  async getRoles(): Promise<Role[]> {
    return await roleService.getRoles();
  },
  async getUsers(): Promise<User[]> {
    return await userService.getUsers();
  },

  async saveRole(role: Role): Promise<Role> {
    const payload = {
      id: role.id,
      name: role.name,
      description: role.description ?? "", 
      permissions: role.permissions ?? [], 
      isSystem: role.isSystem ?? false, 
    };

    return await roleService.saveRole(payload);
  },

  async deleteRole(roleId: number | string): Promise<void> {
    await roleService.deleteRole(roleId);
  },
  async assignRoleToUser(userId: number, roleName: string): Promise<void> {
    await roleService.assignRoleToUser(userId, roleName);
  },
};
