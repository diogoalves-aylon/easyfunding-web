<script setup lang="ts">
const updatedAt = "09/02/2026";
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center px-6 py-16 animate-in fade-in duration-1200 ease-in-out">
    <div class="w-full max-w-4xl space-y-12 text-theme-text/80">
      <!-- Header -->
      <header class="text-center space-y-6">
        <h1 class="text-[20px] md:text-[26px] font-medium tracking-[0.6em] uppercase text-theme-text/90 pl-[0.6em]">
          Termos e Condições de Uso
        </h1>

        <p class="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-theme-muted/45 pl-[0.35em]">
          Última atualização: {{ updatedAt }}
        </p>

        <div class="mx-auto w-72 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
      </header>

      <!-- Content box -->
      <section
        class="rounded-3xl ui-border shadow-lg bg-theme-suface/10 backdrop-blur-md px-8 md:px-12 py-10 md:py-12 space-y-12">
        <!-- 1 -->
        <div class="space-y-4">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            1. Introdução e Aceitação
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            1.1. Os presentes Termos e Condições ("Termos") regulam a utilização do website e dos serviços
            prestados pela
            <span class="text-theme-text/95">Aylon</span> ("nós", "nosso"). Ao aceder ao nosso site ou ao
            contratar os
            nossos serviços, o utilizador ("Cliente", "você") concorda em vincular-se legalmente a este
            acordo.
          </p>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            1.2. A <span class="text-theme-text/95">Aylon</span> presta serviços de consultoria,
            desenvolvimento de
            software e implementação de soluções de IA. O uso destas tecnologias implica a aceitação das
            suas
            características intrínsecas, nomeadamente a natureza probabilística dos modelos de IA.
          </p>
        </div>

        <!-- 2 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            2. Propriedade Intelectual
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            2.1. Todos os textos, gráficos, logótipos, interfaces, código e materiais disponíveis na
            <span class="text-theme-text/95">Aylon</span> são propriedade exclusiva da Aylon ou dos seus
            licenciadores.
          </p>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            2.2. Salvo acordo em contrário, a propriedade intelectual das soluções desenvolvidas para o
            Cliente é
            transferida para este após pagamento. A Aylon retém o direito de reutilizar "Background IP".
          </p>
        </div>

        <!-- 3 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            3. Responsabilidade (AI Disclaimer)
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            3.1. A <span class="text-theme-text/95">Aylon</span> envida os melhores esforços para garantir a
            qualidade
            dos seus serviços. Não garantimos que as soluções de IA sejam isentas de erros sem supervisão
            humana.
          </p>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            3.2. As soluções da <span class="text-theme-text/95">Aylon</span> servem de apoio à decisão. A
            responsabilidade final por decisões de negócio recai sobre o Cliente.
          </p>
        </div>

        <!-- 4 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            4. Confidencialidade e Dados
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            4.1. Comprometemo-nos a manter o estrito sigilo sobre informações sensíveis do Cliente.
          </p>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            4.2. O tratamento de dados pessoais rege-se pela nossa Política de Privacidade, em cumprimento
            do RGPD.
          </p>
        </div>

        <!-- 5 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            5. Lei Aplicável e Foro
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            5.1. Estes Termos regem-se pela lei Portuguesa.
          </p>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            5.2. Para resolução de conflitos, é competente o Tribunal da Comarca de Bragança.
          </p>
        </div>

        <!-- Contactos -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            Contactos
          </h2>

          <p class="text-[13px] md:text-[14px]">
            <strong>Entidade:</strong> Aylon
          </p>

          <p class="text-[13px] md:text-[14px]">
            <strong>Email:</strong>
            <a href="mailto:comercial@aylon.ai" class="hover:text-theme-text/90 transition-colors">
              comercial@aylon.ai
            </a>
          </p>

          <p class="text-[13px] md:text-[14px]">
            <strong>Morada:</strong>
            Edifício Brigantia EcoPark, Av. Cidade de León, nº 506, 5300-358 Bragança, Portugal
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
