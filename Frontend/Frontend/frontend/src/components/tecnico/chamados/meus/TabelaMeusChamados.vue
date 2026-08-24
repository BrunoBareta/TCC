<template>
  <div class="meus-chamados-wrapper">

    <!-- =========================
         RESUMO / FILTROS
    ========================== -->

    <div class="filtros-card">
      <div class="filtros-topo">
        <div>
          <div class="filtros-titulo">
            Meus atendimentos
          </div>

          <div class="filtros-subtitulo">
            Filtre e acompanhe seus chamados vinculados.
          </div>
        </div>

        <q-input
          v-model="pesquisa"
          outlined
          dense
          clearable
          debounce="250"
          placeholder="Buscar chamado..."
          class="campo-pesquisa"
        >
          <template #prepend>
            <q-icon
              name="search"
              size="19px"
            />
          </template>
        </q-input>
      </div>

      <!-- ABAS -->

      <div class="filtros-status">
        <button
          type="button"
          class="filtro-botao"
          :class="{
            'filtro-botao--ativo':
              filtroSelecionado === 'todos'
          }"
          @click="selecionarFiltro('todos')"
        >
          <span>
            Todos
          </span>

          <strong>
            {{ totalChamados }}
          </strong>
        </button>

        <button
          type="button"
          class="filtro-botao"
          :class="{
            'filtro-botao--ativo':
              filtroSelecionado === 'andamento'
          }"
          @click="selecionarFiltro('andamento')"
        >
          <span>
            Em andamento
          </span>

          <strong>
            {{ totalAndamento }}
          </strong>
        </button>

        <button
          type="button"
          class="filtro-botao"
          :class="{
            'filtro-botao--ativo':
              filtroSelecionado === 'finalizados'
          }"
          @click="selecionarFiltro('finalizados')"
        >
          <span>
            Finalizados
          </span>

          <strong>
            {{ totalFinalizados }}
          </strong>
        </button>
      </div>
    </div>

    <!-- =========================
         ERRO
    ========================== -->

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

    <!-- =========================
         CARREGANDO
    ========================== -->

    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner
        color="orange"
        size="42px"
      />

      <span>
        Carregando seus chamados...
      </span>
    </div>

    <!-- =========================
         LISTA
    ========================== -->

    <div
      v-else
      class="lista-card"
    >
      <!-- CABEÇALHO -->

      <div class="lista-cabecalho">
        <div>
          <strong>
            {{ tituloLista }}
          </strong>

          <span>
            {{ chamadosFiltrados.length }}
            {{
              chamadosFiltrados.length === 1
                ? 'chamado encontrado'
                : 'chamados encontrados'
            }}
          </span>
        </div>

        <q-btn
          flat
          round
          icon="refresh"
          :loading="carregando"
          @click="carregarChamados"
        >
          <q-tooltip>
            Atualizar chamados
          </q-tooltip>
        </q-btn>
      </div>

      <!-- VAZIO -->

      <div
        v-if="chamadosFiltrados.length === 0"
        class="estado-vazio"
      >
        <div class="estado-vazio-icone">
          <q-icon
            :name="
              pesquisa
                ? 'search_off'
                : 'assignment'
            "
            size="32px"
          />
        </div>

        <strong>
          {{
            pesquisa
              ? 'Nenhum chamado encontrado'
              : 'Nenhum chamado neste filtro'
          }}
        </strong>

        <span>
          {{
            pesquisa
              ? 'Tente buscar utilizando outro termo.'
              : 'Seus atendimentos aparecerão aqui.'
          }}
        </span>
      </div>

      <!-- CHAMADOS -->

      <div
        v-else
        class="chamados-lista"
      >
        <div
          v-for="chamado in chamadosFiltrados"
          :key="chamado.id_chamado"
          class="chamado-card"
        >
          <!-- ID -->

          <div class="chamado-numero">
            #{{ chamado.id_chamado }}
          </div>

          <!-- PRINCIPAL -->

          <div class="chamado-principal">
            <div class="chamado-problema">
              {{
                chamado.problema ||
                'Solicitação de atendimento'
              }}
            </div>

            <div class="chamado-descricao">
              {{
                descricaoCurta(
                  chamado.descricao
                )
              }}
            </div>
          </div>

          <!-- PROPRIEDADE -->

          <div class="chamado-info">
            <q-icon
              name="agriculture"
              size="17px"
            />

            <div>
              <span>
                Propriedade
              </span>

              <strong>
                {{
                  chamado.nome_propriedade ||
                  'Não informada'
                }}
              </strong>
            </div>
          </div>

          <!-- LOCAL -->

          <div class="chamado-info">
            <q-icon
              name="location_on"
              size="17px"
            />

            <div>
              <span>
                Localização
              </span>

              <strong>
                {{
                  localChamado(
                    chamado
                  )
                }}
              </strong>
            </div>
          </div>

          <!-- URGÊNCIA -->

          <div class="chamado-status-area">
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
                formatarTexto(
                  chamado.urgencia
                )
              }}
            </q-badge>
          </div>

          <!-- STATUS -->

          <div class="chamado-status-area">
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
                formatarTexto(
                  chamado.status
                )
              }}
            </q-badge>
          </div>

          <!-- DATA -->

          <div class="chamado-data">
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

          <!-- AÇÃO -->

          <div class="chamado-acoes">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="grey-7"
              @click="
                verDetalhes(
                  chamado
                )
              "
            >
              <q-tooltip>
                Ver detalhes
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="
                !chamadoFinalizado(
                  chamado
                )
              "
              unelevated
              no-caps
              color="orange"
              icon="play_arrow"
              label="Continuar"
              size="sm"
              @click="
                abrirAtendimento(
                  chamado
                )
              "
            />

            <q-btn
              v-else
              outline
              no-caps
              color="positive"
              icon="visibility"
              label="Visualizar"
              size="sm"
              @click="
                abrirAtendimento(
                  chamado
                )
              "
            />
          </div>
        </div>
      </div>
    </div>

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
const pesquisa = ref('')

/* =========================
   FILTRO
========================= */

const filtroSelecionado =
  computed(() => {
    const valor =
      String(
        route.query.filtro ||
        ''
      )
        .trim()
        .toLowerCase()

    if (
      [
        'andamento',
        'finalizados'
      ].includes(valor)
    ) {
      return valor
    }

    return 'todos'
  })

const tituloLista =
  computed(() => {
    if (
      filtroSelecionado.value ===
      'andamento'
    ) {
      return 'Chamados em andamento'
    }

    if (
      filtroSelecionado.value ===
      'finalizados'
    ) {
      return 'Chamados finalizados'
    }

    return 'Todos os meus chamados'
  })

/* =========================
   CONTADORES
========================= */

const totalChamados =
  computed(() =>
    chamados.value.length
  )

const totalAndamento =
  computed(() =>
    chamados.value.filter(
      chamado =>
        [
          'ACEITO',
          'EM_ROTA',
          'EM_ATENDIMENTO'
        ].includes(
          normalizarStatus(
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
          normalizarStatus(
            chamado.status
          )
        )
    ).length
  )

/* =========================
   FILTRAGEM
========================= */

const chamadosFiltrados =
  computed(() => {
    let lista =
      [...chamados.value]

    if (
      filtroSelecionado.value ===
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
              normalizarStatus(
                chamado.status
              )
            )
        )
    }

    if (
      filtroSelecionado.value ===
      'finalizados'
    ) {
      lista =
        lista.filter(
          chamado =>
            [
              'FINALIZADO',
              'CONCLUIDO'
            ].includes(
              normalizarStatus(
                chamado.status
              )
            )
        )
    }

    const termo =
      String(
        pesquisa.value ||
        ''
      )
        .trim()
        .toLowerCase()

    if (termo) {
      lista =
        lista.filter(
          chamado => {
            const texto =
              [
                chamado.id_chamado,
                chamado.problema,
                chamado.descricao,
                chamado.nome_propriedade,
                chamado.cidade_propriedade,
                chamado.estado_propriedade,
                chamado.urgencia,
                chamado.status
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return texto.includes(
              termo
            )
          }
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

/* =========================
   CARREGAMENTO
========================= */

async function carregarChamados() {
  carregando.value = true
  erro.value = ''

  try {
    const idFuncionario =
      Number(
        authStore.usuario
          ?.id_usuario
      )

    if (
      !Number.isInteger(
        idFuncionario
      ) ||
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
      Array.isArray(
        resposta
      )
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

/* =========================
   ALTERAR FILTRO
========================= */

async function selecionarFiltro(
  filtro
) {
  pesquisa.value = ''

  if (
    filtro === 'todos'
  ) {
    await router.replace({
      name:
        'tecnico-meus-chamados'
    })

    return
  }

  await router.replace({
    name:
      'tecnico-meus-chamados',

    query: {
      filtro
    }
  })
}

/* =========================
   NAVEGAÇÃO
========================= */

async function verDetalhes(
  chamado
) {
  await router.push({
    name:
      'tecnico-detalhes-chamado',

    params: {
      id:
        chamado.id_chamado
    }
  })
}

async function abrirAtendimento(
  chamado
) {
  await router.push({
    name:
      'tecnico-atendimento-detalhes',

    params: {
      id:
        chamado.id_chamado
    }
  })
}

/* =========================
   FORMATAÇÃO
========================= */

function normalizarStatus(
  status
) {
  return String(
    status || ''
  )
    .trim()
    .toUpperCase()
}

function formatarTexto(
  valor
) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
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

  return data
    .toLocaleDateString(
      'pt-BR'
    )
}

function descricaoCurta(
  descricao
) {
  const texto =
    String(
      descricao ||
      'Sem descrição informada.'
    )

  if (
    texto.length <= 65
  ) {
    return texto
  }

  return (
    texto.substring(
      0,
      65
    ) +
    '...'
  )
}

function localChamado(
  chamado
) {
  if (
    chamado.cidade_propriedade &&
    chamado.estado_propriedade
  ) {
    return (
      `${chamado.cidade_propriedade} - ` +
      chamado.estado_propriedade
    )
  }

  if (
    chamado.cidade_propriedade
  ) {
    return chamado
      .cidade_propriedade
  }

  if (
    chamado.nome_unidade
  ) {
    return chamado
      .nome_unidade
  }

  return 'Não informado'
}

/* =========================
   STATUS
========================= */

function chamadoFinalizado(
  chamado
) {
  return [
    'FINALIZADO',
    'CONCLUIDO'
  ].includes(
    normalizarStatus(
      chamado.status
    )
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

function classeUrgencia(
  urgencia
) {
  const valor =
    String(
      urgencia ||
      ''
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

/* =========================
   WATCH
========================= */

watch(
  () => route.query.filtro,
  () => {
    pesquisa.value = ''
  }
)

onMounted(
  carregarChamados
)
</script>

<style scoped>
/* =========================
   WRAPPER
========================= */

.meus-chamados-wrapper {
  width: 100%;
}

/* =========================
   FILTROS
========================= */

.filtros-card {
  margin-bottom: 16px;
  padding: 18px;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
}

.filtros-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.filtros-titulo {
  color: #101828;
  font-size: 14px;
  font-weight: 900;
}

.filtros-subtitulo {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 9px;
}

.campo-pesquisa {
  width: 270px;
}

.filtros-status {
  display: flex;
  gap: 8px;
  margin-top: 17px;
}

.filtro-botao {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid #eaecf0;
  border-radius: 9px;
  color: #667085;
  background: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.filtro-botao strong {
  min-width: 22px;
  padding: 2px 6px;
  border-radius: 20px;
  color: #667085;
  background: #f2f4f7;
  font-size: 8px;
  text-align: center;
}

.filtro-botao:hover {
  border-color: #fdba74;
  color: #f97316;
}

.filtro-botao--ativo {
  border-color: #fed7aa;
  color: #f97316;
  background: #fff7ed;
}

.filtro-botao--ativo strong {
  color: #f97316;
  background: #ffedd5;
}

/* =========================
   LISTA
========================= */

.lista-card {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
}

.lista-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 17px 20px;
  border-bottom: 1px solid #eaecf0;
}

.lista-cabecalho strong {
  display: block;
  color: #101828;
  font-size: 12px;
}

.lista-cabecalho span {
  display: block;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 8px;
}

/* =========================
   CHAMADO
========================= */

.chamado-card {
  display: grid;
  grid-template-columns:
    45px
    minmax(190px, 1.4fr)
    minmax(125px, 0.8fr)
    minmax(110px, 0.7fr)
    75px
    100px
    75px
    150px;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid #f2f4f7;
  transition: background 0.2s ease;
}

.chamado-card:last-child {
  border-bottom: none;
}

.chamado-card:hover {
  background: #fafafa;
}

.chamado-numero {
  color: #f97316;
  font-size: 9px;
  font-weight: 900;
}

.chamado-principal {
  min-width: 0;
}

.chamado-problema {
  overflow: hidden;
  color: #344054;
  font-size: 10px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-descricao {
  overflow: hidden;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-info {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
}

.chamado-info > .q-icon {
  flex-shrink: 0;
  color: #667085;
}

.chamado-info span,
.chamado-status-area > span,
.chamado-data span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  text-transform: uppercase;
}

.chamado-info strong,
.chamado-data strong {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: #475467;
  font-size: 8px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chamado-status-area {
  min-width: 0;
}

.chamado-status-area .q-badge {
  margin-top: 4px;
}

.chamado-acoes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

/* =========================
   ESTADOS
========================= */

.estado-central {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #98a2b3;
  font-size: 9px;
}

.estado-vazio {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #98a2b3;
  text-align: center;
}

.estado-vazio-icone {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 16px;
  color: #f97316;
  background: #fff1e6;
}

.estado-vazio strong {
  color: #475467;
  font-size: 11px;
}

.estado-vazio span {
  margin-top: 5px;
  font-size: 8px;
}

/* =========================
   BADGES
========================= */

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

/* =========================
   DARK
========================= */

.body--dark
.filtros-card,
.body--dark
.lista-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark
.filtros-titulo,
.body--dark
.lista-cabecalho strong {
  color: #f9fafb;
}

.body--dark
.filtro-botao {
  border-color: #2b2f36;
  color: #98a2b3;
  background: #16191f;
}

.body--dark
.filtro-botao strong {
  background: #1b1f25;
}

.body--dark
.filtro-botao--ativo {
  border-color: #7c2d12;
  color: #fb923c;
  background: #24160f;
}

.body--dark
.lista-cabecalho,
.body--dark
.chamado-card {
  border-color: #2b2f36;
}

.body--dark
.chamado-card:hover {
  background: #1b1f25;
}

.body--dark
.chamado-problema,
.body--dark
.chamado-info strong,
.body--dark
.chamado-data strong {
  color: #d0d5dd;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 1250px) {
  .chamado-card {
    grid-template-columns:
      45px
      minmax(180px, 1.4fr)
      minmax(115px, 0.8fr)
      75px
      95px
      70px
      140px;
  }

  .chamado-card
  > .chamado-info:nth-of-type(4) {
    display: none;
  }
}

@media (max-width: 950px) {
  .chamado-card {
    grid-template-columns:
      42px
      minmax(160px, 1fr)
      75px
      95px
      130px;
  }

  .chamado-info,
  .chamado-data {
    display: none;
  }
}

@media (max-width: 700px) {
  .filtros-topo {
    flex-direction: column;
  }

  .campo-pesquisa {
    width: 100%;
  }

  .filtros-status {
    overflow-x: auto;
  }

  .filtro-botao {
    flex-shrink: 0;
  }

  .chamado-card {
    grid-template-columns:
      38px
      minmax(0, 1fr)
      90px;
  }

  .chamado-status-area:first-of-type,
  .chamado-data {
    display: none;
  }

  .chamado-acoes {
    grid-column:
      2 / 4;
  }
}
</style>