
import api from '@/core/api'

export interface Role {
    id: number | string
    name: string
    description: string
    permissions: string[]
    isSystem?: boolean
}

export const roleService = {
    async getRoles(): Promise<Role[]> {
        const response = await api.get('api/auth/groups/')
        return response.data.map((g: any) => ({
            id: g.id,
            name: g.name,
            description: g.description ?? '',
            permissions: g.permissions,
            isSystem: g.name === 'ADMIN'
        }))
    },

    async saveRole(role: Role): Promise<Role> {
        const payload = {
            name: role.name,
            description: role.description ?? '',
            permissions: role.permissions
        }
        let response;
        if (role.id && typeof role.id === 'number') {
            response = await api.put(`api/auth/groups/${role.id}/`, payload)
        } else {
            response = await api.post('api/auth/groups/', payload)
        }

        const g = response.data;
        return {
            id: g.id,
            name: g.name,
            description: g.description ?? '',
            permissions: g.permissions,
            isSystem: false
        }
    },

    async deleteRole(roleId: string | number): Promise<void> {
        await api.delete(`api/auth/groups/${roleId}/`)
    },

    async assignRoleToUser(userId: number, roleName: string): Promise<void> {
        await api.post(`api/auth/users/${userId}/set_role/`, { role: roleName })
    },

    init() {},
}
