<template>
  <div class="pendentes-wrapper">

    <!-- =========================
         TOPO / BUSCA
    ========================== -->

    <div class="filtros-card">
      <div class="filtros-topo">
        <div>
          <div class="filtros-titulo">
            Solicitações disponíveis
          </div>

          <div class="filtros-subtitulo">
            Analise os chamados pendentes e aceite um atendimento.
          </div>
        </div>

        <div class="acoes-topo">
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
      </div>

      <!-- RESUMO -->

      <div class="resumo-grid">
        <div class="resumo-item">
          <div class="resumo-icone resumo-icone--total">
            <q-icon
              name="pending_actions"
              size="20px"
            />
          </div>

          <div>
            <strong>
              {{ totalPendentes }}
            </strong>

            <span>
              Pendentes
            </span>
          </div>
        </div>

        <div class="resumo-item">
          <div class="resumo-icone resumo-icone--alta">
            <q-icon
              name="priority_high"
              size="20px"
            />
          </div>

          <div>
            <strong>
              {{ totalAlta }}
            </strong>

            <span>
              Alta urgência
            </span>
          </div>
        </div>

        <div class="resumo-item">
          <div class="resumo-icone resumo-icone--media">
            <q-icon
              name="warning_amber"
              size="20px"
            />
          </div>

          <div>
            <strong>
              {{ totalMedia }}
            </strong>

            <span>
              Média urgência
            </span>
          </div>
        </div>

        <div class="resumo-item">
          <div class="resumo-icone resumo-icone--baixa">
            <q-icon
              name="low_priority"
              size="20px"
            />
          </div>

          <div>
            <strong>
              {{ totalBaixa }}
            </strong>

            <span>
              Baixa urgência
            </span>
          </div>
        </div>
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
        Carregando chamados pendentes...
      </span>
    </div>

    <!-- =========================
         LISTAGEM
    ========================== -->

    <div
      v-else
      class="lista-card"
    >
      <div class="lista-cabecalho">
        <div>
          <strong>
            Chamados aguardando atendimento
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

        <div class="ordem-info">
          <q-icon
            name="sort"
            size="17px"
          />

          Maior urgência primeiro
        </div>
      </div>

      <!-- SEM DADOS -->

      <div
        v-if="chamadosFiltrados.length === 0"
        class="estado-vazio"
      >
        <div class="estado-vazio-icone">
          <q-icon
            :name="
              pesquisa
                ? 'search_off'
                : 'check_circle'
            "
            size="32px"
          />
        </div>

        <strong>
          {{
            pesquisa
              ? 'Nenhum chamado encontrado'
              : 'Nenhum chamado pendente'
          }}
        </strong>

        <span>
          {{
            pesquisa
              ? 'Tente pesquisar utilizando outro termo.'
              : 'Não existem novas solicitações aguardando atendimento.'
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
          :class="{
            'chamado-card--urgente':
              urgenciaNormalizada(chamado.urgencia) === 'ALTA'
          }"
        >
          <!-- NÚMERO -->

          <div class="chamado-numero">
            #{{ chamado.id_chamado }}
          </div>

          <!-- PROBLEMA -->

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

          <!-- PRODUTOR -->

          <div class="chamado-info">
            <q-icon
              name="person_outline"
              size="17px"
            />

            <div>
              <span>
                Produtor
              </span>

              <strong>
                {{
                  chamado.nome_produtor ||
                  'Não informado'
                }}
              </strong>
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

          <!-- LOCALIZAÇÃO -->

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

          <!-- AÇÕES -->

          <div class="chamado-acoes">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="grey-7"
              :disable="aceitandoId !== null"
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
              unelevated
              no-caps
              color="orange"
              icon="check_circle"
              label="Aceitar"
              size="sm"
              :loading="
                aceitandoId === chamado.id_chamado
              "
              :disable="
                aceitandoId !== null &&
                aceitandoId !== chamado.id_chamado
              "
              @click="
                prepararAceite(
                  chamado
                )
              "
            />
          </div>
        </div>
      </div>
    </div>

    <!-- =========================
         CONFIRMAÇÃO DO ACEITE
    ========================== -->

    <q-dialog
      v-model="dialogAceite"
      persistent
    >
      <q-card class="dialog-card">
        <q-card-section class="dialog-topo">
          <div class="dialog-icone">
            <q-icon
              name="assignment_turned_in"
              size="25px"
            />
          </div>

          <div>
            <div class="dialog-titulo">
              Aceitar chamado
            </div>

            <div class="dialog-subtitulo">
              Confirme antes de assumir este atendimento.
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section
          v-if="chamadoSelecionado"
          class="dialog-conteudo"
        >
          <div class="dialog-chamado">
            <div class="dialog-numero">
              CHAMADO #{{ chamadoSelecionado.id_chamado }}
            </div>

            <strong>
              {{
                chamadoSelecionado.problema ||
                'Solicitação de atendimento'
              }}
            </strong>

            <span>
              {{
                chamadoSelecionado.descricao ||
                'Nenhuma descrição informada.'
              }}
            </span>
          </div>

          <div class="dialog-grid">
            <div>
              <span>
                Produtor
              </span>

              <strong>
                {{
                  chamadoSelecionado.nome_produtor ||
                  'Não informado'
                }}
              </strong>
            </div>

            <div>
              <span>
                Propriedade
              </span>

              <strong>
                {{
                  chamadoSelecionado.nome_propriedade ||
                  'Não informada'
                }}
              </strong>
            </div>

            <div>
              <span>
                Localização
              </span>

              <strong>
                {{
                  localChamado(
                    chamadoSelecionado
                  )
                }}
              </strong>
            </div>

            <div>
              <span>
                Urgência
              </span>

              <q-badge
                rounded
                :class="
                  classeUrgencia(
                    chamadoSelecionado.urgencia
                  )
                "
              >
                {{
                  formatarTexto(
                    chamadoSelecionado.urgencia
                  )
                }}
              </q-badge>
            </div>
          </div>

          <div class="dialog-aviso">
            <q-icon
              name="info"
              size="20px"
            />

            <span>
              Ao confirmar, o chamado será vinculado ao seu usuário e deixará de aparecer para os demais técnicos como pendente.
            </span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="right"
          class="dialog-acoes"
        >
          <q-btn
            flat
            no-caps
            label="Cancelar"
            :disable="aceitandoId !== null"
            @click="fecharDialogAceite"
          />

          <q-btn
            unelevated
            no-caps
            color="orange"
            icon="check_circle"
            label="Confirmar aceite"
            :loading="aceitandoId !== null"
            @click="confirmarAceite"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
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
  useAuthStore
} from 'src/stores/auth'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')
const pesquisa = ref('')

const aceitandoId = ref(null)

const dialogAceite = ref(false)
const chamadoSelecionado = ref(null)

/* =========================
   PENDENTES
========================= */

const chamadosPendentes =
  computed(() => {
    return chamados.value.filter(
      chamado =>
        normalizarStatus(
          chamado.status
        ) === 'PENDENTE'
    )
  })

const totalPendentes =
  computed(() =>
    chamadosPendentes.value.length
  )

const totalAlta =
  computed(() =>
    chamadosPendentes.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'ALTA'
    ).length
  )

const totalMedia =
  computed(() =>
    chamadosPendentes.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'MEDIA'
    ).length
  )

const totalBaixa =
  computed(() =>
    chamadosPendentes.value.filter(
      chamado =>
        urgenciaNormalizada(
          chamado.urgencia
        ) === 'BAIXA'
    ).length
  )

/* =========================
   FILTRO E ORDENAÇÃO
========================= */

const chamadosFiltrados =
  computed(() => {
    let lista =
      [...chamadosPendentes.value]

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
                chamado.nome_produtor,
                chamado.nome_propriedade,
                chamado.cidade_propriedade,
                chamado.estado_propriedade,
                chamado.tipo_cultura,
                chamado.urgencia
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

    /*
      Primeiro ordena por urgência.
      Dentro da mesma urgência,
      o chamado mais antigo aparece primeiro.
    */

    return lista.sort(
      (a, b) => {
        const urgenciaA =
          prioridadeUrgencia(
            a.urgencia
          )

        const urgenciaB =
          prioridadeUrgencia(
            b.urgencia
          )

        if (
          urgenciaA !==
          urgenciaB
        ) {
          return urgenciaB - urgenciaA
        }

        return (
          new Date(
            a.data_abertura ||
            0
          ).getTime() -
          new Date(
            b.data_abertura ||
            0
          ).getTime()
        )
      }
    )
  })

/* =========================
   CARREGAR
========================= */

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
      'Erro ao carregar chamados pendentes:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar os chamados pendentes.'
  } finally {
    carregando.value = false
  }
}

/* =========================
   DETALHES
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

/* =========================
   ACEITE
========================= */

function prepararAceite(
  chamado
) {
  chamadoSelecionado.value =
    chamado

  dialogAceite.value =
    true
}

function fecharDialogAceite() {
  if (
    aceitandoId.value !== null
  ) {
    return
  }

  dialogAceite.value =
    false

  chamadoSelecionado.value =
    null
}

async function confirmarAceite() {
  if (
    !chamadoSelecionado.value
  ) {
    return
  }

  await aceitarChamado(
    chamadoSelecionado.value
  )
}

async function aceitarChamado(
  chamado
) {
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
    $q.notify({
      type:
        'negative',

      message:
        'Não foi possível identificar o técnico logado.'
    })

    return
  }

  aceitandoId.value =
    chamado.id_chamado

  try {
    const resposta =
      await chamadoFuncionarioService
        .aceitar(
          chamado.id_chamado,
          idFuncionario
        )

    chamados.value =
      chamados.value.filter(
        item =>
          item.id_chamado !==
          chamado.id_chamado
      )

    dialogAceite.value =
      false

    chamadoSelecionado.value =
      null

    $q.notify({
      type:
        'positive',

      message:
        resposta?.message ||
        `Chamado #${chamado.id_chamado} aceito com sucesso.`
    })

    /*
      Depois do aceite já abre
      o atendimento que acabou
      de ser assumido.
    */

    await router.push({
      name:
        'tecnico-atendimento-detalhes',

      params: {
        id:
          chamado.id_chamado
      }
    })
  } catch (error) {
    console.error(
      'Erro ao aceitar chamado:',
      error
    )

    const mensagem =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível aceitar o chamado.'

    $q.notify({
      type:
        'negative',

      message:
        mensagem
    })

    /*
      Se outro técnico tiver aceitado
      primeiro, atualizamos a lista
      imediatamente.
    */

    dialogAceite.value =
      false

    chamadoSelecionado.value =
      null

    await carregarChamados()
  } finally {
    aceitandoId.value =
      null
  }
}

/* =========================
   UTILITÁRIOS
========================= */

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

function urgenciaNormalizada(
  urgencia
) {
  return String(
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
}

function prioridadeUrgencia(
  urgencia
) {
  const valor =
    urgenciaNormalizada(
      urgencia
    )

  if (
    valor === 'ALTA'
  ) {
    return 3
  }

  if (
    valor === 'MEDIA'
  ) {
    return 2
  }

  return 1
}

/* =========================
   FORMATAÇÃO
========================= */

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

function descricaoCurta(
  descricao
) {
  const texto =
    String(
      descricao ||
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

  return 'Não informado'
}

function classeUrgencia(
  urgencia
) {
  const valor =
    urgenciaNormalizada(
      urgencia
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

onMounted(
  carregarChamados
)
</script>

<style scoped>
/* =========================
   WRAPPER
========================= */

.pendentes-wrapper {
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

.acoes-topo {
  display: flex;
  align-items: center;
  gap: 7px;
}

.campo-pesquisa {
  width: 285px;
}

/* =========================
   RESUMO
========================= */

.resumo-grid {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap: 10px;
  margin-top: 17px;
}

.resumo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px;
  border-radius: 11px;
  background: #f9fafb;
}

.resumo-icone {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
}

.resumo-icone--total {
  color: #f97316;
  background: #fff1e6;
}

.resumo-icone--alta {
  color: #dc2626;
  background: #fee2e2;
}

.resumo-icone--media {
  color: #d97706;
  background: #fef3c7;
}

.resumo-icone--baixa {
  color: #2563eb;
  background: #dbeafe;
}

.resumo-item strong {
  display: block;
  color: #101828;
  font-size: 14px;
  font-weight: 900;
}

.resumo-item span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
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

.ordem-info {
  display: flex;
  align-items: center;
  gap: 6px;
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
    minmax(110px, 0.7fr)
    minmax(120px, 0.8fr)
    minmax(105px, 0.7fr)
    75px
    70px
    125px;
  align-items: center;
  gap: 9px;
  padding: 14px 18px;
  border-left: 3px solid transparent;
  border-bottom: 1px solid #f2f4f7;
  transition: background 0.2s ease;
}

.chamado-card:last-child {
  border-bottom: none;
}

.chamado-card:hover {
  background: #fafafa;
}

.chamado-card--urgente {
  border-left-color: #ef4444;
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
  gap: 6px;
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
   BADGES
========================= */

.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 6px 9px;
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
   DIALOG
========================= */

.dialog-card {
  width: 100%;
  max-width: 560px;
  border-radius: 17px;
}

.dialog-topo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.dialog-icone {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  color: #f97316;
  background: #fff1e6;
}

.dialog-titulo {
  color: #101828;
  font-size: 15px;
  font-weight: 900;
}

.dialog-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
}

.dialog-conteudo {
  padding: 20px;
}

.dialog-numero {
  color: #f97316;
  font-size: 8px;
  font-weight: 900;
}

.dialog-chamado > strong {
  display: block;
  margin-top: 4px;
  color: #101828;
  font-size: 15px;
}

.dialog-chamado > span {
  display: block;
  margin-top: 5px;
  color: #667085;
  font-size: 9px;
  line-height: 1.5;
}

.dialog-grid {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  gap: 9px;
  margin-top: 17px;
}

.dialog-grid > div {
  padding: 11px;
  border-radius: 10px;
  background: #f9fafb;
}

.dialog-grid span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  text-transform: uppercase;
}

.dialog-grid strong {
  display: block;
  margin-top: 3px;
  color: #344054;
  font-size: 9px;
}

.dialog-aviso {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 17px;
  padding: 11px;
  border-radius: 10px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 8px;
  line-height: 1.5;
}

.dialog-acoes {
  padding: 13px 20px;
}

/* =========================
   DARK
========================= */

.body--dark
.filtros-card,
.body--dark
.lista-card,
.body--dark
.dialog-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark
.filtros-titulo,
.body--dark
.lista-cabecalho strong,
.body--dark
.dialog-titulo,
.body--dark
.dialog-chamado > strong {
  color: #f9fafb;
}

.body--dark
.resumo-item,
.body--dark
.dialog-grid > div {
  background: #1b1f25;
}

.body--dark
.resumo-item strong,
.body--dark
.chamado-problema,
.body--dark
.chamado-info strong,
.body--dark
.chamado-data strong,
.body--dark
.dialog-grid strong {
  color: #d0d5dd;
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
.dialog-aviso {
  color: #fdba74;
  background: #292018;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 1250px) {
  .chamado-card {
    grid-template-columns:
      42px
      minmax(180px, 1.4fr)
      minmax(110px, 0.8fr)
      minmax(115px, 0.8fr)
      75px
      70px
      120px;
  }

  .chamado-card
  > .chamado-info:nth-of-type(5) {
    display: none;
  }
}

@media (max-width: 950px) {
  .resumo-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .chamado-card {
    grid-template-columns:
      42px
      minmax(170px, 1fr)
      minmax(115px, 0.8fr)
      75px
      120px;
  }

  .chamado-info:nth-of-type(3),
  .chamado-info:nth-of-type(4),
  .chamado-data {
    display: none;
  }
}

@media (max-width: 700px) {
  .filtros-topo {
    flex-direction: column;
  }

  .acoes-topo {
    width: 100%;
  }

  .campo-pesquisa {
    flex: 1;
    width: auto;
  }

  .resumo-grid {
    grid-template-columns: 1fr;
  }

  .chamado-card {
    grid-template-columns:
      38px
      minmax(0, 1fr)
      95px;
  }

  .chamado-info,
  .chamado-data,
  .chamado-status-area {
    display: none;
  }

  .chamado-acoes {
    grid-column:
      2 / 4;
  }

  .dialog-grid {
    grid-template-columns: 1fr;
  }
}
</style>