<template>
  <q-page
    class="dashboard-page"
    :class="{ 'dashboard-page--dark': $q.dark.isActive }"
  >
    <!-- ==================================================
         TOPO COMPACTO
    =================================================== -->
    <section class="dashboard-hero">
      <div class="dashboard-hero__identidade">
        <div class="dashboard-hero__barra"></div>

        <div>
          <div class="dashboard-hero__label">
            Painel do Técnico
          </div>

          <div class="dashboard-hero__titulo">
            Olá, {{ primeiroNome }} 👋
          </div>

          <div class="dashboard-hero__descricao">
            Acompanhe seus chamados, atendimentos e prioridades do dia.
          </div>
        </div>
      </div>

      <div class="dashboard-hero__acoes">
        <div class="data-card">
          <div class="data-card__icone">
            <q-icon name="calendar_month" size="19px" />
          </div>

          <div>
            <span>Hoje</span>
            <strong>{{ dataAtual }}</strong>
          </div>
        </div>

        <q-btn
          unelevated
          round
          class="botao-atualizar"
          icon="refresh"
          :loading="carregando"
          @click="carregarDashboard"
        >
          <q-tooltip>Atualizar dashboard</q-tooltip>
        </q-btn>
      </div>
    </section>

    <q-banner
      v-if="erro"
      rounded
      class="bg-red-1 text-negative q-mb-md"
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
      <q-spinner color="orange" size="42px" />
      <span>Carregando seus atendimentos...</span>
    </div>

    <template v-else>
      <!-- ==================================================
           INDICADORES
      =================================================== -->
      <section class="indicadores-grid">
        <button
          type="button"
          class="indicador-card indicador-card--pendentes"
          @click="irPendentes"
        >
          <div class="indicador-icone indicador-icone--laranja">
            <q-icon name="pending_actions" size="22px" />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalPendentes }}
            </div>

            <div class="indicador-label">
              Chamados pendentes
            </div>

            <div class="indicador-rodape">
              Disponíveis para aceite
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--andamento"
          @click="irEmAndamento"
        >
          <div class="indicador-icone indicador-icone--azul">
            <q-icon name="engineering" size="22px" />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalEmAndamento }}
            </div>

            <div class="indicador-label">
              Em andamento
            </div>

            <div class="indicador-rodape">
              Aceitos, em rota ou atendimento
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--finalizados"
          @click="irFinalizados"
        >
          <div class="indicador-icone indicador-icone--verde">
            <q-icon name="task_alt" size="22px" />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalFinalizados }}
            </div>

            <div class="indicador-label">
              Finalizados
            </div>

            <div class="indicador-rodape">
              Concluídos por você
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>

        <button
          type="button"
          class="indicador-card indicador-card--meus"
          @click="irMeusChamados"
        >
          <div class="indicador-icone indicador-icone--roxo">
            <q-icon name="assignment_ind" size="22px" />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalMeusChamados }}
            </div>

            <div class="indicador-label">
              Meus chamados
            </div>

            <div class="indicador-rodape">
              Histórico vinculado ao usuário
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>
      </section>

      <!-- ==================================================
           ATENDIMENTO + DISTRIBUIÇÃO
      =================================================== -->
      <section class="dashboard-grid-principal">
        <article class="dashboard-card atendimento-card">
          <template v-if="chamadoAtual">
            <div class="atendimento-cabecalho">
              <div>
                <div class="card-kicker">
                  Atendimento atual · Chamado #{{ chamadoAtual.id_chamado }}
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

            <div class="atendimento-rodape">
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
                        size="14px"
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

              <q-btn
                unelevated
                no-caps
                class="continuar-btn"
                icon="play_arrow"
                label="Continuar atendimento"
                @click="continuarAtendimento"
              />
            </div>
          </template>

          <div
            v-else
            class="estado-vazio atendimento-vazio"
          >
            <div class="estado-vazio-icone">
              <q-icon name="check_circle" size="30px" />
            </div>

            <div>
              <strong>Nenhum atendimento em andamento</strong>
              <span>
                Quando você aceitar um chamado, ele aparecerá aqui.
              </span>
            </div>

            <q-btn
              outline
              no-caps
              color="orange"
              icon="pending_actions"
              label="Ver pendentes"
              @click="irPendentes"
            />
          </div>
        </article>

        <article class="dashboard-card status-card">
          <div class="card-header card-header--compacto">
            <div>
              <div class="card-titulo">
                Meus atendimentos
              </div>

              <div class="card-subtitulo">
                Distribuição por situação
              </div>
            </div>

            <div class="card-icone">
              <q-icon name="donut_large" size="19px" />
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
        </article>
      </section>

      <!-- ==================================================
           PENDENTES + EVOLUÇÃO
      =================================================== -->
      <section class="dashboard-grid-secundario">
        <article class="dashboard-card lista-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Chamados aguardando atendimento
              </div>

              <div class="card-subtitulo">
                Prioridades disponíveis para aceite
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
            <q-icon name="inbox" size="30px" color="grey-5" />
            <strong>Nenhum chamado pendente</strong>
            <span>Não há solicitações aguardando aceite.</span>
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
        </article>

        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Atendimentos finalizados
              </div>

              <div class="card-subtitulo">
                Evolução dos últimos 6 meses
              </div>
            </div>

            <div class="card-icone">
              <q-icon name="show_chart" size="19px" />
            </div>
          </div>

          <div class="grafico-linha">
            <Line
              :data="dadosGraficoMensal"
              :options="opcoesGraficoMensal"
            />
          </div>
        </article>
      </section>

      <!-- ==================================================
           ANÁLISE DO ATENDIMENTO
      =================================================== -->
      <section class="dashboard-grid-analitico">
        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Chamados por urgência
              </div>

              <div class="card-subtitulo">
                Distribuição dos seus chamados por prioridade
              </div>
            </div>

            <div class="card-icone">
              <q-icon name="priority_high" size="19px" />
            </div>
          </div>

          <div
            v-if="totalChamadosComUrgencia > 0"
            class="grafico-analitico"
          >
            <Bar
              :data="dadosGraficoUrgencia"
              :options="opcoesGraficoUrgencia"
            />
          </div>

          <div
            v-else
            class="estado-vazio estado-vazio--grafico"
          >
            <q-icon
              name="bar_chart"
              size="30px"
              color="grey-5"
            />

            <strong>
              Ainda não há dados de urgência
            </strong>

            <span>
              O gráfico será preenchido conforme os atendimentos forem registrados.
            </span>
          </div>
        </article>

        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Propriedades mais atendidas
              </div>

              <div class="card-subtitulo">
                Onde seus chamados estão mais concentrados
              </div>
            </div>

            <div class="card-icone">
              <q-icon name="agriculture" size="19px" />
            </div>
          </div>

          <div
            v-if="topPropriedades.length > 0"
            class="grafico-analitico"
          >
            <Bar
              :data="dadosGraficoPropriedades"
              :options="opcoesGraficoPropriedades"
            />
          </div>

          <div
            v-else
            class="estado-vazio estado-vazio--grafico"
          >
            <q-icon
              name="agriculture"
              size="30px"
              color="grey-5"
            />

            <strong>
              Ainda não há propriedades para comparar
            </strong>

            <span>
              O ranking aparecerá conforme os chamados forem vinculados às propriedades.
            </span>
          </div>
        </article>
      </section>
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
  Bar,
  Doughnut,
  Line
} from 'vue-chartjs'

import {
  ArcElement,
  BarElement,
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
  BarElement,
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


const totaisUrgencia = computed(() => {
  const totais = {
    BAIXA: 0,
    MEDIA: 0,
    ALTA: 0
  }

  meusChamadosNormalizados.value.forEach(
    item => {
      const valor =
        String(
          item.urgencia || ''
        )
          .trim()
          .toUpperCase()
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          )

      if (
        Object.prototype.hasOwnProperty.call(
          totais,
          valor
        )
      ) {
        totais[valor] += 1
      }
    }
  )

  return totais
})

const totalChamadosComUrgencia =
  computed(() =>
    totaisUrgencia.value.BAIXA +
    totaisUrgencia.value.MEDIA +
    totaisUrgencia.value.ALTA
  )

const dadosGraficoUrgencia =
  computed(() => ({
    labels: [
      'Baixa',
      'Média',
      'Alta'
    ],

    datasets: [
      {
        data: [
          totaisUrgencia.value.BAIXA,
          totaisUrgencia.value.MEDIA,
          totaisUrgencia.value.ALTA
        ],

        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#ef4444'
        ],

        borderRadius: 8,
        borderSkipped: false,
        barThickness: 24
      }
    ]
  }))

const opcoesGraficoUrgencia =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label(context) {
            return ` ${context.raw} chamado(s)`
          }
        }
      }
    },

    scales: {
      x: {
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
      },

      y: {
        ticks: {
          color:
            $q.dark.isActive
              ? '#cbd5e1'
              : '#475467',

          font: {
            weight: 700
          }
        },

        grid: {
          display: false
        },

        border: {
          display: false
        }
      }
    }
  }))

const topPropriedades =
  computed(() => {
    const contagem = new Map()

    meusChamadosNormalizados.value.forEach(
      item => {
        const nome =
          String(
            item.nome_propriedade || ''
          ).trim()

        if (!nome) {
          return
        }

        contagem.set(
          nome,
          (contagem.get(nome) || 0) + 1
        )
      }
    )

    return Array.from(
      contagem.entries()
    )
      .map(
        ([nome, total]) => ({
          nome,
          total
        })
      )
      .sort(
        (a, b) =>
          b.total - a.total
      )
      .slice(0, 5)
  })

const dadosGraficoPropriedades =
  computed(() => ({
    labels:
      topPropriedades.value.map(
        item => item.nome
      ),

    datasets: [
      {
        data:
          topPropriedades.value.map(
            item => item.total
          ),

        backgroundColor:
          topPropriedades.value.map(
            (_, index) => {
              const coresGrafico = [
                '#f97316',
                '#fb923c',
                '#fdba74',
                '#fed7aa',
                '#ffedd5'
              ]

              return coresGrafico[index]
            }
          ),

        borderRadius: 8,
        borderSkipped: false,
        barThickness: 20
      }
    ]
  }))

const opcoesGraficoPropriedades =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label(context) {
            return ` ${context.raw} chamado(s)`
          }
        }
      }
    },

    scales: {
      x: {
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
      },

      y: {
        ticks: {
          color:
            $q.dark.isActive
              ? '#cbd5e1'
              : '#475467',

          font: {
            size: 10,
            weight: 700
          }
        },

        grid: {
          display: false
        },

        border: {
          display: false
        }
      }
    }
  }))

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
  padding: 14px 20px 24px;
  background: #f5f6f8;
}

/* ==================================================
   HERO / CABEÇALHO DA DASHBOARD
=================================================== */

.dashboard-hero {
  min-height: 82px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  margin-bottom: 12px;
  padding: 13px 16px;

  border: 1px solid #eaecf0;
  border-radius: 16px;

  background:
    linear-gradient(
      110deg,
      #ffffff 0%,
      #ffffff 62%,
      #fff6ed 100%
    );

  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.dashboard-hero__identidade {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 12px;
}

.dashboard-hero__barra {
  width: 4px;
  height: 47px;

  flex-shrink: 0;

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      #ff9d1f,
      #f97316
    );
}

.dashboard-hero__label {
  color: #f97316;

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1px;
  text-transform: uppercase;
}

.dashboard-hero__titulo {
  margin-top: 2px;

  color: #17233c;

  font-size: 24px;
  font-weight: 900;

  line-height: 1.05;
}

.dashboard-hero__descricao {
  margin-top: 4px;

  color: #667085;

  font-size: 11px;
}

.dashboard-hero__acoes {
  display: flex;
  align-items: center;

  gap: 8px;
}

.data-card {
  min-width: 205px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 8px 11px;

  border: 1px solid #eaecf0;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.92);
}

.data-card__icone {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;

  background: #fff1e6;
}

.data-card span {
  display: block;

  color: #98a2b3;

  font-size: 8px;
  font-weight: 700;
}

.data-card strong {
  display: block;

  margin-top: 1px;

  color: #344054;

  font-size: 10px;
  font-weight: 800;

  text-transform: capitalize;
}

.botao-atualizar {
  width: 42px;
  height: 42px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );

  box-shadow:
    0 5px 13px
    rgba(249, 115, 22, 0.2);
}

/* ==================================================
   CARREGAMENTO
=================================================== */

.carregamento-inicial {
  min-height: 360px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #98a2b3;

  font-size: 11px;
}

/* ==================================================
   INDICADORES
=================================================== */

.indicadores-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 10px;

  margin-bottom: 12px;
}

.indicador-card {
  appearance: none;

  position: relative;

  min-width: 0;
  min-height: 108px;

  display: grid;

  grid-template-columns:
    42px
    minmax(0, 1fr)
    18px;

  align-items: center;

  gap: 11px;

  padding: 13px 14px;

  border: 1px solid #eaecf0;
  border-radius: 15px;

  color: inherit;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);

  font-family: inherit;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.indicador-card::before {
  content: '';

  position: absolute;

  left: 0;
  top: 16px;
  bottom: 16px;

  width: 3px;

  border-radius: 0 999px 999px 0;

  opacity: 0;

  transition: opacity 0.18s ease;
}

.indicador-card--pendentes::before {
  background: #f97316;
}

.indicador-card--andamento::before {
  background: #2563eb;
}

.indicador-card--finalizados::before {
  background: #16a34a;
}

.indicador-card--meus::before {
  background: #7c3aed;
}

.indicador-card:hover {
  transform: translateY(-2px);

  border-color: #fed7aa;

  box-shadow:
    0 8px 22px
    rgba(16, 24, 40, 0.075);
}

.indicador-card:hover::before {
  opacity: 1;
}

.indicador-icone {
  width: 42px;
  height: 42px;

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

.indicador-conteudo {
  min-width: 0;
}

.indicador-numero {
  color: #101828;

  font-size: 26px;
  font-weight: 900;

  line-height: 1;
}

.indicador-label {
  margin-top: 4px;

  color: #344054;

  font-size: 11px;
  font-weight: 800;
}

.indicador-rodape {
  overflow: hidden;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 8px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.indicador-seta {
  color: #c5c9d0;

  transition:
    color 0.18s ease,
    transform 0.18s ease;
}

.indicador-card:hover .indicador-seta {
  color: #f97316;
  transform: translateX(2px);
}

/* ==================================================
   CARDS GERAIS
=================================================== */

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
  min-height: 57px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  padding: 13px 16px 9px;
}

.card-header--compacto {
  padding-bottom: 4px;
}

.card-titulo {
  color: #101828;

  font-size: 13px;
  font-weight: 900;
}

.card-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
}

.card-kicker {
  color: #f97316;

  font-size: 9px;
  font-weight: 900;

  letter-spacing: 0.5px;

  text-transform: uppercase;
}

.card-icone {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;

  background: #fff1e6;
}

/* ==================================================
   GRID PRINCIPAL
=================================================== */

.dashboard-grid-principal {
  display: grid;

  grid-template-columns:
    minmax(0, 1.65fr)
    minmax(320px, 0.55fr);

  gap: 12px;

  margin-bottom: 12px;
}

.atendimento-card {
  padding: 16px;

  border-color: #fed7aa;
}

.atendimento-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.chamado-problema {
  margin-top: 4px;

  color: #101828;

  font-size: 23px;
  font-weight: 900;

  line-height: 1.08;
}

.atendimento-info-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 8px;

  margin-top: 13px;
}

.info-item {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 9px 10px;

  border-radius: 11px;

  background: #f8fafc;
}

.info-icone {
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  color: #f97316;

  background: #fff1e6;
}

.info-item > div:last-child {
  min-width: 0;
}

.info-item span {
  display: block;

  color: #98a2b3;

  font-size: 7px;
  font-weight: 700;

  text-transform: uppercase;
}

.info-item strong {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #344054;

  font-size: 9px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.atendimento-rodape {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  align-items: end;

  gap: 18px;

  margin-top: 14px;
}

.progresso-atendimento {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));
}

.progresso-etapa {
  min-width: 0;
}

.progresso-linha-area {
  display: flex;
  align-items: center;
}

.progresso-circulo {
  width: 28px;
  height: 28px;

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

  margin: 0 5px;

  background: #eaecf0;
}

.progresso-linha--concluida {
  background: #f97316;
}

.progresso-label {
  margin-top: 5px;

  color: #98a2b3;

  font-size: 7px;
  font-weight: 700;
}

.progresso-label--ativo {
  color: #475467;
}

.continuar-btn {
  min-height: 40px;

  padding: 0 13px;

  border-radius: 11px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );

  font-size: 11px;
  font-weight: 800;
}

/* ==================================================
   GRÁFICO ROSCA
=================================================== */

.status-card {
  overflow: hidden;
}

.doughnut-area {
  min-height: 205px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 17px;

  padding: 2px 13px 13px;
}

.doughnut-wrapper {
  position: relative;

  width: 145px;
  height: 145px;

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

  gap: 9px;
}

.legenda-item {
  display: flex;
  align-items: center;

  gap: 7px;
}

.ponto {
  width: 8px;
  height: 8px;

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

/* ==================================================
   GRID SECUNDÁRIO
=================================================== */

.dashboard-grid-secundario {
  display: grid;

  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(0, 0.95fr);

  gap: 12px;

  margin-bottom: 12px;
}

.grafico-linha {
  height: 200px;

  padding: 4px 15px 14px;
}


/* ==================================================
   ANÁLISE / GRÁFICOS
=================================================== */

.dashboard-grid-analitico {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 12px;

  margin-bottom: 12px;
}

.grafico-analitico {
  height: 235px;

  padding: 5px 16px 16px;
}

.estado-vazio--grafico {
  min-height: 235px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 20px;

  gap: 5px;
}

/* ==================================================
   LISTAS
=================================================== */

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
    43px
    minmax(0, 1fr)
    68px
    32px;

  align-items: center;

  gap: 8px;

  padding: 10px 15px;

  border-bottom: 1px solid #f2f4f7;
}

.chamado-item:last-child {
  border-bottom: none;
}

.chamado-item:hover {
  background: #fafafa;
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

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.ultimos-card {
  overflow: hidden;
}

.lista-finalizados--grade {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.finalizado-item {
  appearance: none;

  min-width: 0;

  display: grid;

  grid-template-columns:
    31px
    minmax(0, 1fr)
    67px
    18px;

  align-items: center;

  gap: 8px;

  padding: 10px 14px;

  border: none;
  border-right: 1px solid #f2f4f7;
  border-bottom: 1px solid #f2f4f7;

  color: inherit;

  background: transparent;

  font-family: inherit;

  text-align: left;

  cursor: pointer;
}

.finalizado-item:nth-child(2n) {
  border-right: none;
}

.finalizado-item:hover {
  background: #fafafa;
}

.finalizado-icone {
  width: 29px;
  height: 29px;

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

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.finalizado-data {
  color: #667085;

  font-size: 7px;
}

/* ==================================================
   ESTADO VAZIO
=================================================== */

.estado-vazio {
  color: #98a2b3;

  text-align: center;
}

.atendimento-vazio {
  min-height: 180px;

  display: grid;

  grid-template-columns:
    50px
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 15px;

  padding: 18px;
}

.estado-vazio--pequeno {
  min-height: 145px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 22px 15px;
}

.estado-vazio-icone {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

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

  margin-top: 4px;

  font-size: 8px;
}

/* ==================================================
   BADGES
=================================================== */

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado,
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 5px 9px;

  font-size: 9px;
  font-weight: 700;
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

/* ==================================================
   DARK
=================================================== */

.dashboard-page--dark {
  background: #0d0f12;
}

.dashboard-page--dark .dashboard-hero {
  border-color: #292d33;

  background:
    linear-gradient(
      110deg,
      #15181d 0%,
      #15181d 62%,
      #211b17 100%
    );
}

.dashboard-page--dark .dashboard-hero__titulo,
.dashboard-page--dark .indicador-numero,
.dashboard-page--dark .card-titulo,
.dashboard-page--dark .chamado-problema,
.dashboard-page--dark .doughnut-centro strong {
  color: #f9fafb;
}

.dashboard-page--dark .dashboard-hero__descricao {
  color: #98a2b3;
}

.dashboard-page--dark .data-card,
.dashboard-page--dark .indicador-card,
.dashboard-page--dark .dashboard-card {
  border-color: #292d33;

  background: #15181d;
}

.dashboard-page--dark .data-card {
  background: #191d23;
}

.dashboard-page--dark .data-card strong,
.dashboard-page--dark .indicador-label,
.dashboard-page--dark .info-item strong,
.dashboard-page--dark .legenda-item strong,
.dashboard-page--dark .chamado-conteudo strong,
.dashboard-page--dark .finalizado-conteudo strong,
.dashboard-page--dark .estado-vazio strong {
  color: #f2f4f7;
}

.dashboard-page--dark .atendimento-card {
  border-color: #7c2d12;
}

.dashboard-page--dark .info-item {
  background: #1b1e24;
}

.dashboard-page--dark .lista-chamados,
.dashboard-page--dark .lista-finalizados,
.dashboard-page--dark .chamado-item,
.dashboard-page--dark .finalizado-item {
  border-color: #292d33;
}

.dashboard-page--dark .chamado-item:hover,
.dashboard-page--dark .finalizado-item:hover {
  background: #1b1e24;
}

.dashboard-page--dark .progresso-circulo {
  border-color: #3a3f47;

  background: #15181d;
}

.dashboard-page--dark .progresso-circulo--concluido {
  border-color: #f97316;

  color: #f97316;

  background: #292018;
}

.dashboard-page--dark .progresso-circulo--atual {
  color: #ffffff;

  background: #f97316;
}

.dashboard-page--dark .progresso-linha {
  background: #3a3f47;
}

.dashboard-page--dark .progresso-linha--concluida {
  background: #f97316;
}

/* ==================================================
   RESPONSIVO
=================================================== */

@media (max-width: 1350px) {
  .atendimento-info-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .atendimento-rodape {
    grid-template-columns: 1fr;
  }

  .continuar-btn {
    justify-self: end;
  }
}

@media (max-width: 1200px) {
  .indicadores-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid-principal,
  .dashboard-grid-secundario,
  .dashboard-grid-analitico {
    grid-template-columns: 1fr;
  }

  .doughnut-area {
    justify-content: flex-start;

    padding-left: 20px;
  }
}

@media (max-width: 1023px) {
  .dashboard-page {
    padding: 14px 14px 34px;
  }

  .dashboard-hero {
    min-height: auto;

    padding: 12px 13px;
  }

  .dashboard-hero__label {
    display: none;
  }

  .dashboard-hero__titulo {
    font-size: 20px;
  }

  .dashboard-hero__descricao {
    display: none;
  }

  .data-card {
    min-width: 0;
  }
}

@media (max-width: 700px) {
  .dashboard-hero {
    align-items: flex-start;

    flex-direction: column;

    gap: 10px;
  }

  .dashboard-hero__acoes {
    width: 100%;
  }

  .data-card {
    flex: 1;
  }

  .indicadores-grid {
    grid-template-columns: 1fr;
  }

  .indicador-card {
    min-height: 94px;
  }

  .atendimento-cabecalho {
    align-items: flex-start;

    flex-direction: column;
  }

  .atendimento-info-grid {
    grid-template-columns: 1fr;
  }

  .progresso-atendimento {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 14px;
  }

  .doughnut-area {
    align-items: center;

    flex-direction: column;
  }

  .lista-finalizados--grade {
    grid-template-columns: 1fr;
  }

  .finalizado-item {
    border-right: none;
  }

  .atendimento-vazio {
    grid-template-columns: 1fr;

    text-align: center;
  }
}

@media (max-width: 500px) {
  .dashboard-page {
    padding:
      12px
      12px
      28px;
  }

  .dashboard-hero__barra {
    display: none;
  }

  .dashboard-hero__titulo {
    font-size: 18px;
  }

  .data-card strong {
    font-size: 9px;
  }

  .chamado-problema {
    font-size: 20px;
  }

  .chamado-item {
    grid-template-columns:
      38px
      minmax(0, 1fr)
      30px;
  }

  .chamado-item .q-badge {
    display: none;
  }

  .finalizado-item {
    grid-template-columns:
      30px
      minmax(0, 1fr)
      18px;
  }

  .finalizado-data {
    display: none;
  }
}
</style>