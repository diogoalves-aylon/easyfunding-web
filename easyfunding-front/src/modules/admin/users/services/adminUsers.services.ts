import { userService } from '@/services/userService'
import { roleService } from '@/services/roleService'
import type { AdminUser, Role, CreateUserPayload } from '../adminUsers.types'

export const adminUsersService = {
  async getUsers(): Promise<AdminUser[]> {
    // reaproveita seu service existente
    return await userService.getUsers()
  },

  async getRoles(): Promise<Role[]> {
    return await roleService.getRoles()
  },

  async updateUserRole(userId: number | string, role: string): Promise<void> {
    await userService.updateUserRole(userId as any, role)
  },

  async deleteUser(userId: number | string): Promise<void> {
    await userService.deleteUser(userId as any)
  },

  async createUser(payload: CreateUserPayload): Promise<void> {
    await userService.createUser(payload as any)
  },

  async updateUser(userId: number | string, payload: Partial<CreateUserPayload>): Promise<void> {
    await userService.updateUser(userId as any, payload as any)
  }
}
