<!-- src/shared/pages/cookies/CookiesView.vue -->
<script setup lang="ts">
const updatedAt = "09/02/2026";
</script>

<template>
    <div
        class="min-h-screen w-full flex items-center justify-center px-6 py-16 animate-in fade-in duration-1200 ease-in-out">
        <div class="w-full max-w-4xl space-y-12 text-theme-text/80">
            <!-- Header -->
            <header class="text-center space-y-6">
                <h1
                    class="text-[20px] md:text-[26px] font-medium tracking-[0.6em] uppercase text-theme-text/90 pl-[0.6em]">
                    Política de Cookies
                </h1>

                <p class="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-theme-muted/45 pl-[0.35em]">
                    Última atualização: {{ updatedAt }}
                </p>

                <div class="mx-auto w-72 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
            </header>

            <!-- Content box -->
            <section
                class="rounded-3xl ui-border shadow-lg bg-theme-suface/10 backdrop-blur-md px-8 md:px-12 py-10 md:py-12 space-y-12">
                <p class="text-[13px] md:text-[14px] leading-relaxed">
                    O website da <span class="text-theme-text/95">Aylon</span> utiliza apenas cookies estritamente
                    necessários ao
                    seu funcionamento.
                </p>

                <!-- What -->
                <div class="space-y-4">
                    <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
                        O que são cookies?
                    </h2>

                    <p class="text-[13px] md:text-[14px] leading-relaxed">
                        Cookies são pequenos ficheiros de texto armazenados no dispositivo do utilizador quando visita
                        um website,
                        permitindo o seu correto funcionamento.
                    </p>
                </div>

                <!-- Types -->
                <div class="space-y-4 pt-4 border-t border-theme-border/15">
                    <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
                        Que tipos de cookies utilizamos?
                    </h2>

                    <p class="text-[13px] md:text-[14px] leading-relaxed">
                        <strong>Cookies essenciais (técnicos):</strong>
                        Necessários para garantir o funcionamento básico do website, como segurança, navegação e gestão
                        de
                        preferências.
                    </p>

                    <p class="text-[13px] md:text-[14px] leading-relaxed">
                        A <span class="text-theme-text/95">Aylon</span> não utiliza cookies analíticos nem cookies de
                        marketing.
                    </p>
                </div>

                <!-- Consent -->
                <div class="space-y-4 pt-4 border-t border-theme-border/15">
                    <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
                        Consentimento
                    </h2>

                    <p class="text-[13px] md:text-[14px] leading-relaxed">
                        Uma vez que apenas são utilizados cookies estritamente necessários, não é requerido
                        consentimento prévio do
                        utilizador.
                    </p>
                </div>

                <!-- Management -->
                <div class="space-y-4 pt-4 border-t border-theme-border/15">
                    <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
                        Gestão de cookies
                    </h2>

                    <p class="text-[13px] md:text-[14px] leading-relaxed">
                        O utilizador pode configurar o seu navegador para bloquear ou eliminar cookies. No entanto, tal
                        poderá
                        afetar o correto funcionamento do website.
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>
