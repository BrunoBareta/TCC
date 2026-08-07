<template>
  <q-page class="dashboard-page">
    <!-- CABEÇALHO -->
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Dashboard do Técnico
        </div>

        <div class="pagina-subtitulo">
          Acompanhe seus atendimentos e chamados disponíveis.
        </div>
      </div>

      <q-btn
        outline
        no-caps
        color="orange"
        icon="refresh"
        label="Atualizar"
        :loading="carregando"
        @click="carregarDashboard"
      />
    </div>

    <!-- ERRO -->
    <q-banner
      v-if="erro"
      rounded
      class="bg-red-1 text-negative q-mb-lg"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarDashboard"
        />
      </template>
    </q-banner>

    <!-- CARDS -->
    <div class="cards-grid">
      <!-- PENDENTES -->
      <div
        class="indicador-card clicavel"
        @click="irPendentes"
      >
        <div class="indicador-topo">
          <div class="indicador-icone pendente">
            <q-icon
              name="pending_actions"
              size="24px"
            />
          </div>

          <q-icon
            name="arrow_forward"
            color="grey-5"
            size="20px"
          />
        </div>

        <div class="indicador-numero">
          {{ totalPendentes }}
        </div>

        <div class="indicador-titulo">
          Chamados pendentes
        </div>

        <div class="indicador-subtitulo">
          Disponíveis para atendimento
        </div>
      </div>

      <!-- EM ANDAMENTO -->
      <div
        class="indicador-card clicavel"
        @click="irEmAndamento"
      >
        <div class="indicador-topo">
          <div class="indicador-icone andamento">
            <q-icon
              name="engineering"
              size="24px"
            />
          </div>

          <q-icon
            name="arrow_forward"
            color="grey-5"
            size="20px"
          />
        </div>

        <div class="indicador-numero">
          {{ totalEmAndamento }}
        </div>

        <div class="indicador-titulo">
          Em andamento
        </div>

        <div class="indicador-subtitulo">
          Aceitos, em rota ou atendimento
        </div>
      </div>

      <!-- FINALIZADOS -->
      <div
        class="indicador-card clicavel"
        @click="irFinalizados"
      >
        <div class="indicador-topo">
          <div class="indicador-icone finalizado">
            <q-icon
              name="task_alt"
              size="24px"
            />
          </div>

          <q-icon
            name="arrow_forward"
            color="grey-5"
            size="20px"
          />
        </div>

        <div class="indicador-numero">
          {{ totalFinalizados }}
        </div>

        <div class="indicador-titulo">
          Finalizados
        </div>

        <div class="indicador-subtitulo">
          Atendimentos concluídos
        </div>
      </div>

      <!-- TODOS -->
      <div
        class="indicador-card clicavel"
        @click="irMeusChamados"
      >
        <div class="indicador-topo">
          <div class="indicador-icone total">
            <q-icon
              name="assignment_ind"
              size="24px"
            />
          </div>

          <q-icon
            name="arrow_forward"
            color="grey-5"
            size="20px"
          />
        </div>

        <div class="indicador-numero">
          {{ totalMeusChamados }}
        </div>

        <div class="indicador-titulo">
          Meus chamados
        </div>

        <div class="indicador-subtitulo">
          Total vinculado ao seu usuário
        </div>
      </div>
    </div>

    <!-- CONTEÚDO -->
    <div class="dashboard-grid">
      <!-- COLUNA PRINCIPAL -->
      <div class="coluna-principal">
        <!-- ATENDIMENTO ATUAL -->
        <div class="conteudo-card destaque-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Atendimento atual
              </div>

              <div class="card-subtitulo">
                Continue de onde parou.
              </div>
            </div>

            <q-icon
              name="engineering"
              size="30px"
              color="orange"
            />
          </div>

          <div
            v-if="carregando"
            class="estado-central"
          >
            <q-spinner
              color="orange"
              size="36px"
            />
          </div>

          <div
            v-else-if="chamadoAtual"
            class="atendimento-atual"
          >
            <div class="atendimento-topo">
              <div>
                <div class="chamado-numero">
                  Chamado #{{ chamadoAtual.id_chamado }}
                </div>

                <div class="chamado-problema">
                  {{ chamadoAtual.problema }}
                </div>
              </div>

              <q-badge
                rounded
                :class="classeStatus(chamadoAtual.status)"
              >
                {{ formatarTexto(chamadoAtual.status) }}
              </q-badge>
            </div>

            <div class="atendimento-info-grid">
              <div class="info-item">
                <q-icon
                  name="agriculture"
                  size="18px"
                  color="grey-6"
                />

                <div>
                  <div class="info-label">
                    Propriedade
                  </div>

                  <div class="info-valor">
                    {{
                      chamadoAtual.nome_propriedade ||
                      'Não informada'
                    }}
                  </div>
                </div>
              </div>

              <div class="info-item">
                <q-icon
                  name="location_on"
                  size="18px"
                  color="grey-6"
                />

                <div>
                  <div class="info-label">
                    Local
                  </div>

                  <div class="info-valor">
                    {{
                      chamadoAtual.nome_unidade ||
                      'Não informado'
                    }}
                  </div>
                </div>
              </div>

              <div class="info-item">
                <q-icon
                  name="priority_high"
                  size="18px"
                  color="grey-6"
                />

                <div>
                  <div class="info-label">
                    Urgência
                  </div>

                  <div class="info-valor">
                    {{
                      formatarTexto(
                        chamadoAtual.urgencia
                      )
                    }}
                  </div>
                </div>
              </div>

              <div class="info-item">
                <q-icon
                  name="event"
                  size="18px"
                  color="grey-6"
                />

                <div>
                  <div class="info-label">
                    Data
                  </div>

                  <div class="info-valor">
                    {{
                      formatarData(
                        chamadoAtual.data_abertura
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="chamadoAtual.referencia_unidade"
              class="referencia-local"
            >
              <q-icon
                name="near_me"
                size="18px"
              />

              <span>
                Referência:
                {{ chamadoAtual.referencia_unidade }}
              </span>
            </div>

            <div class="atendimento-acoes">
              <q-btn
                unelevated
                no-caps
                color="orange"
                icon="play_arrow"
                label="Continuar atendimento"
                @click="continuarAtendimento"
              />
            </div>
          </div>

          <div
            v-else
            class="estado-vazio"
          >
            <div class="estado-vazio-icone">
              <q-icon
                name="check_circle"
                size="34px"
              />
            </div>

            <div class="estado-vazio-titulo">
              Nenhum atendimento em andamento
            </div>

            <div class="estado-vazio-texto">
              Você não possui chamado ativo neste momento.
            </div>

            <q-btn
              outline
              no-caps
              color="orange"
              icon="pending_actions"
              label="Ver chamados pendentes"
              class="q-mt-md"
              @click="irPendentes"
            />
          </div>
        </div>

        <!-- CHAMADOS PENDENTES -->
        <div class="conteudo-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Chamados aguardando atendimento
              </div>

              <div class="card-subtitulo">
                Solicitações disponíveis para aceite.
              </div>
            </div>

            <q-btn
              flat
              no-caps
              color="orange"
              label="Ver todos"
              icon-right="arrow_forward"
              @click="irPendentes"
            />
          </div>

          <div
            v-if="pendentesDestaque.length === 0"
            class="estado-vazio pequeno"
          >
            <q-icon
              name="inbox"
              size="36px"
              color="grey-5"
            />

            <div class="estado-vazio-titulo">
              Nenhum chamado pendente
            </div>
          </div>

          <div
            v-else
            class="lista-chamados"
          >
            <div
              v-for="item in pendentesDestaque"
              :key="item.id_chamado"
              class="chamado-lista-item"
            >
              <div class="chamado-lista-principal">
                <div class="lista-numero">
                  #{{ item.id_chamado }}
                </div>

                <div class="lista-conteudo">
                  <div class="lista-problema">
                    {{ item.problema }}
                  </div>

                  <div class="lista-meta">
                    <span>
                      {{
                        item.nome_propriedade ||
                        'Propriedade não informada'
                      }}
                    </span>

                    <span
                      v-if="item.nome_unidade"
                    >
                      • {{ item.nome_unidade }}
                    </span>

                    <span>
                      • {{ formatarData(item.data_abertura) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="lista-acoes">
                <q-badge
                  rounded
                  :class="classeUrgencia(item.urgencia)"
                >
                  {{ formatarTexto(item.urgencia) }}
                </q-badge>

                <q-btn
                  outline
                  no-caps
                  color="orange"
                  label="Ver"
                  size="sm"
                  @click="abrirChamado(item)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUNA DIREITA -->
      <div class="coluna-lateral">
        <!-- RESUMO -->
        <div class="conteudo-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Resumo
              </div>

              <div class="card-subtitulo">
                Situação dos seus chamados.
              </div>
            </div>

            <q-icon
              name="query_stats"
              size="28px"
              color="orange"
            />
          </div>

          <div class="resumo-lista">
            <div class="resumo-item">
              <div class="resumo-item-esquerda">
                <span class="ponto ponto-aceito" />
                <span>Aceitos</span>
              </div>

              <strong>
                {{ totalAceitos }}
              </strong>
            </div>

            <div class="resumo-item">
              <div class="resumo-item-esquerda">
                <span class="ponto ponto-rota" />
                <span>Em deslocamento</span>
              </div>

              <strong>
                {{ totalEmRota }}
              </strong>
            </div>

            <div class="resumo-item">
              <div class="resumo-item-esquerda">
                <span class="ponto ponto-atendimento" />
                <span>Em atendimento</span>
              </div>

              <strong>
                {{ totalAtendimento }}
              </strong>
            </div>

            <div class="resumo-item">
              <div class="resumo-item-esquerda">
                <span class="ponto ponto-finalizado" />
                <span>Finalizados</span>
              </div>

              <strong>
                {{ totalFinalizados }}
              </strong>
            </div>
          </div>
        </div>

        <!-- ÚLTIMOS FINALIZADOS -->
        <div class="conteudo-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Últimos atendimentos
              </div>

              <div class="card-subtitulo">
                Seus chamados concluídos recentemente.
              </div>
            </div>
          </div>

          <div
            v-if="ultimosFinalizados.length === 0"
            class="estado-vazio pequeno"
          >
            <q-icon
              name="history"
              size="34px"
              color="grey-5"
            />

            <div class="estado-vazio-texto">
              Nenhum atendimento finalizado.
            </div>
          </div>

          <div
            v-else
            class="ultimos-lista"
          >
            <div
              v-for="item in ultimosFinalizados"
              :key="item.id_chamado"
              class="ultimo-item"
              @click="abrirChamado(item)"
            >
              <div class="ultimo-icone">
                <q-icon
                  name="check"
                  size="18px"
                />
              </div>

              <div class="ultimo-conteudo">
                <div class="ultimo-problema">
                  {{ item.problema }}
                </div>

                <div class="ultimo-data">
                  {{
                    formatarData(
                      item.data_fechamento ||
                      item.data_finalizacao ||
                      item.data_abertura
                    )
                  }}
                </div>
              </div>

              <q-icon
                name="chevron_right"
                color="grey-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
  useAuthStore
} from 'src/stores/auth'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(false)
const erro = ref('')

const chamadosGerais = ref([])
const meusChamados = ref([])

const idFuncionario = computed(() =>
  Number(
    authStore.usuario?.id_usuario
  )
)

const chamadosPendentes = computed(() =>
  chamadosGerais.value.filter(
    (item) =>
      String(
        item.status || ''
      ).toUpperCase() === 'PENDENTE'
  )
)

const meusChamadosNormalizados = computed(() =>
  Array.isArray(meusChamados.value)
    ? meusChamados.value
    : []
)

const totalPendentes = computed(
  () => chamadosPendentes.value.length
)

const totalMeusChamados = computed(
  () => meusChamadosNormalizados.value.length
)

const totalAceitos = computed(() =>
  contarStatus(['ACEITO'])
)

const totalEmRota = computed(() =>
  contarStatus(['EM_ROTA'])
)

const totalAtendimento = computed(() =>
  contarStatus(['EM_ATENDIMENTO'])
)

const totalFinalizados = computed(() =>
  contarStatus([
    'FINALIZADO',
    'CONCLUIDO'
  ])
)

const totalEmAndamento = computed(
  () =>
    totalAceitos.value +
    totalEmRota.value +
    totalAtendimento.value
)

const chamadoAtual = computed(() => {
  const prioridade = [
    'EM_ATENDIMENTO',
    'EM_ROTA',
    'ACEITO'
  ]

  for (const status of prioridade) {
    const encontrado =
      meusChamadosNormalizados.value.find(
        (item) =>
          String(
            item.status || ''
          ).toUpperCase() === status
      )

    if (encontrado) {
      return encontrado
    }
  }

  return null
})

const pendentesDestaque = computed(() =>
  [...chamadosPendentes.value]
    .sort((a, b) => {
      const prioridadeA =
        prioridadeUrgencia(
          a.urgencia
        )

      const prioridadeB =
        prioridadeUrgencia(
          b.urgencia
        )

      if (
        prioridadeA !==
        prioridadeB
      ) {
        return (
          prioridadeB -
          prioridadeA
        )
      }

      return (
        new Date(
          b.data_abertura
        ).getTime() -
        new Date(
          a.data_abertura
        ).getTime()
      )
    })
    .slice(0, 4)
)

const ultimosFinalizados = computed(() =>
  meusChamadosNormalizados.value
    .filter((item) =>
      [
        'FINALIZADO',
        'CONCLUIDO'
      ].includes(
        String(
          item.status || ''
        ).toUpperCase()
      )
    )
    .sort((a, b) => {
      const dataA =
        new Date(
          a.data_fechamento ||
          a.data_finalizacao ||
          a.data_abertura
        ).getTime()

      const dataB =
        new Date(
          b.data_fechamento ||
          b.data_finalizacao ||
          b.data_abertura
        ).getTime()

      return dataB - dataA
    })
    .slice(0, 5)
)

function contarStatus(
  statusPermitidos
) {
  return meusChamadosNormalizados.value.filter(
    (item) =>
      statusPermitidos.includes(
        String(
          item.status || ''
        ).toUpperCase()
      )
  ).length
}

function prioridadeUrgencia(
  urgencia
) {
  const valor =
    String(
      urgencia || ''
    ).toUpperCase()

  if (valor === 'ALTA') {
    return 3
  }

  if (valor === 'MEDIA') {
    return 2
  }

  return 1
}

async function carregarDashboard() {
  carregando.value = true
  erro.value = ''

  try {
    if (
      !Number.isInteger(
        idFuncionario.value
      ) ||
      idFuncionario.value <= 0
    ) {
      throw new Error(
        'Técnico logado não identificado.'
      )
    }

    const [
      respostaChamados,
      respostaMeusChamados
    ] = await Promise.all([
      chamadoService.listar(),

      chamadoFuncionarioService
        .listarPorFuncionario(
          idFuncionario.value
        )
    ])

    chamadosGerais.value =
      Array.isArray(
        respostaChamados
      )
        ? respostaChamados
        : respostaChamados?.data ||
          respostaChamados?.chamados ||
          []

    meusChamados.value =
      Array.isArray(
        respostaMeusChamados
      )
        ? respostaMeusChamados
        : respostaMeusChamados?.data ||
          respostaMeusChamados?.chamados ||
          []
  } catch (error) {
    console.error(
      'Erro ao carregar dashboard do técnico:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar o dashboard.'
  } finally {
    carregando.value = false
  }
}

function formatarTexto(valor) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /^\w/,
      (letra) =>
        letra.toUpperCase()
    )
}

function formatarData(valor) {
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

function classeStatus(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
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
      urgencia || ''
    ).toUpperCase()

  if (valor === 'ALTA') {
    return 'urgencia-alta'
  }

  if (valor === 'MEDIA') {
    return 'urgencia-media'
  }

  return 'urgencia-baixa'
}

function continuarAtendimento() {
  if (!chamadoAtual.value) {
    return
  }

  router.push({
    name:
      'tecnico-atendimento-detalhes',

    params: {
      id:
        chamadoAtual.value
          .id_chamado
    }
  })
}

function abrirChamado(item) {
  router.push({
    name:
      'tecnico-detalhes-chamado',

    params: {
      id:
        item.id_chamado
    }
  })
}

/* =============================
   NAVEGAÇÃO DOS CARDS
============================= */

function irPendentes() {
  router.push({
    name: 'tecnico-pendentes'
  })
}

function irEmAndamento() {
  router.push({
    name:
      'tecnico-meus-chamados',

    query: {
      filtro: 'andamento'
    }
  })
}

function irFinalizados() {
  router.push({
    name:
      'tecnico-meus-chamados',

    query: {
      filtro: 'finalizados'
    }
  })
}

function irMeusChamados() {
  router.push({
    name:
      'tecnico-meus-chamados'
  })
}

onMounted(
  carregarDashboard
)
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
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

.cards-grid {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap: 18px;
  margin-bottom: 22px;
}

.indicador-card,
.conteudo-card {
  border: 1px solid #eaecf0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 3px 10px
    rgba(
      16,
      24,
      40,
      0.05
    );
}

.indicador-card {
  padding: 20px;
}

.clicavel {
  cursor: pointer;
  transition:
    transform 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.clicavel:hover {
  transform: translateY(-2px);
  border-color: #fdba74;
  box-shadow:
    0 6px 18px
    rgba(
      16,
      24,
      40,
      0.08
    );
}

.indicador-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.indicador-icone {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
}

.indicador-icone.pendente {
  color: #f97316;
  background: #fff1e6;
}

.indicador-icone.andamento {
  color: #2563eb;
  background: #dbeafe;
}

.indicador-icone.finalizado {
  color: #059669;
  background: #d1fae5;
}

.indicador-icone.total {
  color: #344054;
  background: #f2f4f7;
}

.indicador-numero {
  margin-top: 20px;
  color: #101828;
  font-size: 28px;
  font-weight: 800;
}

.indicador-titulo {
  margin-top: 3px;
  color: #344054;
  font-size: 13px;
  font-weight: 800;
}

.indicador-subtitulo {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 11px;
  line-height: 1.4;
}

.dashboard-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(310px, 1fr);
  align-items: start;
  gap: 22px;
}

.coluna-principal,
.coluna-lateral {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.conteudo-card {
  padding: 24px;
}

.destaque-card {
  border-color: #fed7aa;
}

.card-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.card-titulo {
  color: #101828;
  font-size: 18px;
  font-weight: 800;
}

.card-subtitulo {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.estado-central {
  padding: 30px;
  text-align: center;
}

.atendimento-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.chamado-numero {
  color: #f97316;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.chamado-problema {
  margin-top: 4px;
  color: #101828;
  font-size: 22px;
  font-weight: 800;
}

.atendimento-info-grid {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  gap: 15px;
  margin-top: 22px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.info-label {
  color: #98a2b3;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.info-valor {
  margin-top: 2px;
  color: #475467;
  font-size: 12px;
  font-weight: 600;
}

.referencia-local {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  padding: 11px 13px;
  border-radius: 11px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 11px;
}

.atendimento-acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lista-chamados {
  display: flex;
  flex-direction: column;
}

.chamado-lista-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 0;
  border-top:
    1px solid #eaecf0;
}

.chamado-lista-item:first-child {
  border-top: none;
}

.chamado-lista-principal {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  gap: 12px;
}

.lista-numero {
  min-width: 35px;
  color: #f97316;
  font-size: 11px;
  font-weight: 800;
}

.lista-conteudo {
  min-width: 0;
}

.lista-problema {
  overflow: hidden;
  color: #344054;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lista-meta {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 10px;
}

.lista-acoes {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 9px;
}

.estado-vazio {
  padding: 32px 16px;
  text-align: center;
}

.estado-vazio.pequeno {
  padding: 20px 10px;
}

.estado-vazio-icone {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 16px;
  color: #059669;
  background: #d1fae5;
}

.estado-vazio-titulo {
  margin-top: 12px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.estado-vazio-texto {
  margin-top: 6px;
  color: #98a2b3;
  font-size: 11px;
}

.resumo-lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resumo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #475467;
  font-size: 12px;
}

.resumo-item-esquerda {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ponto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.ponto-aceito {
  background: #2563eb;
}

.ponto-rota {
  background: #7c3aed;
}

.ponto-atendimento {
  background: #d97706;
}

.ponto-finalizado {
  background: #059669;
}

.ultimos-lista {
  display: flex;
  flex-direction: column;
}

.ultimo-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 0;
  border-top:
    1px solid #eaecf0;
  cursor: pointer;
}

.ultimo-item:first-child {
  border-top: none;
}

.ultimo-icone {
  width: 34px;
  height: 34px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #059669;
  background: #d1fae5;
}

.ultimo-conteudo {
  min-width: 0;
  flex: 1;
}

.ultimo-problema {
  overflow: hidden;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ultimo-data {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 10px;
}

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado,
.urgencia-baixa,
.urgencia-media,
.urgencia-alta {
  padding: 6px 10px;
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

/* DARK */

.body--dark .dashboard-page {
  background: #0d0f12;
}

.body--dark .indicador-card,
.body--dark .conteudo-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .destaque-card {
  border-color: #7c2d12;
}

.body--dark .pagina-titulo,
.body--dark .indicador-numero,
.body--dark .card-titulo,
.body--dark .chamado-problema {
  color: #f9fafb;
}

.body--dark .pagina-subtitulo,
.body--dark .card-subtitulo,
.body--dark .indicador-subtitulo,
.body--dark .info-valor,
.body--dark .lista-meta {
  color: #98a2b3;
}

.body--dark .indicador-titulo,
.body--dark .lista-problema,
.body--dark .ultimo-problema,
.body--dark .resumo-item {
  color: #d0d5dd;
}

.body--dark .chamado-lista-item,
.body--dark .ultimo-item {
  border-color: #2b2f36;
}

.body--dark .referencia-local {
  color: #fdba74;
  background: #292018;
}

@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .dashboard-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagina-titulo {
    font-size: 25px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .atendimento-info-grid {
    grid-template-columns: 1fr;
  }

  .chamado-lista-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .lista-acoes {
    width: 100%;
    justify-content: space-between;
  }
}
</style>