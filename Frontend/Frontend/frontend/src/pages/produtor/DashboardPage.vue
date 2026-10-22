<template>
  <q-page
    class="dashboard-page"
    :class="{ 'dashboard-page--dark': $q.dark.isActive }"
  >
    <!-- BOAS-VINDAS -->
    <section class="dashboard-hero">
      <div class="dashboard-hero__identidade">
        <div class="dashboard-hero__barra"></div>

        <div>
          <div class="dashboard-hero__label">PAINEL DO PRODUTOR</div>
          <div class="dashboard-hero__titulo">
            Olá, {{ primeiroNome }} 👋
          </div>
          <div class="dashboard-hero__descricao">
            Veja como estão seus chamados.
          </div>
        </div>
      </div>

      <div class="dashboard-hero__acoes">
        <div class="data-card">
          <div class="data-card__icone">
            <q-icon name="calendar_today" size="19px" />
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
          aria-label="Atualizar chamados"
          @click="carregarDados"
        >
          <q-tooltip>Atualizar dashboard</q-tooltip>
        </q-btn>
      </div>
    </section>

    <!-- CARREGAMENTO E ERROS -->
    <div v-if="carregando" class="estado-central">
      <q-spinner color="orange" size="42px" />
      <span>Carregando dashboard...</span>
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
          @click="carregarDados"
        />
      </template>
    </q-banner>

    <template v-else>
      <!-- RESUMO DOS CHAMADOS: DESTAQUE + QUATRO CARDS COMPACTOS -->
      <div class="secao-cabecalho">
        <div>
          <div class="secao-sobretitulo">ACOMPANHAMENTO</div>
          <h2>Seus chamados</h2>
        </div>
        <span class="secao-ajuda">Toque em um card para visualizar</span>
      </div>

      <section class="cards-grid" aria-label="Resumo dos chamados">
        <!-- TODOS -->
        <button
          type="button"
          class="indicador-card indicador-card--principal"
          @click="abrirChamados()"
        >
          <div class="principal-topo">
            <span class="principal-marcador">
              <q-icon name="space_dashboard" size="17px" />
              VISÃO GERAL
            </span>
            <q-icon name="north_east" size="20px" />
          </div>

          <div class="principal-meio">
            <div>
              <div class="principal-numero">{{ totalChamados }}</div>
              <div class="principal-titulo">Chamados registrados</div>
              <div class="principal-descricao">
                Todas as suas solicitações
              </div>
            </div>
            <div class="principal-ilustracao" aria-hidden="true">
              <q-icon name="confirmation_number" size="44px" />
            </div>
          </div>

          <div class="principal-rodape">
            <span>Ver todos os chamados</span>
            <q-icon name="arrow_forward" size="17px" />
          </div>
        </button>

        <!-- PENDENTES -->
        <button
          type="button"
          class="indicador-card indicador-card--mini"
          @click="abrirChamados('PENDENTE')"
        >
          <div class="mini-topo">
            <div class="icone-wrapper pendente">
              <q-icon name="schedule" size="21px" />
            </div>
            <q-icon name="north_east" class="indicador-seta" size="17px" />
          </div>
          <div class="indicador-numero">{{ totalPendentes }}</div>
          <div class="indicador-titulo">Pendentes</div>
          <div class="indicador-descricao">Aguardando atendimento</div>
        </button>

        <!-- EM ANDAMENTO -->
        <button
          type="button"
          class="indicador-card indicador-card--mini"
          @click="abrirChamados('EM_ANDAMENTO')"
        >
          <div class="mini-topo">
            <div class="icone-wrapper atendimento">
              <q-icon name="engineering" size="21px" />
            </div>
            <q-icon name="north_east" class="indicador-seta" size="17px" />
          </div>
          <div class="indicador-numero">{{ totalEmAndamento }}</div>
          <div class="indicador-titulo">Em andamento</div>
          <div class="indicador-descricao">Em atendimento</div>
        </button>

        <!-- FINALIZADOS -->
        <button
          type="button"
          class="indicador-card indicador-card--mini"
          @click="abrirChamados('FINALIZADO')"
        >
          <div class="mini-topo">
            <div class="icone-wrapper finalizado">
              <q-icon name="task_alt" size="21px" />
            </div>
            <q-icon name="north_east" class="indicador-seta" size="17px" />
          </div>
          <div class="indicador-numero">{{ totalFinalizados }}</div>
          <div class="indicador-titulo">Finalizados</div>
          <div class="indicador-descricao">Atendimentos concluídos</div>
        </button>

        <!-- CANCELADOS -->
        <button
          type="button"
          class="indicador-card indicador-card--mini"
          @click="abrirChamados('CANCELADO')"
        >
          <div class="mini-topo">
            <div class="icone-wrapper cancelado">
              <q-icon name="cancel" size="21px" />
            </div>
            <q-icon name="north_east" class="indicador-seta" size="17px" />
          </div>
          <div class="indicador-numero">{{ totalCancelados }}</div>
          <div class="indicador-titulo">Cancelados</div>
          <div class="indicador-descricao">Solicitações canceladas</div>
        </button>
      </section>

      <!-- GRÁFICOS E INFORMAÇÕES -->
      <div class="secao-cabecalho secao-cabecalho--graficos">
        <div>
          <div class="secao-sobretitulo">ESTATÍSTICAS</div>
          <h2>Acompanhe os resultados</h2>
        </div>
      </div>

      <section class="dashboard-grid dashboard-grid--principal">
        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Evolução dos chamados</div>
              <div class="card-subtitulo">
                Abertos e finalizados nos últimos 6 meses
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="show_chart" size="19px" />
            </div>
          </div>
          <div class="grafico grafico--linha">
            <Line :data="dadosGraficoMensal" :options="opcoesGraficoMensal" />
          </div>
        </article>

        <article class="dashboard-card">
          <div class="card-header card-header--compacto">
            <div>
              <div class="card-titulo">Chamados por status</div>
              <div class="card-subtitulo">
                Distribuição atual dos seus chamados
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="donut_large" size="19px" />
            </div>
          </div>

          <div class="doughnut-area">
            <div class="doughnut-wrapper">
              <Doughnut :data="dadosGraficoStatus" :options="opcoesGraficoStatus" />
              <div class="doughnut-centro">
                <strong>{{ totalChamados }}</strong>
                <span>chamados</span>
              </div>
            </div>

            <div class="legenda-status">
              <div class="legenda-item">
                <span class="ponto ponto--pendente"></span>
                <div>
                  <strong>{{ totalPendentes }}</strong>
                  <span>Pendentes</span>
                </div>
              </div>
              <div class="legenda-item">
                <span class="ponto ponto--andamento"></span>
                <div>
                  <strong>{{ totalEmAndamento }}</strong>
                  <span>Em andamento</span>
                </div>
              </div>
              <div class="legenda-item">
                <span class="ponto ponto--finalizado"></span>
                <div>
                  <strong>{{ totalFinalizados }}</strong>
                  <span>Finalizados</span>
                </div>
              </div>
              <div class="legenda-item">
                <span class="ponto ponto--cancelado"></span>
                <div>
                  <strong>{{ totalCancelados }}</strong>
                  <span>Cancelados</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="dashboard-grid dashboard-grid--secundario">
        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Chamados por urgência</div>
              <div class="card-subtitulo">
                Distribuição das prioridades registradas
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="priority_high" size="19px" />
            </div>
          </div>

          <div v-if="totalComUrgencia > 0" class="grafico grafico--barra">
            <Bar :data="dadosGraficoUrgencia" :options="opcoesGraficoUrgencia" />
          </div>
          <div v-else class="estado-vazio">
            <q-icon name="bar_chart" size="30px" color="grey-5" />
            <strong>Sem dados de urgência</strong>
            <span>
              O gráfico será preenchido conforme novos chamados forem registrados.
            </span>
          </div>
        </article>

        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">Tipos de chamado</div>
              <div class="card-subtitulo">
                Motivos mais frequentes das suas solicitações
              </div>
            </div>
            <div class="card-icone">
              <q-icon name="category" size="19px" />
            </div>
          </div>

          <div v-if="tiposChamado.length > 0" class="grafico grafico--barra">
            <Bar :data="dadosGraficoTipos" :options="opcoesGraficoTipos" />
          </div>
          <div v-else class="estado-vazio">
            <q-icon name="category" size="30px" color="grey-5" />
            <strong>Sem tipos de chamado para comparar</strong>
            <span>
              O gráfico aparecerá conforme os chamados forem registrados.
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

const chamados =
  ref([])

const carregando =
  ref(false)

const erro =
  ref('')

const primeiroNome =
  computed(() => {
    const nome =
      String(
        authStore.usuario?.nome ||
        authStore.nomeUsuario ||
        'Produtor'
      ).trim()

    return (
      nome.split(/\s+/)[0] ||
      'Produtor'
    )
  })

const dataAtual =
  computed(() => {
    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        weekday:
          'long',
        day:
          '2-digit',
        month:
          'long'
      }
    ).format(
      new Date()
    )
  })

/* CONTADORES */

const totalChamados =
  computed(() =>
    chamados.value.length
  )

const totalPendentes =
  computed(() =>
    contarStatus([
      'PENDENTE'
    ])
  )

const totalEmAndamento =
  computed(() =>
    contarStatus([
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO',
      'AGUARDANDO_CONFIRMACAO',
      'EM_ANDAMENTO'
    ])
  )

const totalFinalizados =
  computed(() =>
    contarStatus([
      'FINALIZADO',
      'CONCLUIDO'
    ])
  )

const totalCancelados =
  computed(() =>
    contarStatus([
      'CANCELADO'
    ])
  )

/* GRÁFICO STATUS */

const dadosGraficoStatus =
  computed(() => ({
    labels: [
      'Pendentes',
      'Em andamento',
      'Finalizados',
      'Cancelados'
    ],

    datasets: [
      {
        data: [
          totalPendentes.value,
          totalEmAndamento.value,
          totalFinalizados.value,
          totalCancelados.value
        ],

        backgroundColor: [
          '#f97316',
          '#3b82f6',
          '#22c55e',
          '#ef4444'
        ],

        borderWidth:
          0,

        hoverOffset:
          6
      }
    ]
  }))

const opcoesGraficoStatus =
  computed(() => ({
    responsive:
      true,

    maintainAspectRatio:
      false,

    cutout:
      '72%',

    plugins: {
      legend: {
        display:
          false
      }
    }
  }))

/* GRÁFICO MENSAL */

const mesesGrafico =
  computed(() => {
    const meses = []
    const hoje =
      new Date()

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
        ano:
          data.getFullYear(),

        mes:
          data.getMonth(),

        label:
          new Intl.DateTimeFormat(
            'pt-BR',
            {
              month:
                'short'
            }
          )
            .format(data)
            .replace(
              '.',
              ''
            )
      })
    }

    return meses
  })

const chamadosAbertosPorMes =
  computed(() =>
    mesesGrafico.value.map(
      periodo =>
        chamados.value.filter(
          item => {
            const data =
              new Date(
                item.data_abertura ||
                0
              )

            return (
              !Number.isNaN(
                data.getTime()
              ) &&
              data.getFullYear() ===
                periodo.ano &&
              data.getMonth() ===
                periodo.mes
            )
          }
        ).length
    )
  )

const finalizadosPorMes =
  computed(() =>
    mesesGrafico.value.map(
      periodo =>
        chamados.value.filter(
          item => {
            if (
              ![
                'FINALIZADO',
                'CONCLUIDO'
              ].includes(
                normalizarStatus(
                  item.status
                )
              )
            ) {
              return false
            }

            const valorData =
              item.data_fechamento ||
              item.data_finalizacao ||
              item.data_abertura

            const data =
              new Date(
                valorData ||
                0
              )

            return (
              !Number.isNaN(
                data.getTime()
              ) &&
              data.getFullYear() ===
                periodo.ano &&
              data.getMonth() ===
                periodo.mes
            )
          }
        ).length
    )
  )

const dadosGraficoMensal =
  computed(() => ({
    labels:
      mesesGrafico.value.map(
        item =>
          item.label
      ),

    datasets: [
      {
        label:
          'Abertos',

        data:
          chamadosAbertosPorMes.value,

        borderColor:
          '#f97316',

        backgroundColor:
          'rgba(249, 115, 22, 0.12)',

        pointBackgroundColor:
          '#f97316',

        pointBorderColor:
          '#ffffff',

        pointBorderWidth:
          2,

        pointRadius:
          3,

        borderWidth:
          3,

        tension:
          0.35,

        fill:
          true
      },
      {
        label:
          'Finalizados',

        data:
          finalizadosPorMes.value,

        borderColor:
          '#22c55e',

        backgroundColor:
          'rgba(34, 197, 94, 0.04)',

        pointBackgroundColor:
          '#22c55e',

        pointBorderColor:
          '#ffffff',

        pointBorderWidth:
          2,

        pointRadius:
          3,

        borderWidth:
          2,

        tension:
          0.35,

        fill:
          false
      }
    ]
  }))

const opcoesGraficoMensal =
  computed(() => ({
    responsive:
      true,

    maintainAspectRatio:
      false,

    interaction: {
      intersect:
        false,

      mode:
        'index'
    },

    plugins: {
      legend: {
        display:
          true,

        position:
          'top',

        align:
          'end',

        labels: {
          usePointStyle:
            true,

          boxWidth:
            7,

          color:
            $q.dark.isActive
              ? '#cbd5e1'
              : '#667085',

          font: {
            size:
              9
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
          display:
            false
        },

        border: {
          display:
            false
        }
      },

      y: {
        beginAtZero:
          true,

        ticks: {
          precision:
            0,

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
          display:
            false
        }
      }
    }
  }))

/* GRÁFICO URGÊNCIA */

const totaisUrgencia =
  computed(() => {
    const totais = {
      BAIXA:
        0,
      MEDIA:
        0,
      ALTA:
        0
    }

    chamados.value.forEach(
      item => {
        const valor =
          normalizarTexto(
            item.urgencia
          )

        if (
          Object.prototype
            .hasOwnProperty.call(
              totais,
              valor
            )
        ) {
          totais[
            valor
          ] += 1
        }
      }
    )

    return totais
  })

const totalComUrgencia =
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

        borderRadius:
          8,

        borderSkipped:
          false,

        barThickness:
          25
      }
    ]
  }))

const opcoesGraficoUrgencia =
  computed(() => ({
    responsive:
      true,

    maintainAspectRatio:
      false,

    plugins: {
      legend: {
        display:
          false
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
          display:
            false
        },

        border: {
          display:
            false
        }
      },

      y: {
        beginAtZero:
          true,

        ticks: {
          precision:
            0,

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
          display:
            false
        }
      }
    }
  }))

/* TIPOS DE CHAMADO */

const tiposChamado =
  computed(() => {
    const mapa =
      new Map()

    chamados.value.forEach(
      item => {
        const tipo =
          String(
            item.tipo_chamado ||
            item.tipo_cultura ||
            'Não informado'
          ).trim()

        if (
          !tipo ||
          tipo ===
          'Não informado'
        ) {
          return
        }

        mapa.set(
          tipo,
          (mapa.get(tipo) || 0) + 1
        )
      }
    )

    return Array.from(
      mapa.entries()
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
      .slice(0, 6)
  })

const dadosGraficoTipos =
  computed(() => ({
    labels:
      tiposChamado.value.map(
        item =>
          formatarRotulo(
            item.nome
          )
      ),

    datasets: [
      {
        data:
          tiposChamado.value.map(
            item =>
              item.total
          ),

        backgroundColor:
          tiposChamado.value.map(
            (_, index) => {
              const cores = [
                '#f97316',
                '#fb923c',
                '#fdba74',
                '#3b82f6',
                '#8b5cf6',
                '#22c55e'
              ]

              return cores[index]
            }
          ),

        borderRadius:
          8,

        borderSkipped:
          false,

        barThickness:
          20
      }
    ]
  }))

const opcoesGraficoTipos =
  computed(() => ({
    responsive:
      true,

    maintainAspectRatio:
      false,

    indexAxis:
      'y',

    plugins: {
      legend: {
        display:
          false
      }
    },

    scales: {
      x: {
        beginAtZero:
          true,

        ticks: {
          precision:
            0,

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
          display:
            false
        }
      },

      y: {
        ticks: {
          color:
            $q.dark.isActive
              ? '#cbd5e1'
              : '#475467',

          font: {
            size:
              10,
            weight:
              700
          }
        },

        grid: {
          display:
            false
        },

        border: {
          display:
            false
        }
      }
    }
  }))

/* UTILITÁRIOS */

function normalizarStatus(
  status
) {
  return String(
    status ||
    ''
  )
    .trim()
    .toUpperCase()
}

function normalizarTexto(
  valor
) {
  return String(
    valor ||
    ''
  )
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function contarStatus(
  statusPermitidos
) {
  return chamados.value.filter(
    chamado =>
      statusPermitidos.includes(
        normalizarStatus(
          chamado.status
        )
      )
  ).length
}

function formatarRotulo(
  valor
) {
  return String(valor || '')
    .replaceAll(
      '_',
      ' '
    )
    .toLowerCase()
    .replace(
      /^\w/,
      letra =>
        letra.toUpperCase()
    )
}

/* NAVEGAÇÃO */

async function abrirChamados(
  status = null
) {
  if (!status) {
    await router.push({
      name:
        'produtor-chamados'
    })

    return
  }

  await router.push({
    name:
      'produtor-chamados',

    query: {
      status
    }
  })
}

/* CARREGAR */

async function carregarDados() {
  carregando.value =
    true

  erro.value =
    ''

  try {
    const resposta =
      await chamadoService
        .listar()

    chamados.value =
      Array.isArray(
        resposta
      )
        ? resposta
        : resposta?.chamados ||
          resposta?.data ||
          []
  } catch (error) {
    console.error(
      'Erro ao carregar dashboard:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar o dashboard.'
  } finally {
    carregando.value =
      false
  }
}

onMounted(
  carregarDados
)
</script>

<style scoped>
/* ESTRUTURA GERAL */
.dashboard-page {
  min-height: 100%;
  padding: 18px 22px 40px;
  background: #f5f6f8;
  font-family: inherit;
}

/* BOAS-VINDAS */
.dashboard-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  padding: 19px 22px;
  border: 1px solid #eaecf0;
  border-radius: 20px;
  background: linear-gradient(115deg, #fff 0%, #fff 58%, #fff4e9 100%);
}

.dashboard-hero__identidade {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.dashboard-hero__barra {
  align-self: stretch;
  width: 4px;
  min-height: 54px;
  flex-shrink: 0;
  border-radius: 5px;
  background: #f97316;
}

.dashboard-hero__label {
  color: #ea680f;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.1px;
}

.dashboard-hero__titulo {
  margin-top: 3px;
  color: #17233c;
  font-size: 27px;
  font-weight: 900;
  line-height: 1.2;
}

.dashboard-hero__descricao {
  margin-top: 3px;
  color: #667085;
  font-size: 12px;
}

.dashboard-hero__acoes {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
}

.data-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 205px;
  padding: 9px 12px;
  border: 1px solid #eaecf0;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.92);
}

.data-card__icone {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 11px;
  color: #f97316;
  background: #fff1e6;
}

.data-card span {
  display: block;
  color: #98a2b3;
  font-size: 10px;
  font-weight: 700;
}

.data-card strong {
  display: block;
  margin-top: 1px;
  color: #344054;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.35;
}

.botao-atualizar {
  width: 43px;
  height: 43px;
  color: #fff;
  background: linear-gradient(135deg, #ff9d1f, #f97316);
  box-shadow: 0 5px 13px rgba(249, 115, 22, 0.16);
}

.estado-central {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #667085;
  font-size: 12px;
}

/* TÍTULOS DAS SEÇÕES */
.secao-cabecalho {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 13px;
}

.secao-sobretitulo {
  color: #ed751d;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.1px;
}

.secao-cabecalho h2 {
  margin: 3px 0 0;
  color: #17233c;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
}

.secao-ajuda {
  color: #98a2b3;
  font-size: 11px;
}

.secao-cabecalho--graficos {
  margin-top: 29px;
}

/* CARDS DOS CHAMADOS */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.indicador-card {
  appearance: none;
  min-width: 0;
  position: relative;
  border: 1px solid #e8ebf0;
  border-radius: 20px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.indicador-card:focus-visible {
  outline: 3px solid #fdba74;
  outline-offset: 3px;
}

.indicador-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 26px rgba(16, 24, 40, 0.08);
}

/* CARD PRINCIPAL */
.indicador-card--principal {
  grid-column: span 2;
  min-height: 175px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 17px 19px 15px;
  border-color: #273d60;
  color: #fff;
  background: linear-gradient(128deg, #182943 0%, #243e64 75%, #2b4b75 100%);
}

.indicador-card--principal::before {
  content: '';
  position: absolute;
  right: -45px;
  top: -75px;
  width: 195px;
  height: 195px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.025);
  pointer-events: none;
}

.principal-topo,
.principal-meio,
.principal-rodape {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.principal-topo {
  color: rgba(255, 255, 255, 0.7);
}

.principal-marcador {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.7px;
}

.principal-meio {
  gap: 10px;
  margin: 6px 0 9px;
}

.principal-numero {
  color: #fff;
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
}

.principal-titulo {
  margin-top: 3px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}

.principal-descricao {
  margin-top: 2px;
  color: #b9c8dd;
  font-size: 10px;
}

.principal-ilustracao {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 17px;
  color: #ffa759;
  background: rgba(255,255,255,0.08);
}

.principal-rodape {
  justify-content: flex-start;
  gap: 9px;
  padding-top: 11px;
  border-top: 1px solid rgba(255,255,255,0.13);
  color: #ffe1ca;
  font-size: 11px;
  font-weight: 800;
}

/* QUATRO CARDS MENORES */
.indicador-card--mini {
  min-height: 175px;
  padding: 17px 15px;
  background: #fff;
}

.indicador-card--mini:hover {
  border-color: #fed7aa;
}

.mini-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 13px;
}

.icone-wrapper {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
}

.icone-wrapper.pendente {
  color: #f97316;
  background: #fff1e6;
}

.icone-wrapper.atendimento {
  color: #2563eb;
  background: #eff6ff;
}

.icone-wrapper.finalizado {
  color: #16a34a;
  background: #ecfdf3;
}

.icone-wrapper.cancelado {
  color: #dc2626;
  background: #fff1f2;
}

.indicador-seta {
  color: #b4bdc9;
}

.indicador-numero {
  color: #17233c;
  font-size: 29px;
  font-weight: 900;
  line-height: 1;
}

.indicador-titulo {
  margin-top: 6px;
  color: #344054;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
}

.indicador-descricao {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 10px;
  line-height: 1.35;
}

/* GRÁFICOS */
.dashboard-grid {
  display: grid;
  gap: 13px;
  margin-bottom: 13px;
}

.dashboard-grid--principal {
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.55fr);
}

.dashboard-grid--secundario {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 20px;
  background: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px 9px;
}

.card-header--compacto {
  padding-bottom: 5px;
}

.card-titulo {
  color: #17233c;
  font-size: 15px;
  font-weight: 900;
}

.card-subtitulo {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 10px;
  line-height: 1.45;
}

.card-icone {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  color: #f97316;
  background: #fff1e6;
}

.grafico {
  position: relative;
  height: 244px;
  padding: 7px 15px 16px;
}

.doughnut-area {
  min-height: 245px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 9px 16px 19px;
}

.doughnut-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
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
  color: #17233c;
  font-size: 23px;
  font-weight: 900;
}

.doughnut-centro span {
  color: #98a2b3;
  font-size: 10px;
}

.legenda-status {
  display: grid;
  gap: 11px;
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

.ponto--pendente { background: #f97316; }
.ponto--andamento { background: #3b82f6; }
.ponto--finalizado { background: #22c55e; }
.ponto--cancelado { background: #ef4444; }

.legenda-item strong {
  display: block;
  color: #344054;
  font-size: 12px;
  line-height: 1.2;
}

.legenda-item span:not(.ponto) {
  display: block;
  color: #98a2b3;
  font-size: 10px;
}

.estado-vazio {
  min-height: 245px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #98a2b3;
  text-align: center;
}

.estado-vazio strong {
  color: #475467;
  font-size: 12px;
}

.estado-vazio span {
  max-width: 300px;
  font-size: 11px;
}

/* MODO ESCURO */
.dashboard-page--dark { background: #0d0f12; }

.dashboard-page--dark .dashboard-hero {
  border-color: #292d33;
  background: linear-gradient(110deg, #15181d, #211b17);
}

.dashboard-page--dark .dashboard-hero__titulo,
.dashboard-page--dark .secao-cabecalho h2,
.dashboard-page--dark .indicador-numero,
.dashboard-page--dark .card-titulo,
.dashboard-page--dark .doughnut-centro strong {
  color: #f9fafb;
}

.dashboard-page--dark .dashboard-hero__descricao { color: #a3acbb; }

.dashboard-page--dark .data-card,
.dashboard-page--dark .indicador-card--mini,
.dashboard-page--dark .dashboard-card {
  border-color: #2a2f38;
  background: #15181d;
}

.dashboard-page--dark .data-card strong,
.dashboard-page--dark .indicador-titulo,
.dashboard-page--dark .legenda-item strong,
.dashboard-page--dark .estado-vazio strong {
  color: #f2f4f7;
}

.dashboard-page--dark .indicador-card--principal {
  border-color: #36547e;
  background: linear-gradient(128deg, #203453, #294870);
}

.dashboard-page--dark .indicador-card--principal .principal-numero,
.dashboard-page--dark .indicador-card--principal .principal-titulo {
  color: #fff;
}

/* TABLET E NOTEBOOK */
@media (max-width: 1450px) {
  .cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .dashboard-grid--principal,
  .dashboard-grid--secundario {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1023px) {
  .dashboard-page { padding: 16px 17px 48px; }
  .cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .indicador-card--principal { grid-column: span 2; }
  .dashboard-hero { flex-wrap: wrap; }
}

/* CELULAR - VISUAL COMPACTO DE APLICATIVO */
@media (max-width: 700px) {
  .dashboard-page {
    padding: 16px 14px calc(140px + env(safe-area-inset-bottom, 0px));
  }

  .dashboard-hero {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 20px;
    padding: 0 2px;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  .dashboard-page--dark .dashboard-hero {
    border: none;
    background: transparent;
  }

  .dashboard-hero__identidade { gap: 0; }
  .dashboard-hero__barra { display: none; }

  .dashboard-hero__label {
    font-size: 10px;
    letter-spacing: 1px;
  }

  .dashboard-hero__titulo {
    margin-top: 3px;
    font-size: 25px;
    line-height: 1.25;
  }

  .dashboard-hero__descricao {
    margin-top: 3px;
    font-size: 12px;
  }

  .dashboard-hero__acoes {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .data-card {
    min-width: 0;
    flex: 1;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .dashboard-page--dark .data-card {
    border: 0;
    background: transparent;
  }

  .data-card__icone {
    width: 35px;
    height: 35px;
    border-radius: 11px;
  }

  .data-card strong { font-size: 11px; }
  .botao-atualizar { width: 39px; height: 39px; }

  .secao-cabecalho {
    align-items: flex-end;
    margin-bottom: 11px;
  }

  .secao-cabecalho h2 { font-size: 19px; }
  .secao-ajuda { display: none; }

  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .indicador-card { border-radius: 18px; }
  .indicador-card--principal {
    grid-column: 1 / -1;
    min-height: 165px;
    padding: 16px 18px 14px;
  }

  .principal-numero { font-size: 38px; }
  .principal-ilustracao { width: 52px; height: 52px; }
  .principal-meio { margin: 8px 0 10px; }

  .indicador-card--mini {
    min-height: 144px;
    padding: 14px 14px 13px;
  }

  .mini-topo { margin-bottom: 10px; }
  .icone-wrapper { width: 36px; height: 36px; border-radius: 12px; }
  .indicador-numero { font-size: 28px; }
  .indicador-titulo { font-size: 12px; }
  .indicador-descricao { font-size: 10px; line-height: 1.25; }

  .secao-cabecalho--graficos { margin-top: 25px; }
  .dashboard-grid { gap: 11px; margin-bottom: 11px; }
  .dashboard-grid--principal,
  .dashboard-grid--secundario { grid-template-columns: 1fr; }

  .dashboard-card { border-radius: 18px; }
  .card-header { padding: 16px 16px 8px; }
  .card-titulo { font-size: 15px; }
  .card-subtitulo { font-size: 11px; }
  .grafico { height: 225px; padding: 6px 9px 14px; }
  .doughnut-area {
    min-height: 205px;
    flex-direction: row;
    gap: 15px;
    padding: 14px 15px 17px;
  }
  .doughnut-wrapper { width: 145px; height: 145px; }
  .legenda-item span:not(.ponto) { font-size: 10px; }
  .estado-vazio { min-height: 190px; }
}

/* TELAS PEQUENAS */
@media (max-width: 360px) {
  .dashboard-page { padding-right: 11px; padding-left: 11px; }
  .indicador-card--mini { padding: 12px 11px; }
  .indicador-titulo { font-size: 12px; }
  .indicador-descricao { font-size: 9px; }
  .doughnut-area { gap: 9px; padding-right: 10px; padding-left: 10px; }
  .doughnut-wrapper { width: 125px; height: 125px; }
}

@media (prefers-reduced-motion: reduce) {
  .indicador-card { transition: none; }
}
</style>
