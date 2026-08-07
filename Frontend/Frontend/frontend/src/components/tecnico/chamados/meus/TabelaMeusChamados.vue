<template>
  <div class="tabela-wrapper">
    <!-- FILTRO ATIVO -->
    <div
      v-if="filtroAtivo"
      class="filtro-ativo"
    >
      <div class="filtro-info">
        <q-icon
          name="filter_alt"
          size="20px"
          color="orange"
        />

        <div>
          <div class="filtro-titulo">
            {{ tituloFiltro }}
          </div>

          <div class="filtro-subtitulo">
            {{ descricaoFiltro }}
          </div>
        </div>
      </div>

      <q-btn
        flat
        no-caps
        color="grey-7"
        icon="close"
        label="Limpar filtro"
        @click="limparFiltro"
      />
    </div>

    <div class="tabela-container">
      <q-table
        :title="tituloTabela"
        :rows="chamadosFiltrados"
        :columns="columns"
        row-key="id_chamado"
        flat
        :loading="carregando"
        :pagination="paginacao"
        no-data-label="Nenhum chamado encontrado"
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
                v-if="!chamadoFinalizado(props.row)"
                unelevated
                no-caps
                color="orange"
                icon="engineering"
                label="Atender"
                size="sm"
                @click="abrirAtendimento(props.row)"
              />

              <q-btn
                v-else
                outline
                no-caps
                color="positive"
                icon="visibility"
                label="Visualizar"
                size="sm"
                @click="abrirAtendimento(props.row)"
              />
            </div>
          </q-td>
        </template>

        <template #no-data>
          <div class="estado-vazio">
            <q-icon
              :name="
                filtroAtivo
                  ? 'filter_alt_off'
                  : 'assignment'
              "
              size="42px"
              color="grey-5"
            />

            <div class="estado-vazio-titulo">
              {{
                filtroAtivo
                  ? 'Nenhum chamado neste filtro'
                  : 'Nenhum chamado vinculado a você'
              }}
            </div>

            <div class="estado-vazio-texto">
              {{
                filtroAtivo
                  ? 'Não existem chamados que correspondam ao filtro selecionado.'
                  : 'Seus atendimentos aparecerão aqui.'
              }}
            </div>
          </div>
        </template>
      </q-table>
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

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  useAuthStore
} from 'src/stores/auth'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  rowsPerPage: 10
})

const filtro = computed(() =>
  String(
    route.query.filtro || ''
  ).toLowerCase()
)

const filtroAtivo = computed(() =>
  ['andamento', 'finalizados'].includes(
    filtro.value
  )
)

const tituloFiltro = computed(() => {
  if (filtro.value === 'andamento') {
    return 'Em andamento'
  }

  if (filtro.value === 'finalizados') {
    return 'Finalizados'
  }

  return ''
})

const descricaoFiltro = computed(() => {
  if (filtro.value === 'andamento') {
    return 'Chamados aceitos, em deslocamento ou em atendimento.'
  }

  if (filtro.value === 'finalizados') {
    return 'Atendimentos que já foram concluídos.'
  }

  return ''
})

const tituloTabela = computed(() => {
  if (filtro.value === 'andamento') {
    return 'Chamados em andamento'
  }

  if (filtro.value === 'finalizados') {
    return 'Chamados finalizados'
  }

  return 'Meus chamados'
})

const chamadosFiltrados = computed(() => {
  if (filtro.value === 'andamento') {
    return chamados.value.filter((item) =>
      [
        'ACEITO',
        'EM_ROTA',
        'EM_ATENDIMENTO'
      ].includes(
        String(
          item.status || ''
        ).toUpperCase()
      )
    )
  }

  if (filtro.value === 'finalizados') {
    return chamados.value.filter((item) =>
      [
        'FINALIZADO',
        'CONCLUIDO'
      ].includes(
        String(
          item.status || ''
        ).toUpperCase()
      )
    )
  }

  return chamados.value
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

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return valor
  }

  return data.toLocaleDateString(
    'pt-BR'
  )
}

function formatarTexto(valor) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /^\w/,
      (letra) =>
        letra.toUpperCase()
    )
}

function classeUrgencia(urgencia) {
  const valor =
    String(
      urgencia || ''
    ).toUpperCase()

  if (valor === 'ALTA') {
    return 'urgencia-alta'
  }

  if (valor === 'MEDIA') {
    return 'urgencia-media'
  }

  return 'urgencia-baixa'
}

function classeStatus(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
    return 'status-rota'
  }

  if (
    valor ===
    'EM_ATENDIMENTO'
  ) {
    return 'status-atendimento'
  }

  if (
    [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(valor)
  ) {
    return 'status-finalizado'
  }

  return 'status-pendente'
}

function chamadoFinalizado(chamado) {
  return [
    'FINALIZADO',
    'CONCLUIDO'
  ].includes(
    String(
      chamado.status || ''
    ).toUpperCase()
  )
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
    name:
      'tecnico-atendimento-detalhes',

    params: {
      id: chamado.id_chamado
    }
  })
}

async function limparFiltro() {
  await router.replace({
    name: 'tecnico-meus-chamados'
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
      await chamadoFuncionarioService
        .listarPorFuncionario(
          idFuncionario
        )

    chamados.value =
      Array.isArray(resposta)
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

watch(
  () => route.query.filtro,
  () => {
    paginacao.value.page = 1
  }
)

onMounted(
  carregarChamados
)
</script>

<style scoped>
.tabela-wrapper {
  width: 100%;
}

.filtro-ativo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px;
  padding: 14px 18px;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  background: #fff7ed;
}

.filtro-info {
  display: flex;
  align-items: center;
  gap: 11px;
}

.filtro-titulo {
  color: #9a3412;
  font-size: 13px;
  font-weight: 800;
}

.filtro-subtitulo {
  margin-top: 2px;
  color: #c2410c;
  font-size: 11px;
}

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

.estado-vazio {
  width: 100%;
  padding: 35px 15px;
  text-align: center;
}

.estado-vazio-titulo {
  margin-top: 10px;
  color: #475467;
  font-size: 14px;
  font-weight: 700;
}

.estado-vazio-texto {
  margin-top: 5px;
  color: #98a2b3;
  font-size: 11px;
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

/* DARK */

.body--dark .tabela-container {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .filtro-ativo {
  border-color: #7c2d12;
  background: #24160f;
}

.body--dark .filtro-titulo {
  color: #fdba74;
}

.body--dark .filtro-subtitulo {
  color: #fb923c;
}

.body--dark .estado-vazio-titulo {
  color: #d0d5dd;
}

@media (max-width: 900px) {
  .acoes {
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  .filtro-ativo {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>