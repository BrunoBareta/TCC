<template>
  <q-page
    class="relatorios-admin-page"
    :class="{
      'relatorios-admin-page--dark': $q.dark.isActive
    }"
  >
    <!-- =====================================================
         CABEÇALHO
    ====================================================== -->

    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Relatórios
        </div>

        <div class="pagina-subtitulo">
          Consulte os atendimentos e gere relatórios administrativos em PDF.
        </div>
      </div>

      <q-btn
        outline
        no-caps
        color="orange"
        icon="refresh"
        label="Atualizar"
        :loading="carregando"
        @click="carregarDados"
      />
    </div>

    <!-- =====================================================
         ERRO
    ====================================================== -->

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
          @click="carregarDados"
        />
      </template>
    </q-banner>

    <!-- =====================================================
         FILTROS PRINCIPAIS
    ====================================================== -->

    <div class="filtros-card">
      <div class="filtros-principais">
        <!-- BUSCA -->

        <q-input
          v-model="filtros.busca"
          outlined
          clearable
          class="filtro-busca"
          placeholder="Buscar chamado, produtor ou propriedade..."
        >
          <template #prepend>
            <q-icon
              name="search"
              size="20px"
            />
          </template>
        </q-input>

        <!-- STATUS -->

        <q-select
          v-model="filtros.status"
          outlined
          clearable
          emit-value
          map-options
          label="Status"
          :options="opcoesStatus"
        />

        <!-- PERÍODO -->

        <q-select
          v-model="filtros.periodo"
          outlined
          emit-value
          map-options
          label="Período"
          :options="opcoesPeriodo"
        />

        <!-- MAIS FILTROS -->

        <q-btn
          outline
          no-caps
          color="orange"
          :icon="
            mostrarMaisFiltros
              ? 'expand_less'
              : 'tune'
          "
          :label="
            mostrarMaisFiltros
              ? 'Ocultar filtros'
              : 'Mais filtros'
          "
          @click="
            mostrarMaisFiltros =
              !mostrarMaisFiltros
          "
        />

        <!-- LIMPAR -->

        <q-btn
          v-if="possuiFiltros"
          flat
          no-caps
          color="grey-7"
          icon="filter_alt_off"
          label="Limpar"
          @click="limparFiltros"
        />
      </div>

      <!-- ===================================================
           FILTROS AVANÇADOS
      ==================================================== -->

      <q-slide-transition>
        <div
          v-show="mostrarMaisFiltros"
          class="filtros-avancados"
        >
          <q-select
            v-model="filtros.produtor"
            outlined
            clearable
            emit-value
            map-options
            label="Produtor"
            :options="opcoesProdutores"
          />

          <q-select
            v-model="filtros.propriedade"
            outlined
            clearable
            emit-value
            map-options
            label="Propriedade"
            :options="opcoesPropriedades"
          />

          <q-select
            v-model="filtros.tecnico"
            outlined
            clearable
            emit-value
            map-options
            label="Técnico"
            :options="opcoesTecnicos"
          />

          <q-select
            v-model="filtros.urgencia"
            outlined
            clearable
            emit-value
            map-options
            label="Urgência"
            :options="opcoesUrgencia"
          />
        </div>
      </q-slide-transition>
    </div>

    <!-- =====================================================
         LISTA
    ====================================================== -->

    <div class="chamados-card">
      <div class="chamados-topo">
        <div>
          <div class="secao-titulo">
            Chamados para o relatório
          </div>

          <div class="secao-subtitulo">
            {{ textoQuantidade }}
          </div>
        </div>

        <div class="chamados-acoes">
          <q-btn
            v-if="chamadosSelecionadosIds.length"
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
            :disable="
              chamadosSelecionadosIds.length === 0
            "
            :label="
              chamadosSelecionadosIds.length
                ? `Gerar PDF (${chamadosSelecionadosIds.length})`
                : 'Gerar PDF'
            "
            @click="gerarPdf"
          />
        </div>
      </div>

      <!-- SELEÇÃO GERAL -->

      <div
        v-if="chamadosFiltrados.length"
        class="selecao-geral"
      >
        <q-checkbox
          v-model="todosSelecionados"
          color="orange"
          label="Selecionar todos"
        />

        <span>
          {{ chamadosSelecionadosIds.length }}
          selecionado(s)
        </span>
      </div>

      <!-- CABEÇALHO -->

      <div
        v-if="chamadosFiltrados.length"
        class="lista-cabecalho"
      >
        <div></div>

        <div>
          Chamado
        </div>

        <div>
          Solicitação
        </div>

        <div>
          Produtor / propriedade
        </div>

        <div>
          Técnico
        </div>

        <div>
          Urgência
        </div>

        <div>
          Status
        </div>

        <div>
          Abertura
        </div>
      </div>

      <!-- CHAMADOS -->

      <div
        v-if="
          chamadosFiltrados.length &&
          !carregando
        "
        class="lista-chamados"
      >
        <div
          v-for="chamado in chamadosFiltrados"
          :key="chamado.id_chamado"
          class="chamado-item"
        >
          <div>
            <q-checkbox
              v-model="chamadosSelecionadosIds"
              :val="Number(chamado.id_chamado)"
              color="orange"
            />
          </div>

          <div class="chamado-id">
            #{{ chamado.id_chamado }}
          </div>

          <div class="chamado-solicitacao">
            <strong>
              {{
                chamado.problema ||
                'Solicitação de atendimento'
              }}
            </strong>

            <span>
              {{
                descricaoCurta(
                  chamado.descricao
                )
              }}
            </span>
          </div>

          <div class="chamado-produtor">
            <strong>
              {{ nomeProdutor(chamado) }}
            </strong>

            <span>
              {{
                chamado.nome_propriedade ||
                'Propriedade não informada'
              }}
            </span>
          </div>

          <div class="chamado-tecnico">
            {{ nomeTecnico(chamado) }}
          </div>

          <div>
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

          <div>
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

          <div class="chamado-data">
            {{
              formatarData(
                chamado.data_abertura
              )
            }}
          </div>
        </div>
      </div>

      <!-- CARREGANDO -->

      <div
        v-if="carregando"
        class="estado-vazio"
      >
        <q-spinner
          color="orange"
          size="36px"
        />

        <span>
          Carregando atendimentos...
        </span>
      </div>

      <!-- SEM RESULTADOS -->

      <div
        v-else-if="
          !chamadosFiltrados.length
        "
        class="estado-vazio"
      >
        <div class="estado-vazio-icone">
          <q-icon
            name="search_off"
            size="30px"
          />
        </div>

        <strong>
          Nenhum chamado encontrado
        </strong>

        <span>
          Tente alterar os filtros utilizados.
        </span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  useQuasar
} from 'quasar'

import {
  jsPDF
} from 'jspdf'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

import deslocamentoService from
  'src/services/deslocamentoService'

import materialService from
  'src/services/materialService'

import usuarioService from
  'src/services/usuarioService'

const $q = useQuasar()

/* =====================================================
   ESTADOS
===================================================== */

const chamados =
  ref([])

const usuarios =
  ref([])

const equipesPorChamado =
  ref({})

const carregando =
  ref(false)

const gerandoPdf =
  ref(false)

const erro =
  ref('')

const mostrarMaisFiltros =
  ref(false)

const chamadosSelecionadosIds =
  ref([])

const filtros =
  reactive({
    busca: '',
    status: null,
    periodo: 'TODOS',
    produtor: null,
    propriedade: null,
    tecnico: null,
    urgencia: null
  })

/* =====================================================
   OPÇÕES
===================================================== */

const opcoesStatus = [
  {
    label: 'Pendentes',
    value: 'PENDENTE'
  },
  {
    label: 'Em andamento',
    value: 'ANDAMENTO'
  },
  {
    label: 'Finalizados',
    value: 'FINALIZADO'
  },
  {
    label: 'Cancelados',
    value: 'CANCELADO'
  }
]

const opcoesPeriodo = [
  {
    label: 'Todos',
    value: 'TODOS'
  },
  {
    label: 'Hoje',
    value: 'HOJE'
  },
  {
    label: 'Últimos 7 dias',
    value: '7_DIAS'
  },
  {
    label: 'Últimos 30 dias',
    value: '30_DIAS'
  },
  {
    label: 'Este mês',
    value: 'MES_ATUAL'
  }
]

const opcoesUrgencia = [
  {
    label: 'Alta',
    value: 'ALTA'
  },
  {
    label: 'Média',
    value: 'MEDIA'
  },
  {
    label: 'Baixa',
    value: 'BAIXA'
  }
]

/* =====================================================
   USUÁRIOS
===================================================== */

const mapaUsuarios =
  computed(() => {
    const mapa =
      new Map()

    usuarios.value.forEach(
      usuario => {
        mapa.set(
          Number(
            usuario.id_usuario
          ),
          usuario
        )
      }
    )

    return mapa
  })

const opcoesProdutores =
  computed(() => {
    return usuarios.value
      .filter(
        usuario =>
          String(
            usuario.tipo_usuario ||
            ''
          ).toUpperCase() ===
          'PRODUTOR'
      )
      .map(
        usuario => ({
          label:
            usuario.nome ||
            `Produtor #${usuario.id_usuario}`,

          value:
            Number(
              usuario.id_usuario
            )
        })
      )
      .sort(
        (a, b) =>
          a.label.localeCompare(
            b.label,
            'pt-BR'
          )
      )
  })

const opcoesTecnicos =
  computed(() => {
    return usuarios.value
      .filter(
        usuario =>
          [
            'FUNCIONARIO',
            'TECNICO'
          ].includes(
            String(
              usuario.tipo_usuario ||
              ''
            ).toUpperCase()
          )
      )
      .map(
        usuario => ({
          label:
            usuario.nome ||
            `Técnico #${usuario.id_usuario}`,

          value:
            Number(
              usuario.id_usuario
            )
        })
      )
      .sort(
        (a, b) =>
          a.label.localeCompare(
            b.label,
            'pt-BR'
          )
      )
  })

const opcoesPropriedades =
  computed(() => {
    const nomes =
      chamados.value
        .map(
          chamado =>
            String(
              chamado.nome_propriedade ||
              ''
            ).trim()
        )
        .filter(Boolean)

    return [
      ...new Set(
        nomes
      )
    ]
      .sort(
        (a, b) =>
          a.localeCompare(
            b,
            'pt-BR'
          )
      )
      .map(
        nome => ({
          label: nome,
          value: nome
        })
      )
  })

/* =====================================================
   POSSUI FILTROS
===================================================== */

const possuiFiltros =
  computed(() => {
    return Boolean(
      String(
        filtros.busca ||
        ''
      ).trim() ||
      filtros.status ||
      filtros.periodo !==
        'TODOS' ||
      filtros.produtor ||
      filtros.propriedade ||
      filtros.tecnico ||
      filtros.urgencia
    )
  })

/* =====================================================
   FILTRAGEM
===================================================== */

const chamadosFiltrados =
  computed(() => {
    let lista =
      [...chamados.value]

    /* BUSCA */

    const busca =
      normalizarBusca(
        filtros.busca
      )

    if (busca) {
      lista =
        lista.filter(
          chamado => {
            const texto =
              normalizarBusca(
                [
                  chamado.id_chamado,
                  chamado.problema,
                  chamado.descricao,
                  nomeProdutor(
                    chamado
                  ),
                  chamado.nome_propriedade,
                  nomeTecnico(
                    chamado
                  ),
                  chamado.cidade_propriedade,
                  chamado.estado_propriedade
                ]
                  .filter(Boolean)
                  .join(' ')
              )

            return texto.includes(
              busca
            )
          }
        )
    }

    /* STATUS */

    if (filtros.status) {
      lista =
        lista.filter(
          chamado =>
            chamadoPertenceStatus(
              chamado.status,
              filtros.status
            )
        )
    }

    /* PERÍODO */

    if (
      filtros.periodo !==
      'TODOS'
    ) {
      lista =
        lista.filter(
          chamado =>
            pertencePeriodo(
              chamado.data_abertura,
              filtros.periodo
            )
        )
    }

    /* PRODUTOR */

    if (filtros.produtor) {
      lista =
        lista.filter(
          chamado =>
            Number(
              chamado.id_usuario
            ) ===
            Number(
              filtros.produtor
            )
        )
    }

    /* PROPRIEDADE */

    if (filtros.propriedade) {
      lista =
        lista.filter(
          chamado =>
            String(
              chamado.nome_propriedade ||
              ''
            ) ===
            String(
              filtros.propriedade
            )
        )
    }

    /* TÉCNICO */

    if (filtros.tecnico) {
      lista =
        lista.filter(
          chamado => {
            const equipe =
              equipeChamado(
                chamado.id_chamado
              )

            return equipe.some(
              tecnico =>
                Number(
                  tecnico.id_funcionario ||
                  tecnico.id_usuario
                ) ===
                Number(
                  filtros.tecnico
                )
            )
          }
        )
    }

    /* URGÊNCIA */

    if (filtros.urgencia) {
      lista =
        lista.filter(
          chamado =>
            urgenciaNormalizada(
              chamado.urgencia
            ) ===
            filtros.urgencia
        )
    }

    return lista.sort(
      (a, b) =>
        dataTimestamp(
          b.data_abertura
        ) -
        dataTimestamp(
          a.data_abertura
        )
    )
  })

const textoQuantidade =
  computed(() => {
    const quantidade =
      chamadosFiltrados.value
        .length

    if (quantidade === 1) {
      return '1 chamado encontrado'
    }

    return `${quantidade} chamados encontrados`
  })

/* =====================================================
   SELECIONAR TODOS
===================================================== */

const todosSelecionados =
  computed({
    get() {
      if (
        chamadosFiltrados
          .value.length === 0
      ) {
        return false
      }

      return chamadosFiltrados
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
      const ids =
        chamadosFiltrados
          .value
          .map(
            chamado =>
              Number(
                chamado.id_chamado
              )
          )

      if (selecionado) {
        chamadosSelecionadosIds
          .value =
          [
            ...new Set([
              ...chamadosSelecionadosIds
                .value,
              ...ids
            ])
          ]

        return
      }

      chamadosSelecionadosIds
        .value =
        chamadosSelecionadosIds
          .value
          .filter(
            id =>
              !ids.includes(
                id
              )
          )
    }
  })

/* =====================================================
   CARREGAMENTO
===================================================== */

async function carregarDados() {
  carregando.value =
    true

  erro.value =
    ''

  try {
    const [
      respostaChamados,
      respostaUsuarios
    ] =
      await Promise.all([
        chamadoService.listar(),
        usuarioService.listar()
      ])

    chamados.value =
      extrairLista(
        respostaChamados,
        ['chamados']
      )

    usuarios.value =
      extrairLista(
        respostaUsuarios,
        ['usuarios']
      )

    await carregarEquipes()

    limparSelecao()
  } catch (error) {
    console.error(
      'Erro ao carregar relatórios:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar os relatórios.'
  } finally {
    carregando.value =
      false
  }
}

/* =====================================================
   EQUIPES
===================================================== */

async function carregarEquipes() {
  const resultados =
    await Promise.all(
      chamados.value.map(
        async chamado => {
          const idChamado =
            Number(
              chamado.id_chamado
            )

          try {
            const resposta =
              await chamadoFuncionarioService
                .listarPorChamado(
                  idChamado
                )

            return [
              idChamado,
              extrairLista(
                resposta,
                [
                  'funcionarios',
                  'equipe'
                ]
              )
            ]
          } catch (error) {
            console.warn(
              `Erro ao carregar equipe do chamado #${idChamado}:`,
              error
            )

            return [
              idChamado,
              []
            ]
          }
        }
      )
    )

  equipesPorChamado.value =
    Object.fromEntries(
      resultados
    )
}

function equipeChamado(
  idChamado
) {
  return (
    equipesPorChamado
      .value[
        Number(
          idChamado
        )
      ] ||
    []
  )
}

function nomeTecnico(
  chamado
) {
  const equipe =
    equipeChamado(
      chamado.id_chamado
    )

  if (!equipe.length) {
    return 'Não atribuído'
  }

  const nomes =
    equipe
      .map(
        tecnico =>
          tecnico.nome
      )
      .filter(Boolean)

  return (
    [
      ...new Set(
        nomes
      )
    ].join(', ') ||
    'Não atribuído'
  )
}

function nomeProdutor(
  chamado
) {
  const usuario =
    mapaUsuarios.value
      .get(
        Number(
          chamado.id_usuario
        )
      )

  return (
    usuario?.nome ||
    'Não informado'
  )
}

/* =====================================================
   PERÍODO
===================================================== */

function pertencePeriodo(
  valor,
  periodo
) {
  if (!valor) {
    return false
  }

  const data =
    new Date(valor)

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return false
  }

  const hoje =
    new Date()

  const inicioHoje =
    new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    )

  const dataComparacao =
    new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate()
    )

  if (
    periodo ===
    'HOJE'
  ) {
    return (
      dataComparacao.getTime() ===
      inicioHoje.getTime()
    )
  }

  if (
    periodo ===
    '7_DIAS'
  ) {
    const inicio =
      new Date(
        inicioHoje
      )

    inicio.setDate(
      inicio.getDate() - 6
    )

    return (
      dataComparacao >= inicio &&
      dataComparacao <= inicioHoje
    )
  }

  if (
    periodo ===
    '30_DIAS'
  ) {
    const inicio =
      new Date(
        inicioHoje
      )

    inicio.setDate(
      inicio.getDate() - 29
    )

    return (
      dataComparacao >= inicio &&
      dataComparacao <= inicioHoje
    )
  }

  if (
    periodo ===
    'MES_ATUAL'
  ) {
    return (
      data.getFullYear() ===
        hoje.getFullYear() &&
      data.getMonth() ===
        hoje.getMonth()
    )
  }

  return true
}

/* =====================================================
   LIMPAR
===================================================== */

function limparSelecao() {
  chamadosSelecionadosIds
    .value =
    []
}

function limparFiltros() {
  filtros.busca =
    ''

  filtros.status =
    null

  filtros.periodo =
    'TODOS'

  filtros.produtor =
    null

  filtros.propriedade =
    null

  filtros.tecnico =
    null

  filtros.urgencia =
    null

  mostrarMaisFiltros.value =
    false

  limparSelecao()
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
          dataTimestamp(
            b.data_abertura
          ) -
          dataTimestamp(
            a.data_abertura
          )
      )

  if (!selecionados.length) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione pelo menos um chamado.'
    })

    return
  }

  gerandoPdf.value =
    true

  try {
    const dados =
      await Promise.all(
        selecionados.map(
          chamado =>
            buscarDadosCompletos(
              chamado
            )
        )
      )

    criarPdf(dados)

    $q.notify({
      type: 'positive',
      message:
        'Relatório administrativo gerado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao gerar PDF:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        'Não foi possível gerar o PDF.'
    })
  } finally {
    gerandoPdf.value =
      false
  }
}

/* =====================================================
   DADOS COMPLETOS
===================================================== */

async function buscarDadosCompletos(
  chamadoBase
) {
  const idChamado =
    Number(
      chamadoBase.id_chamado
    )

  const [
    respostaChamado,
    respostaEquipe
  ] =
    await Promise.allSettled([
      chamadoService
        .buscarPorId(
          idChamado
        ),

      chamadoFuncionarioService
        .listarPorChamado(
          idChamado
        )
    ])

  const chamado =
    respostaChamado.status ===
    'fulfilled'
      ? (
          extrairObjeto(
            respostaChamado.value,
            'chamado'
          ) ||
          chamadoBase
        )
      : chamadoBase

  const equipe =
    respostaEquipe.status ===
    'fulfilled'
      ? extrairLista(
          respostaEquipe.value,
          [
            'funcionarios',
            'equipe'
          ]
        )
      : equipeChamado(
          idChamado
        )

  if (
    !chamadoPertenceStatus(
      chamado.status,
      'FINALIZADO'
    )
  ) {
    return {
      chamado,
      equipe,
      deslocamento: null,
      materiais: []
    }
  }

  const [
    respostaDeslocamento,
    respostaMateriais
  ] =
    await Promise.allSettled([
      deslocamentoService
        .buscarPorChamado(
          idChamado
        ),

      materialService
        .listarPorChamado(
          idChamado
        )
    ])

  const deslocamento =
    respostaDeslocamento.status ===
    'fulfilled'
      ? extrairObjeto(
          respostaDeslocamento.value,
          'deslocamento'
        )
      : null

  const materiais =
    respostaMateriais.status ===
    'fulfilled'
      ? extrairLista(
          respostaMateriais.value,
          ['materiais']
        )
      : []

  return {
    chamado,
    equipe,
    deslocamento,
    materiais
  }
}

/* =====================================================
   CRIAR PDF
===================================================== */

function criarPdf(
  atendimentos
) {
  const doc =
    new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

  const agora =
    new Date()

  desenharCabecalhoPdf(
    doc,
    agora
  )

  let y =
    58

  atendimentos.forEach(
    (
      dados,
      index
    ) => {
      const chamado =
        dados.chamado

      if (
        index > 0
      ) {
        y =
          garantirEspacoPdf(
            doc,
            y,
            55
          )

        doc.setDrawColor(
          220,
          224,
          230
        )

        doc.line(
          15,
          y,
          195,
          y
        )

        y +=
          10
      }

      y =
        garantirEspacoPdf(
          doc,
          y,
          48
        )

      /* CHAMADO */

      doc.setFont(
        'helvetica',
        'bold'
      )

      doc.setFontSize(
        11
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
        48,
        y
      )

      y +=
        9

      /* PRODUTOR / PROPRIEDADE */

      doc.setFont(
        'helvetica',
        'normal'
      )

      doc.setFontSize(
        8
      )

      doc.setTextColor(
        71,
        84,
        103
      )

      doc.text(
        `Produtor: ${nomeProdutor(chamado)}`,
        15,
        y
      )

      doc.text(
        `Propriedade: ${
          chamado.nome_propriedade ||
          'Não informada'
        }`,
        105,
        y
      )

      y +=
        6

      /* TÉCNICO / LOCAL */

      doc.text(
        `Técnico: ${nomesEquipePdf(
          dados.equipe
        )}`,
        15,
        y
      )

      const local =
        localChamado(
          chamado
        )

      const localLinhas =
        doc.splitTextToSize(
          `Localização: ${local}`,
          88
        )

      doc.text(
        localLinhas,
        105,
        y
      )

      y +=
        Math.max(
          6,
          localLinhas.length *
            4
        )

      /* STATUS */

      doc.text(
        `Urgência: ${formatarUrgencia(
          chamado.urgencia
        )}`,
        15,
        y
      )

      doc.text(
        `Status: ${formatarStatus(
          chamado.status
        )}`,
        65,
        y
      )

      doc.text(
        `Abertura: ${formatarData(
          chamado.data_abertura
        )}`,
        115,
        y
      )

      y +=
        6

      if (
        chamado.data_finalizacao ||
        chamado.data_fechamento
      ) {
        doc.text(
          `Finalização: ${formatarDataHora(
            chamado.data_finalizacao ||
            chamado.data_fechamento
          )}`,
          15,
          y
        )

        y +=
          7
      }

      /* DESCRIÇÃO */

      doc.setFont(
        'helvetica',
        'bold'
      )

      doc.setTextColor(
        16,
        24,
        40
      )

      doc.text(
        'Descrição',
        15,
        y
      )

      y +=
        5

      const descricao =
        chamado.descricao ||
        'Nenhuma descrição informada.'

      const descricaoLinhas =
        doc.splitTextToSize(
          descricao,
          178
        )

      y =
        garantirEspacoPdf(
          doc,
          y,
          descricaoLinhas.length *
            4 +
            5
        )

      doc.setFont(
        'helvetica',
        'normal'
      )

      doc.setTextColor(
        71,
        84,
        103
      )

      doc.text(
        descricaoLinhas,
        18,
        y
      )

      y +=
        descricaoLinhas.length *
        4 +
        7

      /* ATENDIMENTO FINALIZADO */

      if (
        chamadoPertenceStatus(
          chamado.status,
          'FINALIZADO'
        )
      ) {
        y =
          adicionarAssistenciaPdf(
            doc,
            y,
            dados
          )
      }
    }
  )

  adicionarRodapePdf(
    doc
  )

  doc.save(
    `relatorio-administrativo-${formatarDataArquivo(
      agora
    )}.pdf`
  )
}

/* =====================================================
   CABEÇALHO DO PDF
===================================================== */

function desenharCabecalhoPdf(
  doc,
  agora
) {
  const largura =
    doc.internal.pageSize
      .getWidth()

  doc.setFillColor(
    249,
    115,
    22
  )

  doc.rect(
    0,
    0,
    largura,
    5,
    'F'
  )

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(
    19
  )

  doc.setTextColor(
    16,
    24,
    40
  )

  doc.text(
    'Avioeste',
    15,
    18
  )

  doc.setFontSize(
    11
  )

  doc.setTextColor(
    249,
    115,
    22
  )

  doc.text(
    'Relatório Administrativo de Atendimentos',
    15,
    26
  )

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

  doc.text(
    `Gerado em: ${formatarDataHora(
      agora
    )}`,
    15,
    36
  )

  const filtrosTexto =
    montarDescricaoFiltros()

  const linhas =
    doc.splitTextToSize(
      filtrosTexto,
      180
    )

  doc.text(
    linhas,
    15,
    42
  )

  const yLinha =
    44 +
    linhas.length *
      4

  doc.setDrawColor(
    234,
    236,
    240
  )

  doc.line(
    15,
    yLinha,
    195,
    yLinha
  )
}

/* =====================================================
   DADOS DA ASSISTÊNCIA
===================================================== */

function adicionarAssistenciaPdf(
  doc,
  yInicial,
  dados
) {
  let y =
    garantirEspacoPdf(
      doc,
      yInicial,
      45
    )

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
    12

  /* KM */

  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(
    7.7
  )

  doc.setTextColor(
    71,
    84,
    103
  )

  doc.text(
    `KM de saída: ${valorKm(
      dados.deslocamento
        ?.km_saida
    )}`,
    15,
    y
  )

  doc.text(
    `KM de retorno: ${valorKm(
      dados.deslocamento
        ?.km_retorno
    )}`,
    78,
    y
  )

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.text(
    `Distância total: ${valorKm(
      calcularKmTotal(
        dados.deslocamento
      )
    )}`,
    142,
    y
  )

  y +=
    9

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
    6

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
      6
  } else {
    dados.materiais.forEach(
      material => {
        y =
          garantirEspacoPdf(
            doc,
            y,
            7
          )

        const nome =
          material.nome_material ||
          material.descricao_material ||
          material.descricao ||
          material.material ||
          'Material'

        const quantidade =
          formatarQuantidade(
            material.quantidade
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

        const linha =
          doc.splitTextToSize(
            `• ${nome} — Quantidade: ${quantidade}`,
            175
          )

        doc.text(
          linha,
          18,
          y
        )

        y +=
          linha.length *
          4 +
          2
      }
    )
  }

  y +=
    3

  /* RELATO */

  y =
    garantirEspacoPdf(
      doc,
      y,
      20
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
    6

  const relato =
    dados.chamado.resposta_tecnico ||
    dados.chamado.observacao_final ||
    dados.chamado.observacao ||
    'Nenhum relato final registrado.'

  const linhas =
    doc.splitTextToSize(
      relato,
      175
    )

  y =
    garantirEspacoPdf(
      doc,
      y,
      linhas.length *
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
    linhas,
    18,
    y
  )

  y +=
    linhas.length *
    4 +
    6

  return y
}

/* =====================================================
   TEXTO DOS FILTROS NO PDF
===================================================== */

function montarDescricaoFiltros() {
  const partes = []

  const periodo =
    opcoesPeriodo.find(
      item =>
        item.value ===
        filtros.periodo
    )

  if (
    periodo &&
    filtros.periodo !==
      'TODOS'
  ) {
    partes.push(
      `Período: ${periodo.label}`
    )
  }

  if (filtros.status) {
    const status =
      opcoesStatus.find(
        item =>
          item.value ===
          filtros.status
      )

    if (status) {
      partes.push(
        `Status: ${status.label}`
      )
    }
  }

  if (filtros.produtor) {
    const produtor =
      opcoesProdutores.value
        .find(
          item =>
            Number(
              item.value
            ) ===
            Number(
              filtros.produtor
            )
        )

    if (produtor) {
      partes.push(
        `Produtor: ${produtor.label}`
      )
    }
  }

  if (filtros.propriedade) {
    partes.push(
      `Propriedade: ${filtros.propriedade}`
    )
  }

  if (filtros.tecnico) {
    const tecnico =
      opcoesTecnicos.value
        .find(
          item =>
            Number(
              item.value
            ) ===
            Number(
              filtros.tecnico
            )
        )

    if (tecnico) {
      partes.push(
        `Técnico: ${tecnico.label}`
      )
    }
  }

  if (filtros.urgencia) {
    partes.push(
      `Urgência: ${formatarUrgencia(
        filtros.urgencia
      )}`
    )
  }

  if (
    String(
      filtros.busca ||
      ''
    ).trim()
  ) {
    partes.push(
      `Busca: ${filtros.busca.trim()}`
    )
  }

  if (!partes.length) {
    return 'Consulta geral de atendimentos.'
  }

  return partes.join(
    ' | '
  )
}

/* =====================================================
   STATUS
===================================================== */

function statusNormalizado(
  valor
) {
  return String(
    valor ||
    ''
  )
    .trim()
    .toUpperCase()
    .replaceAll(
      ' ',
      '_'
    )
}

function chamadoPertenceStatus(
  status,
  filtro
) {
  const atual =
    statusNormalizado(
      status
    )

  if (
    filtro ===
    'ANDAMENTO'
  ) {
    return [
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO'
    ].includes(
      atual
    )
  }

  if (
    filtro ===
    'FINALIZADO'
  ) {
    return [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(
      atual
    )
  }

  return atual === filtro
}

function formatarStatus(
  valor
) {
  const nomes = {
    PENDENTE:
      'Pendente',

    ACEITO:
      'Aceito',

    EM_ROTA:
      'Em deslocamento',

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
    nomes[
      statusNormalizado(
        valor
      )
    ] ||
    'Não informado'
  )
}

/* =====================================================
   URGÊNCIA
===================================================== */

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

function formatarUrgencia(
  valor
) {
  const nomes = {
    ALTA: 'Alta',
    MEDIA: 'Média',
    BAIXA: 'Baixa'
  }

  return (
    nomes[
      urgenciaNormalizada(
        valor
      )
    ] ||
    'Não informada'
  )
}

/* =====================================================
   CLASSES
===================================================== */

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

/* =====================================================
   KM
===================================================== */

function numeroSeguro(
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
      .replace(',', '.')
  )
}

function calcularKmTotal(
  deslocamento
) {
  if (!deslocamento) {
    return null
  }

  const total =
    numeroSeguro(
      deslocamento.km_total ??
      deslocamento.distancia_total
    )

  if (
    Number.isFinite(
      total
    )
  ) {
    return total
  }

  const saida =
    numeroSeguro(
      deslocamento.km_saida
    )

  const retorno =
    numeroSeguro(
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
    return retorno - saida
  }

  return null
}

function valorKm(
  valor
) {
  const numero =
    numeroSeguro(
      valor
    )

  if (
    !Number.isFinite(
      numero
    )
  ) {
    return 'Não informado'
  }

  return `${
    numero.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  } km`
}

/* =====================================================
   FORMATAÇÕES
===================================================== */

function normalizarBusca(
  valor
) {
  return String(
    valor ||
    ''
  )
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
}

function descricaoCurta(
  valor
) {
  const texto =
    String(
      valor ||
      'Sem descrição complementar.'
    )

  if (
    texto.length <= 55
  ) {
    return texto
  }

  return `${texto.substring(
    0,
    55
  )}...`
}

function formatarQuantidade(
  valor
) {
  const numero =
    Number(valor)

  if (
    !Number.isFinite(
      numero
    )
  ) {
    return valor ||
      '1'
  }

  if (
    Number.isInteger(
      numero
    )
  ) {
    return String(
      numero
    )
  }

  return numero.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2
    }
  )
}

function dataTimestamp(
  valor
) {
  const data =
    new Date(
      valor ||
      0
    )

  return Number.isNaN(
    data.getTime()
  )
    ? 0
    : data.getTime()
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}

function formatarDataArquivo(
  valor
) {
  const data =
    new Date(valor)

  const ano =
    data.getFullYear()

  const mes =
    String(
      data.getMonth() + 1
    ).padStart(
      2,
      '0'
    )

  const dia =
    String(
      data.getDate()
    ).padStart(
      2,
      '0'
    )

  return `${ano}-${mes}-${dia}`
}

function nomesEquipePdf(
  equipe
) {
  if (
    !Array.isArray(
      equipe
    ) ||
    !equipe.length
  ) {
    return 'Não atribuído'
  }

  const nomes =
    equipe
      .map(
        item =>
          item.nome
      )
      .filter(Boolean)

  return (
    [
      ...new Set(
        nomes
      )
    ].join(', ') ||
    'Não atribuído'
  )
}

function localChamado(
  chamado
) {
  if (
    chamado.endereco_atendimento
  ) {
    return chamado
      .endereco_atendimento
  }

  const cidade =
    chamado.cidade_propriedade ||
    ''

  const estado =
    chamado.estado_propriedade ||
    ''

  if (
    cidade &&
    estado
  ) {
    return `${cidade} - ${estado}`
  }

  return (
    chamado.endereco_propriedade ||
    cidade ||
    estado ||
    'Não informado'
  )
}

/* =====================================================
   EXTRATORES
===================================================== */

function extrairLista(
  resposta,
  chaves = []
) {
  if (
    Array.isArray(
      resposta
    )
  ) {
    return resposta
  }

  for (
    const chave of chaves
  ) {
    if (
      Array.isArray(
        resposta?.[chave]
      )
    ) {
      return resposta[chave]
    }
  }

  if (
    Array.isArray(
      resposta?.data
    )
  ) {
    return resposta.data
  }

  return []
}

function extrairObjeto(
  resposta,
  chave
) {
  if (!resposta) {
    return null
  }

  if (
    Array.isArray(
      resposta
    )
  ) {
    return resposta[0] ||
      null
  }

  if (
    resposta[chave]
  ) {
    return resposta[chave]
  }

  if (
    resposta.data &&
    !Array.isArray(
      resposta.data
    )
  ) {
    return resposta.data
  }

  if (
    typeof resposta ===
      'object'
  ) {
    return resposta
  }

  return null
}

/* =====================================================
   PÁGINAS PDF
===================================================== */

function garantirEspacoPdf(
  doc,
  y,
  altura
) {
  const alturaPagina =
    doc.internal.pageSize
      .getHeight()

  if (
    y + altura >
    alturaPagina - 20
  ) {
    doc.addPage()

    return 18
  }

  return y
}

function adicionarRodapePdf(
  doc
) {
  const totalPaginas =
    doc.getNumberOfPages()

  const largura =
    doc.internal.pageSize
      .getWidth()

  const altura =
    doc.internal.pageSize
      .getHeight()

  for (
    let pagina = 1;
    pagina <= totalPaginas;
    pagina += 1
  ) {
    doc.setPage(
      pagina
    )

    doc.setDrawColor(
      234,
      236,
      240
    )

    doc.line(
      15,
      altura - 13,
      largura - 15,
      altura - 13
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
      'Avioeste - Relatório Administrativo de Atendimentos',
      15,
      altura - 8
    )

    doc.text(
      `Página ${pagina} de ${totalPaginas}`,
      largura - 15,
      altura - 8,
      {
        align: 'right'
      }
    )
  }
}

/* =====================================================
   LIMPAR SELEÇÃO AO ALTERAR FILTRO
===================================================== */

watch(
  () => [
    filtros.busca,
    filtros.status,
    filtros.periodo,
    filtros.produtor,
    filtros.propriedade,
    filtros.tecnico,
    filtros.urgencia
  ],
  () => {
    limparSelecao()
  }
)

onMounted(
  carregarDados
)
</script>

<style scoped>
/* =====================================================
   PÁGINA
===================================================== */

.relatorios-admin-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.pagina-titulo {
  color: #101828;
  font-size: 30px;
  font-weight: 800;
}

.pagina-subtitulo {
  margin-top: 5px;
  color: #667085;
  font-size: 14px;
}

/* =====================================================
   FILTROS
===================================================== */

.filtros-card {
  margin-bottom: 18px;
  padding: 18px 20px;
  border: 1px solid #eaecf0;
  border-radius: 18px;
  background: #ffffff;
}

.filtros-principais {
  display: grid;
  grid-template-columns:
    minmax(280px, 1fr)
    180px
    190px
    auto
    auto;
  align-items: center;
  gap: 10px;
}

.filtro-busca {
  min-width: 0;
}

.filtros-avancados {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f2f4f7;
}

/* =====================================================
   LISTAGEM
===================================================== */

.chamados-card {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 18px;
  background: #ffffff;
}

.chamados-topo {
  min-height: 84px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 22px;
}

.secao-titulo {
  color: #101828;
  font-size: 16px;
  font-weight: 800;
}

.secao-subtitulo {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 10px;
}

.chamados-acoes {
  display: flex;
  align-items: center;
  gap: 6px;
}

.selecao-geral {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 6px 22px;
  border-top: 1px solid #eaecf0;
  border-bottom: 1px solid #eaecf0;
  color: #98a2b3;
  background: #fcfcfd;
  font-size: 9px;
}

/* =====================================================
   LINHAS
===================================================== */

.lista-cabecalho,
.chamado-item {
  display: grid;
  grid-template-columns:
    36px
    52px
    minmax(180px, 1.5fr)
    minmax(150px, 1.1fr)
    minmax(100px, 0.8fr)
    80px
    115px
    86px;
  align-items: center;
  gap: 10px;
}

.lista-cabecalho {
  min-height: 42px;
  padding: 0 22px;
  color: #98a2b3;
  font-size: 7px;
  font-weight: 800;
  text-transform: uppercase;
}

.chamado-item {
  min-height: 67px;
  padding: 8px 22px;
  border-top: 1px solid #f2f4f7;
}

.chamado-item:hover {
  background: #fcfcfd;
}

.chamado-id {
  color: #f97316;
  font-size: 9px;
  font-weight: 900;
}

.chamado-solicitacao,
.chamado-produtor {
  min-width: 0;
}

.chamado-solicitacao strong,
.chamado-produtor strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 9px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-solicitacao span,
.chamado-produtor span {
  display: block;
  overflow: hidden;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 7px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-tecnico,
.chamado-data {
  color: #667085;
  font-size: 8px;
}

/* =====================================================
   BADGES
===================================================== */

.urgencia-alta,
.urgencia-media,
.urgencia-baixa,
.status-pendente,
.status-andamento,
.status-finalizado,
.status-cancelado {
  padding: 6px 9px;
}

.urgencia-alta {
  color: #dc2626;
  background: #fee2e2;
}

.urgencia-media {
  color: #d97706;
  background: #fef3c7;
}

.urgencia-baixa {
  color: #2563eb;
  background: #dbeafe;
}

.status-pendente {
  color: #d97706;
  background: #fef3c7;
}

.status-andamento {
  color: #2563eb;
  background: #dbeafe;
}

.status-finalizado {
  color: #16a34a;
  background: #dcfce7;
}

.status-cancelado {
  color: #dc2626;
  background: #fee2e2;
}

/* =====================================================
   ESTADOS
===================================================== */

.estado-vazio {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #98a2b3;
  text-align: center;
}

.estado-vazio-icone {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border-radius: 13px;
  color: #f97316;
  background: #fff1e6;
}

.estado-vazio strong {
  color: #475467;
  font-size: 11px;
}

.estado-vazio span {
  font-size: 9px;
}

/* =====================================================
   DARK
===================================================== */

.relatorios-admin-page--dark {
  background: #0d0f12;
}

.relatorios-admin-page--dark
.pagina-titulo,
.relatorios-admin-page--dark
.secao-titulo,
.relatorios-admin-page--dark
.chamado-solicitacao strong,
.relatorios-admin-page--dark
.chamado-produtor strong {
  color: #f9fafb;
}

.relatorios-admin-page--dark
.filtros-card,
.relatorios-admin-page--dark
.chamados-card {
  border-color: #2b2f36;
  background: #16191f;
}

.relatorios-admin-page--dark
.filtros-avancados,
.relatorios-admin-page--dark
.selecao-geral,
.relatorios-admin-page--dark
.chamado-item {
  border-color: #2b2f36;
}

.relatorios-admin-page--dark
.selecao-geral {
  background: #1b1f25;
}

.relatorios-admin-page--dark
.chamado-item:hover {
  background: #1b1f25;
}

/* =====================================================
   RESPONSIVO
===================================================== */

@media (max-width: 1250px) {
  .filtros-principais {
    grid-template-columns:
      minmax(240px, 1fr)
      160px
      170px
      auto;
  }

  .filtros-principais
  > :last-child {
    grid-column:
      4;
  }

  .filtros-avancados {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .lista-cabecalho,
  .chamado-item {
    grid-template-columns:
      36px
      50px
      minmax(170px, 1fr)
      minmax(140px, 0.9fr)
      95px
      110px
      80px;
  }

  .lista-cabecalho
  > div:nth-child(6),
  .chamado-item
  > div:nth-child(6) {
    display: none;
  }
}

@media (max-width: 850px) {
  .relatorios-admin-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho,
  .chamados-topo {
    flex-direction: column;
  }

  .filtros-principais,
  .filtros-avancados {
    grid-template-columns:
      1fr;
  }

  .filtros-principais
  > :last-child {
    grid-column: auto;
  }

  .chamados-acoes {
    width: 100%;
    justify-content: flex-end;
  }

  .lista-cabecalho {
    display: none;
  }

  .chamado-item {
    grid-template-columns:
      35px
      46px
      minmax(0, 1fr)
      110px;
  }

  .chamado-item
  > div:nth-child(4),
  .chamado-item
  > div:nth-child(5),
  .chamado-item
  > div:nth-child(6),
  .chamado-item
  > div:nth-child(8) {
    display: none;
  }
}

@media (max-width: 550px) {
  .pagina-titulo {
    font-size: 25px;
  }

  .chamados-acoes {
    flex-direction: column;
    align-items: stretch;
  }

  .selecao-geral {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>