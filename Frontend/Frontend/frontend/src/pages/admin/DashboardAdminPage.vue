<template>
  <q-page
    class="dashboard-page"
    :class="{
      'dashboard-page--dark':
        $q.dark.isActive
    }"
  >
    <!-- ===================================================
         HERO
    ==================================================== -->

    <section class="dashboard-hero">
      <div class="dashboard-hero__identidade">
        <div class="dashboard-hero__barra"></div>

        <div>
          <div class="dashboard-hero__label">
            PAINEL ADMINISTRATIVO
          </div>

          <div class="dashboard-hero__titulo">
            Olá, {{ primeiroNome }} 👋
          </div>

          <div class="dashboard-hero__descricao">
            Acompanhe os principais indicadores da operação em um só lugar.
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
          @click="carregarDashboard"
        >
          <q-tooltip>
            Atualizar dashboard
          </q-tooltip>
        </q-btn>
      </div>
    </section>

    <!-- ===================================================
         CARREGAMENTO
    ==================================================== -->

    <div
      v-if="
        carregando &&
        !carregadoUmaVez
      "
      class="carregamento"
    >
      <q-spinner
        color="orange"
        size="42px"
      />

      <span>
        Carregando informações...
      </span>
    </div>

    <template v-else>
      <!-- =================================================
           INDICADORES
      ================================================== -->

      <section class="indicadores-grid">
        <button
          type="button"
          class="indicador-card"
          @click="abrirChamados()"
        >
          <div class="indicador-icone total">
            <q-icon
              name="confirmation_number"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <strong>
              {{ totalChamados }}
            </strong>

            <span>
              Total de chamados
            </span>

            <small>
              Todos os registros
            </small>
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
          <div class="indicador-icone pendente">
            <q-icon
              name="schedule"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <strong>
              {{ totalPendentes }}
            </strong>

            <span>
              Pendentes
            </span>

            <small>
              Aguardando atendimento
            </small>
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
          @click="abrirChamados('ANDAMENTO')"
        >
          <div class="indicador-icone andamento">
            <q-icon
              name="engineering"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <strong>
              {{ totalAndamento }}
            </strong>

            <span>
              Em andamento
            </span>

            <small>
              Aceitos, em rota ou atendimento
            </small>
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
          <div class="indicador-icone finalizado">
            <q-icon
              name="task_alt"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <strong>
              {{ totalFinalizados }}
            </strong>

            <span>
              Finalizados
            </span>

            <small>
              Atendimentos concluídos
            </small>
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
          <div class="indicador-icone cancelado">
            <q-icon
              name="cancel"
              size="21px"
            />
          </div>

          <div class="indicador-conteudo">
            <strong>
              {{ totalCancelados }}
            </strong>

            <span>
              Cancelados
            </span>

            <small>
              Solicitações canceladas
            </small>
          </div>

          <q-icon
            name="arrow_forward"
            class="indicador-seta"
            size="18px"
          />
        </button>
      </section>

      <!-- ALERTA COMPACTO -->

      <button
        type="button"
        class="alerta-operacional"
        @click="irParaChamados"
      >
        <div class="alerta-operacional__icone">
          <q-icon
            name="priority_high"
            size="20px"
          />
        </div>

        <div class="alerta-operacional__texto">
          <strong>
            {{ totalAltaUrgenciaAberta }}
            {{
              totalAltaUrgenciaAberta === 1
                ? 'chamado de alta urgência'
                : 'chamados de alta urgência'
            }}
          </strong>

          <span>
            em aberto neste momento
          </span>
        </div>

        <div class="alerta-operacional__estrutura">
          <span>
            {{ totalProdutores }} produtores
          </span>

          <i></i>

          <span>
            {{ totalTecnicos }} técnicos ativos
          </span>

          <i></i>

          <span>
            {{ taxaResolucao }}% resolvidos
          </span>
        </div>

        <q-icon
          name="arrow_forward"
          size="19px"
          class="alerta-operacional__seta"
        />
      </button>

      <!-- =================================================
           GRÁFICOS - LINHA 1
      ================================================== -->

      <section class="graficos-grid graficos-grid--principal">
        <article class="grafico-card">
          <div class="grafico-cabecalho">
            <div>
              <div class="grafico-titulo">
                Evolução dos chamados
              </div>

              <div class="grafico-subtitulo">
                Abertos e finalizados nos últimos 6 meses
              </div>
            </div>

            <div class="grafico-icone">
              <q-icon
                name="show_chart"
                size="19px"
              />
            </div>
          </div>

          <div class="grafico-area grafico-area--linha">
            <Line
              :data="dadosGraficoMensal"
              :options="opcoesGraficoMensal"
            />
          </div>
        </article>

        <article class="grafico-card">
          <div class="grafico-cabecalho">
            <div>
              <div class="grafico-titulo">
                Chamados por status
              </div>

              <div class="grafico-subtitulo">
                Distribuição atual da operação
              </div>
            </div>

            <div class="grafico-icone">
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
                  <strong>{{ totalAndamento }}</strong>
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

      <!-- =================================================
           GRÁFICOS - LINHA 2
      ================================================== -->

      <section class="graficos-grid graficos-grid--duplo">
        <article class="grafico-card">
          <div class="grafico-cabecalho">
            <div>
              <div class="grafico-titulo">
                Chamados por urgência
              </div>

              <div class="grafico-subtitulo">
                Distribuição das prioridades registradas
              </div>
            </div>

            <div class="grafico-icone">
              <q-icon
                name="priority_high"
                size="19px"
              />
            </div>
          </div>

          <div class="grafico-area">
            <Bar
              :data="dadosGraficoUrgencia"
              :options="opcoesGraficoUrgencia"
            />
          </div>
        </article>

        <article class="grafico-card">
          <div class="grafico-cabecalho">
            <div>
              <div class="grafico-titulo">
                Chamados em aberto por técnico
              </div>

              <div class="grafico-subtitulo">
                Distribuição da carga atual da equipe
              </div>
            </div>

            <div class="grafico-icone">
              <q-icon
                name="engineering"
                size="19px"
              />
            </div>
          </div>

          <div
            v-if="cargaTecnicos.length"
            class="grafico-area"
          >
            <Bar
              :data="dadosGraficoTecnicos"
              :options="opcoesGraficoTecnicos"
            />
          </div>

          <div
            v-else
            class="estado-vazio"
          >
            <q-icon
              name="engineering"
              size="30px"
              color="grey-5"
            />

            <strong>
              Nenhum chamado atribuído
            </strong>

            <span>
              O gráfico será preenchido conforme os chamados forem aceitos.
            </span>
          </div>
        </article>
      </section>

      <!-- =================================================
           GRÁFICO PRODUTORES
      ================================================== -->

      <section class="grafico-card grafico-card--largura-total">
        <div class="grafico-cabecalho">
          <div>
            <div class="grafico-titulo">
              Produtores com mais chamados
            </div>

            <div class="grafico-subtitulo">
              Quantidade de solicitações registradas por produtor
            </div>
          </div>

          <div class="grafico-icone">
            <q-icon
              name="agriculture"
              size="19px"
            />
          </div>
        </div>

        <div
          v-if="chamadosPorProdutor.length"
          class="grafico-area grafico-area--produtores"
        >
          <Bar
            :data="dadosGraficoProdutores"
            :options="opcoesGraficoProdutores"
          />
        </div>

        <div
          v-else
          class="estado-vazio"
        >
          <q-icon
            name="agriculture"
            size="30px"
            color="grey-5"
          />

          <strong>
            Sem dados de produtores
          </strong>
        </div>
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
  useQuasar
} from 'quasar'

import {
  useRouter
} from 'vue-router'

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

import usuarioService from
  'src/services/usuarioService'

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

const chamados = ref([])
const usuarios = ref([])

/* =========================================================
   IDENTIFICAÇÃO / DATA
========================================================= */

const primeiroNome =
  computed(() => {
    const nome =
      String(
        authStore.usuario?.nome ||
        authStore.nomeUsuario ||
        'Administrador'
      ).trim()

    return (
      nome.split(/\s+/)[0] ||
      'Administrador'
    )
  })

const dataAtual =
  computed(() => {
    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
      }
    ).format(new Date())
  })

/* =========================================================
   NORMALIZAÇÃO
========================================================= */

function statusNormalizado(status) {
  return String(status || '')
    .trim()
    .toUpperCase()
}

function urgenciaNormalizada(urgencia) {
  return String(urgencia || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function tipoUsuarioNormalizado(tipo) {
  return String(tipo || '')
    .trim()
    .toUpperCase()
}

const statusEmAndamento = [
  'ACEITO',
  'EM_ROTA',
  'EM_ATENDIMENTO',
  'AGUARDANDO_CONFIRMACAO'
]

function chamadoAberto(chamado) {
  return ![
    'FINALIZADO',
    'CANCELADO'
  ].includes(
    statusNormalizado(
      chamado.status
    )
  )
}

/* =========================================================
   INDICADORES
========================================================= */

const totalChamados =
  computed(() =>
    chamados.value.length
  )

const totalPendentes =
  computed(() =>
    chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'PENDENTE'
    ).length
  )

const totalAndamento =
  computed(() =>
    chamados.value.filter(
      chamado =>
        statusEmAndamento.includes(
          statusNormalizado(
            chamado.status
          )
        )
    ).length
  )

const totalFinalizados =
  computed(() =>
    chamados.value.filter(
      chamado =>
        [
          'FINALIZADO',
          'CONCLUIDO'
        ].includes(
          statusNormalizado(
            chamado.status
          )
        )
    ).length
  )

const totalCancelados =
  computed(() =>
    chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'CANCELADO'
    ).length
  )

const totalAltaUrgenciaAberta =
  computed(() =>
    chamados.value.filter(
      chamado =>
        chamadoAberto(chamado) &&
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'ALTA'
    ).length
  )

const taxaResolucao =
  computed(() => {
    if (!totalChamados.value) {
      return 0
    }

    return Math.round(
      (
        totalFinalizados.value /
        totalChamados.value
      ) * 100
    )
  })

/* =========================================================
   USUÁRIOS
========================================================= */

const tecnicosAtivos =
  computed(() =>
    usuarios.value.filter(
      usuario =>
        [
          'FUNCIONARIO',
          'TECNICO'
        ].includes(
          tipoUsuarioNormalizado(
            usuario.tipo_usuario
          )
        ) &&
        usuario.ativo !== false
    )
  )

const totalTecnicos =
  computed(() =>
    tecnicosAtivos.value.length
  )

const totalProdutores =
  computed(() =>
    usuarios.value.filter(
      usuario =>
        tipoUsuarioNormalizado(
          usuario.tipo_usuario
        ) === 'PRODUTOR' &&
        usuario.ativo !== false
    ).length
  )

/* =========================================================
   GRÁFICO STATUS
========================================================= */

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
          totalAndamento.value,
          totalFinalizados.value,
          totalCancelados.value
        ],

        backgroundColor: [
          '#f97316',
          '#3b82f6',
          '#22c55e',
          '#ef4444'
        ],

        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  }))

const opcoesGraficoStatus =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',

    plugins: {
      legend: {
        display: false
      }
    }
  }))

/* =========================================================
   EVOLUÇÃO MENSAL
========================================================= */

const mesesGrafico =
  computed(() => {
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

const chamadosAbertosPorMes =
  computed(() =>
    mesesGrafico.value.map(
      periodo =>
        chamados.value.filter(
          chamado => {
            const data =
              new Date(
                chamado.data_abertura ||
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

const chamadosFinalizadosPorMes =
  computed(() =>
    mesesGrafico.value.map(
      periodo =>
        chamados.value.filter(
          chamado => {
            if (
              ![
                'FINALIZADO',
                'CONCLUIDO'
              ].includes(
                statusNormalizado(
                  chamado.status
                )
              )
            ) {
              return false
            }

            const valorData =
              chamado.data_finalizacao ||
              chamado.data_fechamento ||
              chamado.data_relatorio ||
              chamado.data_abertura

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
        item => item.label
      ),

    datasets: [
      {
        label: 'Abertos',
        data: chamadosAbertosPorMes.value,

        borderColor: '#f97316',

        backgroundColor:
          'rgba(249, 115, 22, 0.12)',

        pointBackgroundColor:
          '#f97316',

        pointBorderColor:
          '#ffffff',

        pointBorderWidth: 2,
        pointRadius: 3,

        borderWidth: 3,
        tension: 0.35,
        fill: true
      },
      {
        label: 'Finalizados',
        data:
          chamadosFinalizadosPorMes.value,

        borderColor: '#22c55e',

        backgroundColor:
          'rgba(34, 197, 94, 0.04)',

        pointBackgroundColor:
          '#22c55e',

        pointBorderColor:
          '#ffffff',

        pointBorderWidth: 2,
        pointRadius: 3,

        borderWidth: 2,
        tension: 0.35,
        fill: false
      }
    ]
  }))

const opcoesGraficoMensal =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: 'index'
    },

    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',

        labels: {
          usePointStyle: true,
          boxWidth: 7,

          color:
            $q.dark.isActive
              ? '#cbd5e1'
              : '#667085',

          font: {
            size: 9
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

/* =========================================================
   URGÊNCIA
========================================================= */

const totaisUrgencia =
  computed(() => {
    const totais = {
      BAIXA: 0,
      MEDIA: 0,
      ALTA: 0
    }

    chamados.value.forEach(
      chamado => {
        const valor =
          urgenciaNormalizada(
            chamado.urgencia
          )

        if (
          Object.prototype
            .hasOwnProperty.call(
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
        barThickness: 27
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

/* =========================================================
   CARGA POR TÉCNICO
========================================================= */

function nomeTecnicoChamado(chamado) {
  const nomeDireto =
    chamado.nome_funcionario ||
    chamado.nome_tecnico ||
    chamado.funcionario_nome ||
    chamado.tecnico_nome

  if (nomeDireto) {
    return String(nomeDireto)
  }

  const idTecnico =
    chamado.id_funcionario ||
    chamado.id_tecnico ||
    chamado.id_usuario_tecnico ||
    chamado.id_usuario_responsavel

  if (idTecnico) {
    const usuario =
      tecnicosAtivos.value.find(
        item =>
          Number(item.id_usuario) ===
          Number(idTecnico)
      )

    if (usuario?.nome) {
      return usuario.nome
    }

    return `Técnico #${idTecnico}`
  }

  return 'Sem técnico'
}

const cargaTecnicos =
  computed(() => {
    const mapa = new Map()

    chamados.value
      .filter(chamadoAberto)
      .filter(
        chamado =>
          statusNormalizado(
            chamado.status
          ) !== 'PENDENTE'
      )
      .forEach(
        chamado => {
          const nome =
            nomeTecnicoChamado(
              chamado
            )

          mapa.set(
            nome,
            (mapa.get(nome) || 0) + 1
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
      .slice(0, 7)
  })

const dadosGraficoTecnicos =
  computed(() => ({
    labels:
      cargaTecnicos.value.map(
        item => item.nome
      ),

    datasets: [
      {
        data:
          cargaTecnicos.value.map(
            item => item.total
          ),

        backgroundColor:
          '#f97316',

        borderRadius: 8,
        borderSkipped: false,
        barThickness: 19
      }
    ]
  }))

const opcoesGraficoTecnicos =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',

    plugins: {
      legend: {
        display: false
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
            size: 9,
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

/* =========================================================
   CHAMADOS POR PRODUTOR
========================================================= */

const chamadosPorProdutor =
  computed(() => {
    const mapa = new Map()

    chamados.value.forEach(
      chamado => {
        const nome =
          String(
            chamado.nome_produtor ||
            chamado.produtor_nome ||
            'Não informado'
          ).trim()

        mapa.set(
          nome,
          (mapa.get(nome) || 0) + 1
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
      .slice(0, 8)
  })

const dadosGraficoProdutores =
  computed(() => ({
    labels:
      chamadosPorProdutor.value.map(
        item => item.nome
      ),

    datasets: [
      {
        data:
          chamadosPorProdutor.value.map(
            item => item.total
          ),

        backgroundColor:
          '#3b82f6',

        borderRadius: 8,
        borderSkipped: false,
        barThickness: 18
      }
    ]
  }))

const opcoesGraficoProdutores =
  computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',

    plugins: {
      legend: {
        display: false
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
            size: 9,
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

/* =========================================================
   API
========================================================= */

async function carregarDashboard() {
  carregando.value = true

  try {
    const [
      listaChamados,
      listaUsuarios
    ] = await Promise.all([
      chamadoService.listar(),
      usuarioService.listar()
    ])

    chamados.value =
      Array.isArray(
        listaChamados
      )
        ? listaChamados
        : listaChamados?.data ||
          listaChamados?.chamados ||
          []

    usuarios.value =
      Array.isArray(
        listaUsuarios
      )
        ? listaUsuarios
        : listaUsuarios?.data ||
          listaUsuarios?.usuarios ||
          []

    carregadoUmaVez.value = true
  } catch (error) {
    console.error(
      'Erro ao carregar dashboard:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar o dashboard.'
    })
  } finally {
    carregando.value = false
  }
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirChamados(status = null) {
  if (!status) {
    router.push({
      name: 'admin-chamados'
    })

    return
  }

  router.push({
    name: 'admin-chamados',

    query: {
      status
    }
  })
}

function irParaChamados() {
  router.push({
    name: 'admin-chamados'
  })
}

onMounted(
  carregarDashboard
)
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;

  padding: 14px 20px 28px;

  background: #f5f6f8;
}

/* =========================================================
   HERO
========================================================= */

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

/* =========================================================
   CARREGAMENTO
========================================================= */

.carregamento {
  min-height: 350px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #98a2b3;

  font-size: 11px;
}

/* =========================================================
   INDICADORES
========================================================= */

.indicadores-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 10px;

  margin-bottom: 10px;
}

.indicador-card {
  appearance: none;

  min-width: 0;
  min-height: 104px;

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

.indicador-icone {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
}

.indicador-icone.total {
  color: #f97316;
  background: #fff1e6;
}

.indicador-icone.pendente {
  color: #d97706;
  background: #fffbeb;
}

.indicador-icone.andamento {
  color: #2563eb;
  background: #eff6ff;
}

.indicador-icone.finalizado {
  color: #16a34a;
  background: #f0fdf4;
}

.indicador-icone.cancelado {
  color: #dc2626;
  background: #fef2f2;
}

.indicador-conteudo {
  min-width: 0;
}

.indicador-conteudo strong {
  display: block;

  color: #101828;

  font-size: 24px;
  font-weight: 900;

  line-height: 1;
}

.indicador-conteudo span {
  display: block;

  margin-top: 4px;

  color: #344054;

  font-size: 9px;
  font-weight: 800;
}

.indicador-conteudo small {
  display: block;

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

/* =========================================================
   ALERTA OPERACIONAL
========================================================= */

.alerta-operacional {
  appearance: none;

  width: 100%;
  min-height: 50px;

  display: grid;

  grid-template-columns:
    34px
    minmax(220px, 1fr)
    auto
    18px;

  align-items: center;

  gap: 10px;

  margin-bottom: 12px;
  padding: 8px 12px;

  border: 1px solid #fed7aa;
  border-radius: 12px;

  color: inherit;

  background:
    linear-gradient(
      90deg,
      #fffaf5 0%,
      #ffffff 100%
    );

  font-family: inherit;
  text-align: left;

  cursor: pointer;
}

.alerta-operacional__icone {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  color: #dc2626;
  background: #fef2f2;
}

.alerta-operacional__texto strong {
  color: #344054;

  font-size: 9px;
  font-weight: 900;
}

.alerta-operacional__texto span {
  margin-left: 4px;

  color: #98a2b3;

  font-size: 8px;
}

.alerta-operacional__estrutura {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #667085;

  font-size: 8px;
  font-weight: 700;
}

.alerta-operacional__estrutura i {
  width: 3px;
  height: 3px;

  border-radius: 50%;

  background: #d0d5dd;
}

.alerta-operacional__seta {
  color: #f97316;
}

/* =========================================================
   CARDS DE GRÁFICOS
========================================================= */

.graficos-grid {
  display: grid;

  gap: 12px;

  margin-bottom: 12px;
}

.graficos-grid--principal {
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(330px, 0.55fr);
}

.graficos-grid--duplo {
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.grafico-card {
  min-width: 0;

  overflow: hidden;

  border: 1px solid #eaecf0;
  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.grafico-card--largura-total {
  margin-bottom: 4px;
}

.grafico-cabecalho {
  min-height: 57px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  padding: 13px 16px 8px;
}

.grafico-titulo {
  color: #101828;

  font-size: 13px;
  font-weight: 900;
}

.grafico-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
}

.grafico-icone {
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

.grafico-area {
  height: 240px;

  padding: 3px 15px 14px;
}

.grafico-area--linha {
  height: 255px;
}

.grafico-area--produtores {
  height: 265px;
}

/* =========================================================
   DOUGHNUT
========================================================= */

.doughnut-area {
  min-height: 255px;

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

/* =========================================================
   VAZIO
========================================================= */

.estado-vazio {
  min-height: 240px;

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

/* =========================================================
   DARK
========================================================= */

.dashboard-page--dark {
  background: #0d0f12;
}

.dashboard-page--dark
.dashboard-hero {
  border-color: #292d33;

  background:
    linear-gradient(
      110deg,
      #15181d 0%,
      #15181d 62%,
      #211b17 100%
    );
}

.dashboard-page--dark
.dashboard-hero__titulo,
.dashboard-page--dark
.indicador-conteudo strong,
.dashboard-page--dark
.grafico-titulo,
.dashboard-page--dark
.doughnut-centro strong,
.dashboard-page--dark
.legenda-item strong {
  color: #f9fafb;
}

.dashboard-page--dark
.data-card,
.dashboard-page--dark
.indicador-card,
.dashboard-page--dark
.grafico-card {
  border-color: #292d33;

  background: #15181d;
}

.dashboard-page--dark
.data-card {
  background: #191d23;
}

.dashboard-page--dark
.data-card strong,
.dashboard-page--dark
.indicador-conteudo span,
.dashboard-page--dark
.alerta-operacional__texto strong {
  color: #f2f4f7;
}

.dashboard-page--dark
.alerta-operacional {
  border-color: #4b3526;

  background:
    linear-gradient(
      90deg,
      #211b17 0%,
      #15181d 100%
    );
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1350px) {
  .indicadores-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .graficos-grid--principal,
  .graficos-grid--duplo {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1023px) {
  .dashboard-page {
    padding: 14px 14px 34px;
  }

  .indicadores-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .alerta-operacional {
    grid-template-columns:
      34px
      minmax(0, 1fr)
      18px;
  }

  .alerta-operacional__estrutura {
    display: none;
  }
}

/* Layout compacto do painel administrativo no celular. */
@media (max-width: 700px) {
  .dashboard-page {
    padding: 12px 12px calc(135px + env(safe-area-inset-bottom, 0px));
  }

  .dashboard-hero {
    min-height: 0;
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    margin-bottom: 10px;
  }

  .dashboard-hero__identidade {
    gap: 9px;
  }

  .dashboard-hero__barra {
    height: 35px;
  }

  .dashboard-hero__label,
  .dashboard-hero__descricao {
    display: none;
  }

  .dashboard-hero__titulo {
    font-size: 19px;
    line-height: 1.2;
  }

  .dashboard-hero__acoes {
    width: 100%;
    gap: 8px;
  }

  .data-card {
    flex: 1;
    min-width: 0;
    padding: 7px 9px;
  }

  .data-card strong {
    font-size: 11px;
    overflow-wrap: anywhere;
  }

  .botao-atualizar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  /* Mantém dois indicadores por linha, sem rolagem horizontal. */
  .indicadores-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
    margin-bottom: 10px;
  }

  .indicador-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    min-width: 0;
    min-height: 114px;
    padding: 12px;
    border-radius: 14px;
  }

  .indicador-icone {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .indicador-icone :deep(.q-icon) {
    font-size: 20px !important;
  }

  .indicador-conteudo {
    width: 100%;
  }

  .indicador-conteudo strong {
    font-size: 25px;
  }

  .indicador-conteudo span {
    margin-top: 4px;
    font-size: 11px;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .indicador-conteudo small,
  .indicador-seta {
    display: none;
  }

  .alerta-operacional {
    grid-template-columns: 34px minmax(0, 1fr) 18px;
    min-height: 62px;
    gap: 9px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .alerta-operacional__texto strong,
  .alerta-operacional__texto span {
    display: block;
    margin-left: 0;
    font-size: 10px;
    line-height: 1.45;
  }

  .graficos-grid {
    gap: 10px;
    margin-bottom: 10px;
  }

  .grafico-card {
    border-radius: 14px;
  }

  .grafico-cabecalho {
    padding: 12px 12px 7px;
    min-height: 0;
  }

  .grafico-titulo {
    font-size: 13px;
  }

  .grafico-subtitulo {
    font-size: 10px;
    line-height: 1.35;
  }

  .grafico-area {
    height: 218px;
    padding: 5px 8px 12px;
  }

  .grafico-area--linha {
    height: 230px;
  }

  .grafico-area--produtores {
    height: 250px;
  }

  /* Rosca e legenda na mesma linha para reduzir a altura. */
  .doughnut-area {
    flex-direction: row;
    min-height: 185px;
    justify-content: center;
    gap: 12px;
    padding: 8px 12px 16px;
  }

  .doughnut-wrapper {
    width: 138px;
    height: 138px;
  }

  .doughnut-centro strong {
    font-size: 23px;
  }

  .doughnut-centro span {
    font-size: 9px;
  }

  .legenda-status {
    min-width: 0;
    gap: 8px;
  }

  .legenda-item strong {
    font-size: 12px;
  }

  .legenda-item span:not(.ponto) {
    font-size: 10px;
    line-height: 1.2;
  }
}

@media (max-width: 360px) {
  .indicador-card {
    padding: 10px;
  }

  .doughnut-area {
    gap: 8px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .doughnut-wrapper {
    width: 112px;
    height: 112px;
  }
}
</style>
