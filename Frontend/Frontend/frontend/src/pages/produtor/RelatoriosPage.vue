<template>
  <q-page
    class="relatorios-page"
    :class="{ 'relatorios-page--dark': $q.dark.isActive }"
  >
    <!-- =========================
         CABEÇALHO
    ========================== -->

    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Relatórios
        </div>

        <div class="pagina-subtitulo">
          Visualize seus atendimentos e gere relatórios em PDF.
        </div>
      </div>

      <q-btn
        outline
        color="orange-8"
        icon="refresh"
        label="Atualizar"
        no-caps
        :loading="carregando"
        @click="carregarRelatorios"
      />
    </div>

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
          @click="carregarRelatorios"
        />
      </template>
    </q-banner>

    <!-- =========================
         CARDS / FILTROS
    ========================== -->

    <div class="cards-resumo">
      <q-card
        class="card-resumo card-resumo--clicavel"
        :class="{
          'card-resumo--ativo':
            filtroAtivo === 'todos'
        }"
        @click="selecionarFiltro('todos')"
      >
        <div class="card-icone card-icone--total">
          <q-icon
            name="confirmation_number"
            size="24px"
          />
        </div>

        <div>
          <div class="card-valor">
            {{ totalChamados }}
          </div>

          <div class="card-titulo">
            Total de chamados
          </div>

          <div class="card-texto">
            Todos os seus atendimentos
          </div>
        </div>
      </q-card>

      <q-card
        class="card-resumo card-resumo--clicavel"
        :class="{
          'card-resumo--ativo':
            filtroAtivo === 'pendentes'
        }"
        @click="selecionarFiltro('pendentes')"
      >
        <div class="card-icone card-icone--pendente">
          <q-icon
            name="schedule"
            size="24px"
          />
        </div>

        <div>
          <div class="card-valor">
            {{ chamadosPendentes }}
          </div>

          <div class="card-titulo">
            Pendentes
          </div>

          <div class="card-texto">
            Aguardando atendimento
          </div>
        </div>
      </q-card>

      <q-card
        class="card-resumo card-resumo--clicavel"
        :class="{
          'card-resumo--ativo':
            filtroAtivo === 'andamento'
        }"
        @click="selecionarFiltro('andamento')"
      >
        <div class="card-icone card-icone--andamento">
          <q-icon
            name="engineering"
            size="24px"
          />
        </div>

        <div>
          <div class="card-valor">
            {{ chamadosEmAndamento }}
          </div>

          <div class="card-titulo">
            Em andamento
          </div>

          <div class="card-texto">
            Atendimentos em execução
          </div>
        </div>
      </q-card>

      <q-card
        class="card-resumo card-resumo--clicavel"
        :class="{
          'card-resumo--ativo':
            filtroAtivo === 'finalizados'
        }"
        @click="selecionarFiltro('finalizados')"
      >
        <div class="card-icone card-icone--finalizado">
          <q-icon
            name="check_circle"
            size="24px"
          />
        </div>

        <div>
          <div class="card-valor">
            {{ chamadosFinalizados }}
          </div>

          <div class="card-titulo">
            Finalizados
          </div>

          <div class="card-texto">
            Atendimentos concluídos
          </div>
        </div>
      </q-card>
    </div>

    <!-- =========================
         GRÁFICOS
    ========================== -->

    <div class="graficos-grid">
      <q-card class="grafico-card">
        <div class="card-topo">
          <div>
            <div class="bloco-titulo">
              Situação dos chamados
            </div>

            <div class="bloco-subtitulo">
              Distribuição geral dos seus atendimentos
            </div>
          </div>

          <div class="icone-lateral">
            <q-icon
              name="pie_chart"
              size="20px"
            />
          </div>
        </div>

        <div class="grafico-area">
          <Doughnut
            v-if="!carregando"
            :data="dadosGraficoStatus"
            :options="opcoesGraficoRosca"
          />

          <div
            v-else
            class="grafico-loading"
          >
            <q-spinner
              color="orange"
              size="40px"
            />
          </div>
        </div>
      </q-card>

      <q-card class="grafico-card">
        <div class="card-topo">
          <div>
            <div class="bloco-titulo">
              Chamados por urgência
            </div>

            <div class="bloco-subtitulo">
              Quantidade por nível de prioridade
            </div>
          </div>

          <div class="icone-lateral icone-lateral--urgencia">
            <q-icon
              name="priority_high"
              size="20px"
            />
          </div>
        </div>

        <div class="grafico-area">
          <Bar
            v-if="!carregando"
            :data="dadosGraficoUrgencia"
            :options="opcoesGraficoBarra"
          />

          <div
            v-else
            class="grafico-loading"
          >
            <q-spinner
              color="orange"
              size="40px"
            />
          </div>
        </div>
      </q-card>
    </div>

    <!-- =========================
         SELEÇÃO PARA PDF
    ========================== -->

    <q-card class="relatorio-card">
      <div class="relatorio-topo">
        <div>
          <div class="bloco-titulo">
            Chamados para o relatório
          </div>

          <div class="bloco-subtitulo">
            Selecione os chamados que deseja incluir no PDF.
          </div>
        </div>

        <div class="relatorio-acoes">
          <q-btn
            v-if="chamadosSelecionadosIds.length > 0"
            flat
            no-caps
            color="grey-7"
            label="Limpar seleção"
            @click="limparSelecao"
          />

          <q-btn
            unelevated
            no-caps
            color="orange"
            icon="picture_as_pdf"
            :loading="gerandoPdf"
            :label="
              chamadosSelecionadosIds.length > 0
                ? `Gerar PDF (${chamadosSelecionadosIds.length})`
                : 'Gerar PDF'
            "
            :disable="
              chamadosSelecionadosIds.length === 0
            "
            @click="gerarPdf"
          />
        </div>
      </div>

      <!-- FILTRO ATIVO -->

      <div class="filtro-atual">
        <div>
          Exibindo:
          <strong>
            {{ nomeFiltroAtivo }}
          </strong>
        </div>

        <div>
          {{ chamadosParaRelatorio.length }}
          {{
            chamadosParaRelatorio.length === 1
              ? 'chamado'
              : 'chamados'
          }}
        </div>
      </div>

      <!-- SELECIONAR TODOS -->

      <div
        v-if="chamadosParaRelatorio.length > 0"
        class="selecionar-todos"
      >
        <q-checkbox
          v-model="todosVisiveisSelecionados"
          color="orange"
          label="Selecionar todos os chamados exibidos"
        />

        <span>
          {{ chamadosSelecionadosIds.length }}
          selecionado(s)
        </span>
      </div>

      <!-- SEM CHAMADOS -->

      <div
        v-if="chamadosParaRelatorio.length === 0"
        class="sem-chamados"
      >
        <q-icon
          name="description"
          size="34px"
        />

        <strong>
          Nenhum chamado neste filtro
        </strong>

        <span>
          Selecione outro card para visualizar os chamados.
        </span>
      </div>

      <!-- LISTAGEM -->

      <div
        v-else
        class="chamados-relatorio-lista"
      >
        <div
          v-for="chamado in chamadosParaRelatorio"
          :key="chamado.id_chamado"
          class="chamado-relatorio-item"
        >
          <q-checkbox
            v-model="chamadosSelecionadosIds"
            :val="Number(chamado.id_chamado)"
            color="orange"
          />

          <div class="chamado-relatorio-id">
            #{{ chamado.id_chamado }}
          </div>

          <div class="chamado-relatorio-principal">
            <strong>
              {{
                chamado.problema ||
                'Solicitação de atendimento'
              }}
            </strong>

            <span>
              {{ descricaoCurta(chamado) }}
            </span>
          </div>

          <div class="chamado-relatorio-info">
            <span>
              Urgência
            </span>

            <q-badge
              rounded
              :class="
                classeUrgencia(
                  chamado.urgencia
                )
              "
            >
              {{
                formatarUrgencia(
                  chamado.urgencia
                )
              }}
            </q-badge>
          </div>

          <div class="chamado-relatorio-info">
            <span>
              Status
            </span>

            <q-badge
              rounded
              :class="
                classeStatus(
                  chamado.status
                )
              "
            >
              {{
                formatarStatus(
                  chamado.status
                )
              }}
            </q-badge>
          </div>

          <div class="chamado-relatorio-data">
            <span>
              Abertura
            </span>

            <strong>
              {{
                formatarData(
                  chamado.data_abertura
                )
              }}
            </strong>
          </div>
        </div>
      </div>
    </q-card>
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
  Bar,
  Doughnut
} from 'vue-chartjs'

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js'

import {
  jsPDF
} from 'jspdf'

import {
  autoTable
} from 'jspdf-autotable'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

import deslocamentoService from
  'src/services/deslocamentoService'

import materialService from
  'src/services/materialService'

import {
  useAuthStore
} from 'src/stores/auth'

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
)

const $q =
  useQuasar()

const authStore =
  useAuthStore()

const chamados =
  ref([])

const carregando =
  ref(false)

const erro =
  ref('')

const gerandoPdf =
  ref(false)

const filtroAtivo =
  ref('todos')

const chamadosSelecionadosIds =
  ref([])

/* =========================
   CONTADORES
========================= */

const totalChamados =
  computed(() =>
    chamados.value.length
  )

const chamadosPendentes =
  computed(() =>
    chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'PENDENTE'
    ).length
  )

const chamadosEmAndamento =
  computed(() =>
    chamados.value.filter(
      chamado =>
        [
          'ACEITO',
          'EM_ROTA',
          'EM_ATENDIMENTO'
        ].includes(
          statusNormalizado(
            chamado.status
          )
        )
    ).length
  )

const chamadosFinalizados =
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

const chamadosCancelados =
  computed(() =>
    chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'CANCELADO'
    ).length
  )

/* =========================
   URGÊNCIAS
========================= */

const totalAlta =
  computed(() =>
    chamados.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'ALTA'
    ).length
  )

const totalMedia =
  computed(() =>
    chamados.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'MEDIA'
    ).length
  )

const totalBaixa =
  computed(() =>
    chamados.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'BAIXA'
    ).length
  )

/* =========================
   FILTRO DOS CARDS
========================= */

const chamadosParaRelatorio =
  computed(() => {
    let lista =
      [...chamados.value]

    if (
      filtroAtivo.value ===
      'pendentes'
    ) {
      lista =
        lista.filter(
          chamado =>
            statusNormalizado(
              chamado.status
            ) === 'PENDENTE'
        )
    }

    if (
      filtroAtivo.value ===
      'andamento'
    ) {
      lista =
        lista.filter(
          chamado =>
            [
              'ACEITO',
              'EM_ROTA',
              'EM_ATENDIMENTO'
            ].includes(
              statusNormalizado(
                chamado.status
              )
            )
        )
    }

    if (
      filtroAtivo.value ===
      'finalizados'
    ) {
      lista =
        lista.filter(
          chamado =>
            [
              'FINALIZADO',
              'CONCLUIDO'
            ].includes(
              statusNormalizado(
                chamado.status
              )
            )
        )
    }

    return lista.sort(
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
  })

const nomeFiltroAtivo =
  computed(() => {
    const nomes = {
      todos:
        'Todos os chamados',

      pendentes:
        'Pendentes',

      andamento:
        'Em andamento',

      finalizados:
        'Finalizados'
    }

    return (
      nomes[
        filtroAtivo.value
      ] ||
      'Todos os chamados'
    )
  })

/* =========================
   SELECIONAR TODOS
========================= */

const todosVisiveisSelecionados =
  computed({
    get() {
      if (
        chamadosParaRelatorio
          .value.length === 0
      ) {
        return false
      }

      return chamadosParaRelatorio
        .value
        .every(
          chamado =>
            chamadosSelecionadosIds
              .value
              .includes(
                Number(
                  chamado.id_chamado
                )
              )
        )
    },

    set(selecionado) {
      const idsVisiveis =
        chamadosParaRelatorio
          .value
          .map(
            chamado =>
              Number(
                chamado.id_chamado
              )
          )

      if (selecionado) {
        chamadosSelecionadosIds.value =
          [
            ...new Set([
              ...chamadosSelecionadosIds
                .value,

              ...idsVisiveis
            ])
          ]

        return
      }

      chamadosSelecionadosIds.value =
        chamadosSelecionadosIds
          .value
          .filter(
            id =>
              !idsVisiveis.includes(
                id
              )
          )
    }
  })

/* =========================
   GRÁFICO DE STATUS
========================= */

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
          chamadosPendentes.value,
          chamadosEmAndamento.value,
          chamadosFinalizados.value,
          chamadosCancelados.value
        ],

        backgroundColor: [
          '#f59e0b',
          '#3b82f6',
          '#22c55e',
          '#ef4444'
        ],

        borderWidth:
          0
      }
    ]
  }))

const opcoesGraficoRosca = {
  responsive:
    true,

  maintainAspectRatio:
    false,

  cutout:
    '68%',

  plugins: {
    legend: {
      position:
        'bottom',

      labels: {
        boxWidth:
          11,

        usePointStyle:
          true,

        pointStyle:
          'circle',

        padding:
          18
      }
    }
  }
}

/* =========================
   GRÁFICO DE URGÊNCIA
========================= */

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
          '#ef4444',
          '#f59e0b',
          '#22c55e'
        ],

        borderRadius:
          9,

        borderSkipped:
          false
      }
    ]
  }))

const opcoesGraficoBarra = {
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
          0
      },

      grid: {
        color:
          '#eef2f7'
      }
    },

    y: {
      grid: {
        display:
          false
      }
    }
  }
}

/* =========================
   CARREGAMENTO
========================= */

async function carregarRelatorios() {
  carregando.value =
    true

  erro.value =
    ''

  try {
    const idUsuario =
      Number(
        authStore.usuario
          ?.id_usuario
      )

    if (
      !Number.isInteger(
        idUsuario
      ) ||
      idUsuario <= 0
    ) {
      throw new Error(
        'Não foi possível identificar o produtor logado.'
      )
    }

    const resposta =
      await chamadoService
        .listar()

    const lista =
      Array.isArray(
        resposta
      )
        ? resposta
        : resposta?.chamados ||
          resposta?.data ||
          []

    chamados.value =
      lista.filter(
        chamado => {
          const idProdutor =
            Number(
              chamado.id_usuario ||
              chamado.id_produtor ||
              chamado.usuario_id
            )

          return (
            Number.isInteger(
              idProdutor
            ) &&
            idProdutor ===
            idUsuario
          )
        }
      )

    const idsValidos =
      chamados.value.map(
        chamado =>
          Number(
            chamado.id_chamado
          )
      )

    chamadosSelecionadosIds.value =
      chamadosSelecionadosIds
        .value
        .filter(
          id =>
            idsValidos.includes(
              id
            )
        )
  } catch (error) {
    console.error(
      'Erro ao carregar relatórios:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar os relatórios.'
  } finally {
    carregando.value =
      false
  }
}

/* =========================
   FILTROS
========================= */

function selecionarFiltro(
  filtro
) {
  filtroAtivo.value =
    filtro
}

function limparSelecao() {
  chamadosSelecionadosIds.value =
    []
}

/* =====================================================
   BUSCAR DADOS COMPLETOS PARA O PDF
===================================================== */

async function buscarDadosCompletosPdf(
  chamado
) {
  const idChamado =
    Number(
      chamado.id_chamado
    )

  const finalizado =
    [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(
      statusNormalizado(
        chamado.status
      )
    )

  /*
    Para chamados ainda em andamento,
    usamos somente os dados básicos.
  */

  if (!finalizado) {
    return {
      chamado,
      equipe:
        [],
      deslocamento:
        null,
      materiais:
        []
    }
  }

  const [
    detalhesResposta,
    equipeResposta,
    deslocamentoResposta,
    materiaisResposta
  ] =
    await Promise.allSettled([
      chamadoService
        .buscarPorId(
          idChamado
        ),

      chamadoFuncionarioService
        .listarPorChamado(
          idChamado
        ),

      deslocamentoService
        .buscarPorChamado(
          idChamado
        ),

      materialService
        .listarPorChamado(
          idChamado
        )
    ])

  /* CHAMADO COMPLETO */

  const chamadoCompleto =
    detalhesResposta.status ===
    'fulfilled'
      ? (
          detalhesResposta.value
            ?.chamado ||
          detalhesResposta.value ||
          chamado
        )
      : chamado

  /* EQUIPE */

  const equipe =
    equipeResposta.status ===
    'fulfilled'
      ? (
          Array.isArray(
            equipeResposta.value
          )
            ? equipeResposta.value
            : equipeResposta.value
                ?.data ||
              []
        )
      : []

  /* DESLOCAMENTO */

  const deslocamento =
    deslocamentoResposta.status ===
    'fulfilled'
      ? (
          deslocamentoResposta
            .value
            ?.deslocamento ||
          deslocamentoResposta
            .value ||
          null
        )
      : null

  /* MATERIAIS */

  const materiais =
    materiaisResposta.status ===
    'fulfilled'
      ? (
          Array.isArray(
            materiaisResposta
              .value
          )
            ? materiaisResposta
                .value
            : materiaisResposta
                .value
                ?.materiais ||
              materiaisResposta
                .value
                ?.data ||
              []
        )
      : []

  return {
    chamado:
      chamadoCompleto,

    equipe,

    deslocamento,

    materiais
  }
}

/* =====================================================
   PDF
===================================================== */

async function gerarPdf() {
  const selecionados =
    chamados.value
      .filter(
        chamado =>
          chamadosSelecionadosIds
            .value
            .includes(
              Number(
                chamado.id_chamado
              )
            )
      )
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

  if (
    selecionados.length === 0
  ) {
    $q.notify({
      type:
        'warning',

      message:
        'Selecione pelo menos um chamado para gerar o PDF.'
    })

    return
  }

  gerandoPdf.value = true

  try {
    /*
      BUSCA OS DADOS COMPLETOS DOS
      CHAMADOS FINALIZADOS.
    */

    const chamadosCompletos =
      await Promise.all(
        selecionados.map(
          chamado =>
            buscarDadosCompletosPdf(
              chamado
            )
        )
      )

    const doc =
      new jsPDF({
        orientation:
          'portrait',

        unit:
          'mm',

        format:
          'a4'
      })

    const larguraPagina =
      doc.internal.pageSize
        .getWidth()

    const nomeProdutor =
      authStore.usuario?.nome ||
      'Produtor'

    const propriedade =
      selecionados[0]
        ?.nome_propriedade ||
      'Não informada'

    const agora =
      new Date()

    /* =========================
       CABEÇALHO
    ========================= */

    doc.setFillColor(
      249,
      115,
      22
    )

    doc.rect(
      0,
      0,
      larguraPagina,
      6,
      'F'
    )

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(
      20
    )

    doc.setTextColor(
      16,
      24,
      40
    )

    doc.text(
      'Avioeste',
      15,
      19
    )

    doc.setFontSize(
      12
    )

    doc.setTextColor(
      249,
      115,
      22
    )

    doc.text(
      'Relatório de Chamados',
      15,
      27
    )

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.setFontSize(
      9
    )

    doc.setTextColor(
      102,
      112,
      133
    )

    doc.text(
      `Produtor: ${nomeProdutor}`,
      15,
      36
    )

    doc.text(
      `Propriedade: ${propriedade}`,
      15,
      41
    )

    doc.text(
      `Gerado em: ${formatarDataHora(
        agora
      )}`,
      15,
      46
    )

    doc.setDrawColor(
      234,
      236,
      240
    )

    doc.line(
      15,
      51,
      larguraPagina - 15,
      51
    )

    /* =========================
       RESUMO
    ========================= */

    const resumo =
      calcularResumoPdf(
        selecionados
      )

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(
      11
    )

    doc.setTextColor(
      16,
      24,
      40
    )

    doc.text(
      'Resumo',
      15,
      60
    )

    const larguraCard =
      42

    const espaco =
      3

    const cards = [
      {
        titulo:
          'Selecionados',

        valor:
          selecionados.length
      },

      {
        titulo:
          'Pendentes',

        valor:
          resumo.pendentes
      },

      {
        titulo:
          'Em andamento',

        valor:
          resumo.andamento
      },

      {
        titulo:
          'Finalizados',

        valor:
          resumo.finalizados
      }
    ]

    cards.forEach(
      (
        card,
        index
      ) => {
        const x =
          15 +
          index *
          (
            larguraCard +
            espaco
          )

        doc.setFillColor(
          249,
          250,
          251
        )

        doc.roundedRect(
          x,
          65,
          larguraCard,
          22,
          2,
          2,
          'F'
        )

        doc.setFont(
          'helvetica',
          'bold'
        )

        doc.setFontSize(
          14
        )

        doc.setTextColor(
          16,
          24,
          40
        )

        doc.text(
          String(
            card.valor
          ),
          x + 4,
          74
        )

        doc.setFont(
          'helvetica',
          'normal'
        )

        doc.setFontSize(
          7
        )

        doc.setTextColor(
          102,
          112,
          133
        )

        doc.text(
          card.titulo,
          x + 4,
          81
        )
      }
    )

    /* =========================
       TABELA
    ========================= */

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(
      11
    )

    doc.setTextColor(
      16,
      24,
      40
    )

    doc.text(
      'Chamados selecionados',
      15,
      98
    )

    autoTable(
      doc,
      {
        startY:
          103,

        margin: {
          left:
            15,

          right:
            15
        },

        head: [[
          'Chamado',
          'Solicitação',
          'Urgência',
          'Status',
          'Abertura',
          'Finalização'
        ]],

        body:
          selecionados.map(
            chamado => [
              `#${chamado.id_chamado}`,

              chamado.problema ||
              'Não informado',

              formatarUrgencia(
                chamado.urgencia
              ),

              formatarStatus(
                chamado.status
              ),

              formatarData(
                chamado.data_abertura
              ),

              formatarData(
                chamado.data_finalizacao ||
                chamado.data_fechamento
              )
            ]
          ),

        theme:
          'grid',

        styles: {
          font:
            'helvetica',

          fontSize:
            7.5,

          cellPadding:
            2.5,

          textColor:
            [
              71,
              84,
              103
            ],

          lineColor:
            [
              234,
              236,
              240
            ],

          lineWidth:
            0.2,

          valign:
            'middle'
        },

        headStyles: {
          fillColor:
            [
              249,
              115,
              22
            ],

          textColor:
            [
              255,
              255,
              255
            ],

          fontStyle:
            'bold'
        },

        alternateRowStyles: {
          fillColor:
            [
              249,
              250,
              251
            ]
        },

        columnStyles: {
          0: {
            cellWidth:
              16
          },

          1: {
            cellWidth:
              57
          },

          2: {
            cellWidth:
              22
          },

          3: {
            cellWidth:
              28
          },

          4: {
            cellWidth:
              26
          },

          5: {
            cellWidth:
              26
          }
        }
      }
    )

    /* =========================
       DETALHAMENTO
    ========================= */

    let y =
      doc.lastAutoTable
        ?.finalY
        ? doc.lastAutoTable
            .finalY + 12
        : 120

    chamadosCompletos.forEach(
      (
        dados,
        index
      ) => {
        const chamado =
          dados.chamado

        const finalizado =
          [
            'FINALIZADO',
            'CONCLUIDO'
          ].includes(
            statusNormalizado(
              chamado.status
            )
          )

        /*
          GARANTE ESPAÇO PARA
          COMEÇAR O CHAMADO.
        */

        y =
          garantirEspacoPdf(
            doc,
            y,
            finalizado
              ? 78
              : 38
          )

        /* TÍTULO */

        doc.setFont(
          'helvetica',
          'bold'
        )

        doc.setFontSize(
          10
        )

        doc.setTextColor(
          249,
          115,
          22
        )

        doc.text(
          `Chamado #${chamado.id_chamado}`,
          15,
          y
        )

        doc.setTextColor(
          16,
          24,
          40
        )

        doc.text(
          chamado.problema ||
          'Solicitação de atendimento',
          43,
          y
        )

        y +=
          6

        /* DESCRIÇÃO */

        doc.setFont(
          'helvetica',
          'normal'
        )

        doc.setFontSize(
          8
        )

        doc.setTextColor(
          102,
          112,
          133
        )

        const descricao =
          chamado.descricao ||
          'Nenhuma descrição informada.'

        const descricaoLinhas =
          doc.splitTextToSize(
            descricao,
            175
          )

        doc.text(
          descricaoLinhas,
          15,
          y
        )

        y +=
          descricaoLinhas.length *
          4 +
          4

        /* DADOS BÁSICOS */

        doc.setFontSize(
          7.5
        )

        doc.setTextColor(
          71,
          84,
          103
        )

        doc.text(
          `Propriedade: ${
            chamado.nome_propriedade ||
            'Não informada'
          }`,
          15,
          y
        )

        doc.text(
          `Localização: ${
            localChamado(
              chamado
            )
          }`,
          105,
          y
        )

        y +=
          5

        doc.text(
          `Urgência: ${
            formatarUrgencia(
              chamado.urgencia
            )
          }`,
          15,
          y
        )

        doc.text(
          `Status: ${
            formatarStatus(
              chamado.status
            )
          }`,
          65,
          y
        )

        doc.text(
          `Abertura: ${
            formatarData(
              chamado.data_abertura
            )
          }`,
          115,
          y
        )

        y +=
          8

        /* =================================================
           DADOS COMPLETOS DO ATENDIMENTO FINALIZADO
        ================================================= */

        if (finalizado) {
          y =
            garantirEspacoPdf(
              doc,
              y,
              55
            )

          /*
            TÍTULO DA ASSISTÊNCIA
          */

          doc.setFillColor(
            249,
            250,
            251
          )

          doc.roundedRect(
            15,
            y - 4,
            180,
            9,
            1.5,
            1.5,
            'F'
          )

          doc.setFont(
            'helvetica',
            'bold'
          )

          doc.setFontSize(
            8
          )

          doc.setTextColor(
            16,
            24,
            40
          )

          doc.text(
            'Dados da assistência técnica',
            19,
            y + 1
          )

          y +=
            11

          /* TÉCNICO */

          const tecnico =
            nomeTecnicosPdf(
              dados.equipe
            )

          doc.setFont(
            'helvetica',
            'normal'
          )

          doc.setFontSize(
            7.8
          )

          doc.setTextColor(
            71,
            84,
            103
          )

          doc.text(
            `Técnico responsável: ${tecnico}`,
            15,
            y
          )

          y +=
            6

          /* QUILOMETRAGEM */

          const kmSaida =
            formatarKmPdf(
              dados.deslocamento
                ?.km_saida
            )

          const kmRetorno =
            formatarKmPdf(
              dados.deslocamento
                ?.km_retorno
            )

          const kmTotal =
            formatarKmPdf(
              calcularKmTotal(
                dados.deslocamento
              )
            )

          doc.text(
            `KM de saída: ${kmSaida}`,
            15,
            y
          )

          doc.text(
            `KM de retorno: ${kmRetorno}`,
            75,
            y
          )

          doc.setFont(
            'helvetica',
            'bold'
          )

          doc.text(
            `Distância total: ${kmTotal}`,
            140,
            y
          )

          y +=
            8

          /* MATERIAIS */

          doc.setFont(
            'helvetica',
            'bold'
          )

          doc.setFontSize(
            8
          )

          doc.setTextColor(
            16,
            24,
            40
          )

          doc.text(
            'Materiais utilizados',
            15,
            y
          )

          y +=
            5

          if (
            dados.materiais.length ===
            0
          ) {
            doc.setFont(
              'helvetica',
              'normal'
            )

            doc.setFontSize(
              7.5
            )

            doc.setTextColor(
              102,
              112,
              133
            )

            doc.text(
              'Nenhum material registrado.',
              18,
              y
            )

            y +=
              5
          } else {
            dados.materiais.forEach(
              material => {
                y =
                  garantirEspacoPdf(
                    doc,
                    y,
                    7
                  )

                const descricaoMaterial =
                  material
                    .descricao_material ||
                  material
                    .nome_material ||
                  material
                    .descricao ||
                  'Material'

                const quantidade =
                  material.quantidade ??
                  1

                doc.setFont(
                  'helvetica',
                  'normal'
                )

                doc.setFontSize(
                  7.5
                )

                doc.setTextColor(
                  71,
                  84,
                  103
                )

                doc.text(
                  `• ${descricaoMaterial} — Quantidade: ${quantidade}`,
                  18,
                  y
                )

                y +=
                  5
              }
            )
          }

          y +=
            3

          /* RELATO DO TÉCNICO */

          y =
            garantirEspacoPdf(
              doc,
              y,
              24
            )

          doc.setFont(
            'helvetica',
            'bold'
          )

          doc.setFontSize(
            8
          )

          doc.setTextColor(
            16,
            24,
            40
          )

          doc.text(
            'Relato final do técnico',
            15,
            y
          )

          y +=
            5

          const relato =
            chamado
              .resposta_tecnico ||
            chamado
              .observacao_final ||
            chamado
              .observacao ||
            'Nenhum relato final informado.'

          const relatoLinhas =
            doc.splitTextToSize(
              relato,
              175
            )

          y =
            garantirEspacoPdf(
              doc,
              y,
              relatoLinhas.length *
                4 +
                4
            )

          doc.setFont(
            'helvetica',
            'normal'
          )

          doc.setFontSize(
            7.5
          )

          doc.setTextColor(
            71,
            84,
            103
          )

          doc.text(
            relatoLinhas,
            18,
            y
          )

          y +=
            relatoLinhas.length *
            4 +
            4
        }

        /* SEPARADOR */

        if (
          index <
          chamadosCompletos
            .length -
          1
        ) {
          y =
            garantirEspacoPdf(
              doc,
              y,
              10
            )

          doc.setDrawColor(
            234,
            236,
            240
          )

          doc.line(
            15,
            y,
            larguraPagina - 15,
            y
          )

          y +=
            8
        }
      }
    )

    /* =========================
       RODAPÉ
    ========================= */

    const paginas =
      doc.getNumberOfPages()

    for (
      let pagina = 1;
      pagina <= paginas;
      pagina += 1
    ) {
      doc.setPage(
        pagina
      )

      const alturaPagina =
        doc.internal.pageSize
          .getHeight()

      doc.setDrawColor(
        234,
        236,
        240
      )

      doc.line(
        15,
        alturaPagina - 13,
        larguraPagina - 15,
        alturaPagina - 13
      )

      doc.setFont(
        'helvetica',
        'normal'
      )

      doc.setFontSize(
        7
      )

      doc.setTextColor(
        152,
        162,
        179
      )

      doc.text(
        'Avioeste - Relatório de Chamados',
        15,
        alturaPagina - 8
      )

      doc.text(
        `Página ${pagina} de ${paginas}`,
        larguraPagina - 15,
        alturaPagina - 8,
        {
          align:
            'right'
        }
      )
    }

    const nomeArquivo =
      `relatorio-chamados-${formatarDataArquivo(
        agora
      )}.pdf`

    doc.save(
      nomeArquivo
    )

    $q.notify({
      type:
        'positive',

      message:
        'PDF completo gerado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao gerar PDF:',
      error
    )

    $q.notify({
      type:
        'negative',

      message:
        'Não foi possível gerar o relatório em PDF.'
    })
  } finally {
  gerandoPdf.value = false
  }
}

/* =====================================================
   CONTROLE DE PÁGINA DO PDF
===================================================== */

function garantirEspacoPdf(
  doc,
  y,
  alturaNecessaria
) {
  const alturaPagina =
    doc.internal.pageSize
      .getHeight()

  const limite =
    alturaPagina -
    20

  if (
    y +
    alturaNecessaria >
    limite
  ) {
    doc.addPage()

    return 18
  }

  return y
}

/* =====================================================
   TÉCNICO
===================================================== */

function nomeTecnicosPdf(
  equipe
) {
  if (
    !Array.isArray(
      equipe
    ) ||
    equipe.length === 0
  ) {
    return 'Não informado'
  }

  const nomes =
    equipe
      .map(
        funcionario =>
          funcionario.nome
      )
      .filter(Boolean)

  const unicos =
    [...new Set(nomes)]

  return (
    unicos.join(', ') ||
    'Não informado'
  )
}

/* =====================================================
   QUILOMETRAGEM
===================================================== */

function converterNumero(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return NaN
  }

  return Number(
    String(valor)
      .replace(
        ',',
        '.'
      )
  )
}

function calcularKmTotal(
  deslocamento
) {
  if (!deslocamento) {
    return null
  }

  const total =
    converterNumero(
      deslocamento.km_total
    )

  if (
    Number.isFinite(
      total
    )
  ) {
    return total
  }

  const saida =
    converterNumero(
      deslocamento.km_saida
    )

  const retorno =
    converterNumero(
      deslocamento.km_retorno
    )

  if (
    Number.isFinite(
      saida
    ) &&
    Number.isFinite(
      retorno
    ) &&
    retorno >= saida
  ) {
    return (
      retorno -
      saida
    )
  }

  return null
}

function formatarKmPdf(
  valor
) {
  const numero =
    converterNumero(
      valor
    )

  if (
    !Number.isFinite(
      numero
    )
  ) {
    return 'Não informado'
  }

  return (
    numero.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2
      }
    ) +
    ' km'
  )
}

/* =========================
   RESUMO PDF
========================= */

function calcularResumoPdf(
  lista
) {
  return {
    pendentes:
      lista.filter(
        chamado =>
          statusNormalizado(
            chamado.status
          ) ===
          'PENDENTE'
      ).length,

    andamento:
      lista.filter(
        chamado =>
          [
            'ACEITO',
            'EM_ROTA',
            'EM_ATENDIMENTO'
          ].includes(
            statusNormalizado(
              chamado.status
            )
          )
      ).length,

    finalizados:
      lista.filter(
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
  }
}

/* =========================
   FORMATAÇÕES
========================= */

function statusNormalizado(
  valor
) {
  return String(
    valor ||
    ''
  )
    .trim()
    .toUpperCase()
}

function urgenciaNormalizada(
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

function formatarStatus(
  valor
) {
  const status =
    statusNormalizado(
      valor
    )

  const nomes = {
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

    CONCLUIDO:
      'Finalizado',

    CANCELADO:
      'Cancelado'
  }

  return (
    nomes[status] ||
    'Não informado'
  )
}

function formatarUrgencia(
  valor
) {
  const urgencia =
    urgenciaNormalizada(
      valor
    )

  const nomes = {
    ALTA:
      'Alta',

    MEDIA:
      'Média',

    BAIXA:
      'Baixa'
  }

  return (
    nomes[urgencia] ||
    'Não informada'
  )
}

function formatarData(
  valor
) {
  if (!valor) {
    return '-'
  }

  const data =
    new Date(valor)

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return '-'
  }

  return data.toLocaleDateString(
    'pt-BR'
  )
}

function formatarDataHora(
  valor
) {
  if (!valor) {
    return '-'
  }

  const data =
    new Date(valor)

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return '-'
  }

  return data.toLocaleString(
    'pt-BR',
    {
      day:
        '2-digit',

      month:
        '2-digit',

      year:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit'
    }
  )
}

function formatarDataArquivo(
  valor
) {
  const data =
    new Date(valor)

  const dia =
    String(
      data.getDate()
    ).padStart(
      2,
      '0'
    )

  const mes =
    String(
      data.getMonth() +
      1
    ).padStart(
      2,
      '0'
    )

  const ano =
    data.getFullYear()

  return `${ano}-${mes}-${dia}`
}

function descricaoCurta(
  chamado
) {
  const texto =
    String(
      chamado.descricao ||
      'Sem descrição informada.'
    )

  if (
    texto.length <= 70
  ) {
    return texto
  }

  return (
    texto.substring(
      0,
      70
    ) +
    '...'
  )
}

function localChamado(
  chamado
) {
  const cidade =
    chamado.cidade_propriedade ||
    chamado.cidade ||
    ''

  const estado =
    chamado.estado_propriedade ||
    chamado.estado ||
    ''

  if (
    cidade &&
    estado
  ) {
    return `${cidade} - ${estado}`
  }

  return (
    cidade ||
    estado ||
    'Não informada'
  )
}

/* =========================
   CLASSES
========================= */

function classeUrgencia(
  valor
) {
  const urgencia =
    urgenciaNormalizada(
      valor
    )

  if (
    urgencia ===
    'ALTA'
  ) {
    return 'urgencia-alta'
  }

  if (
    urgencia ===
    'MEDIA'
  ) {
    return 'urgencia-media'
  }

  return 'urgencia-baixa'
}

function classeStatus(
  valor
) {
  const status =
    statusNormalizado(
      valor
    )

  if (
    status ===
    'PENDENTE'
  ) {
    return 'status-pendente'
  }

  if (
    [
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO'
    ].includes(
      status
    )
  ) {
    return 'status-andamento'
  }

  if (
    [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(
      status
    )
  ) {
    return 'status-finalizado'
  }

  return 'status-cancelado'
}

onMounted(
  carregarRelatorios
)
</script>

<style scoped>
/* =========================
   PÁGINA
========================= */

.relatorios-page {
  padding:
    28px 32px 48px;
  background:
    #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items:
    flex-start;
  justify-content:
    space-between;
  gap:
    16px;
  margin-bottom:
    24px;
}

.pagina-titulo {
  color:
    #101828;
  font-size:
    30px;
  font-weight:
    800;
}

.pagina-subtitulo {
  margin-top:
    5px;
  color:
    #667085;
  font-size:
    14px;
}

/* =========================
   CARDS
========================= */

.cards-resumo {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap:
    18px;
  margin-bottom:
    20px;
}

.card-resumo {
  min-height:
    150px;
  display:
    flex;
  align-items:
    flex-start;
  gap:
    14px;
  padding:
    20px;
  border:
    1px solid #eaecf0;
  border-radius:
    20px;
  background:
    #ffffff;
  box-shadow:
    none;
}

.card-resumo--clicavel {
  cursor:
    pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.card-resumo--clicavel:hover {
  transform:
    translateY(-2px);
  border-color:
    #fdba74;
}

.card-resumo--ativo {
  border-color:
    #f97316;
  box-shadow:
    0 0 0 2px
    rgba(
      249,
      115,
      22,
      0.08
    );
}

.card-icone {
  width:
    52px;
  height:
    52px;
  display:
    flex;
  align-items:
    center;
  justify-content:
    center;
  flex-shrink:
    0;
  border-radius:
    14px;
}

.card-icone--total {
  color:
    #f97316;
  background:
    #fff1e6;
}

.card-icone--pendente {
  color:
    #d97706;
  background:
    #fffbeb;
}

.card-icone--andamento {
  color:
    #2563eb;
  background:
    #eff6ff;
}

.card-icone--finalizado {
  color:
    #16a34a;
  background:
    #f0fdf4;
}

.card-valor {
  color:
    #101828;
  font-size:
    31px;
  font-weight:
    900;
  line-height:
    1;
}

.card-titulo {
  margin-top:
    10px;
  color:
    #101828;
  font-size:
    14px;
  font-weight:
    800;
}

.card-texto {
  margin-top:
    5px;
  color:
    #98a2b3;
  font-size:
    10px;
}

/* =========================
   GRÁFICOS
========================= */

.graficos-grid {
  display:
    grid;
  grid-template-columns:
    1.05fr 1fr;
  gap:
    20px;
  margin-bottom:
    20px;
}

.grafico-card,
.relatorio-card {
  padding:
    22px;
  border:
    1px solid #eaecf0;
  border-radius:
    20px;
  background:
    #ffffff;
  box-shadow:
    none;
}

.card-topo,
.relatorio-topo {
  display:
    flex;
  align-items:
    flex-start;
  justify-content:
    space-between;
  gap:
    16px;
}

.bloco-titulo {
  color:
    #101828;
  font-size:
    15px;
  font-weight:
    900;
}

.bloco-subtitulo {
  margin-top:
    4px;
  color:
    #98a2b3;
  font-size:
    10px;
}

.icone-lateral {
  width:
    44px;
  height:
    44px;
  display:
    flex;
  align-items:
    center;
  justify-content:
    center;
  border-radius:
    13px;
  color:
    #f97316;
  background:
    #fff1e6;
}

.icone-lateral--urgencia {
  color:
    #dc2626;
  background:
    #fef2f2;
}

.grafico-area {
  position:
    relative;
  min-height:
    290px;
  margin-top:
    15px;
}

.grafico-loading {
  min-height:
    280px;
  display:
    flex;
  align-items:
    center;
  justify-content:
    center;
}

/* =========================
   RELATÓRIO
========================= */

.relatorio-acoes {
  display:
    flex;
  align-items:
    center;
  gap:
    6px;
}

.filtro-atual {
  display:
    flex;
  align-items:
    center;
  justify-content:
    space-between;
  gap:
    15px;
  margin-top:
    18px;
  padding:
    11px 13px;
  border-radius:
    10px;
  color:
    #667085;
  background:
    #f9fafb;
  font-size:
    9px;
}

.filtro-atual strong {
  color:
    #344054;
}

.selecionar-todos {
  display:
    flex;
  align-items:
    center;
  justify-content:
    space-between;
  gap:
    15px;
  padding:
    14px 4px;
  border-bottom:
    1px solid #eaecf0;
  color:
    #98a2b3;
  font-size:
    9px;
}

.chamados-relatorio-lista {
  display:
    flex;
  flex-direction:
    column;
}

.chamado-relatorio-item {
  display:
    grid;
  grid-template-columns:
    34px
    48px
    minmax(220px, 1fr)
    90px
    120px
    90px;
  align-items:
    center;
  gap:
    10px;
  padding:
    14px 4px;
  border-bottom:
    1px solid #f2f4f7;
}

.chamado-relatorio-item:last-child {
  border-bottom:
    none;
}

.chamado-relatorio-id {
  color:
    #f97316;
  font-size:
    10px;
  font-weight:
    900;
}

.chamado-relatorio-principal {
  min-width:
    0;
}

.chamado-relatorio-principal strong {
  display:
    block;
  overflow:
    hidden;
  color:
    #344054;
  font-size:
    10px;
  font-weight:
    800;
  text-overflow:
    ellipsis;
  white-space:
    nowrap;
}

.chamado-relatorio-principal span {
  display:
    block;
  overflow:
    hidden;
  margin-top:
    3px;
  color:
    #98a2b3;
  font-size:
    8px;
  text-overflow:
    ellipsis;
  white-space:
    nowrap;
}

.chamado-relatorio-info span,
.chamado-relatorio-data span {
  display:
    block;
  margin-bottom:
    4px;
  color:
    #98a2b3;
  font-size:
    7px;
  text-transform:
    uppercase;
}

.chamado-relatorio-data strong {
  color:
    #475467;
  font-size:
    8px;
}

/* =========================
   BADGES
========================= */

.urgencia-alta,
.urgencia-media,
.urgencia-baixa,
.status-pendente,
.status-andamento,
.status-finalizado,
.status-cancelado {
  padding:
    6px 9px;
}

.urgencia-alta {
  color:
    #dc2626;
  background:
    #fee2e2;
}

.urgencia-media {
  color:
    #d97706;
  background:
    #fef3c7;
}

.urgencia-baixa {
  color:
    #2563eb;
  background:
    #dbeafe;
}

.status-pendente {
  color:
    #d97706;
  background:
    #fef3c7;
}

.status-andamento {
  color:
    #2563eb;
  background:
    #dbeafe;
}

.status-finalizado {
  color:
    #16a34a;
  background:
    #dcfce7;
}

.status-cancelado {
  color:
    #dc2626;
  background:
    #fee2e2;
}

/* =========================
   VAZIO
========================= */

.sem-chamados {
  min-height:
    200px;
  display:
    flex;
  flex-direction:
    column;
  align-items:
    center;
  justify-content:
    center;
  gap:
    6px;
  color:
    #98a2b3;
  text-align:
    center;
}

.sem-chamados strong {
  color:
    #475467;
  font-size:
    11px;
}

.sem-chamados span {
  font-size:
    9px;
}

/* =========================
   DARK MODE
========================= */

.relatorios-page--dark {
  background:
    #0d0f12;
}

.relatorios-page--dark
.pagina-titulo,
.relatorios-page--dark
.card-valor,
.relatorios-page--dark
.card-titulo,
.relatorios-page--dark
.bloco-titulo {
  color:
    #f9fafb;
}

.relatorios-page--dark
.card-resumo,
.relatorios-page--dark
.grafico-card,
.relatorios-page--dark
.relatorio-card {
  border-color:
    #292d33;
  background:
    #15181d;
}

.relatorios-page--dark
.filtro-atual {
  background:
    #1b1e24;
}

.relatorios-page--dark
.filtro-atual strong,
.relatorios-page--dark
.chamado-relatorio-principal strong,
.relatorios-page--dark
.chamado-relatorio-data strong {
  color:
    #f2f4f7;
}

.relatorios-page--dark
.selecionar-todos,
.relatorios-page--dark
.chamado-relatorio-item {
  border-color:
    #292d33;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 1250px) {
  .cards-resumo {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .graficos-grid {
    grid-template-columns:
      1fr;
  }

  .chamado-relatorio-item {
    grid-template-columns:
      34px
      45px
      minmax(190px, 1fr)
      90px
      110px;
  }

  .chamado-relatorio-data {
    display:
      none;
  }
}

@media (max-width: 850px) {
  .relatorios-page {
    padding:
      22px 16px 40px;
  }

  .pagina-cabecalho,
  .relatorio-topo {
    flex-direction:
      column;
  }

  .relatorio-acoes {
    width:
      100%;
    justify-content:
      flex-end;
  }

  .chamado-relatorio-item {
    grid-template-columns:
      34px
      42px
      minmax(0, 1fr)
      105px;
  }

  .chamado-relatorio-info:first-of-type {
    display:
      none;
  }
}

@media (max-width: 600px) {
  .cards-resumo {
    grid-template-columns:
      1fr;
  }

  .pagina-titulo {
    font-size:
      25px;
  }

  .relatorio-acoes {
    align-items:
      stretch;
    flex-direction:
      column;
  }

  .chamado-relatorio-item {
    grid-template-columns:
      30px
      40px
      minmax(0, 1fr);
  }

  .chamado-relatorio-info,
  .chamado-relatorio-data {
    display:
      none;
  }
}
</style>