<template>
  <div class="tabela-container">
    <q-table
      title="Chamados"
      :rows="chamados"
      :columns="columns"
      row-key="id_chamado"
      flat
      :loading="carregando"
      :pagination="paginacao"
      no-data-label="Nenhum chamado encontrado"
      loading-label="Carregando chamados..."
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            rounded
            :class="classeStatus(props.row.status)"
          >
            {{ formatarStatus(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-acoes="props">
        <q-td :props="props">
          <q-btn
            outline
            no-caps
            color="orange"
            label="Ver detalhes"
            size="sm"
            @click="verDetalhes(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-banner
      v-if="erro"
      rounded
      class="bg-red-1 text-negative q-mt-md"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarChamados"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import chamadoService from 'src/services/chamadoService'

const $q = useQuasar()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  rowsPerPage: 10
})

const columns = [
  {
    name: 'id_chamado',
    label: 'Número',
    field: 'id_chamado',
    align: 'left',
    sortable: true,
    format: (valor) => `#${valor}`
  },
  {
    name: 'problema',
    label: 'Problema',
    field: (row) =>
      row.problema ||
      row.titulo ||
      row.motivo ||
      row.descricao ||
      'Não informado',
    align: 'left'
  },
  {
    name: 'data_abertura',
    label: 'Data de abertura',
    field: 'data_abertura',
    align: 'left',
    sortable: true,
    format: formatarData
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left'
  },
  {
    name: 'acoes',
    label: 'Ação',
    field: 'acoes',
    align: 'right'
  }
]

function formatarData(valor) {
  if (!valor) {
    return 'Não informada'
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleDateString('pt-BR')
}

function formatarStatus(status) {
  if (!status) {
    return 'Não informado'
  }

  return String(status)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase())
}

function classeStatus(status) {
  const valor = String(status || '').toUpperCase()

  if (['CONCLUIDO', 'FINALIZADO'].includes(valor)) {
    return 'status-concluido'
  }

  if (['EM_ATENDIMENTO', 'EM ANDAMENTO', 'EM_ROTA'].includes(valor)) {
    return 'status-atendimento'
  }

  if (['CANCELADO'].includes(valor)) {
    return 'status-cancelado'
  }

  return 'status-pendente'
}

function verDetalhes(chamado) {
  $q.notify({
    type: 'info',
    message: `Detalhes do chamado #${chamado.id_chamado}`
  })
}

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await chamadoService.listar()

    chamados.value = Array.isArray(resposta)
      ? resposta
      : resposta.chamados || resposta.data || []
  } catch (error) {
    console.error('Erro ao carregar chamados:', error)

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível buscar os chamados no servidor.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarChamados)
</script>

<style scoped>
.tabela-container {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
}

.status-pendente {
  padding: 7px 12px;
  color: #f97316;
  background: #fff1df;
}

.status-atendimento {
  padding: 7px 12px;
  color: #2563eb;
  background: #dbeafe;
}

.status-concluido {
  padding: 7px 12px;
  color: #059669;
  background: #d1fae5;
}

.status-cancelado {
  padding: 7px 12px;
  color: #dc2626;
  background: #fee2e2;
}
</style>