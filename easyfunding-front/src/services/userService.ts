export interface User {
    id: number
    name: string
    email: string
    role: string
    avatar: string
    permissions?: string[]
    component_permissions?: string[]
}

import api from '@/core/api'

export const userService = {
    async getUsers(): Promise<User[]> {
        interface ApiUser {
            id: number
            username: string
            email: string
            is_admin: boolean
            role: string
            permissions?: string[]
        }

        try {
            const response = await api.get<any>('/api/auth/users/')
            const data = Array.isArray(response.data) ? response.data : response.data.results
            if (!Array.isArray(data)) return []

            return data.map((user: any) => ({
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
                avatar: `https://i.pravatar.cc/150?u=${user.id}`,
                permissions: user.permissions
            }))
        } catch (error) {
            console.error('Failed to fetch users:', error)
            return []
        }
    },

    async updateUserRole(userId: number, role: string): Promise<void> {
        try {
            await api.post(`/api/auth/users/${userId}/set_role/`, { role })
        } catch (error) {
            console.error(`Failed to update user ${userId}:`, error)
            throw error
        }
    },

    async deleteUser(userId: number): Promise<void> {
        try {
            await api.delete(`/api/auth/users/${userId}/`)
        } catch (error) {
            console.error(`Failed to delete user ${userId}:`, error)
            throw error
        }
    },

    async createUser(userData: { username: string; email: string; password: string; is_admin: boolean }): Promise<void> {
        try {
            await api.post('/api/auth/users/', userData)
        } catch (error) {
            console.error('Failed to create user:', error)
            throw error
        }
    },

    async updateUser(userId: number, userData: Partial<{ username: string; email: string; password: string; is_admin: boolean }>): Promise<void> {
        try {
            await api.put(`/api/auth/users/${userId}/`, userData)
        } catch (error) {
            console.error(`Failed to update user ${userId}:`, error)
            throw error
        }   
    }
}
