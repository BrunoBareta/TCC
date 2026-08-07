<template>
  <q-page class="chamados-page">
    <div class="pagina-cabecalho">
      <div class="pagina-titulo">
        Meus Chamados
      </div>

      <div class="pagina-subtitulo">
        Consulte todos os chamados da sua propriedade.
      </div>
    </div>

    <FiltroChamados
      v-model:pesquisa="pesquisa"
      v-model:status="statusSelecionado"
    />

    <div class="q-mt-xl">
      <TabelaChamados
        :pesquisa="pesquisa"
        :status="statusSelecionado"
      />
    </div>
  </q-page>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch
} from 'vue'

import { useRoute } from 'vue-router'

import FiltroChamados from 'src/components/produtor/chamados/FiltroChamados.vue'
import TabelaChamados from 'src/components/produtor/chamados/TabelaChamados.vue'

const route = useRoute()

const pesquisa = ref('')
const statusSelecionado = ref(null)

function aplicarFiltroDaUrl() {
  const status = String(
    route.query.status || ''
  ).toUpperCase()

  const statusPermitidos = [
    'PENDENTE',
    'ACEITO',
    'EM_ROTA',
    'EM_ATENDIMENTO',
    'EM_ANDAMENTO',
    'FINALIZADO',
    'CANCELADO'
  ]

  if (
    status &&
    statusPermitidos.includes(status)
  ) {
    statusSelecionado.value = status
  } else {
    statusSelecionado.value = null
  }
}

watch(
  () => route.query.status,
  () => {
    aplicarFiltroDaUrl()
  }
)

onMounted(() => {
  aplicarFiltroDaUrl()
})
</script>

<style scoped>
.chamados-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  margin-bottom: 28px;
}

.pagina-titulo {
  color: #101828;
  font-size: 30px;
  font-weight: 800;
}

.pagina-subtitulo {
  margin-top: 5px;
  color: #667085;
  font-size: 14px;
}

@media (max-width: 700px) {
  .chamados-page {
    padding: 22px 16px 40px;
  }

  .pagina-titulo {
    font-size: 25px;
  }
}
</style>