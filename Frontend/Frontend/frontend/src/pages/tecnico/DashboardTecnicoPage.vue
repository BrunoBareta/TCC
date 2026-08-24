<template>
  <q-page
    class="dashboard-page"
    :class="{ 'dashboard-page--dark': $q.dark.isActive }"
  >
    <div class="dashboard-header">
      <div>
        <div class="saudacao">Olá, {{ primeiroNome }} 👋</div>
        <div class="descricao">
          Veja seus atendimentos, chamados disponíveis e evolução recente.
        </div>
      </div>

      <div class="header-actions">
        <div class="data-card">
          <q-icon name="calendar_month" size="19px" />
          <div>
            <span>Hoje</span>
            <strong>{{ dataAtual }}</strong>
          </div>
        </div>

        <q-btn
          flat
          round
          icon="refresh"
          :loading="carregando"
          @click="carregarDashboard"
        >
          <q-tooltip>Atualizar dashboard</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-banner
      v-if="erro"
      rounded
      class="bg-red-1 text-negative q-mb-lg"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarDashboard"
        />
      </template>
    </q-banner>

    <div
      v-if="carregando && !carregadoUmaVez"
      class="carregamento-inicial"
    >
      <q-spinner color="orange" size="46px" />
      <span>Carregando seus atendimentos...</span>
    </div>

    <template v-else>
      <div class="indicadores-grid">
        <button
          type="button"
          class="indicador-card indicador-card--clicavel"
          @click="irPendentes"
        >
          <div class="indicador-topo">
            <div class="indicador-icone indicador-icone--laranja">
              <q-icon name="pending_actions" size="25px" />
            </div>
            <div class="indicador-tag">Disponíveis</div>
          </div>
          <div class="indicador-numero">{{ totalPendentes }}</div>
          <div class="indicador-label">Chamados pendentes</div>
          <div class="indicador-rodape">
            Solicitações disponíveis para aceite
          </div>
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--clicavel"
          @click="irEmAndamento"
        >
          <div class="indicador-topo">
            <div class="indicador-icone indicador-icone--azul">
              <q-icon name="engineering" size="25px" />
            </div>
            <div class="indicador-tag">Ativos</div>
          </div>
          <div class="indicador-numero">{{ totalEmAndamento }}</div>
          <div class="indicador-label">Em andamento</div>
          <div class="indicador-rodape">
            Aceitos, em rota ou em atendimento
          </div>
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--clicavel"
          @click="irFinalizados"
        >
          <div class="indicador-topo">
            <div class="indicador-icone indicador-icone--verde">
              <q-icon name="task_alt" size="25px" />
            </div>
            <div class="indicador-tag">Concluídos</div>
          </div>
          <div class="indicador-numero">{{ totalFinalizados }}</div>
          <div class="indicador-label">Finalizados</div>
          <div class="indicador-rodape">
            Atendimentos concluídos por você
          </div>
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--clicavel"
          @click="irMeusChamados"
        >
          <div class="indicador-topo">
            <div class="indicador-icone indicador-icone--roxo">
              <q-icon name="assignment_ind" size="25px" />
            </div>
            <div class="indicador-tag">Histórico</div>
          </div>
          <div class="indicador-numero">{{ totalMeusChamados }}</div>
          <div class="indicador-label">Meus chamados</div>
          <div class="indicador-rodape">
            Total vinculado ao seu usuário
          </div>
        </button>
      </div>

      <div class="dashboard-grid-principal">
        <div class="dashboard-card atendimento-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Atendimento atual</div>
              <div class="card-subtitulo">
                Continue rapidamente de onde parou.
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="engineering" size="21px" />
            </div>
          </div>

          <div
            v-if="chamadoAtual"
            class="atendimento-atual"
          >
            <div class="atendimento-topo">
              <div>
                <div class="chamado-numero">
                  CHAMADO #{{ chamadoAtual.id_chamado }}
                </div>
                <div class="chamado-problema">
                  {{ chamadoAtual.problema || 'Solicitação de atendimento' }}
                </div>
              </div>

              <q-badge
                rounded
                :class="classeStatus(chamadoAtual.status)"
              >
                {{ formatarTexto(chamadoAtual.status) }}
              </q-badge>
            </div>

            <div class="atendimento-info-grid">
              <div class="info-item">
                <div class="info-icone">
                  <q-icon name="agriculture" size="18px" />
                </div>
                <div>
                  <span>Propriedade</span>
                  <strong>
                    {{ chamadoAtual.nome_propriedade || 'Não informada' }}
                  </strong>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icone">
                  <q-icon name="location_on" size="18px" />
                </div>
                <div>
                  <span>Localização</span>
                  <strong>{{ localChamado(chamadoAtual) }}</strong>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icone">
                  <q-icon name="priority_high" size="18px" />
                </div>
                <div>
                  <span>Urgência</span>
                  <strong>{{ formatarTexto(chamadoAtual.urgencia) }}</strong>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icone">
                  <q-icon name="event" size="18px" />
                </div>
                <div>
                  <span>Abertura</span>
                  <strong>{{ formatarData(chamadoAtual.data_abertura) }}</strong>
                </div>
              </div>
            </div>

            <div class="progresso-atendimento">
              <div
                v-for="(etapa, index) in etapasAtendimento"
                :key="etapa.status"
                class="progresso-etapa"
              >
                <div class="progresso-linha-area">
                  <div
                    class="progresso-circulo"
                    :class="{
                      'progresso-circulo--concluido':
                        indiceEtapaChamadoAtual >= index,
                      'progresso-circulo--atual':
                        indiceEtapaChamadoAtual === index
                    }"
                  >
                    <q-icon
                      :name="
                        indiceEtapaChamadoAtual > index
                          ? 'check'
                          : etapa.icone
                      "
                      size="15px"
                    />
                  </div>

                  <div
                    v-if="index < etapasAtendimento.length - 1"
                    class="progresso-linha"
                    :class="{
                      'progresso-linha--concluida':
                        indiceEtapaChamadoAtual > index
                    }"
                  ></div>
                </div>

                <div
                  class="progresso-label"
                  :class="{
                    'progresso-label--ativo':
                      indiceEtapaChamadoAtual >= index
                  }"
                >
                  {{ etapa.label }}
                </div>
              </div>
            </div>

            <div class="atendimento-acoes">
              <q-btn
                unelevated
                no-caps
                color="orange"
                icon="play_arrow"
                label="Continuar atendimento"
                @click="continuarAtendimento"
              />
            </div>
          </div>

          <div
            v-else
            class="estado-vazio atendimento-vazio"
          >
            <div class="estado-vazio-icone">
              <q-icon name="check_circle" size="33px" />
            </div>
            <strong>Nenhum atendimento em andamento</strong>
            <span>
              Quando você aceitar um chamado, ele aparecerá aqui.
            </span>
            <q-btn
              outline
              no-caps
              color="orange"
              icon="pending_actions"
              label="Ver chamados pendentes"
              class="q-mt-md"
              @click="irPendentes"
            />
          </div>
        </div>

        <div class="dashboard-card status-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Meus atendimentos</div>
              <div class="card-subtitulo">
                Distribuição por situação.
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="donut_large" size="21px" />
            </div>
          </div>

          <div class="doughnut-area">
            <div class="doughnut-wrapper">
              <Doughnut
                :data="dadosGraficoStatus"
                :options="opcoesGraficoStatus"
              />
              <div class="doughnut-centro">
                <strong>{{ totalMeusChamados }}</strong>
                <span>chamados</span>
              </div>
            </div>

            <div class="legenda-status">
              <div class="legenda-item">
                <span class="ponto ponto--aceito"></span>
                <div>
                  <strong>{{ totalAceitos }}</strong>
                  <span>Aceitos</span>
                </div>
              </div>

              <div class="legenda-item">
                <span class="ponto ponto--rota"></span>
                <div>
                  <strong>{{ totalEmRota }}</strong>
                  <span>Em rota</span>
                </div>
              </div>

              <div class="legenda-item">
                <span class="ponto ponto--atendimento"></span>
                <div>
                  <strong>{{ totalAtendimento }}</strong>
                  <span>Em atendimento</span>
                </div>
              </div>

              <div class="legenda-item">
                <span class="ponto ponto--finalizado"></span>
                <div>
                  <strong>{{ totalFinalizados }}</strong>
                  <span>Finalizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-secundario">
        <div class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Atendimentos finalizados</div>
              <div class="card-subtitulo">
                Evolução dos últimos 6 meses.
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="show_chart" size="21px" />
            </div>
          </div>

          <div class="grafico-linha">
            <Line
              :data="dadosGraficoMensal"
              :options="opcoesGraficoMensal"
            />
          </div>
        </div>

        <div class="dashboard-card resumo-rapido-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Situação atual</div>
              <div class="card-subtitulo">
                Sua fila de trabalho agora.
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="query_stats" size="21px" />
            </div>
          </div>

          <div class="resumo-lista">
            <button
              type="button"
              class="resumo-item"
              @click="irEmAndamento"
            >
              <div class="resumo-esquerda">
                <span class="ponto ponto--aceito"></span>
                <span>Aceitos</span>
              </div>
              <strong>{{ totalAceitos }}</strong>
            </button>

            <button
              type="button"
              class="resumo-item"
              @click="irEmAndamento"
            >
              <div class="resumo-esquerda">
                <span class="ponto ponto--rota"></span>
                <span>Em deslocamento</span>
              </div>
              <strong>{{ totalEmRota }}</strong>
            </button>

            <button
              type="button"
              class="resumo-item"
              @click="irEmAndamento"
            >
              <div class="resumo-esquerda">
                <span class="ponto ponto--atendimento"></span>
                <span>Em atendimento</span>
              </div>
              <strong>{{ totalAtendimento }}</strong>
            </button>

            <button
              type="button"
              class="resumo-item"
              @click="irFinalizados"
            >
              <div class="resumo-esquerda">
                <span class="ponto ponto--finalizado"></span>
                <span>Finalizados</span>
              </div>
              <strong>{{ totalFinalizados }}</strong>
            </button>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-listas">
        <div class="dashboard-card lista-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Chamados aguardando atendimento
              </div>
              <div class="card-subtitulo">
                Prioridades disponíveis para aceite.
              </div>
            </div>

            <q-btn
              flat
              no-caps
              color="orange"
              label="Ver todos"
              icon-right="arrow_forward"
              @click="irPendentes"
            />
          </div>

          <div
            v-if="pendentesDestaque.length === 0"
            class="estado-vazio estado-vazio--pequeno"
          >
            <q-icon name="inbox" size="34px" color="grey-5" />
            <strong>Nenhum chamado pendente</strong>
            <span>
              Não há novas solicitações aguardando aceite.
            </span>
          </div>

          <div
            v-else
            class="lista-chamados"
          >
            <div
              v-for="item in pendentesDestaque"
              :key="item.id_chamado"
              class="chamado-item"
            >
              <div class="chamado-id">
                #{{ item.id_chamado }}
              </div>

              <div class="chamado-conteudo">
                <strong>
                  {{ item.problema || 'Solicitação de atendimento' }}
                </strong>
                <span>
                  {{ item.nome_propriedade || 'Propriedade não informada' }}
                  • {{ formatarData(item.data_abertura) }}
                </span>
              </div>

              <q-badge
                rounded
                :class="classeUrgencia(item.urgencia)"
              >
                {{ formatarTexto(item.urgencia) }}
              </q-badge>

              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="orange"
                @click="abrirChamado(item)"
              >
                <q-tooltip>Ver chamado</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <div class="dashboard-card lista-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Últimos atendimentos</div>
              <div class="card-subtitulo">
                Chamados concluídos recentemente.
              </div>
            </div>

            <q-btn
              flat
              no-caps
              color="orange"
              label="Histórico"
              icon-right="arrow_forward"
              @click="irFinalizados"
            />
          </div>

          <div
            v-if="ultimosFinalizados.length === 0"
            class="estado-vazio estado-vazio--pequeno"
          >
            <q-icon name="history" size="34px" color="grey-5" />
            <strong>Nenhum atendimento finalizado</strong>
          </div>

          <div
            v-else
            class="lista-finalizados"
          >
            <button
              v-for="item in ultimosFinalizados"
              :key="item.id_chamado"
              type="button"
              class="finalizado-item"
              @click="abrirChamado(item)"
            >
              <div class="finalizado-icone">
                <q-icon name="check" size="17px" />
              </div>

              <div class="finalizado-conteudo">
                <strong>
                  {{ item.problema || 'Atendimento concluído' }}
                </strong>
                <span>
                  {{ item.nome_propriedade || 'Propriedade não informada' }}
                </span>
              </div>

              <div class="finalizado-data">
                {{
                  formatarData(
                    item.data_fechamento ||
                    item.data_finalizacao ||
                    item.data_abertura
                  )
                }}
              </div>

              <q-icon
                name="chevron_right"
                color="grey-5"
              />
            </button>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  Doughnut,
  Line
} from 'vue-chartjs'

import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js'

import {
  useAuthStore
} from 'src/stores/auth'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(false)
const carregadoUmaVez = ref(false)
const erro = ref('')

const chamadosGerais = ref([])
const meusChamados = ref([])

const etapasAtendimento = [
  {
    status: 'ACEITO',
    label: 'Aceito',
    icone: 'thumb_up'
  },
  {
    status: 'EM_ROTA',
    label: 'Em rota',
    icone: 'local_shipping'
  },
  {
    status: 'EM_ATENDIMENTO',
    label: 'Atendimento',
    icone: 'engineering'
  },
  {
    status: 'FINALIZADO',
    label: 'Finalizado',
    icone: 'check_circle'
  }
]

const cores = {
  azul: '#3b82f6',
  roxo: '#8b5cf6',
  amarelo: '#f59e0b',
  verde: '#22c55e',
  laranja: '#f97316',
  laranjaClaro: 'rgba(249, 115, 22, 0.16)'
}

const idFuncionario = computed(() =>
  Number(
    authStore.usuario?.id_usuario
  )
)

const primeiroNome = computed(() => {
  const nome = String(
    authStore.usuario?.nome ||
    'Técnico'
  ).trim()

  return (
    nome.split(/\s+/)[0] ||
    'Técnico'
  )
})

const dataAtual = computed(() => {
  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    }
  ).format(
    new Date()
  )
})

const chamadosPendentes = computed(() =>
  chamadosGerais.value.filter(
    item =>
      normalizarStatus(
        item.status
      ) === 'PENDENTE'
  )
)

const meusChamadosNormalizados = computed(() =>
  Array.isArray(
    meusChamados.value
  )
    ? meusChamados.value
    : []
)

const totalPendentes = computed(
  () =>
    chamadosPendentes.value.length
)

const totalMeusChamados = computed(
  () =>
    meusChamadosNormalizados.value.length
)

const totalAceitos = computed(() =>
  contarStatus([
    'ACEITO'
  ])
)

const totalEmRota = computed(() =>
  contarStatus([
    'EM_ROTA'
  ])
)

const totalAtendimento = computed(() =>
  contarStatus([
    'EM_ATENDIMENTO'
  ])
)

const totalFinalizados = computed(() =>
  contarStatus([
    'FINALIZADO',
    'CONCLUIDO'
  ])
)

const totalEmAndamento = computed(
  () =>
    totalAceitos.value +
    totalEmRota.value +
    totalAtendimento.value
)

const chamadoAtual = computed(() => {
  const prioridade = [
    'EM_ATENDIMENTO',
    'EM_ROTA',
    'ACEITO'
  ]

  for (
    const status of prioridade
  ) {
    const encontrado =
      meusChamadosNormalizados.value.find(
        item =>
          normalizarStatus(
            item.status
          ) === status
      )

    if (encontrado) {
      return encontrado
    }
  }

  return null
})

const indiceEtapaChamadoAtual =
  computed(() => {
    if (!chamadoAtual.value) {
      return -1
    }

    const status =
      normalizarStatus(
        chamadoAtual.value.status
      )

    if (
      [
        'FINALIZADO',
        'CONCLUIDO'
      ].includes(status)
    ) {
      return 3
    }

    return etapasAtendimento.findIndex(
      etapa =>
        etapa.status === status
    )
  })

const pendentesDestaque = computed(() =>
  [
    ...chamadosPendentes.value
  ]
    .sort(
      (a, b) => {
        const prioridadeA =
          prioridadeUrgencia(
            a.urgencia
          )

        const prioridadeB =
          prioridadeUrgencia(
            b.urgencia
          )

        if (
          prioridadeA !==
          prioridadeB
        ) {
          return (
            prioridadeB -
            prioridadeA
          )
        }

        return (
          new Date(
            b.data_abertura ||
            0
          ).getTime() -
          new Date(
            a.data_abertura ||
            0
          ).getTime()
        )
      }
    )
    .slice(
      0,
      4
    )
)

const ultimosFinalizados = computed(() =>
  meusChamadosNormalizados.value
    .filter(
      item =>
        [
          'FINALIZADO',
          'CONCLUIDO'
        ].includes(
          normalizarStatus(
            item.status
          )
        )
    )
    .sort(
      (a, b) => {
        const dataA =
          new Date(
            a.data_fechamento ||
            a.data_finalizacao ||
            a.data_abertura ||
            0
          ).getTime()

        const dataB =
          new Date(
            b.data_fechamento ||
            b.data_finalizacao ||
            b.data_abertura ||
            0
          ).getTime()

        return dataB - dataA
      }
    )
    .slice(
      0,
      5
    )
)

const dadosGraficoStatus = computed(() => ({
  labels: [
    'Aceitos',
    'Em rota',
    'Em atendimento',
    'Finalizados'
  ],

  datasets: [
    {
      data: [
        totalAceitos.value,
        totalEmRota.value,
        totalAtendimento.value,
        totalFinalizados.value
      ],

      backgroundColor: [
        cores.azul,
        cores.roxo,
        cores.amarelo,
        cores.verde
      ],

      borderWidth: 0,
      hoverOffset: 6
    }
  ]
}))

const opcoesGraficoStatus = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      callbacks: {
        label(context) {
          return ` ${context.label}: ${context.raw}`
        }
      }
    }
  }
}))

const mesesGrafico = computed(() => {
  const meses = []
  const hoje = new Date()

  for (
    let i = 5;
    i >= 0;
    i--
  ) {
    const data =
      new Date(
        hoje.getFullYear(),
        hoje.getMonth() - i,
        1
      )

    meses.push({
      ano: data.getFullYear(),
      mes: data.getMonth(),

      label:
        new Intl.DateTimeFormat(
          'pt-BR',
          {
            month: 'short'
          }
        )
          .format(data)
          .replace('.', '')
    })
  }

  return meses
})

const finalizadosPorMes = computed(() => {
  return mesesGrafico.value.map(
    periodo => {
      return meusChamadosNormalizados.value.filter(
        item => {
          const status =
            normalizarStatus(
              item.status
            )

          if (
            ![
              'FINALIZADO',
              'CONCLUIDO'
            ].includes(status)
          ) {
            return false
          }

          const valorData =
            item.data_fechamento ||
            item.data_finalizacao ||
            item.data_abertura

          if (!valorData) {
            return false
          }

          const data =
            new Date(
              valorData
            )

          if (
            Number.isNaN(
              data.getTime()
            )
          ) {
            return false
          }

          return (
            data.getFullYear() ===
              periodo.ano &&
            data.getMonth() ===
              periodo.mes
          )
        }
      ).length
    }
  )
})

const dadosGraficoMensal = computed(() => ({
  labels:
    mesesGrafico.value.map(
      item =>
        item.label
    ),

  datasets: [
    {
      label:
        'Atendimentos finalizados',

      data:
        finalizadosPorMes.value,

      borderColor:
        cores.laranja,

      backgroundColor:
        cores.laranjaClaro,

      pointBackgroundColor:
        cores.laranja,

      pointBorderColor:
        '#ffffff',

      pointBorderWidth:
        2,

      pointRadius:
        4,

      pointHoverRadius:
        6,

      borderWidth:
        3,

      tension:
        0.35,

      fill:
        true
    }
  ]
}))

const opcoesGraficoMensal = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    intersect: false,
    mode: 'index'
  },

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      callbacks: {
        label(context) {
          return ` ${context.raw} atendimento(s)`
        }
      }
    }
  },

  scales: {
    x: {
      ticks: {
        color:
          $q.dark.isActive
            ? '#98a2b3'
            : '#667085'
      },

      grid: {
        display: false
      },

      border: {
        display: false
      }
    },

    y: {
      beginAtZero: true,

      ticks: {
        precision: 0,

        color:
          $q.dark.isActive
            ? '#98a2b3'
            : '#667085'
      },

      grid: {
        color:
          $q.dark.isActive
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(16,24,40,0.06)'
      },

      border: {
        display: false
      }
    }
  }
}))

async function carregarDashboard() {
  carregando.value = true
  erro.value = ''

  try {
    if (
      !Number.isInteger(
        idFuncionario.value
      ) ||
      idFuncionario.value <= 0
    ) {
      throw new Error(
        'Técnico logado não identificado.'
      )
    }

    const [
      respostaChamados,
      respostaMeusChamados
    ] =
      await Promise.all([
        chamadoService.listar(),

        chamadoFuncionarioService
          .listarPorFuncionario(
            idFuncionario.value
          )
      ])

    chamadosGerais.value =
      Array.isArray(
        respostaChamados
      )
        ? respostaChamados
        : respostaChamados?.data ||
          respostaChamados?.chamados ||
          []

    meusChamados.value =
      Array.isArray(
        respostaMeusChamados
      )
        ? respostaMeusChamados
        : respostaMeusChamados?.data ||
          respostaMeusChamados?.chamados ||
          []

    carregadoUmaVez.value = true
  } catch (error) {
    console.error(
      'Erro ao carregar dashboard do técnico:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar o dashboard.'
  } finally {
    carregando.value = false
  }
}

function normalizarStatus(
  status
) {
  return String(
    status || ''
  )
    .trim()
    .toUpperCase()
}

function contarStatus(
  statusPermitidos
) {
  return meusChamadosNormalizados.value.filter(
    item =>
      statusPermitidos.includes(
        normalizarStatus(
          item.status
        )
      )
  ).length
}

function prioridadeUrgencia(
  urgencia
) {
  const valor =
    String(
      urgencia || ''
    )
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

  if (valor === 'ALTA') {
    return 3
  }

  if (valor === 'MEDIA') {
    return 2
  }

  return 1
}

function localChamado(
  item
) {
  if (
    item.cidade_propriedade &&
    item.estado_propriedade
  ) {
    return `${item.cidade_propriedade} - ${item.estado_propriedade}`
  }

  if (
    item.cidade_propriedade
  ) {
    return item.cidade_propriedade
  }

  if (
    item.nome_unidade
  ) {
    return item.nome_unidade
  }

  return 'Não informado'
}

function formatarTexto(
  valor
) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /^\w/,
      letra =>
        letra.toUpperCase()
    )
}

function formatarData(
  valor
) {
  if (!valor) {
    return 'Não informada'
  }

  const data =
    new Date(valor)

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

function classeStatus(
  status
) {
  const valor =
    normalizarStatus(
      status
    )

  if (
    valor === 'ACEITO'
  ) {
    return 'status-aceito'
  }

  if (
    valor === 'EM_ROTA'
  ) {
    return 'status-rota'
  }

  if (
    valor === 'EM_ATENDIMENTO'
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

function classeUrgencia(
  urgencia
) {
  const valor =
    String(
      urgencia || ''
    )
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

  if (
    valor === 'ALTA'
  ) {
    return 'urgencia-alta'
  }

  if (
    valor === 'MEDIA'
  ) {
    return 'urgencia-media'
  }

  return 'urgencia-baixa'
}

function continuarAtendimento() {
  if (!chamadoAtual.value) {
    return
  }

  router.push({
    name:
      'tecnico-atendimento-detalhes',

    params: {
      id:
        chamadoAtual.value.id_chamado
    }
  })
}

function abrirChamado(
  item
) {
  router.push({
    name:
      'tecnico-detalhes-chamado',

    params: {
      id:
        item.id_chamado
    }
  })
}

function irPendentes() {
  router.push({
    name:
      'tecnico-pendentes'
  })
}

function irEmAndamento() {
  router.push({
    name:
      'tecnico-meus-chamados',

    query: {
      filtro:
        'andamento'
    }
  })
}

function irFinalizados() {
  router.push({
    name:
      'tecnico-meus-chamados',

    query: {
      filtro:
        'finalizados'
    }
  })
}

function irMeusChamados() {
  router.push({
    name:
      'tecnico-meus-chamados'
  })
}

onMounted(
  carregarDashboard
)
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  padding: 30px;
  background: #f5f6f8;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.saudacao {
  color: #101828;
  font-size: 25px;
  font-weight: 900;
}

.descricao {
  margin-top: 5px;
  color: #667085;
  font-size: 11px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-card {
  min-width: 175px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  background: #ffffff;
}

.data-card > .q-icon {
  color: #f97316;
}

.data-card span {
  display: block;
  color: #98a2b3;
  font-size: 8px;
}

.data-card strong {
  display: block;
  margin-top: 1px;
  color: #344054;
  font-size: 9px;
  text-transform: capitalize;
}

.carregamento-inicial {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #98a2b3;
  font-size: 10px;
}

.indicadores-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 16px;
}

.indicador-card {
  appearance: none;
  width: 100%;
  padding: 18px;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  color: inherit;
  background: #ffffff;
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
  font-family: inherit;
  text-align: left;
}

.indicador-card--clicavel {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.indicador-card--clicavel:hover {
  transform: translateY(-3px);
  border-color: #fed7aa;
  box-shadow:
    0 9px 24px
    rgba(16, 24, 40, 0.08);
}

.indicador-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.indicador-icone {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.indicador-icone--laranja {
  color: #f97316;
  background: #fff1e6;
}

.indicador-icone--azul {
  color: #2563eb;
  background: #eff6ff;
}

.indicador-icone--verde {
  color: #16a34a;
  background: #f0fdf4;
}

.indicador-icone--roxo {
  color: #7c3aed;
  background: #f3e8ff;
}

.indicador-tag {
  padding: 5px 8px;
  border-radius: 20px;
  color: #667085;
  background: #f2f4f7;
  font-size: 8px;
  font-weight: 700;
}

.indicador-numero {
  margin-top: 15px;
  color: #101828;
  font-size: 25px;
  font-weight: 900;
}

.indicador-label {
  margin-top: 1px;
  color: #344054;
  font-size: 10px;
  font-weight: 700;
}

.indicador-rodape {
  margin-top: 6px;
  color: #98a2b3;
  font-size: 8px;
}

.dashboard-card {
  min-width: 0;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 19px 20px 10px;
}

.card-titulo {
  color: #101828;
  font-size: 13px;
  font-weight: 900;
}

.card-subtitulo {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 8px;
}

.card-icone {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  color: #f97316;
  background: #fff1e6;
}

.dashboard-grid-principal {
  display: grid;
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(330px, 0.55fr);
  gap: 16px;
  margin-bottom: 16px;
}

.dashboard-grid-secundario {
  display: grid;
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(300px, 0.55fr);
  gap: 16px;
  margin-bottom: 16px;
}

.dashboard-grid-listas {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.atendimento-card {
  border-color: #fed7aa;
}

.atendimento-atual {
  padding: 10px 20px 20px;
}

.atendimento-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.chamado-numero {
  color: #f97316;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.4px;
}

.chamado-problema {
  margin-top: 4px;
  color: #101828;
  font-size: 20px;
  font-weight: 900;
}

.atendimento-info-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px;
  border-radius: 11px;
  background: #f9fafb;
}

.info-icone {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 9px;
  color: #f97316;
  background: #fff1e6;
}

.info-item span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  text-transform: uppercase;
}

.info-item strong {
  display: block;
  margin-top: 2px;
  color: #344054;
  font-size: 9px;
}

.progresso-atendimento {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  margin-top: 20px;
}

.progresso-etapa {
  min-width: 0;
}

.progresso-linha-area {
  display: flex;
  align-items: center;
}

.progresso-circulo {
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #eaecf0;
  border-radius: 50%;
  color: #98a2b3;
  background: #ffffff;
}

.progresso-circulo--concluido {
  border-color: #f97316;
  color: #f97316;
  background: #fff7ed;
}

.progresso-circulo--atual {
  color: #ffffff;
  background: #f97316;
}

.progresso-linha {
  height: 2px;
  flex: 1;
  margin: 0 6px;
  background: #eaecf0;
}

.progresso-linha--concluida {
  background: #f97316;
}

.progresso-label {
  margin-top: 7px;
  color: #98a2b3;
  font-size: 7px;
  font-weight: 700;
}

.progresso-label--ativo {
  color: #475467;
}

.atendimento-acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.doughnut-area {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 7px 18px 20px;
}

.doughnut-wrapper {
  position: relative;
  width: 175px;
  height: 175px;
  flex-shrink: 0;
}

.doughnut-centro {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.doughnut-centro strong {
  color: #101828;
  font-size: 22px;
  font-weight: 900;
}

.doughnut-centro span {
  color: #98a2b3;
  font-size: 7px;
}

.legenda-status {
  display: grid;
  gap: 12px;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ponto {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
}

.ponto--aceito {
  background: #3b82f6;
}

.ponto--rota {
  background: #8b5cf6;
}

.ponto--atendimento {
  background: #f59e0b;
}

.ponto--finalizado {
  background: #22c55e;
}

.legenda-item strong {
  display: block;
  color: #344054;
  font-size: 10px;
}

.legenda-item span:not(.ponto) {
  display: block;
  color: #98a2b3;
  font-size: 7px;
}

.grafico-linha {
  height: 255px;
  padding: 8px 18px 18px;
}

.resumo-lista {
  display: flex;
  flex-direction: column;
  padding: 4px 18px 18px;
}

.resumo-item {
  appearance: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 0;
  border: none;
  border-bottom: 1px solid #f2f4f7;
  color: #475467;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  text-align: left;
}

.resumo-item:last-child {
  border-bottom: none;
}

.resumo-item:hover {
  color: #f97316;
}

.resumo-esquerda {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resumo-item strong {
  color: #101828;
  font-size: 12px;
}

.lista-card {
  overflow: hidden;
}

.lista-chamados,
.lista-finalizados {
  border-top: 1px solid #eaecf0;
}

.chamado-item {
  display: grid;
  grid-template-columns:
    45px
    minmax(0, 1fr)
    70px
    34px;
  align-items: center;
  gap: 9px;
  padding: 12px 18px;
  border-bottom: 1px solid #f2f4f7;
}

.chamado-item:last-child {
  border-bottom: none;
}

.chamado-id {
  color: #f97316;
  font-size: 9px;
  font-weight: 900;
}

.chamado-conteudo {
  min-width: 0;
}

.chamado-conteudo strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-conteudo span {
  display: block;
  overflow: hidden;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 7px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finalizado-item {
  appearance: none;
  width: 100%;
  display: grid;
  grid-template-columns:
    34px
    minmax(0, 1fr)
    75px
    20px;
  align-items: center;
  gap: 9px;
  padding: 12px 18px;
  border: none;
  border-bottom: 1px solid #f2f4f7;
  color: inherit;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}

.finalizado-item:last-child {
  border-bottom: none;
}

.finalizado-item:hover,
.chamado-item:hover {
  background: #fafafa;
}

.finalizado-icone {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  color: #059669;
  background: #d1fae5;
}

.finalizado-conteudo {
  min-width: 0;
}

.finalizado-conteudo strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finalizado-conteudo span {
  display: block;
  overflow: hidden;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 7px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finalizado-data {
  color: #667085;
  font-size: 7px;
}

.estado-vazio {
  padding: 35px 18px;
  color: #98a2b3;
  text-align: center;
}

.estado-vazio--pequeno {
  min-height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.estado-vazio-icone {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  border-radius: 15px;
  color: #059669;
  background: #d1fae5;
}

.estado-vazio strong {
  display: block;
  color: #475467;
  font-size: 10px;
}

.estado-vazio span {
  display: block;
  margin-top: 5px;
  font-size: 8px;
}

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado,
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 6px 9px;
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

.dashboard-page--dark {
  background: #0d0f12;
}

.dashboard-page--dark
.data-card,
.dashboard-page--dark
.indicador-card,
.dashboard-page--dark
.dashboard-card {
  border-color: #292d33;
  background: #15181d;
}

.dashboard-page--dark
.atendimento-card {
  border-color: #7c2d12;
}

.dashboard-page--dark
.saudacao,
.dashboard-page--dark
.indicador-numero,
.dashboard-page--dark
.card-titulo,
.dashboard-page--dark
.chamado-problema,
.dashboard-page--dark
.doughnut-centro strong {
  color: #f9fafb;
}

.dashboard-page--dark
.data-card strong,
.dashboard-page--dark
.indicador-label,
.dashboard-page--dark
.info-item strong,
.dashboard-page--dark
.legenda-item strong,
.dashboard-page--dark
.resumo-item strong,
.dashboard-page--dark
.chamado-conteudo strong,
.dashboard-page--dark
.finalizado-conteudo strong,
.dashboard-page--dark
.estado-vazio strong {
  color: #f2f4f7;
}

.dashboard-page--dark
.indicador-tag,
.dashboard-page--dark
.info-item {
  background: #1b1e24;
}

.dashboard-page--dark
.resumo-item,
.dashboard-page--dark
.lista-chamados,
.dashboard-page--dark
.lista-finalizados,
.dashboard-page--dark
.chamado-item,
.dashboard-page--dark
.finalizado-item {
  border-color: #292d33;
}

.dashboard-page--dark
.finalizado-item:hover,
.dashboard-page--dark
.chamado-item:hover {
  background: #1b1e24;
}

.dashboard-page--dark
.progresso-circulo {
  border-color: #3a3f47;
  background: #15181d;
}

.dashboard-page--dark
.progresso-circulo--concluido {
  border-color: #f97316;
  color: #f97316;
  background: #292018;
}

.dashboard-page--dark
.progresso-circulo--atual {
  color: #ffffff;
  background: #f97316;
}

.dashboard-page--dark
.progresso-linha {
  background: #3a3f47;
}

.dashboard-page--dark
.progresso-linha--concluida {
  background: #f97316;
}

@media (max-width: 1200px) {
  .indicadores-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid-principal,
  .dashboard-grid-secundario,
  .dashboard-grid-listas {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .dashboard-page {
    padding: 22px 16px 40px;
  }

  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .data-card {
    flex: 1;
  }

  .indicadores-grid {
    grid-template-columns: 1fr;
  }

  .atendimento-info-grid {
    grid-template-columns: 1fr;
  }

  .doughnut-area {
    flex-direction: column;
  }

  .progresso-atendimento {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}

@media (max-width: 500px) {
  .saudacao {
    font-size: 22px;
  }

  .chamado-item {
    grid-template-columns:
      38px
      minmax(0, 1fr)
      32px;
  }

  .chamado-item .q-badge {
    display: none;
  }

  .finalizado-item {
    grid-template-columns:
      32px
      minmax(0, 1fr)
      20px;
  }

  .finalizado-data {
    display: none;
  }
}
</style>
