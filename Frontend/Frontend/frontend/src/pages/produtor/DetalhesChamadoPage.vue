<template>
  <q-page class="detalhes-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Detalhes do chamado
        </div>

        <div class="pagina-subtitulo">
          Acompanhe as informações e o andamento da solicitação.
        </div>
      </div>

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Voltar"
        color="grey-7"
        :to="{ name: 'produtor-chamados' }"
      />
    </div>

    <div v-if="carregando" class="text-center q-pa-xl">
      <q-spinner color="orange" size="48px" />

      <div class="text-grey-7 q-mt-md">
        Carregando chamado...
      </div>
    </div>

    <q-banner
      v-else-if="erro"
      rounded
      class="bg-red-1 text-negative"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarChamado"
        />
      </template>
    </q-banner>

    <div v-else-if="chamado" class="detalhes-grid">
      <div>
        <ResumoChamado :chamado="chamado" />

        <div class="q-mt-lg">
          <InformacoesChamado :chamado="chamado" />
        </div>
      </div>

      <HistoricoChamado :chamado="chamado" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import chamadoService from 'src/services/chamadoService'
import ResumoChamado from 'src/components/produtor/chamados/detalhes/ResumoChamado.vue'
import InformacoesChamado from 'src/components/produtor/chamados/detalhes/InformacoesChamado.vue'
import HistoricoChamado from 'src/components/produtor/chamados/detalhes/HistoricoChamado.vue'

const route = useRoute()

const chamado = ref(null)
const carregando = ref(false)
const erro = ref('')

async function carregarChamado() {
  carregando.value = true
  erro.value = ''

  try {
    chamado.value = await chamadoService.buscarPorId(route.params.id)
  } catch (error) {
    console.error('Erro ao buscar chamado:', error)

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar os detalhes do chamado.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarChamado)
</script>

<style scoped>
.detalhes-page {
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
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

.detalhes-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: 24px;
}

@media (max-width: 1000px) {
  .detalhes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .detalhes-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>