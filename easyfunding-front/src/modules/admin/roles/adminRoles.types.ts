export type AppRoutePermission = {
  name: string
  path: string
  meta?: any
}

export type Role = {
  id: number | string
  name: string
  description?: string
  permissions?: string[]
  isSystem?: boolean
}

export type User = {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
}
