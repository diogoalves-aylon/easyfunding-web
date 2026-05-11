export type UserProfile = {
  id: number
  name: string
  email: string
  phone: string
  role: 'ADMIN' | 'USER'
  avatarUrl?: string
}

export type ProfileForm = {
  name: string
  email: string
  phone: string
}

export type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
