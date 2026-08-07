<template>
  <div class="tabela-container">
    <q-table
      title="Meus chamados"
      :rows="chamados"
      :columns="columns"
      row-key="id_chamado"
      flat
      :loading="carregando"
      :pagination="paginacao"
      no-data-label="Nenhum chamado vinculado a você"
      loading-label="Carregando seus chamados..."
    >
      <template #body-cell-numero="props">
        <q-td :props="props">
          #{{ props.row.id_chamado }}
        </q-td>
      </template>

      <template #body-cell-cultura="props">
        <q-td :props="props">
          {{ formatarTexto(props.row.tipo_cultura) }}
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
            :class="classeStatus(props.row.status)"
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
              icon="engineering"
              label="Atender"
              size="sm"
              @click="abrirAtendimento(props.row)"
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import chamadoFuncionarioService from 'src/services/chamadoFuncionarioService'

const router = useRouter()
const authStore = useAuthStore()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  rowsPerPage: 10
})

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

function classeStatus(status) {
  const valor = String(status || '').toUpperCase()

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
    return 'status-rota'
  }

  if (valor === 'EM_ATENDIMENTO') {
    return 'status-atendimento'
  }

  if (
    valor === 'FINALIZADO' ||
    valor === 'CONCLUIDO'
  ) {
    return 'status-finalizado'
  }

  return 'status-pendente'
}

async function verDetalhes(chamado) {
  await router.push({
    name: 'tecnico-detalhes-chamado',
    params: {
      id: chamado.id_chamado
    }
  })
}

async function abrirAtendimento(chamado) {
  await router.push({
    name: 'tecnico-atendimento-detalhes',
    params: {
      id: chamado.id_chamado
    }
  })
}

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

  try {
    const idFuncionario = Number(
      authStore.usuario?.id_usuario
    )

    if (
      !Number.isInteger(idFuncionario) ||
      idFuncionario <= 0
    ) {
      throw new Error(
        'Técnico logado não identificado.'
      )
    }

    const resposta =
      await chamadoFuncionarioService.listarPorFuncionario(
        idFuncionario
      )

    chamados.value = Array.isArray(resposta)
      ? resposta
      : resposta?.chamados ||
        resposta?.data ||
        []
  } catch (error) {
    console.error(
      'Erro ao carregar meus chamados:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar seus chamados.'
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
  flex-wrap: wrap;
  gap: 8px;
}

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado,
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 7px 12px;
}

.status-pendente {
  color: #f97316;
  background: #fff1df;
}

.status-aceito {
  color: #2563eb;
  background: #dbeafe;
}

.status-rota {
  color: #7c3aed;
  background: #ede9fe;
}

.status-atendimento {
  color: #d97706;
  background: #fef3c7;
}

.status-finalizado {
  color: #059669;
  background: #d1fae5;
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

@media (max-width: 900px) {
  .acoes {
    justify-content: flex-start;
  }
}
</style>
