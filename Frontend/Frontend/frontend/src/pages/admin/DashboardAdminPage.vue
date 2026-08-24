<template>

  <q-page

    class="dashboard-page"

    :class="{

      'dashboard-page--dark': $q.dark.isActive

    }"

  >

    <!-- =====================================================

         CABEÇALHO

    ====================================================== -->

    <div class="dashboard-header">

      <div>

        <div class="saudacao">

          Olá, {{ primeiroNome }} 👋

        </div>

        <div class="descricao">

          Veja um resumo visual dos atendimentos da Avioeste.

        </div>

      </div>

      <div class="header-actions">

        <div class="data-card">

          <q-icon

            name="calendar_month"

            size="19px"

          />

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

          <q-tooltip>

            Atualizar dashboard

          </q-tooltip>

        </q-btn>

      </div>

    </div>

    <!-- =====================================================

         CARREGAMENTO INICIAL

    ====================================================== -->

    <div

      v-if="carregando && !carregadoUmaVez"

      class="carregamento-inicial"

    >

      <q-spinner

        color="orange"

        size="45px"

      />

      <span>

        Carregando indicadores...

      </span>

    </div>

    <template v-else>

      <!-- =====================================================

           INDICADORES PRINCIPAIS

      ====================================================== -->

      <div class="indicadores-grid">

        <!-- TOTAL -->

        <div
          class="indicador-card indicador-card--clicavel"
          role="button"
          tabindex="0"
          @click="abrirChamados()"
          @keyup.enter="abrirChamados()"
        >

          <div class="indicador-topo">

            <div class="indicador-icone indicador-icone--laranja">

              <q-icon

                name="confirmation_number"

                size="25px"

              />

            </div>

            <div class="indicador-tendencia">

              Todos

            </div>

          </div>

          <div class="indicador-numero">

            {{ totalChamados }}

          </div>

          <div class="indicador-label">

            Total de chamados

          </div>

          <div class="indicador-rodape">

            Todos os atendimentos registrados

          </div>

        </div>

        <!-- PENDENTES -->

        <div
          class="indicador-card indicador-card--clicavel"
          role="button"
          tabindex="0"
          @click="abrirChamados('PENDENTE')"
          @keyup.enter="abrirChamados('PENDENTE')"
        >

          <div class="indicador-topo">

            <div class="indicador-icone indicador-icone--amarelo">

              <q-icon

                name="schedule"

                size="25px"

              />

            </div>

            <div class="indicador-tendencia">

              Aguardando

            </div>

          </div>

          <div class="indicador-numero">

            {{ totalPendentes }}

          </div>

          <div class="indicador-label">

            Pendentes

          </div>

          <div class="indicador-rodape">

            Precisam ser assumidos

          </div>

        </div>

        <!-- EM ANDAMENTO -->

        <div
          class="indicador-card indicador-card--clicavel"
          role="button"
          tabindex="0"
          @click="abrirChamados('ANDAMENTO')"
          @keyup.enter="abrirChamados('ANDAMENTO')"
        >

          <div class="indicador-topo">

            <div class="indicador-icone indicador-icone--azul">

              <q-icon

                name="engineering"

                size="25px"

              />

            </div>

            <div class="indicador-tendencia">

              Ativos

            </div>

          </div>

          <div class="indicador-numero">

            {{ totalAndamento }}

          </div>

          <div class="indicador-label">

            Em andamento

          </div>

          <div class="indicador-rodape">

            Com atendimento em curso

          </div>

        </div>

        <!-- FINALIZADOS -->

        <div
          class="indicador-card indicador-card--clicavel"
          role="button"
          tabindex="0"
          @click="abrirChamados('FINALIZADO')"
          @keyup.enter="abrirChamados('FINALIZADO')"
        >

          <div class="indicador-topo">

            <div class="indicador-icone indicador-icone--verde">

              <q-icon

                name="task_alt"

                size="25px"

              />

            </div>

            <div class="indicador-tendencia">

              {{ taxaResolucao }}%

            </div>

          </div>

          <div class="indicador-numero">

            {{ totalFinalizados }}

          </div>

          <div class="indicador-label">

            Finalizados

          </div>

          <div class="indicador-rodape">

            Taxa de resolução dos chamados

          </div>

        </div>

      </div>

      <!-- =====================================================

           PRIMEIRA LINHA DE GRÁFICOS

      ====================================================== -->

      <div class="graficos-grid graficos-grid--principal">

        <!-- STATUS -->

        <div class="dashboard-card grafico-card">

          <div class="card-header">

            <div>

              <div class="card-titulo">

                Status dos chamados

              </div>

              <div class="card-subtitulo">

                Distribuição geral dos atendimentos

              </div>

            </div>

            <div class="card-icone">

              <q-icon

                name="donut_large"

                size="20px"

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

                  <strong>

                    {{ totalPendentes }}

                  </strong>

                  <span>

                    Pendentes

                  </span>

                </div>

              </div>

              <div class="legenda-item">

                <span class="ponto ponto--andamento"></span>

                <div>

                  <strong>

                    {{ totalAndamento }}

                  </strong>

                  <span>

                    Em andamento

                  </span>

                </div>

              </div>

              <div class="legenda-item">

                <span class="ponto ponto--finalizado"></span>

                <div>

                  <strong>

                    {{ totalFinalizados }}

                  </strong>

                  <span>

                    Finalizados

                  </span>

                </div>

              </div>

              <div class="legenda-item">

                <span class="ponto ponto--cancelado"></span>

                <div>

                  <strong>

                    {{ totalCancelados }}

                  </strong>

                  <span>

                    Cancelados

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- URGÊNCIA -->

        <div class="dashboard-card grafico-card">

          <div class="card-header">

            <div>

              <div class="card-titulo">

                Chamados por urgência

              </div>

              <div class="card-subtitulo">

                Prioridade dos atendimentos registrados

              </div>

            </div>

            <div class="card-icone">

              <q-icon

                name="priority_high"

                size="20px"

              />

            </div>

          </div>

          <div class="grafico-barras">

            <Bar

              :data="dadosGraficoUrgencia"

              :options="opcoesGraficoUrgencia"

            />

          </div>

        </div>

      </div>

      <!-- =====================================================

           EVOLUÇÃO MENSAL

      ====================================================== -->

      <div class="dashboard-card evolucao-card">

        <div class="card-header">

          <div>

            <div class="card-titulo">

              Evolução dos chamados

            </div>

            <div class="card-subtitulo">

              Quantidade de chamados abertos nos últimos 6 meses

            </div>

          </div>

          <div class="card-icone">

            <q-icon

              name="show_chart"

              size="20px"

            />

          </div>

        </div>

        <div class="grafico-linha">

          <Line

            :data="dadosGraficoMensal"

            :options="opcoesGraficoMensal"

          />

        </div>

      </div>

      <!-- =====================================================

           SEGUNDA LINHA

      ====================================================== -->

      <div class="graficos-grid graficos-grid--secundario">

        <!-- TÉCNICOS -->

        <div class="dashboard-card grafico-card">

          <div class="card-header">

            <div>

              <div class="card-titulo">

                Atendimentos por técnico

              </div>

              <div class="card-subtitulo">

                Distribuição dos chamados atribuídos

              </div>

            </div>

            <div class="card-icone">

              <q-icon

                name="engineering"

                size="20px"

              />

            </div>

          </div>

          <div

            v-if="possuiDadosTecnicos"

            class="grafico-tecnicos"

          >

            <Bar

              :data="dadosGraficoTecnicos"

              :options="opcoesGraficoTecnicos"

            />

          </div>

          <div

            v-else

            class="grafico-vazio"

          >

            <div class="vazio-icone">

              <q-icon

                name="engineering"

                size="27px"

              />

            </div>

            <strong>

              Nenhum atendimento atribuído

            </strong>

            <span>

              Os dados aparecerão conforme os técnicos aceitarem chamados.

            </span>

          </div>

        </div>

        <!-- RESUMO DE USUÁRIOS -->

        <div class="dashboard-card usuarios-card">

          <div class="card-header">

            <div>

              <div class="card-titulo">

                Equipe e produtores

              </div>

              <div class="card-subtitulo">

                Usuários ativos no sistema

              </div>

            </div>

            <div class="card-icone">

              <q-icon

                name="groups"

                size="20px"

              />

            </div>

          </div>

          <div class="usuarios-conteudo">

            <div class="usuario-resumo">

              <div class="usuario-resumo-icone produtor">

                <q-icon

                  name="agriculture"

                  size="25px"

                />

              </div>

              <div>

                <strong>

                  {{ totalProdutores }}

                </strong>

                <span>

                  Produtores ativos

                </span>

              </div>

            </div>

            <div class="usuario-resumo">

              <div class="usuario-resumo-icone tecnico">

                <q-icon

                  name="engineering"

                  size="25px"

                />

              </div>

              <div>

                <strong>

                  {{ totalTecnicos }}

                </strong>

                <span>

                  Técnicos ativos

                </span>

              </div>

            </div>

            <div class="resolucao-box">

              <div class="resolucao-topo">

                <div>

                  <span>

                    Taxa de resolução

                  </span>

                  <strong>

                    {{ taxaResolucao }}%

                  </strong>

                </div>

                <q-circular-progress

                  show-value

                  :value="taxaResolucao"

                  size="82px"

                  :thickness="0.12"

                  color="positive"

                  track-color="grey-3"

                >

                  {{ taxaResolucao }}%

                </q-circular-progress>

              </div>

              <div class="resolucao-descricao">

                Percentual de chamados finalizados em relação ao total registrado.

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- =====================================================

           ÚLTIMOS CHAMADOS

      ====================================================== -->

      <div class="dashboard-card chamados-recentes-card">

        <div class="card-header recentes-header">

          <div>

            <div class="card-titulo">

              Chamados recentes

            </div>

            <div class="card-subtitulo">

              Últimas solicitações registradas no sistema

            </div>

          </div>

          <q-btn

            flat

            no-caps

            color="orange"

            icon-right="arrow_forward"

            label="Ver todos"

            @click="irParaChamados"

          />

        </div>

        <div

          v-if="ultimosChamados.length"

          class="recentes-lista"

        >

          <button

            v-for="chamado in ultimosChamados"

            :key="chamado.id_chamado"

            type="button"

            class="chamado-recente"

            @click="abrirChamado(chamado.id_chamado)"

          >

            <div class="chamado-recente-id">

              #{{ chamado.id_chamado }}

            </div>

            <div class="chamado-recente-principal">

              <strong>

                {{ chamado.problema || 'Solicitação de atendimento' }}

              </strong>

              <span>

                {{ chamado.nome_produtor || 'Produtor não informado' }}

                <template v-if="chamado.nome_propriedade">

                  • {{ chamado.nome_propriedade }}

                </template>

              </span>

            </div>

            <div class="chamado-recente-tecnico">

              <q-icon

                name="engineering"

                size="16px"

              />

              <span>

                {{ chamado.nome_tecnico || 'Não atribuído' }}

              </span>

            </div>

            <q-badge

              rounded

              :color="corUrgencia(chamado.urgencia)"

              :label="formatarUrgencia(chamado.urgencia)"

            />

            <q-badge

              rounded

              :color="corStatus(chamado.status)"

              :label="formatarStatus(chamado.status)"

            />

            <div class="chamado-recente-data">

              {{ formatarData(chamado.data_abertura) }}

            </div>

            <q-icon

              name="chevron_right"

              size="20px"

              class="seta-chamado"

            />

          </button>

        </div>

        <div

          v-else

          class="recentes-vazio"

        >

          Nenhum chamado registrado.

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

import chamadoService from

  'src/services/chamadoService'

import usuarioService from

  'src/services/usuarioService'

import {

  useAuthStore

} from 'src/stores/auth'

/* =====================================================

   CHART.JS

===================================================== */

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

/* =====================================================

   BASE

===================================================== */

const $q =

  useQuasar()

const router =

  useRouter()

const authStore =

  useAuthStore()

const carregando =

  ref(false)

const carregadoUmaVez =

  ref(false)

const chamados =

  ref([])

const usuarios =

  ref([])

/* =====================================================

   USUÁRIO

===================================================== */

const primeiroNome =

  computed(() => {

    const nome =

      String(

        authStore.usuario?.nome ||

        'Administrador'

      )

        .trim()

    return (

      nome.split(/\s+/)[0] ||

      'Administrador'

    )

  })

/* =====================================================

   DATA ATUAL

===================================================== */

const dataAtual =

  computed(() => {

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

/* =====================================================

   STATUS

===================================================== */

function statusNormalizado(status) {

  return String(

    status || ''

  )

    .trim()

    .toUpperCase()

}

const totalChamados =

  computed(

    () =>

      chamados.value.length

  )

const totalPendentes =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          statusNormalizado(

            chamado.status

          ) === 'PENDENTE'

      ).length

  )

const totalAndamento =

  computed(() => {

    const statusAndamento = [

      'ACEITO',

      'EM_ROTA',

      'EM_ATENDIMENTO'

    ]

    return chamados.value.filter(

      chamado =>

        statusAndamento.includes(

          statusNormalizado(

            chamado.status

          )

        )

    ).length

  })

const totalFinalizados =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          statusNormalizado(

            chamado.status

          ) === 'FINALIZADO'

      ).length

  )

const totalCancelados =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          statusNormalizado(

            chamado.status

          ) === 'CANCELADO'

      ).length

  )

const taxaResolucao =

  computed(() => {

    if (

      totalChamados.value === 0

    ) {

      return 0

    }

    return Math.round(

      (

        totalFinalizados.value /

        totalChamados.value

      ) * 100

    )

  })

/* =====================================================

   USUÁRIOS

===================================================== */

function tipoUsuarioNormalizado(tipo) {

  return String(

    tipo || ''

  )

    .trim()

    .toUpperCase()

}

const totalProdutores =

  computed(

    () =>

      usuarios.value.filter(

        usuario =>

          tipoUsuarioNormalizado(

            usuario.tipo_usuario

          ) === 'PRODUTOR' &&

          usuario.ativo !== false

      ).length

  )

const totalTecnicos =

  computed(

    () =>

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

      ).length

  )

/* =====================================================

   CORES DOS GRÁFICOS

===================================================== */

const cores =

  {

    laranja:

      '#f97316',

    laranjaClaro:

      'rgba(249, 115, 22, 0.16)',

    amarelo:

      '#f59e0b',

    azul:

      '#3b82f6',

    verde:

      '#22c55e',

    vermelho:

      '#ef4444',

    roxo:

      '#8b5cf6',

    cinza:

      '#94a3b8'

  }

/* =====================================================

   GRÁFICO STATUS

===================================================== */

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

          cores.amarelo,

          cores.azul,

          cores.verde,

          cores.vermelho

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

/* =====================================================

   URGÊNCIA

===================================================== */

function urgenciaNormalizada(

  urgencia

) {

  return String(

    urgencia || ''

  )

    .trim()

    .toUpperCase()

    .normalize('NFD')

    .replace(

      /[\u0300-\u036f]/g,

      ''

    )

}

const totalAlta =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          urgenciaNormalizada(

            chamado.urgencia

          ) === 'ALTA'

      ).length

  )

const totalMedia =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          urgenciaNormalizada(

            chamado.urgencia

          ) === 'MEDIA'

      ).length

  )

const totalBaixa =

  computed(

    () =>

      chamados.value.filter(

        chamado =>

          urgenciaNormalizada(

            chamado.urgencia

          ) === 'BAIXA'

      ).length

  )

const dadosGraficoUrgencia =

  computed(() => ({

    labels: [

      'Alta',

      'Média',

      'Baixa'

    ],

    datasets: [

      {

        data: [

          totalAlta.value,

          totalMedia.value,

          totalBaixa.value

        ],

        backgroundColor: [

          cores.vermelho,

          cores.amarelo,

          cores.verde

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

              ? '#d0d5dd'

              : '#344054',

          font: {

            weight: 600

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

/* =====================================================

   ÚLTIMOS 6 MESES

===================================================== */

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

              month: 'short'

            }

          )

            .format(data)

            .replace('.', '')

      })

    }

    return meses

  })

const quantidadePorMes =

  computed(() => {

    return mesesGrafico.value.map(

      periodo => {

        return chamados.value.filter(

          chamado => {

            if (

              !chamado.data_abertura

            ) {

              return false

            }

            const data =

              new Date(

                chamado.data_abertura

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

          'Chamados abertos',

        data:

          quantidadePorMes.value,

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

/* =====================================================

   CHAMADOS POR TÉCNICO

===================================================== */

const tecnicosContagem =

  computed(() => {

    const mapa =

      new Map()

    chamados.value.forEach(

      chamado => {

        const nomes =

          String(

            chamado.nome_tecnico ||

            ''

          )

            .split(',')

            .map(

              nome =>

                nome.trim()

            )

            .filter(Boolean)

        nomes.forEach(

          nome => {

            mapa.set(

              nome,

              (

                mapa.get(nome) ||

                0

              ) + 1

            )

          }

        )

      }

    )

    return Array

      .from(

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

          b.total -

          a.total

      )

      .slice(

        0,

        6

      )

  })

const possuiDadosTecnicos =

  computed(

    () =>

      tecnicosContagem.value

        .length > 0

  )

const dadosGraficoTecnicos =

  computed(() => ({

    labels:

      tecnicosContagem.value.map(

        item =>

          primeiroEUltimoNome(

            item.nome

          )

      ),

    datasets: [

      {

        data:

          tecnicosContagem.value.map(

            item =>

              item.total

          ),

        backgroundColor:

          cores.azul,

        borderRadius:

          8,

        borderSkipped:

          false,

        maxBarThickness:

          38

      }

    ]

  }))

const opcoesGraficoTecnicos =

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

/* =====================================================

   ÚLTIMOS CHAMADOS

===================================================== */

const ultimosChamados =

  computed(() => {

    return [

      ...chamados.value

    ]

      .sort(

        (a, b) =>

          new Date(

            b.data_abertura ||

            0

          ).getTime() -

          new Date(

            a.data_abertura ||

            0

          ).getTime()

      )

      .slice(

        0,

        6

      )

  })

/* =====================================================

   CARREGAR DADOS

===================================================== */

async function carregarDashboard() {

  carregando.value =

    true

  try {

    const [

      listaChamados,

      listaUsuarios

    ] =

      await Promise.all([

        chamadoService.listar(),

        usuarioService.listar()

      ])

    chamados.value =

      Array.isArray(

        listaChamados

      )

        ? listaChamados

        : []

    usuarios.value =

      Array.isArray(

        listaUsuarios

      )

        ? listaUsuarios

        : []

    carregadoUmaVez.value =

      true

  } catch (error) {

    console.error(

      'Erro ao carregar dashboard:',

      error

    )

    $q.notify({

      type:

        'negative',

      message:

        error.response?.data

          ?.message ||

        error.response?.data

          ?.erro ||

        'Não foi possível carregar o dashboard.'

    })

  } finally {

    carregando.value =

      false

  }

}

/* =====================================================

   NAVEGAÇÃO

===================================================== */

function abrirChamados(status = null) {

  if (!status) {

    router.push({

      name:

        'admin-chamados'

    })

    return

  }

  router.push({

    name:

      'admin-chamados',

    query: {

      status

    }

  })

}

function irParaChamados() {

  router.push({

    name:

      'admin-chamados'

  })

}

function abrirChamado(

  idChamado

) {

  router.push({

    name:

      'admin-chamados',

    query: {

      chamado:

        idChamado

    }

  })

}

/* =====================================================

   FORMATAÇÕES

===================================================== */

function primeiroEUltimoNome(

  nome

) {

  const partes =

    String(

      nome || ''

    )

      .trim()

      .split(/\s+/)

      .filter(Boolean)

  if (

    partes.length <= 2

  ) {

    return partes.join(' ')

  }

  return `${partes[0]} ${

    partes[

      partes.length - 1

    ]

  }`

}

function formatarData(

  data

) {

  if (!data) {

    return '-'

  }

  const objeto =

    new Date(data)

  if (

    Number.isNaN(

      objeto.getTime()

    )

  ) {

    return '-'

  }

  return new Intl

    .DateTimeFormat(

      'pt-BR',

      {

        day:

          '2-digit',

        month:

          '2-digit',

        year:

          'numeric'

      }

    )

    .format(objeto)

}

function formatarStatus(

  status

) {

  const valores = {

    PENDENTE:

      'Pendente',

    ACEITO:

      'Aceito',

    EM_ROTA:

      'Em rota',

    EM_ATENDIMENTO:

      'Em atendimento',

    FINALIZADO:

      'Finalizado',

    CANCELADO:

      'Cancelado'

  }

  return (

    valores[

      statusNormalizado(

        status

      )

    ] ||

    status ||

    '-'

  )

}

function corStatus(

  status

) {

  const valores = {

    PENDENTE:

      'orange',

    ACEITO:

      'blue',

    EM_ROTA:

      'purple',

    EM_ATENDIMENTO:

      'primary',

    FINALIZADO:

      'positive',

    CANCELADO:

      'negative'

  }

  return (

    valores[

      statusNormalizado(

        status

      )

    ] ||

    'grey'

  )

}

function formatarUrgencia(

  urgencia

) {

  const valores = {

    ALTA:

      'Alta',

    MEDIA:

      'Média',

    BAIXA:

      'Baixa'

  }

  return (

    valores[

      urgenciaNormalizada(

        urgencia

      )

    ] ||

    'Não informada'

  )

}

function corUrgencia(

  urgencia

) {

  const valores = {

    ALTA:

      'red',

    MEDIA:

      'orange',

    BAIXA:

      'green'

  }

  return (

    valores[

      urgenciaNormalizada(

        urgencia

      )

    ] ||

    'grey'

  )

}

/* =====================================================

   INICIAR

===================================================== */

onMounted(

  carregarDashboard

)

</script>

<style scoped>

/* =====================================================

   PÁGINA

===================================================== */

.dashboard-page {

  min-height: 100%;

  padding: 30px;

  background: #f5f6f8;

}

/* =====================================================

   HEADER

===================================================== */

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

  display: flex;

  align-items: center;

  gap: 10px;

  min-width: 165px;

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

/* =====================================================

   CARREGAMENTO

===================================================== */

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

/* =====================================================

   INDICADORES

===================================================== */

.indicadores-grid {

  display: grid;

  grid-template-columns:

    repeat(

      4,

      minmax(0, 1fr)

    );

  gap: 15px;

  margin-bottom: 16px;

}

.indicador-card {

  padding: 18px;

  border: 1px solid #eaecf0;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:

    0 3px 12px

    rgba(16, 24, 40, 0.035);

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
    0 9px 25px
    rgba(16, 24, 40, 0.08);

}

.indicador-card--clicavel:focus-visible {

  outline: 2px solid #f97316;

  outline-offset: 2px;

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

.indicador-icone--amarelo {

  color: #d97706;

  background: #fffbeb;

}

.indicador-icone--azul {

  color: #2563eb;

  background: #eff6ff;

}

.indicador-icone--verde {

  color: #16a34a;

  background: #f0fdf4;

}

.indicador-tendencia {

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

/* =====================================================

   CARDS

===================================================== */

.dashboard-card {

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

  padding: 19px 20px 8px;

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

  width: 37px;

  height: 37px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;

  background: #fff1e6;

}

/* =====================================================

   GRIDS GRÁFICOS

===================================================== */

.graficos-grid {

  display: grid;

  gap: 16px;

  margin-bottom: 16px;

}

.graficos-grid--principal {

  grid-template-columns:

    0.9fr

    1.1fr;

}

.graficos-grid--secundario {

  grid-template-columns:

    1.35fr

    0.65fr;

}

.grafico-card {

  min-width: 0;

}

/* =====================================================

   ROSCA

===================================================== */

.doughnut-area {

  min-height: 280px;

  display: flex;

  align-items: center;

  justify-content: space-around;

  gap: 25px;

  padding: 10px 22px 22px;

}

.doughnut-wrapper {

  position: relative;

  width: 205px;

  height: 205px;

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

  font-size: 25px;

  font-weight: 900;

}

.doughnut-centro span {

  margin-top: -2px;

  color: #98a2b3;

  font-size: 8px;

}

.legenda-status {

  display: grid;

  grid-template-columns:

    repeat(2, 1fr);

  gap: 18px;

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

.ponto--pendente {

  background: #f59e0b;

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

  font-size: 11px;

}

.legenda-item span:not(.ponto) {

  display: block;

  color: #98a2b3;

  font-size: 8px;

}

/* =====================================================

   BARRAS

===================================================== */

.grafico-barras {

  height: 280px;

  padding: 16px 20px 21px;

}

/* =====================================================

   LINHA

===================================================== */

.evolucao-card {

  margin-bottom: 16px;

}

.grafico-linha {

  height: 290px;

  padding: 10px 20px 20px;

}

/* =====================================================

   TÉCNICOS

===================================================== */

.grafico-tecnicos {

  height: 280px;

  padding: 15px 20px 20px;

}

.grafico-vazio {

  min-height: 280px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 20px;

  color: #98a2b3;

  text-align: center;

}

.vazio-icone {

  width: 55px;

  height: 55px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 4px;

  border-radius: 15px;

  color: #f97316;

  background: #fff1e6;

}

.grafico-vazio strong {

  color: #475467;

  font-size: 10px;

}

.grafico-vazio span {

  max-width: 300px;

  font-size: 8px;

}

/* =====================================================

   USUÁRIOS

===================================================== */

.usuarios-conteudo {

  display: flex;

  flex-direction: column;

  gap: 10px;

  padding: 14px 20px 20px;

}

.usuario-resumo {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 13px;

  border-radius: 12px;

  background: #f9fafb;

}

.usuario-resumo-icone {

  width: 43px;

  height: 43px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

}

.usuario-resumo-icone.produtor {

  color: #f97316;

  background: #fff1e6;

}

.usuario-resumo-icone.tecnico {

  color: #2563eb;

  background: #eff6ff;

}

.usuario-resumo strong {

  display: block;

  color: #101828;

  font-size: 18px;

  font-weight: 900;

}

.usuario-resumo span {

  display: block;

  color: #98a2b3;

  font-size: 8px;

}

.resolucao-box {

  padding: 14px;

  border: 1px solid #eaecf0;

  border-radius: 12px;

}

.resolucao-topo {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

}

.resolucao-topo span {

  display: block;

  color: #98a2b3;

  font-size: 8px;

}

.resolucao-topo strong {

  display: block;

  margin-top: 2px;

  color: #101828;

  font-size: 20px;

  font-weight: 900;

}

.resolucao-descricao {

  margin-top: 8px;

  color: #98a2b3;

  font-size: 8px;

  line-height: 1.5;

}

/* =====================================================

   RECENTES

===================================================== */

.chamados-recentes-card {

  overflow: hidden;

}

.recentes-header {

  padding-bottom: 16px;

}

.recentes-lista {

  border-top: 1px solid #eaecf0;

}

.chamado-recente {

  width: 100%;

  display: grid;

  grid-template-columns:

    55px

    minmax(210px, 1.5fr)

    minmax(140px, 0.8fr)

    80px

    100px

    85px

    20px;

  align-items: center;

  gap: 10px;

  padding: 13px 20px;

  border: none;

  border-bottom: 1px solid #f2f4f7;

  color: inherit;

  background: transparent;

  cursor: pointer;

  font-family: inherit;

  text-align: left;

  transition: background 0.2s ease;

}

.chamado-recente:last-child {

  border-bottom: none;

}

.chamado-recente:hover {

  background: #fafafa;

}

.chamado-recente-id {

  color: #f97316;

  font-size: 9px;

  font-weight: 900;

}

.chamado-recente-principal strong {

  display: block;

  overflow: hidden;

  color: #344054;

  font-size: 9px;

  font-weight: 800;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.chamado-recente-principal span {

  display: block;

  overflow: hidden;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 8px;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.chamado-recente-tecnico {

  display: flex;

  align-items: center;

  gap: 5px;

  overflow: hidden;

  color: #667085;

  font-size: 8px;

}

.chamado-recente-tecnico span {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.chamado-recente-data {

  color: #667085;

  font-size: 8px;

}

.seta-chamado {

  color: #98a2b3;

}

.recentes-vazio {

  padding: 50px;

  color: #98a2b3;

  font-size: 9px;

  text-align: center;

}

/* =====================================================

   DARK MODE

===================================================== */

.dashboard-page--dark {

  background: #0d0f12;

}

.dashboard-page--dark

.saudacao,

.dashboard-page--dark

.indicador-numero,

.dashboard-page--dark

.card-titulo,

.dashboard-page--dark

.doughnut-centro strong {

  color: #f9fafb;

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

.data-card strong,

.dashboard-page--dark

.indicador-label,

.dashboard-page--dark

.legenda-item strong,

.dashboard-page--dark

.usuario-resumo strong,

.dashboard-page--dark

.resolucao-topo strong,

.dashboard-page--dark

.chamado-recente-principal strong {

  color: #f2f4f7;

}

.dashboard-page--dark

.indicador-tendencia,

.dashboard-page--dark

.usuario-resumo {

  background: #1b1e24;

}

.dashboard-page--dark

.resolucao-box,

.dashboard-page--dark

.recentes-lista {

  border-color: #292d33;

}

.dashboard-page--dark

.chamado-recente {

  border-color: #24282f;

}

.dashboard-page--dark

.chamado-recente:hover {

  background: #1b1e24;

}

/* =====================================================

   RESPONSIVIDADE

===================================================== */

@media (max-width: 1200px) {

  .indicadores-grid {

    grid-template-columns:

      repeat(2, 1fr);

  }

  .graficos-grid--principal,

  .graficos-grid--secundario {

    grid-template-columns:

      1fr;

  }

}

@media (max-width: 950px) {

  .chamado-recente {

    grid-template-columns:

      50px

      minmax(180px, 1fr)

      90px

      95px

      20px;

  }

  .chamado-recente-tecnico,

  .chamado-recente-data {

    display: none;

  }

}

@media (max-width: 700px) {

  .dashboard-page {

    padding: 22px;

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

  .doughnut-area {

    flex-direction: column;

  }

  .legenda-status {

    width: 100%;

  }

}

@media (max-width: 550px) {

  .dashboard-page {

    padding: 18px 14px;

  }

  .saudacao {

    font-size: 22px;

  }

  .indicadores-grid {

    grid-template-columns:

      1fr;

  }

  .legenda-status {

    grid-template-columns:

      1fr 1fr;

  }

  .chamado-recente {

    grid-template-columns:

      45px

      minmax(120px, 1fr)

      90px

      20px;

  }

  .chamado-recente

  .q-badge:first-of-type {

    display: none;

  }

}

</style>