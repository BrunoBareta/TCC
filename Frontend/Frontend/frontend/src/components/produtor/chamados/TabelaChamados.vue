<template>
  <div class="tabela-container">
    <q-table
      v-model:pagination="paginacao"
      title="Chamados"
      :rows="chamadosFiltrados"
      :columns="columns"
      row-key="id_chamado"
      flat
      :loading="carregando"
      no-data-label="Nenhum chamado encontrado"
      loading-label="Carregando chamados..."
    >
      <template #body-cell-id_chamado="props">
        <q-td :props="props">
          #{{ props.row.id_chamado }}
        </q-td>
      </template>

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

      <template #no-data>
        <div class="estado-vazio">
          <q-icon
            :name="possuiFiltro ? 'search_off' : 'inbox'"
            size="42px"
            color="grey-5"
          />

          <div class="estado-vazio-titulo">
            {{
              possuiFiltro
                ? 'Nenhum chamado corresponde aos filtros'
                : 'Nenhum chamado encontrado'
            }}
          </div>

          <div class="estado-vazio-texto">
            {{
              possuiFiltro
                ? 'Tente alterar a pesquisa ou o status selecionado.'
                : 'Seus chamados aparecerão aqui.'
            }}
          </div>
        </div>
      </template>
    </q-table>

    <div
      v-if="!carregando && possuiFiltro"
      class="resultado-filtro"
    >
      <q-icon
        name="filter_alt"
        size="18px"
      />

      <span>
        {{ textoResultado }}
      </span>
    </div>

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
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import { useRouter } from 'vue-router'

import chamadoService from 'src/services/chamadoService'

const props = defineProps({
  pesquisa: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    default: null
  }
})

const router = useRouter()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  page: 1,
  rowsPerPage: 10
})

const columns = [
  {
    name: 'id_chamado',
    label: 'Número',
    field: 'id_chamado',
    align: 'left',
    sortable: true
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
    align: 'left',
    sortable: true
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
    align: 'left',
    sortable: true
  },
  {
    name: 'acoes',
    label: 'Ação',
    field: 'acoes',
    align: 'right'
  }
]

const possuiFiltro = computed(() => {
  return Boolean(
    String(props.pesquisa || '').trim() ||
    props.status
  )
})

const chamadosFiltrados = computed(() => {
  const pesquisaNormalizada =
    normalizarTexto(props.pesquisa)

  const statusSelecionado =
    String(props.status || '').toUpperCase()

  return chamados.value.filter((chamado) => {
    const statusChamado =
      String(chamado.status || '').toUpperCase()

    let correspondeStatus = true

    if (statusSelecionado === 'EM_ANDAMENTO') {
      correspondeStatus = [
        'ACEITO',
        'EM_ROTA',
        'EM_ATENDIMENTO',
        'AGUARDANDO_CONFIRMACAO'
      ].includes(statusChamado)
    } else if (statusSelecionado) {
      correspondeStatus =
        statusChamado === statusSelecionado
    }

    if (!correspondeStatus) {
      return false
    }

    if (!pesquisaNormalizada) {
      return true
    }

    const id =
      String(chamado.id_chamado || '')

    const numeroComHash =
      `#${id}`

    const problema =
      normalizarTexto(chamado.problema)

    const descricao =
      normalizarTexto(chamado.descricao)

    const cultura =
      normalizarTexto(chamado.tipo_cultura)

    const tipoChamado =
      normalizarTexto(chamado.tipo_chamado)

    const urgencia =
      normalizarTexto(chamado.urgencia)

    return (
      id.includes(pesquisaNormalizada) ||
      numeroComHash.includes(pesquisaNormalizada) ||
      problema.includes(pesquisaNormalizada) ||
      descricao.includes(pesquisaNormalizada) ||
      cultura.includes(pesquisaNormalizada) ||
      tipoChamado.includes(pesquisaNormalizada) ||
      urgencia.includes(pesquisaNormalizada)
    )
  })
})

const textoResultado = computed(() => {
  const total =
    chamadosFiltrados.value.length

  if (total === 0) {
    return 'Nenhum chamado encontrado com estes filtros.'
  }

  if (total === 1) {
    return '1 chamado encontrado.'
  }

  return `${total} chamados encontrados.`
})

function normalizarTexto(valor) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return ''
  }

  return String(valor)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function formatarData(valor) {
  if (!valor) {
    return 'Não informada'
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleDateString(
    'pt-BR'
  )
}

function formatarStatus(status) {
  if (!status) {
    return 'Não informado'
  }

  const valor =
    String(status).toUpperCase()

  const nomes = {
    PENDENTE: 'Pendente',
    AGUARDANDO_CONFIRMACAO:
      'Aguardando confirmação',
    ACEITO: 'Aceito',
    EM_ROTA: 'Em rota',
    EM_ATENDIMENTO:
      'Em atendimento',
    CONCLUIDO: 'Concluído',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado'
  }

  return (
    nomes[valor] ||
    String(status)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /^\w/,
        (letra) => letra.toUpperCase()
      )
  )
}

function classeStatus(status) {
  const valor =
    String(status || '').toUpperCase()

  if (valor === 'PENDENTE') {
    return 'status-pendente'
  }

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
    return 'status-rota'
  }

  if (
    valor === 'EM_ATENDIMENTO' ||
    valor === 'AGUARDANDO_CONFIRMACAO'
  ) {
    return 'status-atendimento'
  }

  if (
    ['CONCLUIDO', 'FINALIZADO']
      .includes(valor)
  ) {
    return 'status-concluido'
  }

  if (valor === 'CANCELADO') {
    return 'status-cancelado'
  }

  return 'status-padrao'
}

async function verDetalhes(chamado) {
  await router.push({
    name: 'produtor-detalhes-chamado',
    params: {
      id: chamado.id_chamado
    }
  })
}

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta =
      await chamadoService.listar()

    chamados.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.chamados ||
          resposta?.data ||
          []
  } catch (error) {
    console.error(
      'Erro ao carregar chamados:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível buscar os chamados no servidor.'
  } finally {
    carregando.value = false
  }
}

watch(
  () => [
    props.pesquisa,
    props.status
  ],
  () => {
    paginacao.value.page = 1
  }
)

onMounted(carregarChamados)
</script>

<style scoped>
.tabela-container {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
}

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-concluido,
.status-cancelado,
.status-padrao {
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

.status-concluido {
  color: #059669;
  background: #d1fae5;
}

.status-cancelado {
  color: #dc2626;
  background: #fee2e2;
}

.status-padrao {
  color: #475467;
  background: #f2f4f7;
}

.resultado-filtro {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 18px;
  border-top: 1px solid #eaecf0;
  color: #667085;
  background: #f9fafb;
  font-size: 13px;
}

.estado-vazio {
  width: 100%;
  padding: 42px 20px;
  text-align: center;
}

.estado-vazio-titulo {
  margin-top: 12px;
  color: #475467;
  font-size: 15px;
  font-weight: 700;
}

.estado-vazio-texto {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 13px;
}
</style>