<template>
  <div class="listagem-chamados">
    <!-- ==================================================
         CARREGANDO
    =================================================== -->

    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner
        color="orange"
        size="42px"
      />

      <div class="estado-central__titulo">
        Carregando chamados...
      </div>
    </div>

    <!-- ==================================================
         ERRO
    =================================================== -->

    <q-banner
      v-else-if="erro"
      rounded
      class="bg-red-1 text-negative"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          no-caps
          color="negative"
          label="Tentar novamente"
          @click="carregarChamados"
        />
      </template>
    </q-banner>

    <!-- ==================================================
         SEM CHAMADOS
    =================================================== -->

    <div
      v-else-if="chamadosFiltrados.length === 0"
      class="estado-vazio"
    >
      <q-icon
        :name="
          possuiFiltro
            ? 'search_off'
            : 'inbox'
        "
        size="46px"
        color="grey-5"
      />

      <div class="estado-vazio__titulo">
        {{
          possuiFiltro
            ? 'Nenhum chamado corresponde aos filtros'
            : 'Nenhum chamado encontrado'
        }}
      </div>

      <div class="estado-vazio__texto">
        {{
          possuiFiltro
            ? 'Tente alterar a pesquisa ou o status selecionado.'
            : 'Quando você abrir um chamado, ele aparecerá aqui.'
        }}
      </div>
    </div>

    <!-- ==================================================
         DESKTOP - TABELA
    =================================================== -->

    <template v-else>
      <q-table
        v-if="!isMobile"
        v-model:pagination="paginacao"
        title="Chamados"
        :rows="chamadosFiltrados"
        :columns="columns"
        row-key="id_chamado"
        flat
        no-data-label="Nenhum chamado encontrado"
        class="tabela-desktop"
      >
        <template #body-cell-id_chamado="props">
          <q-td :props="props">
            <strong>
              #{{ props.row.id_chamado }}
            </strong>
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
      </q-table>

      <!-- ==================================================
           MOBILE - CARDS
      =================================================== -->

      <div
        v-else
        class="mobile-lista"
      >
        <div class="mobile-lista__cabecalho">
          <div>
            <div class="mobile-lista__titulo">
              Chamados
            </div>

            <div class="mobile-lista__quantidade">
              {{ textoResultado }}
            </div>
          </div>

          <q-icon
            name="confirmation_number"
            size="25px"
            color="orange"
          />
        </div>

        <div class="cards-mobile">
          <article
            v-for="chamado in chamadosFiltrados"
            :key="chamado.id_chamado"
            class="chamado-card"
            @click="verDetalhes(chamado)"
          >
            <!-- TOPO -->

            <div class="chamado-card__topo">
              <div class="chamado-card__numero">
                #{{ chamado.id_chamado }}
              </div>

              <q-badge
                rounded
                :class="classeStatus(chamado.status)"
              >
                {{ formatarStatus(chamado.status) }}
              </q-badge>
            </div>

            <!-- PROBLEMA -->

            <div class="chamado-card__problema">
              {{ obterProblema(chamado) }}
            </div>

            <!-- INFORMAÇÕES -->

            <div class="chamado-card__informacoes">
              <div class="chamado-card__info">
                <q-icon
                  name="calendar_today"
                  size="17px"
                />

                <div>
                  <span class="info-label">
                    Abertura
                  </span>

                  <strong>
                    {{ formatarData(chamado.data_abertura) }}
                  </strong>
                </div>
              </div>

              <div
                v-if="chamado.urgencia"
                class="chamado-card__info"
              >
                <q-icon
                  name="priority_high"
                  size="18px"
                />

                <div>
                  <span class="info-label">
                    Urgência
                  </span>

                  <strong>
                    {{ formatarUrgencia(chamado.urgencia) }}
                  </strong>
                </div>
              </div>
            </div>

            <!-- RODAPÉ -->

            <div class="chamado-card__rodape">
              <span>
                Ver detalhes
              </span>

              <q-icon
                name="arrow_forward"
                size="20px"
              />
            </div>
          </article>
        </div>
      </div>

      <!-- RESULTADO DO FILTRO -->

      <div
        v-if="possuiFiltro && !isMobile"
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
    </template>
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
  useQuasar
} from 'quasar'

import {
  useRouter
} from 'vue-router'

import chamadoService from
  'src/services/chamadoService'

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

const $q = useQuasar()
const router = useRouter()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const paginacao = ref({
  page: 1,
  rowsPerPage: 10
})

const isMobile = computed(() => {
  return $q.screen.lt.md
})

/* ==================================================
   COLUNAS DESKTOP
=================================================== */

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
      obterProblema(row),
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

/* ==================================================
   FILTROS
=================================================== */

const possuiFiltro = computed(() => {
  return Boolean(
    String(
      props.pesquisa || ''
    ).trim() ||
    props.status
  )
})

const chamadosFiltrados = computed(() => {
  const pesquisaNormalizada =
    normalizarTexto(
      props.pesquisa
    )

  const statusSelecionado =
    String(
      props.status || ''
    ).toUpperCase()

  return chamados.value.filter(
    (chamado) => {
      const statusChamado =
        String(
          chamado.status || ''
        ).toUpperCase()

      let correspondeStatus =
        true

      if (
        statusSelecionado ===
        'EM_ANDAMENTO'
      ) {
        correspondeStatus = [
          'ACEITO',
          'EM_ROTA',
          'EM_ATENDIMENTO',
          'AGUARDANDO_CONFIRMACAO'
        ].includes(
          statusChamado
        )
      } else if (
        statusSelecionado
      ) {
        correspondeStatus =
          statusChamado ===
          statusSelecionado
      }

      if (!correspondeStatus) {
        return false
      }

      if (
        !pesquisaNormalizada
      ) {
        return true
      }

      const id =
        String(
          chamado.id_chamado ||
          ''
        )

      const numero =
        `#${id}`

      const problema =
        normalizarTexto(
          chamado.problema
        )

      const descricao =
        normalizarTexto(
          chamado.descricao
        )

      const cultura =
        normalizarTexto(
          chamado.tipo_cultura
        )

      const tipoChamado =
        normalizarTexto(
          chamado.tipo_chamado
        )

      const urgencia =
        normalizarTexto(
          chamado.urgencia
        )

      return (
        id.includes(
          pesquisaNormalizada
        ) ||
        numero.includes(
          pesquisaNormalizada
        ) ||
        problema.includes(
          pesquisaNormalizada
        ) ||
        descricao.includes(
          pesquisaNormalizada
        ) ||
        cultura.includes(
          pesquisaNormalizada
        ) ||
        tipoChamado.includes(
          pesquisaNormalizada
        ) ||
        urgencia.includes(
          pesquisaNormalizada
        )
      )
    }
  )
})

const textoResultado =
  computed(() => {
    const total =
      chamadosFiltrados.value
        .length

    if (total === 0) {
      return 'Nenhum chamado encontrado'
    }

    if (total === 1) {
      return '1 chamado encontrado'
    }

    return `${total} chamados encontrados`
  })

/* ==================================================
   TEXTO
=================================================== */

function normalizarTexto(
  valor
) {
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

function obterProblema(
  chamado
) {
  return (
    chamado.problema ||
    chamado.titulo ||
    chamado.motivo ||
    chamado.descricao ||
    'Problema não informado'
  )
}

/* ==================================================
   DATA
=================================================== */

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

/* ==================================================
   URGÊNCIA
=================================================== */

function formatarUrgencia(
  urgencia
) {
  const valor =
    String(
      urgencia || ''
    ).toUpperCase()

  const nomes = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    MÉDIA: 'Média',
    ALTA: 'Alta',
    URGENTE: 'Urgente'
  }

  return (
    nomes[valor] ||
    urgencia ||
    'Não informada'
  )
}

/* ==================================================
   STATUS
=================================================== */

function formatarStatus(
  status
) {
  if (!status) {
    return 'Não informado'
  }

  const valor =
    String(status)
      .toUpperCase()

  const nomes = {
    PENDENTE:
      'Pendente',

    AGUARDANDO_CONFIRMACAO:
      'Aguardando confirmação',

    ACEITO:
      'Aceito',

    EM_ROTA:
      'Em rota',

    EM_ATENDIMENTO:
      'Em atendimento',

    CONCLUIDO:
      'Concluído',

    FINALIZADO:
      'Finalizado',

    CANCELADO:
      'Cancelado'
  }

  return (
    nomes[valor] ||
    String(status)
      .replaceAll(
        '_',
        ' '
      )
      .toLowerCase()
      .replace(
        /^\w/,
        (letra) =>
          letra.toUpperCase()
      )
  )
}

function classeStatus(
  status
) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  if (
    valor === 'PENDENTE'
  ) {
    return 'status-pendente'
  }

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
    valor ===
      'EM_ATENDIMENTO' ||
    valor ===
      'AGUARDANDO_CONFIRMACAO'
  ) {
    return 'status-atendimento'
  }

  if (
    [
      'CONCLUIDO',
      'FINALIZADO'
    ].includes(valor)
  ) {
    return 'status-concluido'
  }

  if (
    valor === 'CANCELADO'
  ) {
    return 'status-cancelado'
  }

  return 'status-padrao'
}

/* ==================================================
   DETALHES
=================================================== */

async function verDetalhes(
  chamado
) {
  await router.push({
    name:
      'produtor-detalhes-chamado',

    params: {
      id:
        chamado.id_chamado
    }
  })
}

/* ==================================================
   API
=================================================== */

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

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
      'Erro ao carregar chamados:',
      error
    )

    chamados.value = []

    erro.value =
      error.response?.data
        ?.message ||
      error.response?.data
        ?.erro ||
      'Não foi possível buscar os chamados no servidor.'
  } finally {
    carregando.value =
      false
  }
}

/* ==================================================
   WATCH
=================================================== */

watch(
  () => [
    props.pesquisa,
    props.status
  ],

  () => {
    paginacao.value.page = 1
  }
)

onMounted(
  carregarChamados
)
</script>

<style scoped>
.listagem-chamados {
  width: 100%;
  max-width: 100%;

  overflow-x: hidden;
}

/* ==================================================
   DESKTOP
=================================================== */

.tabela-desktop {
  overflow: hidden;

  border:
    1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;
}

/* ==================================================
   STATUS
=================================================== */

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-concluido,
.status-cancelado,
.status-padrao {
  padding:
    7px 12px;

  font-size: 12px;

  font-weight: 600;
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

/* ==================================================
   RESULTADO
=================================================== */

.resultado-filtro {
  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    12px 18px;

  border:
    1px solid #eaecf0;

  border-top: 0;

  border-radius:
    0 0 14px 14px;

  color: #667085;

  background: #f9fafb;

  font-size: 13px;
}

/* ==================================================
   VAZIO / CARREGANDO
=================================================== */

.estado-vazio,
.estado-central {
  width: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding:
    50px 20px;

  border:
    1px solid #eaecf0;

  border-radius: 20px;

  background: #ffffff;

  text-align: center;
}

.estado-vazio__titulo,
.estado-central__titulo {
  margin-top: 12px;

  color: #475467;

  font-size: 15px;

  font-weight: 700;
}

.estado-vazio__texto {
  max-width: 330px;

  margin-top: 4px;

  color: #98a2b3;

  font-size: 13px;
}

/* ==================================================
   MOBILE
=================================================== */

.mobile-lista {
  width: 100%;
  max-width: 100%;
}

.mobile-lista__cabecalho {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 12px;

  margin-bottom: 12px;

  padding:
    0 2px;
}

.mobile-lista__titulo {
  color: #101828;

  font-size: 18px;

  font-weight: 800;
}

.mobile-lista__quantidade {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 11px;
}

.cards-mobile {
  display: flex;

  flex-direction: column;

  gap: 11px;
}

.chamado-card {
  width: 100%;
  max-width: 100%;

  overflow: hidden;

  padding:
    16px;

  border:
    1px solid #eaecf0;

  border-radius: 17px;

  background: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(
      16,
      24,
      40,
      0.03
    );

  cursor: pointer;

  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.chamado-card:active {
  transform:
    scale(0.985);
}

.chamado-card__topo {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 10px;
}

.chamado-card__numero {
  color: #f97316;

  font-size: 13px;

  font-weight: 800;
}

.chamado-card__problema {
  margin-top: 11px;

  overflow-wrap:
    anywhere;

  color: #101828;

  font-size: 17px;

  font-weight: 750;

  line-height: 1.3;
}

.chamado-card__informacoes {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin-top: 15px;
}

.chamado-card__info {
  min-width: 0;

  display: flex;

  align-items: center;

  gap: 8px;

  color: #667085;
}

.chamado-card__info > div {
  min-width: 0;

  display: flex;

  flex-direction: column;
}

.chamado-card__info strong {
  overflow: hidden;

  color: #344054;

  font-size: 12px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.info-label {
  margin-bottom: 1px;

  color: #98a2b3;

  font-size: 9px;

  font-weight: 600;

  text-transform:
    uppercase;
}

.chamado-card__rodape {
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 5px;

  margin-top: 14px;

  padding-top: 11px;

  border-top:
    1px solid #f2f4f7;

  color: #f97316;

  font-size: 12px;

  font-weight: 700;
}

/* ==================================================
   DARK
=================================================== */

.body--dark
.tabela-desktop,

.body--dark
.chamado-card,

.body--dark
.estado-vazio,

.body--dark
.estado-central {
  border-color: #2b2f36;

  background: #16191f;
}

.body--dark
.mobile-lista__titulo,

.body--dark
.chamado-card__problema {
  color: #f9fafb;
}

.body--dark
.chamado-card__info strong {
  color: #d0d5dd;
}

.body--dark
.chamado-card__rodape {
  border-top-color:
    #2b2f36;
}

/* ==================================================
   CELULAR PEQUENO
=================================================== */

@media (
  max-width: 380px
) {
  .chamado-card {
    padding: 14px;
  }

  .chamado-card__problema {
    font-size: 16px;
  }

  .chamado-card__informacoes {
    grid-template-columns:
      1fr;
  }
}
</style>