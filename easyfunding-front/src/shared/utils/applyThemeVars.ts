import { appConfig } from '@/config/appConfig'

export function applyThemeVars() {
  const el = document.documentElement

  // cores do app (base)
  el.style.setProperty('--app-primary', appConfig.theme.primary)
  el.style.setProperty('--app-secondary', appConfig.theme.secondary)

  // LIGHT tokens
  el.style.setProperty('--theme-light-background', appConfig.theme.light.background)
  el.style.setProperty('--theme-light-text', appConfig.theme.light.text)
  el.style.setProperty('--theme-light-icon', appConfig.theme.light.icon)
  el.style.setProperty('--theme-light-surface', appConfig.theme.light.surface)
  el.style.setProperty('--theme-light-muted', appConfig.theme.light.muted)
  el.style.setProperty('--theme-light-border', appConfig.theme.light.border)

  // DARK tokens
  el.style.setProperty('--theme-dark-background', appConfig.theme.dark.background)
  el.style.setProperty('--theme-dark-text', appConfig.theme.dark.text)
  el.style.setProperty('--theme-dark-icon', appConfig.theme.dark.icon)
  el.style.setProperty('--theme-dark-surface', appConfig.theme.dark.surface)
  el.style.setProperty('--theme-dark-muted', appConfig.theme.dark.muted)
  el.style.setProperty('--theme-dark-border', appConfig.theme.dark.border)
}
