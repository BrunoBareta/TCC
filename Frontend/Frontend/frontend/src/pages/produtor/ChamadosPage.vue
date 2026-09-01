<template>
  <q-page class="chamados-page">
    <!-- ==================================================
         CABEÇALHO DA PÁGINA
         No celular o Layout já mostra "Meus chamados",
         então evitamos repetir um título enorme.
    =================================================== -->

    <div class="pagina-cabecalho">
      <div class="pagina-titulo">
        Meus Chamados
      </div>

      <div class="pagina-subtitulo">
        Consulte todos os chamados da sua propriedade.
      </div>
    </div>

    <!-- FILTROS -->

    <FiltroChamados
      v-model:pesquisa="pesquisa"
      v-model:status="statusSelecionado"
    />

    <!-- LISTAGEM -->

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

  padding:
    28px
    32px
    48px;

  overflow-x: hidden;

  background: #f7f8fa;
}

.pagina-cabecalho {
  margin-bottom: 28px;
}

.pagina-titulo {
  color: #101828;

  font-size: 30px;
  font-weight: 800;

  line-height: 1.2;
}

.pagina-subtitulo {
  margin-top: 5px;

  color: #667085;

  font-size: 14px;
}

.listagem-container {
  margin-top: 28px;

  width: 100%;

  overflow: hidden;
}

/* DARK */

.body--dark .chamados-page {
  background: #0d0f12;
}

.body--dark .pagina-titulo {
  color: #f9fafb;
}

.body--dark .pagina-subtitulo {
  color: #98a2b3;
}

/* ==================================================
   MOBILE
=================================================== */

@media (max-width: 700px) {
  .chamados-page {
    padding:
      16px
      14px
      30px;
  }

  /*
    O header mobile do ProdutorLayout
    já mostra "Meus chamados".
    No conteúdo deixamos apenas uma
    pequena explicação.
  */

  .pagina-cabecalho {
    margin-bottom: 15px;
  }

  .pagina-titulo {
    display: none;
  }

  .pagina-subtitulo {
    margin: 0;

    color: #667085;

    font-size: 13px;

    text-align: center;
  }

  .listagem-container {
    margin-top: 16px;
  }
}
</style>