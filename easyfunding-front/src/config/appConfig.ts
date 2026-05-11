import { reactive } from 'vue'

export type UserRole = 'ADMIN' | 'USER'
export type NavMode = "SIDEBAR" | "NAVBAR";

export interface MenuItem {
    label: string
    icon: string
    to: string
}

export interface CategoryMenuItem {
    label: string
    icon: string
    to?: string
    itens?: MenuItem[]
}

export const appConfig = reactive({
    appName: 'EasyFunding',
    logo: {
        light: "/assets/icon/logo_light.svg",
        dark: "/assets/icon/logo_dark.svg",
    },
    layout: {
        navMode: "SIDEBAR" as NavMode,
    },
    theme: {
        primary: '#000000',
        secondary: '#E6D5B8',
        dark: {
            background: '#111827',
            text: '#E6D5B8',
            icon: '#9CA3AF',
            surface: '#0b1220',
            muted: '#9CA3AF',
            border: '#E6D5B8'
        },
        light: {
            background: '#F9FAFB',
            text: '#111827',
            icon: '#4B5563',
            surface: '#ffffff',
            muted: '#6B7280',
            border: 'rgba(232, 32, 36, 0.04)'
        }
    },
    mainMenu: [
        { label: 'Dashboard', icon: 'LayoutDashboard', to: '/dashboard' },
        {
            label: 'Fundos', icon: 'FileText', itens: [
                { label: 'Avisos PT2030', icon: 'FileText', to: '/notices-pt2030' },
            ] as MenuItem[],
        },
        {
            label: 'Conta', icon: 'User', itens: [
                { label: 'Notificações', icon: 'Bell', to: '/notifications' },
                { label: 'Perfil', icon: 'User', to: '/profile' },
            ] as MenuItem[],
        },
    ] as CategoryMenuItem[],
    adminMenu: [
        { label: 'Gerir Utilizadores', icon: 'Users', to: '/admin/users' },
        { label: 'Gerir Permissoes', icon: 'Shield', to: '/admin/roles' },
    ] as MenuItem[]
})
