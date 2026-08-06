<template>
  <div class="tabela-container">
    <q-table
      title="Chamados pendentes"
      :rows="chamadosPendentes"
      :columns="columns"
      row-key="id_chamado"
      flat
      :loading="carregando"
      :pagination="paginacao"
      no-data-label="Nenhum chamado pendente"
      loading-label="Carregando chamados..."
    >
      <template #body-cell-numero="props">
        <q-td :props="props">
          #{{ props.row.id_chamado }}
        </q-td>
      </template>

      <template #body-cell-urgencia="props">
        <q-td :props="props">
          <q-badge
            rounded
            :class="classeUrgencia(props.row.urgencia)"
          >
            {{ formatarTexto(props.row.urgencia) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            rounded
            class="status-pendente"
          >
            {{ formatarTexto(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-acoes="props">
        <q-td :props="props">
          <div class="acoes">
            <q-btn
              outline
              no-caps
              color="grey-8"
              label="Detalhes"
              size="sm"
              @click="verDetalhes(props.row)"
            />

            <q-btn
              unelevated
              no-caps
              color="orange"
              label="Aceitar"
              size="sm"
              @click="aceitarChamado(props.row)"
            />
          </div>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import chamadoService from 'src/services/chamadoService'

const router = useRouter()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  rowsPerPage: 10
})

const chamadosPendentes = computed(() =>
  chamados.value.filter(
    (chamado) =>
      String(chamado.status || '').toUpperCase() === 'PENDENTE'
  )
)

const columns = [
  {
    name: 'numero',
    label: 'Número',
    field: 'id_chamado',
    align: 'left',
    sortable: true
  },
  {
    name: 'problema',
    label: 'Problema',
    field: 'problema',
    align: 'left',
    sortable: true
  },
  {
    name: 'cultura',
    label: 'Cultura',
    field: 'tipo_cultura',
    align: 'left'
  },
  {
    name: 'urgencia',
    label: 'Urgência',
    field: 'urgencia',
    align: 'left'
  },
  {
    name: 'data',
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

function formatarTexto(valor) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase())
}

function classeUrgencia(urgencia) {
  const valor = String(urgencia || '').toUpperCase()

  if (valor === 'ALTA') {
    return 'urgencia-alta'
  }

  if (valor === 'MEDIA') {
    return 'urgencia-media'
  }

  return 'urgencia-baixa'
}

function verDetalhes(chamado) {
  router.push({
    name: 'tecnico-detalhes-chamado',
    params: {
      id: chamado.id_chamado
    }
  })
}

function aceitarChamado(chamado) {
  console.log('Chamado selecionado:', chamado)
}

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await chamadoService.listar()

    chamados.value = Array.isArray(resposta)
      ? resposta
      : resposta?.chamados || resposta?.data || []
  } catch (error) {
    console.error('Erro ao carregar chamados pendentes:', error)

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar os chamados pendentes.'
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

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.status-pendente,
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 7px 12px;
}

.status-pendente {
  color: #f97316;
  background: #fff1df;
}

.urgencia-baixa {
  color: #2563eb;
  background: #dbeafe;
}

.urgencia-media {
  color: #d97706;
  background: #fef3c7;
}

.urgencia-alta {
  color: #dc2626;
  background: #fee2e2;
}
</style>