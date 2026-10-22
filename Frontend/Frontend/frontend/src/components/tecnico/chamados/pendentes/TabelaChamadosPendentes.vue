<template>
  <div class="pendentes-wrapper">
    <!-- ==================================================
         CONTROLE / FILTROS
    =================================================== -->
    <section class="controle-card">
      <div class="controle-topo">
        <div class="controle-identidade">
          <div class="controle-icone">
            <q-icon name="pending_actions" size="22px" />
          </div>
          <div>
            <div class="controle-titulo">
              Fila de atendimento
            </div>
            <div class="controle-subtitulo">
              Chamados organizados por ordem de chegada.
            </div>
          </div>
        </div>
        <div class="controle-acoes">
          <q-input
            v-model="pesquisa"
            outlined
            dense
            clearable
            debounce="250"
            placeholder="Buscar chamado, produtor, propriedade..."
            class="campo-pesquisa"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>
          <q-select
            v-model="filtroUrgencia"
            outlined
            dense
            emit-value
            map-options
            :options="opcoesUrgencia"
            class="campo-filtro"
          >
            <template #prepend>
              <q-icon name="priority_high" size="18px" />
            </template>
          </q-select>
          <q-select
            v-model="ordenacao"
            outlined
            dense
            emit-value
            map-options
            :options="opcoesOrdenacao"
            class="campo-ordenacao"
          >
            <template #prepend>
              <q-icon name="sort" size="18px" />
            </template>
          </q-select>
          <q-btn
            unelevated
            round
            class="botao-atualizar"
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
        <button
          type="button"
          class="resumo-item resumo-item--total"
          :class="{ 'resumo-item--ativo': filtroUrgencia === 'TODAS' }"
          @click="filtroUrgencia = 'TODAS'"
        >
          <div class="resumo-icone resumo-icone--total">
            <q-icon name="pending_actions" size="19px" />
          </div>
          <div>
            <strong>{{ totalPendentes }}</strong>
            <span>Pendentes</span>
          </div>
        </button>
        <button
          type="button"
          class="resumo-item resumo-item--alta"
          :class="{ 'resumo-item--ativo': filtroUrgencia === 'ALTA' }"
          @click="filtroUrgencia = 'ALTA'"
        >
          <div class="resumo-icone resumo-icone--alta">
            <q-icon name="priority_high" size="19px" />
          </div>
          <div>
            <strong>{{ totalAlta }}</strong>
            <span>Alta urgência</span>
          </div>
        </button>
        <button
          type="button"
          class="resumo-item resumo-item--media"
          :class="{ 'resumo-item--ativo': filtroUrgencia === 'MEDIA' }"
          @click="filtroUrgencia = 'MEDIA'"
        >
          <div class="resumo-icone resumo-icone--media">
            <q-icon name="warning_amber" size="19px" />
          </div>
          <div>
            <strong>{{ totalMedia }}</strong>
            <span>Média urgência</span>
          </div>
        </button>
        <button
          type="button"
          class="resumo-item resumo-item--baixa"
          :class="{ 'resumo-item--ativo': filtroUrgencia === 'BAIXA' }"
          @click="filtroUrgencia = 'BAIXA'"
        >
          <div class="resumo-icone resumo-icone--baixa">
            <q-icon name="low_priority" size="19px" />
          </div>
          <div>
            <strong>{{ totalBaixa }}</strong>
            <span>Baixa urgência</span>
          </div>
        </button>
      </div>
    </section>
    <!-- ==================================================
         ERRO
    =================================================== -->
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
      <span>
        Carregando chamados pendentes...
      </span>
    </div>
    <!-- ==================================================
         LISTAGEM
    =================================================== -->
    <section
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
        <div class="lista-cabecalho__direita">
          <span class="lista-legenda">
            <span class="legenda-bolinha legenda-bolinha--alta"></span>
            Alta
          </span>
          <span class="lista-legenda">
            <span class="legenda-bolinha legenda-bolinha--media"></span>
            Média
          </span>
          <span class="lista-legenda">
            <span class="legenda-bolinha legenda-bolinha--baixa"></span>
            Baixa
          </span>
        </div>
      </div>
      <div
        v-if="chamadosFiltrados.length === 0"
        class="estado-vazio"
      >
        <div class="estado-vazio-icone">
          <q-icon
            :name="
              pesquisa || filtroUrgencia !== 'TODAS'
                ? 'search_off'
                : 'check_circle'
            "
            size="31px"
          />
        </div>
        <strong>
          {{
            pesquisa || filtroUrgencia !== 'TODAS'
              ? 'Nenhum chamado encontrado'
              : 'Nenhum chamado pendente'
          }}
        </strong>
        <span>
          {{
            pesquisa || filtroUrgencia !== 'TODAS'
              ? 'Altere os filtros para visualizar outros chamados.'
              : 'Não existem novas solicitações aguardando atendimento.'
          }}
        </span>
        <q-btn
          v-if="pesquisa || filtroUrgencia !== 'TODAS'"
          flat
          no-caps
          color="orange"
          label="Limpar filtros"
          class="q-mt-sm"
          @click="limparFiltros"
        />
      </div>
      <div
        v-else
        class="chamados-lista"
      >
        <article
          v-for="chamado in chamadosFiltrados"
          :key="chamado.id_chamado"
          class="chamado-card"
          :class="classeCardUrgencia(chamado.urgencia)"
        >
          <div class="chamado-faixa"></div>
          <div class="chamado-id-area">
            <span>CHAMADO</span>
            <strong>#{{ chamado.id_chamado }}</strong>
          </div>
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
          <div class="chamado-dados">
            <div class="dado-item">
              <q-icon
                name="person_outline"
                size="17px"
              />
              <div>
                <span>Produtor</span>
                <strong>
                  {{
                    chamado.nome_produtor ||
                    'Não informado'
                  }}
                </strong>
              </div>
            </div>
            <div class="dado-item">
              <q-icon
                name="agriculture"
                size="17px"
              />
              <div>
                <span>Propriedade</span>
                <strong>
                  {{
                    chamado.nome_propriedade ||
                    'Não informada'
                  }}
                </strong>
              </div>
            </div>
            <div class="dado-item">
              <q-icon
                name="location_on"
                size="17px"
              />
              <div>
                <span>Localização</span>
                <strong>
                  {{ localChamado(chamado) }}
                </strong>
              </div>
            </div>
            <div class="dado-item">
              <q-icon
                name="event"
                size="17px"
              />
              <div>
                <span>Abertura</span>
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
          <div class="chamado-lateral">
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
            <div class="chamado-acoes">
              <q-btn
                outline
                no-caps
                class="botao-detalhes"
                icon="visibility"
                label="Detalhes"
                :disable="aceitandoId !== null"
                @click="verDetalhes(chamado)"
              />
              <q-btn
                unelevated
                no-caps
                class="botao-aceitar"
                icon="check_circle"
                label="Aceitar chamado"
                :loading="
                  aceitandoId ===
                  chamado.id_chamado
                "
                :disable="
                  aceitandoId !== null &&
                  aceitandoId !==
                    chamado.id_chamado
                "
                @click="
                  prepararAceite(
                    chamado
                  )
                "
              />
            </div>
          </div>
        </article>
      </div>
    </section>
    <!-- ==================================================
         CONFIRMAÇÃO DO ACEITE
    =================================================== -->
    <q-dialog
      v-model="dialogAceite"
      persistent
    >
      <q-card class="dialog-card">
        <q-card-section class="dialog-topo">
          <div class="dialog-icone">
            <q-icon
              name="assignment_turned_in"
              size="24px"
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
              <span>Produtor</span>
              <strong>
                {{
                  chamadoSelecionado.nome_produtor ||
                  'Não informado'
                }}
              </strong>
            </div>
            <div>
              <span>Propriedade</span>
              <strong>
                {{
                  chamadoSelecionado.nome_propriedade ||
                  'Não informada'
                }}
              </strong>
            </div>
            <div>
              <span>Localização</span>
              <strong>
                {{
                  localChamado(
                    chamadoSelecionado
                  )
                }}
              </strong>
            </div>
            <div>
              <span>Urgência</span>
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
              size="19px"
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
            class="botao-aceitar"
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
const filtroUrgencia = ref('TODAS')
const ordenacao = ref('ANTIGOS')
const aceitandoId = ref(null)
const dialogAceite = ref(false)
const chamadoSelecionado = ref(null)
const opcoesUrgencia = [
  {
    label: 'Todas as urgências',
    value: 'TODAS'
  },
  {
    label: 'Alta urgência',
    value: 'ALTA'
  },
  {
    label: 'Média urgência',
    value: 'MEDIA'
  },
  {
    label: 'Baixa urgência',
    value: 'BAIXA'
  }
]
const opcoesOrdenacao = [
  {
    label: 'Mais antigos primeiro',
    value: 'ANTIGOS'
  },
  {
    label: 'Mais recentes primeiro',
    value: 'RECENTES'
  },
  {
    label: 'Maior urgência',
    value: 'PRIORIDADE'
  }
]
/* ==================================================
   PENDENTES
=================================================== */
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
/* ==================================================
   FILTRO E ORDENAÇÃO
=================================================== */
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
    if (
      filtroUrgencia.value !==
      'TODAS'
    ) {
      lista =
        lista.filter(
          chamado =>
            urgenciaNormalizada(
              chamado.urgencia
            ) ===
            filtroUrgencia.value
        )
    }
    return lista.sort(
      (a, b) => {
        const dataA =
          new Date(
            a.data_abertura ||
            0
          ).getTime()
        const dataB =
          new Date(
            b.data_abertura ||
            0
          ).getTime()
        if (
          ordenacao.value ===
          'ANTIGOS'
        ) {
          return (dataA - dataB) || (Number(a.id_chamado) - Number(b.id_chamado))
        }
        if (
          ordenacao.value ===
          'RECENTES'
        ) {
          return (dataB - dataA) || (Number(b.id_chamado) - Number(a.id_chamado))
        }
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
          return (
            urgenciaB -
            urgenciaA
          )
        }
        return (dataA - dataB) || (Number(a.id_chamado) - Number(b.id_chamado))
      }
    )
  })
function limparFiltros() {
  pesquisa.value = ''
  filtroUrgencia.value = 'TODAS'
  ordenacao.value = 'ANTIGOS'
}
/* ==================================================
   CARREGAR
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
/* ==================================================
   DETALHES
=================================================== */
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
/* ==================================================
   ACEITE
=================================================== */
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
/* ==================================================
   UTILITÁRIOS
=================================================== */
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
function classeCardUrgencia(
  urgencia
) {
  const valor =
    urgenciaNormalizada(
      urgencia
    )
  if (valor === 'ALTA') {
    return 'chamado-card--alta'
  }
  if (valor === 'MEDIA') {
    return 'chamado-card--media'
  }
  return 'chamado-card--baixa'
}
/* ==================================================
   FORMATAÇÃO
=================================================== */
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
    texto.length <= 80
  ) {
    return texto
  }
  return (
    texto.substring(
      0,
      80
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
.pendentes-wrapper {
  width: 100%;
}
/* ==================================================
   CONTROLE / FILTROS
=================================================== */
.controle-card {
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background:
    linear-gradient(
      110deg,
      #ffffff 0%,
      #ffffff 72%,
      #fff9f3 100%
    );
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}
.controle-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.controle-identidade {
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.controle-icone {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 11px;
  color: #f97316;
  background: #fff1e6;
}
.controle-titulo {
  color: #17233c;
  font-size: 14px;
  font-weight: 900;
}
.controle-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
}
.controle-acoes {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
}
.campo-pesquisa {
  width: 300px;
}
.campo-filtro {
  width: 170px;
}
.campo-ordenacao {
  width: 170px;
}
.controle-card :deep(.q-field__control) {
  min-height: 40px;
  height: 40px;
  border-radius: 11px;
  background: #ffffff;
}
.controle-card :deep(.q-field__native),
.controle-card :deep(.q-field__input) {
  font-size: 10px;
}
.botao-atualizar {
  width: 40px;
  height: 40px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );
  box-shadow:
    0 5px 13px
    rgba(249, 115, 22, 0.18);
}
/* ==================================================
   RESUMO
=================================================== */
.resumo-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}
.resumo-item {
  appearance: none;
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border: 1px solid #eef0f3;
  border-radius: 11px;
  color: inherit;
  background: rgba(249, 250, 251, 0.86);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}
.resumo-item:hover {
  transform: translateY(-1px);
  border-color: #fed7aa;
}
.resumo-item--ativo {
  border-color: #fdba74;
  background: #fff7ed;
}
.resumo-icone {
  width: 34px;
  height: 34px;
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
  font-size: 15px;
  font-weight: 900;
  line-height: 1;
}
.resumo-item span {
  display: block;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 7px;
}
/* ==================================================
   LISTA
=================================================== */
.lista-card {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}
.lista-cabecalho {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid #eaecf0;
}
.lista-cabecalho strong {
  display: block;
  color: #101828;
  font-size: 12px;
  font-weight: 900;
}
.lista-cabecalho span {
  display: block;
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
}
.lista-cabecalho__direita {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lista-legenda {
  display: flex !important;
  align-items: center;
  gap: 5px;
  margin: 0 !important;
  color: #667085 !important;
  font-size: 7px !important;
}
.legenda-bolinha {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.legenda-bolinha--alta {
  background: #ef4444;
}
.legenda-bolinha--media {
  background: #f59e0b;
}
.legenda-bolinha--baixa {
  background: #3b82f6;
}
/* ==================================================
   CHAMADO
=================================================== */
.chamados-lista {
  display: grid;
  gap: 0;
}
.chamado-card {
  position: relative;
  min-width: 0;
  display: grid;
  grid-template-columns:
    58px
    minmax(210px, 1.25fr)
    minmax(0, 1.8fr)
    260px;
  align-items: center;
  gap: 14px;
  padding: 13px 16px 13px 19px;
  border-bottom: 1px solid #f2f4f7;
  background: #ffffff;
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease;
}
.chamado-card:last-child {
  border-bottom: none;
}
.chamado-card:hover {
  z-index: 1;
  background: #fcfcfd;
  box-shadow:
    inset 0 0 0 1px #fed7aa;
}
.chamado-faixa {
  position: absolute;
  left: 0;
  top: 11px;
  bottom: 11px;
  width: 4px;
  border-radius: 0 999px 999px 0;
}
.chamado-card--alta .chamado-faixa {
  background: #ef4444;
}
.chamado-card--media .chamado-faixa {
  background: #f59e0b;
}
.chamado-card--baixa .chamado-faixa {
  background: #3b82f6;
}
.chamado-id-area span {
  display: block;
  color: #98a2b3;
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.6px;
}
.chamado-id-area strong {
  display: block;
  margin-top: 2px;
  color: #f97316;
  font-size: 13px;
  font-weight: 900;
}
.chamado-principal {
  min-width: 0;
}
.chamado-problema {
  overflow: hidden;
  color: #344054;
  font-size: 11px;
  font-weight: 900;
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
.chamado-dados {
  min-width: 0;
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.dado-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dado-item > .q-icon {
  flex-shrink: 0;
  color: #667085;
}
.dado-item > div {
  min-width: 0;
}
.dado-item span {
  display: block;
  color: #98a2b3;
  font-size: 6px;
  text-transform: uppercase;
}
.dado-item strong {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: #475467;
  font-size: 8px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chamado-lateral {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.chamado-acoes {
  display: flex;
  align-items: center;
  gap: 6px;
}
.botao-detalhes,
.botao-aceitar {
  min-height: 35px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 800;
}
.botao-detalhes {
  color: #667085;
}
.botao-aceitar {
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );
  box-shadow:
    0 4px 11px
    rgba(249, 115, 22, 0.16);
}
/* ==================================================
   BADGES
=================================================== */
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 5px 9px;
  font-size: 8px;
  font-weight: 800;
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
   ESTADOS
=================================================== */
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
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px;
  color: #98a2b3;
  text-align: center;
}
.estado-vazio-icone {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 9px;
  border-radius: 15px;
  color: #f97316;
  background: #fff1e6;
}
.estado-vazio strong {
  color: #475467;
  font-size: 11px;
}
.estado-vazio span {
  margin-top: 4px;
  font-size: 8px;
}
/* ==================================================
   DIALOG
=================================================== */
.dialog-card {
  width: 100%;
  max-width: 540px;
  overflow: hidden;
  border-radius: 17px;
}
.dialog-topo {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 18px;
}
.dialog-icone {
  width: 43px;
  height: 43px;
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
  font-size: 14px;
  font-weight: 900;
}
.dialog-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
}
.dialog-conteudo {
  padding: 18px;
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
    repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 15px;
}
.dialog-grid > div {
  padding: 10px;
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
  margin-top: 15px;
  padding: 10px;
  border-radius: 10px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 8px;
  line-height: 1.5;
}
.dialog-acoes {
  padding: 12px 18px;
}
/* ==================================================
   DARK
=================================================== */
.body--dark .controle-card,
.body--dark .lista-card,
.body--dark .dialog-card {
  border-color: #2b2f36;
  background: #16191f;
}
.body--dark .controle-card {
  background:
    linear-gradient(
      110deg,
      #16191f 0%,
      #16191f 72%,
      #211b17 100%
    );
}
.body--dark .controle-titulo,
.body--dark .lista-cabecalho strong,
.body--dark .dialog-titulo,
.body--dark .dialog-chamado > strong {
  color: #f9fafb;
}
.body--dark .controle-card :deep(.q-field__control) {
  background: #1b1f25;
}
.body--dark .resumo-item {
  border-color: #2b2f36;
  background: #1b1f25;
}
.body--dark .resumo-item--ativo {
  border-color: #7c2d12;
  background: #292018;
}
.body--dark .resumo-item strong,
.body--dark .chamado-problema,
.body--dark .dado-item strong,
.body--dark .dialog-grid strong {
  color: #d0d5dd;
}
.body--dark .lista-cabecalho,
.body--dark .chamado-card {
  border-color: #2b2f36;
}
.body--dark .chamado-card {
  background: #16191f;
}
.body--dark .chamado-card:hover {
  background: #1b1f25;
  box-shadow:
    inset 0 0 0 1px #7c2d12;
}
.body--dark .dialog-grid > div {
  background: #1b1f25;
}
.body--dark .dialog-aviso {
  color: #fdba74;
  background: #292018;
}
/* ==================================================
   RESPONSIVO
=================================================== */
@media (max-width: 1350px) {
  .controle-topo {
    align-items: flex-start;
  }
  .controle-acoes {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .campo-pesquisa {
    width: 260px;
  }
  .chamado-card {
    grid-template-columns:
      55px
      minmax(180px, 1fr)
      minmax(0, 1.3fr)
      245px;
  }
  .chamado-dados {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 1100px) {
  .controle-topo {
    flex-direction: column;
  }
  .controle-acoes {
    width: 100%;
    justify-content: flex-start;
  }
  .campo-pesquisa {
    flex: 1;
    width: auto;
    min-width: 240px;
  }
  .chamado-card {
    grid-template-columns:
      55px
      minmax(0, 1fr)
      230px;
  }
  .chamado-dados {
    grid-column:
      2 / 4;
    grid-row: 2;
    margin-top: -3px;
  }
  .chamado-lateral {
    grid-column: 3;
    grid-row: 1;
  }
}
@media (max-width: 800px) {
  .resumo-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
  .campo-pesquisa,
  .campo-filtro,
  .campo-ordenacao {
    width: 100%;
    min-width: 0;
  }
  .controle-acoes {
    display: grid;
    grid-template-columns:
      1fr
      1fr
      40px;
  }
  .campo-pesquisa {
    grid-column:
      1 / 4;
  }
  .lista-cabecalho__direita {
    display: none;
  }
  .chamado-card {
    grid-template-columns:
      54px
      minmax(0, 1fr);
    gap: 10px;
  }
  .chamado-id-area {
    align-self: start;
  }
  .chamado-dados {
    grid-column:
      1 / 3;
    grid-row: auto;
    padding-left: 0;
  }
  .chamado-lateral {
    grid-column:
      1 / 3;
    grid-row: auto;
    justify-content: space-between;
  }
  .chamado-acoes {
    flex: 1;
    justify-content: flex-end;
  }
}
@media (max-width: 560px) {
  .controle-card {
    padding: 12px;
  }
  .controle-identidade {
    min-width: 0;
  }
  .controle-subtitulo {
    display: none;
  }
  .resumo-grid {
    grid-template-columns: 1fr 1fr;
  }
  .resumo-item {
    padding: 8px;
  }
  .controle-acoes {
    grid-template-columns:
      1fr
      40px;
  }
  .campo-pesquisa,
  .campo-filtro,
  .campo-ordenacao {
    grid-column:
      1 / 3;
  }
  .botao-atualizar {
    grid-column: 2;
  }
  .chamado-card {
    padding:
      12px
      12px
      12px
      17px;
  }
  .chamado-dados {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
  .dado-item:nth-child(1),
  .dado-item:nth-child(4) {
    display: none;
  }
  .chamado-lateral {
    align-items: stretch;
    flex-direction: column;
  }
  .chamado-acoes {
    width: 100%;
  }
  .botao-detalhes,
  .botao-aceitar {
    flex: 1;
  }
  .dialog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
