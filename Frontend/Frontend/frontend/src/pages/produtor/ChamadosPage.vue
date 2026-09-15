<template>
  <q-page class="chamados-page">
    <!--
      O título e o subtítulo já são exibidos pelo Header do
      ProdutorLayout. Aqui deixamos apenas filtros e listagem.
    -->

    <FiltroChamados
      v-model:pesquisa="pesquisa"
      v-model:status="statusSelecionado"
    />

    <div class="listagem-container">
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

import {
  useRoute
} from 'vue-router'

import FiltroChamados from
  'src/components/produtor/chamados/FiltroChamados.vue'

import TabelaChamados from
  'src/components/produtor/chamados/TabelaChamados.vue'

const route = useRoute()

const pesquisa = ref('')
const statusSelecionado = ref(null)

/* ==================================================
   FILTRO RECEBIDO PELA URL
=================================================== */

function aplicarFiltroDaUrl() {
  const status =
    String(
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
    statusPermitidos.includes(
      status
    )
  ) {
    statusSelecionado.value =
      status
  } else {
    statusSelecionado.value =
      null
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
  padding: 14px 20px 28px;
  overflow-x: hidden;
  background: #f5f6f8;
}

.listagem-container {
  width: 100%;
  margin-top: 12px;
  overflow: hidden;
}

/* DARK */

.body--dark .chamados-page {
  background: #0d0f12;
}

/* TABLET */

@media (max-width: 1023px) {
  .chamados-page {
    padding: 14px 14px 30px;
  }
}

/* MOBILE */

@media (max-width: 700px) {
  .chamados-page {
    padding: 12px 12px 28px;
  }

  .listagem-container {
    margin-top: 10px;
  }
}
</style>
