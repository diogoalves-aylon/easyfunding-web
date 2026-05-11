import type { PasswordForm, ProfileForm, UserProfile } from '../profile.types'
import api  from '@/core/api'
import { validateEmail } from '@/utils/utils'

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('/api/auth/me/')

    return {
      id: data.id,
      name: data.username,
      email: data.email,
      phone: data.phone ?? '',
      role: data.role,
      avatarUrl: `https://i.pravatar.cc/150?u=${data.id}`
    }
  },

  async updateProfile(payload: { name: string; email: string; phone: string }) {
    return api.patch('/api/auth/me/', payload)
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    return api.post('/api/auth/change-password/', payload)
  },

  async deleteAccount(){
    return api.delete('/api/auth/delete-account/')
  }
}

export function toProfileForm(u: UserProfile): ProfileForm {
  return {
    name: u.name,
    email: u.email,
    phone: u.phone
  }
}

export function validateProfileForm(f: ProfileForm) {
  const emailError = validateEmail(f.email)

  if (!f.name.trim()) return 'Nome é obrigatório.'
  if (!f.email.trim()) return 'Email é obrigatório.'
  if (emailError) return emailError
  if (!f.phone.trim()) return 'Telefone é obrigatório.'

  return ''
}

export function validatePasswordForm(p: PasswordForm): string {
  const current = (p.currentPassword ?? '').trim()
  const next = (p.newPassword ?? '').trim()
  const confirm = (p.confirmPassword ?? '').trim()

  //básicos
  if (!current) return 'Informe sua senha atual.'
  if (!next) return 'Informe a nova senha.'
  if (!confirm) return 'Confirme a nova senha.'
  if (next !== confirm) return 'Confirmação de senha não confere.'

  //não permitir igual à atual
  if (next === current) return 'A nova senha deve ser diferente da senha atual.'

  //tamanho (recomendação moderna: 8+)
  if (next.length < 8) return 'A nova senha deve ter pelo menos 8 caracteres.'
  if (next.length > 72) return 'A nova senha é muito longa (máx. 72 caracteres).'

  //evitar espaços
  if (/\s/.test(next)) return 'A nova senha não pode conter espaços.'

  //força mínima (3 de 4 categorias)
  const hasLower = /[a-z]/.test(next)
  const hasUpper = /[A-Z]/.test(next)
  const hasDigit = /\d/.test(next)
  const hasSymbol = /[^A-Za-z0-9]/.test(next)

  const categories = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length
  if (categories < 3) {
    return 'Use pelo menos 3 destes: letra minúscula, letra maiúscula, número e símbolo.'
  }

  //bloquear padrões comuns (simples e efetivo)
  const lowered = next.toLowerCase()

  //sequências óbvias (1234, abcd, etc.)
  if (hasSequentialRun(lowered, 4)) {
    return 'Evite sequências óbvias (ex.: 1234, abcd).'
  }

  return ''
}

// detecta sequência crescente de tamanho "run" (ex.: 1234, abcd)
function hasSequentialRun(s: string, run = 4): boolean {
  if (s.length < run) return false

  // normaliza para só letras/dígitos (sequências mais óbvias)
  const cleaned = s.replace(/[^a-z0-9]/g, '')
  if (cleaned.length < run) return false

  for (let i = 0; i <= cleaned.length - run; i++) {
    let inc = true
    for (let j = 0; j < run - 1; j++) {
      const a = cleaned.charCodeAt(i + j)
      const b = cleaned.charCodeAt(i + j + 1)
      if (b !== a + 1) {
        inc = false
        break
      }
    }
    if (inc) return true
  }
  return false
}


