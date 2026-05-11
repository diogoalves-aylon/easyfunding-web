<!-- src/shared/pages/privacy/PrivacyView.vue -->
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
          Política de Privacidade
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
          A <span class="text-theme-text/95">Aylon</span> respeita a privacidade dos utilizadores do seu website e
          compromete-se a proteger os dados pessoais que sejam recolhidos, em conformidade com o Regulamento Geral sobre
          a Proteção de Dados (RGPD) e legislação nacional aplicável.
        </p>

        <!-- 1 -->
        <div class="space-y-4">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            1. Responsável pelo Tratamento de Dados
          </h2>

          <div class="space-y-2 text-[13px] md:text-[14px] leading-relaxed">
            <p><strong>Entidade:</strong> Aylon</p>
            <p><strong>Forma jurídica:</strong> Sociedade por Quotas</p>
            <p>
              <strong>Sede:</strong>
              Edifício Brigantia EcoPark, Av. Cidade de León, nº 506, 5300-358 Bragança, Portugal
            </p>
            <p>
              <strong>Email de contacto:</strong>
              <a href="mailto:comercial@aylon.ai"
                class="hover:text-theme-text/90 transition-colors">comercial@aylon.ai</a>
            </p>
          </div>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            A Aylon é responsável pelo tratamento dos dados pessoais recolhidos através deste website.
          </p>
        </div>

        <!-- 2 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            2. Dados Pessoais Recolhidos
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Através do website, a Aylon pode recolher os seguintes dados pessoais:
          </p>

          <ul class="space-y-2 text-[13px] md:text-[14px] leading-relaxed list-disc pl-5">
            <li>Nome</li>
            <li>Endereço de email</li>
            <li>Empresa / organização</li>
            <li>Conteúdo das mensagens enviadas através do formulário de contacto</li>
          </ul>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Não são recolhidos dados sensíveis.
          </p>
        </div>

        <!-- 3 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            3. Finalidades do Tratamento
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Os dados pessoais recolhidos destinam-se a:
          </p>

          <ul class="space-y-2 text-[13px] md:text-[14px] leading-relaxed list-disc pl-5">
            <li>Responder a pedidos de contacto e informações</li>
            <li>Comunicar com potenciais clientes</li>
            <li>Avaliar oportunidades de prestação de serviços</li>
            <li>Cumprir obrigações legais</li>
          </ul>
        </div>

        <!-- 4 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            4. Base Legal do Tratamento
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            O tratamento dos dados pessoais baseia-se em:
          </p>

          <ul class="space-y-2 text-[13px] md:text-[14px] leading-relaxed list-disc pl-5">
            <li>Consentimento do titular dos dados</li>
            <li>Diligências pré-contratuais, a pedido do titular</li>
            <li>Cumprimento de obrigações legais, quando aplicável</li>
          </ul>
        </div>

        <!-- 5 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            5. Conservação dos Dados
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Os dados pessoais serão conservados apenas durante o período necessário para cumprir as finalidades para as
            quais foram recolhidos ou enquanto existir uma relação comercial ou de contacto ativa, salvo obrigação legal
            em contrário.
          </p>
        </div>

        <!-- 6 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            6. Destinatários dos Dados
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            A Aylon não partilha dados pessoais com terceiros, exceto quando tal seja necessário para cumprir obrigações
            legais ou por imposição de autoridades competentes.
          </p>
        </div>

        <!-- 7 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            7. Direitos dos Titulares dos Dados
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Nos termos do RGPD, o titular dos dados tem direito a:
          </p>

          <ul class="space-y-2 text-[13px] md:text-[14px] leading-relaxed list-disc pl-5">
            <li>Acesso aos seus dados pessoais</li>
            <li>Retificação de dados inexatos ou incompletos</li>
            <li>Apagamento dos dados (“direito a ser esquecido”)</li>
            <li>Limitação ou oposição ao tratamento</li>
            <li>Portabilidade dos dados</li>
          </ul>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            Para exercer qualquer destes direitos, deverá contactar a Aylon através do email indicado.
          </p>
        </div>

        <!-- 8 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            8. Segurança dos Dados
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            A Aylon adota medidas técnicas e organizativas adequadas para proteger os dados pessoais contra acesso não
            autorizado, perda, destruição ou divulgação indevida.
          </p>
        </div>

        <!-- 9 -->
        <div class="space-y-4 pt-4 border-t border-theme-border/15">
          <h2 class="text-[15px] md:text-[17px] font-medium text-theme-text/90">
            9. Alterações à Política de Privacidade
          </h2>

          <p class="text-[13px] md:text-[14px] leading-relaxed">
            A Aylon reserva-se o direito de atualizar a presente Política de Privacidade a qualquer momento. Quaisquer
            alterações serão publicadas nesta página.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
