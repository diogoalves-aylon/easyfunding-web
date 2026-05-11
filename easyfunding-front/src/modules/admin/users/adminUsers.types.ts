export type UserRole = 'USER' | 'ADMIN' | string

export type AdminUser = {
  id: number | string
  name: string
  username?: string
  email: string
  avatar?: string
  role: UserRole
}

export type Role = {
  id: number | string
  name: string
}

export type CreateUserPayload = {
  username: string
  email: string
  password: string
  is_admin: boolean
}
