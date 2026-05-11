export function unmaskPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function validateEmail(email: string): string {
  const value = (email ?? '').trim()

  if (!value) return 'Informe o e-mail.'

  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  if (!re.test(value)) return 'E-mail inválido.'

  // Proteções extras comuns:
  if (value.length > 254) return 'E-mail inválido.'
  const [local, domain] = value.split('@')
  if (!local || !domain) return 'E-mail inválido.'
  if (local.length > 64) return 'E-mail inválido.'

  return ''
}

