<template>
  <div class="header-produtor">
    <div class="header-conteudo">
      <div class="header-detalhe"></div>

      <div>
        <div class="header-titulo">
          {{ configuracao.titulo }}
        </div>

        <div class="header-subtitulo">
          {{ configuracao.subtitulo }}
        </div>
      </div>
    </div>

    <div class="header-marca">
      <span class="header-marca-ponto"></span>
      AVIOESTE
    </div>
  </div>
</template>

<script setup>
import {
  computed
} from 'vue'

import {
  useRoute
} from 'vue-router'

const route = useRoute()

const configuracao =
  computed(() => {
    const nome =
      route.name

    if (
      nome ===
      'produtor-chamados'
    ) {
      return {
        titulo:
          'Meus chamados',
        subtitulo:
          'Acompanhe suas solicitações e o andamento dos atendimentos.'
      }
    }

    if (
      nome ===
      'produtor-novo-chamado'
    ) {
      return {
        titulo:
          'Novo chamado',
        subtitulo:
          'Registre uma nova solicitação de assistência técnica.'
      }
    }

    if (
      nome ===
      'produtor-detalhes-chamado'
    ) {
      return {
        titulo:
          'Detalhes do chamado',
        subtitulo:
          'Consulte todas as informações e atualizações da solicitação.'
      }
    }

    if (
      nome ===
      'produtor-relatorios'
    ) {
      return {
        titulo:
          'Relatórios',
        subtitulo:
          'Consulte informações e histórico dos seus atendimentos.'
      }
    }

    if (
      nome ===
      'produtor-perfil'
    ) {
      return {
        titulo:
          'Meu perfil',
        subtitulo:
          'Consulte e mantenha seus dados atualizados.'
      }
    }

    return {
      titulo:
        'Portal do Produtor',
      subtitulo:
        'Acompanhe seus chamados e atendimentos.'
    }
  })
</script>

<style scoped>
.header-produtor {
  min-height: 68px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  padding: 10px 24px;

  border-bottom: 1px solid #eaecf0;

  background:
    linear-gradient(
      90deg,
      #ffffff 0%,
      #ffffff 72%,
      #fffaf5 100%
    );
}

.header-conteudo {
  display: flex;
  align-items: center;
  gap: 11px;
}

.header-detalhe {
  width: 4px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      #ff9d1f,
      #f97316
    );
}

.header-titulo {
  color: #17233c;

  font-size: 20px;
  font-weight: 900;

  line-height: 1.1;
}

.header-subtitulo {
  margin-top: 3px;

  color: #667085;

  font-size: 10px;
}

.header-marca {
  display: flex;
  align-items: center;

  gap: 7px;

  color: #98a2b3;

  font-size: 8px;
  font-weight: 900;

  letter-spacing: 1.5px;
}

.header-marca-ponto {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #f97316;

  box-shadow:
    0 0 0 4px
    rgba(249, 115, 22, 0.12);
}

.body--dark .header-produtor {
  border-color: #292d33;

  background:
    linear-gradient(
      90deg,
      #16191f 0%,
      #16191f 72%,
      #1f1b18 100%
    );
}

.body--dark .header-titulo {
  color: #f9fafb;
}

.body--dark .header-subtitulo,
.body--dark .header-marca {
  color: #98a2b3;
}
</style>
