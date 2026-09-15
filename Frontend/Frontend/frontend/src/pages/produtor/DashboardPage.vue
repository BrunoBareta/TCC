<template>
  <q-page
    class="dashboard-page"
    :class="{ 'dashboard-page--dark': $q.dark.isActive }"
  >
    <!-- HERO -->
    <section class="dashboard-hero">
      <div class="dashboard-hero__identidade">
        <div class="dashboard-hero__barra"></div>

        <div>
          <div class="dashboard-hero__label">
            PAINEL DO PRODUTOR
          </div>

          <div class="dashboard-hero__titulo">
            Olá, {{ primeiroNome }} 👋
          </div>

          <div class="dashboard-hero__descricao">
            Acompanhe os indicadores e a evolução dos seus chamados.
          </div>
        </div>
      </div>

      <div class="dashboard-hero__acoes">
        <div class="data-card">
          <div class="data-card__icone">
            <q-icon
              name="calendar_month"
              size="19px"
            />
          </div>

          <div>
            <span>Hoje</span>
            <strong>
              {{ dataAtual }}
            </strong>
          </div>
        </div>

        <q-btn
          unelevated
          round
          class="botao-atualizar"
          icon="refresh"
          :loading="carregando"
          @click="carregarDados"
        >
          <q-tooltip>
            Atualizar dashboard
          </q-tooltip>
        </q-btn>
      </div>
    </section>

    <!-- CARREGANDO -->
    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner
        color="orange"
        size="42px"
      />

      <span>
        Carregando dashboard...
      </span>
    </div>

    <!-- ERRO -->
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
      <!-- INDICADORES -->
      <section class="cards-grid">
        <button
          type="button"
          class="indicador-card"
          @click="abrirChamados()"
        >
          <div class="icone-wrapper total">
            <q-icon
              name="confirmation_number"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalChamados }}
            </div>

            <div class="indicador-titulo">
              Total de chamados
            </div>

            <div class="indicador-descricao">
              Todos os registros
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
          class="indicador-card"
          @click="abrirChamados('PENDENTE')"
        >
          <div class="icone-wrapper pendente">
            <q-icon
              name="schedule"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalPendentes }}
            </div>

            <div class="indicador-titulo">
              Pendentes
            </div>

            <div class="indicador-descricao">
              Aguardando atendimento
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
          class="indicador-card"
          @click="abrirChamados('EM_ATENDIMENTO')"
        >
          <div class="icone-wrapper atendimento">
            <q-icon
              name="engineering"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalEmAndamento }}
            </div>

            <div class="indicador-titulo">
              Em andamento
            </div>

            <div class="indicador-descricao">
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
          class="indicador-card"
          @click="abrirChamados('FINALIZADO')"
        >
          <div class="icone-wrapper finalizado">
            <q-icon
              name="task_alt"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalFinalizados }}
            </div>

            <div class="indicador-titulo">
              Finalizados
            </div>

            <div class="indicador-descricao">
              Atendimentos concluídos
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
          class="indicador-card"
          @click="abrirChamados('CANCELADO')"
        >
          <div class="icone-wrapper cancelado">
            <q-icon
              name="cancel"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <div class="indicador-numero">
              {{ totalCancelados }}
            </div>

            <div class="indicador-titulo">
              Cancelados
            </div>

            <div class="indicador-descricao">
              Chamados cancelados
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>
      </section>

      <!-- LINHA 1 DE GRÁFICOS -->
      <section class="dashboard-grid dashboard-grid--principal">
        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Evolução dos chamados
              </div>

              <div class="card-subtitulo">
                Abertos e finalizados nos últimos 6 meses
              </div>
            </div>

            <div class="card-icone">
              <q-icon
                name="show_chart"
                size="19px"
              />
            </div>
          </div>

          <div class="grafico grafico--linha">
            <Line
              :data="dadosGraficoMensal"
              :options="opcoesGraficoMensal"
            />
          </div>
        </article>

        <article class="dashboard-card">
          <div class="card-header card-header--compacto">
            <div>
              <div class="card-titulo">
                Chamados por status
              </div>

              <div class="card-subtitulo">
                Distribuição atual dos seus chamados
              </div>
            </div>

            <div class="card-icone">
              <q-icon
                name="donut_large"
                size="19px"
              />
            </div>
          </div>

          <div class="doughnut-area">
            <div class="doughnut-wrapper">
              <Doughnut
                :data="dadosGraficoStatus"
                :options="opcoesGraficoStatus"
              />

              <div class="doughnut-centro">
                <strong>
                  {{ totalChamados }}
                </strong>

                <span>
                  chamados
                </span>
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

      <!-- LINHA 2 DE GRÁFICOS -->
      <section class="dashboard-grid dashboard-grid--secundario">
        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Chamados por urgência
              </div>

              <div class="card-subtitulo">
                Distribuição das prioridades registradas
              </div>
            </div>

            <div class="card-icone">
              <q-icon
                name="priority_high"
                size="19px"
              />
            </div>
          </div>

          <div
            v-if="totalComUrgencia > 0"
            class="grafico grafico--barra"
          >
            <Bar
              :data="dadosGraficoUrgencia"
              :options="opcoesGraficoUrgencia"
            />
          </div>

          <div
            v-else
            class="estado-vazio"
          >
            <q-icon
              name="bar_chart"
              size="30px"
              color="grey-5"
            />

            <strong>
              Sem dados de urgência
            </strong>

            <span>
              O gráfico será preenchido conforme novos chamados forem registrados.
            </span>
          </div>
        </article>

        <article class="dashboard-card">
          <div class="card-header">
            <div>
              <div class="card-titulo">
                Tipos de chamado
              </div>

              <div class="card-subtitulo">
                Motivos mais frequentes das suas solicitações
              </div>
            </div>

            <div class="card-icone">
              <q-icon
                name="category"
                size="19px"
              />
            </div>
          </div>

          <div
            v-if="tiposChamado.length > 0"
            class="grafico grafico--barra"
          >
            <Bar
              :data="dadosGraficoTipos"
              :options="opcoesGraficoTipos"
            />
          </div>

          <div
            v-else
            class="estado-vazio"
          >
            <q-icon
              name="category"
              size="30px"
              color="grey-5"
            />

            <strong>
              Sem tipos de chamado para comparar
            </strong>

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
      'AGUARDANDO_CONFIRMACAO'
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
.dashboard-page {
  min-height: 100%;

  padding: 14px 20px 26px;

  background: #f5f6f8;
}

/* HERO */

.dashboard-hero {
  min-height: 82px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

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

  background:
    rgba(
      255,
      255,
      255,
      0.92
    );
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

/* CARREGAMENTO */

.estado-central {
  min-height: 360px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #98a2b3;

  font-size: 11px;
}

/* INDICADORES */

.cards-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 10px;

  margin-bottom: 12px;
}

.indicador-card {
  appearance: none;

  min-width: 0;
  min-height: 105px;

  display: grid;

  grid-template-columns:
    40px
    minmax(0, 1fr)
    18px;

  align-items: center;

  gap: 10px;

  padding: 12px 13px;

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

.indicador-card:hover {
  transform: translateY(-2px);

  border-color: #fed7aa;

  box-shadow:
    0 8px 22px
    rgba(16, 24, 40, 0.075);
}

.icone-wrapper {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
}

.icone-wrapper.total {
  color: #344054;
  background: #f2f4f7;
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
  background: #f0fdf4;
}

.icone-wrapper.cancelado {
  color: #dc2626;
  background: #fef2f2;
}

.indicador-numero {
  color: #101828;

  font-size: 25px;
  font-weight: 900;

  line-height: 1;
}

.indicador-titulo {
  margin-top: 4px;

  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.indicador-descricao {
  overflow: hidden;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.indicador-seta {
  color: #c5c9d0;
}

/* CARDS DE GRÁFICOS */

.dashboard-grid {
  display: grid;

  gap: 12px;

  margin-bottom: 12px;
}

.dashboard-grid--principal {
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(330px, 0.55fr);
}

.dashboard-grid--secundario {
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.dashboard-card {
  min-width: 0;

  overflow: hidden;

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

.grafico {
  height: 245px;

  padding: 4px 15px 14px;
}

/* DOUGHNUT */

.doughnut-area {
  min-height: 245px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 16px;

  padding: 2px 13px 13px;
}

.doughnut-wrapper {
  position: relative;

  width: 155px;
  height: 155px;

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

.ponto--pendente {
  background: #f97316;
}

.ponto--andamento {
  background: #3b82f6;
}

.ponto--finalizado {
  background: #22c55e;
}

.ponto--cancelado {
  background: #ef4444;
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

/* VAZIO */

.estado-vazio {
  min-height: 245px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 5px;

  padding: 20px;

  color: #98a2b3;

  text-align: center;
}

.estado-vazio strong {
  color: #475467;

  font-size: 10px;
}

.estado-vazio span {
  max-width: 300px;

  font-size: 8px;
}

/* DARK */

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
.dashboard-page--dark .indicador-titulo,
.dashboard-page--dark .legenda-item strong,
.dashboard-page--dark .estado-vazio strong {
  color: #f2f4f7;
}

/* RESPONSIVO */

@media (max-width: 1350px) {
  .cards-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .dashboard-grid--principal,
  .dashboard-grid--secundario {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1023px) {
  .dashboard-page {
    padding: 14px 14px 34px;
  }

  .cards-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dashboard-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-hero__label,
  .dashboard-hero__descricao {
    display: none;
  }

  .dashboard-hero__titulo {
    font-size: 20px;
  }

  .dashboard-hero__acoes {
    width: 100%;
  }

  .data-card {
    flex: 1;
    min-width: 0;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .indicador-card {
    min-height: 92px;
  }

  .doughnut-area {
    flex-direction: column;
  }
}
</style>
