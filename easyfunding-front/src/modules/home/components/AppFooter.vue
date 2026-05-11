<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

function goTo(route: string) {
    router.push(route)
}
</script>

<template>
    <footer class="bg-theme-surface border-t border-theme-border pt-20 pb-10 px-6 md:px-12">
        <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-12 mb-16">
                <div class="col-span-2">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-8 h-8">
                            <img src="/assets/icon/logo_light.svg" class="block dark:hidden">
                            <img src="/assets/icon/logo_dark.svg" class="hidden dark:block">
                        </div>
                        <span class="font-display font-bold text-lg tracking-tight">
                            Easy<span class="text-primary">Funding</span>
                        </span>
                    </div>

                    <p class="text-theme-muted text-sm max-w-sm leading-relaxed">
                        Plataforma de agregação e pesquisa de fundos públicos portugueses.
                        Desenvolvida pela AYLON.AI no âmbito do programa Portugal 2030.
                    </p>
                </div>

                <div>
                    <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-theme-muted">Links</h4>
                    <ul class="space-y-4 text-sm text-theme-muted">
                        <li>
                            <a @click="goTo('privacy')"
                                class="cursor-pointer hover:text-primary transition-colors duration-300 ease-ui">
                                Privacidade
                            </a>
                        </li>

                        <li>
                            <a @click="goTo('cookies')"
                                class="cursor-pointer hover:text-primary transition-colors duration-300 ease-ui">
                                Cookies
                            </a>
                        </li>

                        <li>
                            <a @click="goTo('terms')"
                                class="cursor-pointer hover:text-primary transition-colors duration-300 ease-ui">
                                Termos de Uso
                            </a>
                        </li>

                        <li>
                            <a href="https://www.livroreclamacoes.pt/inicio/" target="_blank"
                                class="cursor-pointer hover:text-primary transition-colors duration-300 ease-ui">
                                Livro de reclamações
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-theme-muted">Contacto</h4>
                    <ul class="space-y-4 text-sm text-theme-muted">
                        <li><a href="mailto:comercial@aylon.ai"
                                class="hover:text-theme-text/90 transition-colors">comercial@aylon.ai</a></li>
                        <li>Edifício Brigantia EcoPark, Av. Cidade de León, nº 506, 5300-358 Bragança, Portugal</li>
                    </ul>
                </div>
            </div>

            <div
                class="pt-10 border-t border-theme-border flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-xs text-theme-muted">© 2026 EasyFunding · AYLON.AI. Todos os direitos reservados.</p>
                <div class="flex gap-6 text-theme-muted">
                    <AppIcon name="Globe" :size="20" />
                    <AppIcon name="Smartphone" :size="20" />
                    <AppIcon name="ShieldCheck" :size="20" />
                </div>
            </div>
        </div>
    </footer>
</template>
