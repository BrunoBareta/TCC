<template>
  <q-page
    class="dashboard-page"
    :class="{ 'dashboard-page--dark': $q.dark.isActive }"
  >
    <!-- TOPO -->
    <div class="dashboard-topo">
      <div>
        <div class="dashboard-titulo">
          Visão geral
        </div>

        <div class="dashboard-subtitulo">
          Acompanhe o que precisa de atenção no sistema.
        </div>
      </div>

      <div class="dashboard-topo-acoes">
        <div class="data-atual">
          <q-icon name="calendar_month" size="18px" />
          <span>{{ dataAtual }}</span>
        </div>

        <q-btn
          flat
          round
          icon="refresh"
          :loading="carregando"
          @click="carregarDashboard"
        >
          <q-tooltip>Atualizar</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- CARREGAMENTO -->
    <div
      v-if="carregando && !carregadoUmaVez"
      class="carregamento"
    >
      <q-spinner color="orange" size="42px" />
      <span>Carregando informações...</span>
    </div>

    <template v-else>
      <!-- INDICADORES -->
      <div class="indicadores-grid">
        <button
          type="button"
          class="indicador indicador--total"
          @click="abrirChamados()"
        >
          <div class="indicador-icone">
            <q-icon name="confirmation_number" size="23px" />
          </div>

          <div class="indicador-conteudo">
            <strong>{{ totalChamados }}</strong>
            <span>Total</span>
          </div>

          <q-icon
            name="chevron_right"
            class="indicador-seta"
          />
        </button>

        <button
          type="button"
          class="indicador indicador--pendente"
          @click="abrirChamados('PENDENTE')"
        >
          <div class="indicador-icone">
            <q-icon name="schedule" size="23px" />
          </div>

          <div class="indicador-conteudo">
            <strong>{{ totalPendentes }}</strong>
            <span>Pendentes</span>
          </div>

          <q-icon
            name="chevron_right"
            class="indicador-seta"
          />
        </button>

        <button
          type="button"
          class="indicador indicador--andamento"
          @click="abrirChamados('ANDAMENTO')"
        >
          <div class="indicador-icone">
            <q-icon name="engineering" size="23px" />
          </div>

          <div class="indicador-conteudo">
            <strong>{{ totalAndamento }}</strong>
            <span>Em andamento</span>
          </div>

          <q-icon
            name="chevron_right"
            class="indicador-seta"
          />
        </button>

        <button
          type="button"
          class="indicador indicador--finalizado"
          @click="abrirChamados('FINALIZADO')"
        >
          <div class="indicador-icone">
            <q-icon name="task_alt" size="23px" />
          </div>

          <div class="indicador-conteudo">
            <strong>{{ totalFinalizados }}</strong>
            <span>Finalizados</span>
          </div>

          <q-icon
            name="chevron_right"
            class="indicador-seta"
          />
        </button>
      </div>

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="principal-grid">
        <!-- ATENÇÃO NECESSÁRIA -->
        <section class="painel">
          <div class="painel-header">
            <div>
              <div class="painel-titulo">
                Atenção necessária
              </div>

              <div class="painel-subtitulo">
                Chamados prioritários ainda em aberto.
              </div>
            </div>

            <div class="painel-icone painel-icone--alerta">
              <q-icon name="priority_high" size="22px" />
            </div>
          </div>

          <div
            v-if="chamadosAtencao.length"
            class="atencao-lista"
          >
            <button
              v-for="chamado in chamadosAtencao"
              :key="chamado.id_chamado"
              type="button"
              class="atencao-item"
              @click="abrirChamado(chamado.id_chamado)"
            >
              <div class="atencao-id">
                #{{ chamado.id_chamado }}
              </div>

              <div class="atencao-principal">
                <strong>
                  {{
                    chamado.problema ||
                    'Solicitação de atendimento'
                  }}
                </strong>

                <span>
                  {{
                    chamado.nome_produtor ||
                    'Produtor não informado'
                  }}
                  <template v-if="chamado.nome_propriedade">
                    • {{ chamado.nome_propriedade }}
                  </template>
                </span>
              </div>

              <div class="atencao-badges">
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
              </div>

              <q-icon
                name="chevron_right"
                class="atencao-seta"
              />
            </button>
          </div>

          <div v-else class="estado-vazio">
            <q-icon
              name="check_circle"
              color="positive"
              size="34px"
            />

            <strong>Nenhum chamado prioritário</strong>
            <span>
              Não há chamados urgentes aguardando atenção.
            </span>
          </div>

          <button
            type="button"
            class="painel-link"
            @click="irParaChamados"
          >
            Ver todos os chamados
            <q-icon name="arrow_forward" size="18px" />
          </button>
        </section>

        <!-- RESUMO DO SISTEMA -->
        <section class="painel">
          <div class="painel-header">
            <div>
              <div class="painel-titulo">
                Resumo do sistema
              </div>

              <div class="painel-subtitulo">
                Informações gerais da operação.
              </div>
            </div>

            <div class="painel-icone">
              <q-icon name="groups" size="21px" />
            </div>
          </div>

          <div class="resumo-grid">
            <button
              type="button"
              class="resumo-item"
              @click="irPara('admin-produtores')"
            >
              <div class="resumo-item-icone produtor">
                <q-icon name="agriculture" size="21px" />
              </div>

              <div>
                <strong>{{ totalProdutores }}</strong>
                <span>Produtores</span>
              </div>
            </button>

            <button
              type="button"
              class="resumo-item"
              @click="irPara('admin-tecnicos')"
            >
              <div class="resumo-item-icone tecnico">
                <q-icon name="engineering" size="21px" />
              </div>

              <div>
                <strong>{{ totalTecnicos }}</strong>
                <span>Técnicos</span>
              </div>
            </button>

            <div class="resumo-item">
              <div class="resumo-item-icone resolucao">
                <q-icon name="task_alt" size="21px" />
              </div>

              <div>
                <strong>{{ taxaResolucao }}%</strong>
                <span>Resolvidos</span>
              </div>
            </div>

            <button
              type="button"
              class="resumo-item"
              @click="abrirChamados('CANCELADO')"
            >
              <div class="resumo-item-icone cancelado">
                <q-icon name="cancel" size="21px" />
              </div>

              <div>
                <strong>{{ totalCancelados }}</strong>
                <span>Cancelados</span>
              </div>
            </button>
          </div>
        </section>
      </div>

      <!-- CHAMADOS RECENTES -->
      <section class="painel recentes-painel">
        <div class="painel-header recentes-header">
          <div>
            <div class="painel-titulo">
              Chamados recentes
            </div>

            <div class="painel-subtitulo">
              Últimas solicitações registradas.
            </div>
          </div>

          <q-btn
            flat
            no-caps
            color="orange"
            label="Ver todos"
            icon-right="arrow_forward"
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
            class="recente-item"
            @click="abrirChamado(chamado.id_chamado)"
          >
            <div class="recente-id">
              #{{ chamado.id_chamado }}
            </div>

            <div class="recente-principal">
              <strong>
                {{
                  chamado.problema ||
                  'Solicitação de atendimento'
                }}
              </strong>

              <span>
                {{
                  chamado.nome_produtor ||
                  'Produtor não informado'
                }}
                <template v-if="chamado.nome_propriedade">
                  • {{ chamado.nome_propriedade }}
                </template>
              </span>
            </div>

            <div class="recente-data">
              {{ formatarData(chamado.data_abertura) }}
            </div>

            <div class="recente-badges">
              <q-badge
                rounded
                class="recente-badge"
                :color="corUrgencia(chamado.urgencia)"
                :label="formatarUrgencia(chamado.urgencia)"
              />

              <q-badge
                rounded
                class="recente-badge"
                :color="corStatus(chamado.status)"
                :label="formatarStatus(chamado.status)"
              />
            </div>

            <q-icon
              name="chevron_right"
              class="recente-seta"
            />
          </button>
        </div>

        <div v-else class="estado-vazio">
          <q-icon
            name="inbox"
            size="35px"
            color="grey-5"
          />
          <strong>Nenhum chamado registrado</strong>
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

import chamadoService from
  'src/services/chamadoService'

import usuarioService from
  'src/services/usuarioService'

const $q = useQuasar()
const router = useRouter()

const carregando = ref(false)
const carregadoUmaVez = ref(false)

const chamados = ref([])
const usuarios = ref([])

/* DATA */

const dataAtual = computed(() => {
  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      day: '2-digit',
      month: 'short'
    }
  )
    .format(new Date())
    .replace('.', '')
})

/* STATUS */

function statusNormalizado(status) {
  return String(status || '')
    .trim()
    .toUpperCase()
}

const totalChamados = computed(() =>
  chamados.value.length
)

const totalPendentes = computed(() =>
  chamados.value.filter(
    chamado =>
      statusNormalizado(chamado.status) ===
      'PENDENTE'
  ).length
)

const totalAndamento = computed(() => {
  const statusEmAndamento = [
    'ACEITO',
    'EM_ROTA',
    'EM_ATENDIMENTO',
    'AGUARDANDO_CONFIRMACAO'
  ]

  return chamados.value.filter(
    chamado =>
      statusEmAndamento.includes(
        statusNormalizado(chamado.status)
      )
  ).length
})

const totalFinalizados = computed(() =>
  chamados.value.filter(
    chamado =>
      statusNormalizado(chamado.status) ===
      'FINALIZADO'
  ).length
)

const totalCancelados = computed(() =>
  chamados.value.filter(
    chamado =>
      statusNormalizado(chamado.status) ===
      'CANCELADO'
  ).length
)

const taxaResolucao = computed(() => {
  if (totalChamados.value === 0) {
    return 0
  }

  return Math.round(
    (
      totalFinalizados.value /
      totalChamados.value
    ) * 100
  )
})

/* USUÁRIOS */

function tipoUsuarioNormalizado(tipo) {
  return String(tipo || '')
    .trim()
    .toUpperCase()
}

const totalProdutores = computed(() =>
  usuarios.value.filter(
    usuario =>
      tipoUsuarioNormalizado(
        usuario.tipo_usuario
      ) === 'PRODUTOR' &&
      usuario.ativo !== false
  ).length
)

const totalTecnicos = computed(() =>
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

/* URGÊNCIA */

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

function pesoUrgencia(urgencia) {
  const valor =
    urgenciaNormalizada(urgencia)

  if (valor === 'ALTA') return 3
  if (valor === 'MEDIA') return 2
  if (valor === 'BAIXA') return 1

  return 0
}

/* ATENÇÃO NECESSÁRIA */

const chamadosAtencao = computed(() => {
  return [
    ...chamados.value
  ]
    .filter(chamado => {
      const status =
        statusNormalizado(chamado.status)

      return ![
        'FINALIZADO',
        'CANCELADO'
      ].includes(status)
    })
    .sort((a, b) => {
      const prioridade =
        pesoUrgencia(b.urgencia) -
        pesoUrgencia(a.urgencia)

      if (prioridade !== 0) {
        return prioridade
      }

      return (
        new Date(
          b.data_abertura || 0
        ).getTime() -
        new Date(
          a.data_abertura || 0
        ).getTime()
      )
    })
    .slice(0, 4)
})

/* RECENTES */

const ultimosChamados = computed(() => {
  return [
    ...chamados.value
  ]
    .sort(
      (a, b) =>
        new Date(
          b.data_abertura || 0
        ).getTime() -
        new Date(
          a.data_abertura || 0
        ).getTime()
    )
    .slice(0, 5)
})

/* API */

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
      Array.isArray(listaChamados)
        ? listaChamados
        : []

    usuarios.value =
      Array.isArray(listaUsuarios)
        ? listaUsuarios
        : []

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

/* NAVEGAÇÃO */

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

function abrirChamado(idChamado) {
  router.push({
    name: 'admin-chamados',

    query: {
      chamado: idChamado
    }
  })
}

function irPara(rota) {
  router.push({
    name: rota
  })
}

/* FORMATAÇÃO */

function formatarData(data) {
  if (!data) {
    return '-'
  }

  const valor = new Date(data)

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  ).format(valor)
}

function formatarStatus(status) {
  const valores = {
    PENDENTE: 'Pendente',
    ACEITO: 'Aceito',
    EM_ROTA: 'Em rota',
    EM_ATENDIMENTO: 'Em atendimento',
    AGUARDANDO_CONFIRMACAO: 'Aguardando',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado'
  }

  return (
    valores[
      statusNormalizado(status)
    ] ||
    status ||
    '-'
  )
}

function corStatus(status) {
  const valores = {
    PENDENTE: 'orange',
    ACEITO: 'blue',
    EM_ROTA: 'purple',
    EM_ATENDIMENTO: 'primary',
    AGUARDANDO_CONFIRMACAO: 'amber',
    FINALIZADO: 'positive',
    CANCELADO: 'negative'
  }

  return (
    valores[
      statusNormalizado(status)
    ] ||
    'grey'
  )
}

function formatarUrgencia(urgencia) {
  const valores = {
    ALTA: 'Alta',
    MEDIA: 'Média',
    BAIXA: 'Baixa'
  }

  return (
    valores[
      urgenciaNormalizada(urgencia)
    ] ||
    'Normal'
  )
}

function corUrgencia(urgencia) {
  const valores = {
    ALTA: 'red',
    MEDIA: 'orange',
    BAIXA: 'green'
  }

  return (
    valores[
      urgenciaNormalizada(urgencia)
    ] ||
    'grey'
  )
}

onMounted(
  carregarDashboard
)
</script>

<style scoped>
/* PÁGINA */

.dashboard-page {
  min-height: 100%;
  padding: 24px;
  overflow-x: hidden;
  background: #f5f6f8;
}

/* TOPO */

.dashboard-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.dashboard-titulo {
  color: #101828;
  font-size: 24px;
  font-weight: 900;
}

.dashboard-subtitulo {
  margin-top: 3px;
  color: #667085;
  font-size: 11px;
}

.dashboard-topo-acoes {
  display: flex;
  align-items: center;
  gap: 4px;
}

.data-atual {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid #eaecf0;
  border-radius: 9px;
  color: #667085;
  background: #ffffff;
  font-size: 10px;
  font-weight: 700;
  text-transform: capitalize;
}

.data-atual .q-icon {
  color: #f97316;
}

/* CARREGAMENTO */

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

/* INDICADORES */

.indicadores-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.indicador {
  min-width: 0;
  min-height: 96px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 1px solid #eaecf0;
  border-radius: 15px;
  background: #ffffff;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s;
}

.indicador:hover {
  transform: translateY(-2px);
  border-color: #fed7aa;
}

.indicador-icone {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
}

.indicador--total .indicador-icone {
  color: #f97316;
  background: #fff1e6;
}

.indicador--pendente .indicador-icone {
  color: #d97706;
  background: #fffbeb;
}

.indicador--andamento .indicador-icone {
  color: #2563eb;
  background: #eff6ff;
}

.indicador--finalizado .indicador-icone {
  color: #16a34a;
  background: #f0fdf4;
}

.indicador-conteudo {
  min-width: 0;
  flex: 1;
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
  margin-top: 5px;
  color: #475467;
  font-size: 10px;
  font-weight: 700;
}

.indicador-seta {
  color: #d0d5dd;
}

/* PAINÉIS */

.principal-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1.4fr)
    minmax(300px, 0.6fr);
  gap: 14px;
  margin-bottom: 14px;
}

.painel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
}

.painel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px 13px;
}

.painel-titulo {
  color: #101828;
  font-size: 14px;
  font-weight: 900;
}

.painel-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 9px;
}

.painel-icone {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 11px;
  color: #f97316;
  background: #fff1e6;
}

.painel-icone--alerta {
  color: #dc2626;
  background: #fef2f2;
}

/* ATENÇÃO */

.atencao-lista {
  border-top: 1px solid #f2f4f7;
}

.atencao-item {
  width: 100%;
  display: grid;
  grid-template-columns:
    48px minmax(0, 1fr) auto 18px;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 0;
  border-bottom: 1px solid #f2f4f7;
  color: inherit;
  background: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.atencao-item:hover {
  background: #fafafa;
}

.atencao-id {
  color: #f97316;
  font-size: 10px;
  font-weight: 900;
}

.atencao-principal {
  min-width: 0;
}

.atencao-principal strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 10px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.atencao-principal span {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.atencao-badges {
  display: flex;
  align-items: center;
  gap: 5px;
}

.atencao-badges .q-badge {
  font-size: 8px;
}

.atencao-seta {
  color: #98a2b3;
}

.painel-link {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  color: #f97316;
  background: transparent;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
}

/* RESUMO */

.resumo-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 9px;
  padding: 3px 16px 16px;
}

.resumo-item {
  min-width: 0;
  min-height: 76px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  color: inherit;
  background: #f9fafb;
  font-family: inherit;
  text-align: left;
}

button.resumo-item {
  cursor: pointer;
}

.resumo-item-icone {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
}

.resumo-item-icone.produtor {
  color: #f97316;
  background: #fff1e6;
}

.resumo-item-icone.tecnico {
  color: #2563eb;
  background: #eff6ff;
}

.resumo-item-icone.resolucao {
  color: #16a34a;
  background: #f0fdf4;
}

.resumo-item-icone.cancelado {
  color: #dc2626;
  background: #fef2f2;
}

.resumo-item strong {
  display: block;
  color: #101828;
  font-size: 17px;
  font-weight: 900;
}

.resumo-item span {
  display: block;
  margin-top: 1px;
  color: #98a2b3;
  font-size: 8px;
}

/* CHAMADOS RECENTES */

.recentes-painel {
  margin-bottom: 10px;
}

.recentes-header {
  padding-bottom: 13px;
}

.recentes-lista {
  border-top: 1px solid #f2f4f7;
}

.recente-item {
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns:
    48px
    minmax(170px, 1fr)
    82px
    minmax(140px, auto)
    18px;
  align-items: center;
  gap: 9px;
  padding: 12px 18px;
  border: 0;
  border-bottom: 1px solid #f2f4f7;
  color: inherit;
  background: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.recente-item:hover {
  background: #fafafa;
}

.recente-id {
  color: #f97316;
  font-size: 10px;
  font-weight: 900;
}

.recente-principal {
  min-width: 0;
}

.recente-principal strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 10px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recente-principal span {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: #98a2b3;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recente-data {
  color: #667085;
  font-size: 8px;
  white-space: nowrap;
}

.recente-badges {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 5px;
}

.recente-badge {
  max-width: 100%;
  padding: 4px 8px;
  font-size: 8px;
  white-space: nowrap;
}

.recente-seta {
  color: #98a2b3;
}

/* VAZIO */

.estado-vazio {
  min-height: 145px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 18px;
  color: #98a2b3;
  text-align: center;
}

.estado-vazio strong {
  color: #475467;
  font-size: 10px;
}

.estado-vazio span {
  font-size: 8px;
}

/* DARK */

.dashboard-page--dark {
  background: #0d0f12;
}

.dashboard-page--dark
.dashboard-titulo,
.dashboard-page--dark
.indicador-conteudo strong,
.dashboard-page--dark
.painel-titulo,
.dashboard-page--dark
.resumo-item strong {
  color: #f9fafb;
}

.dashboard-page--dark
.data-atual,
.dashboard-page--dark
.indicador,
.dashboard-page--dark
.painel {
  border-color: #292d33;
  background: #15181d;
}

.dashboard-page--dark
.resumo-item {
  background: #1b1e24;
}

.dashboard-page--dark
.atencao-item,
.dashboard-page--dark
.recente-item,
.dashboard-page--dark
.atencao-lista,
.dashboard-page--dark
.recentes-lista {
  border-color: #292d33;
}

.dashboard-page--dark
.atencao-principal strong,
.dashboard-page--dark
.recente-principal strong {
  color: #f2f4f7;
}

/* TABLET */

@media (max-width: 1100px) {
  .principal-grid {
    grid-template-columns: 1fr;
  }

  .indicadores-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

/* MOBILE */

@media (max-width: 700px) {
  .dashboard-page {
    padding: 14px 14px 20px;
  }

  .dashboard-topo {
    margin-bottom: 12px;
  }

  .dashboard-titulo {
    font-size: 18px;
  }

  .dashboard-subtitulo {
    max-width: 230px;
    font-size: 9px;
  }

  .data-atual {
    display: none;
  }

  .indicadores-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 9px;
    margin-bottom: 11px;
  }

  .indicador {
    min-height: 82px;
    gap: 8px;
    padding: 10px;
    border-radius: 13px;
  }

  .indicador-icone {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .indicador-conteudo strong {
    font-size: 20px;
  }

  .indicador-conteudo span {
    margin-top: 3px;
    font-size: 8px;
  }

  .indicador-seta {
    display: none;
  }

  .principal-grid {
    gap: 11px;
    margin-bottom: 11px;
  }

  .painel {
    border-radius: 14px;
  }

  .painel-header {
    padding: 14px 14px 10px;
  }

  .painel-titulo {
    font-size: 13px;
  }

  .painel-subtitulo {
    font-size: 8px;
  }

  .painel-icone {
    width: 34px;
    height: 34px;
  }

  .atencao-item {
    grid-template-columns:
      38px minmax(0, 1fr) auto 14px;
    gap: 7px;
    padding: 11px 14px;
  }

  .atencao-principal strong {
    font-size: 9px;
  }

  .atencao-principal span {
    font-size: 7px;
  }

  .atencao-badges {
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
  }

  .atencao-badges .q-badge {
    font-size: 7px;
  }

  .resumo-grid {
    gap: 7px;
    padding: 3px 12px 12px;
  }

  .resumo-item {
    min-height: 65px;
    padding: 8px;
  }

  .resumo-item-icone {
    width: 30px;
    height: 30px;
  }

  .resumo-item strong {
    font-size: 15px;
  }

  .resumo-item span {
    font-size: 7px;
  }

  .recentes-header .q-btn {
    min-width: auto;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 9px;
  }

  /*
    CORREÇÃO MOBILE:
    os badges agora ficam ABAIXO do título,
    dentro da largura disponível do card.
  */
  .recente-item {
    grid-template-columns:
      36px
      minmax(0, 1fr)
      16px;

    grid-template-areas:
      "numero principal seta"
      "numero badges seta";

    align-items: start;

    gap: 6px 8px;

    padding: 12px 14px;
  }

  .recente-id {
    grid-area: numero;
    padding-top: 2px;
    font-size: 9px;
  }

  .recente-principal {
    grid-area: principal;
    min-width: 0;
  }

  .recente-principal strong {
    font-size: 10px;
    line-height: 1.3;
  }

  .recente-principal span {
    margin-top: 3px;
    font-size: 7px;
  }

  .recente-data {
    display: none;
  }

  .recente-badges {
    grid-area: badges;
    min-width: 0;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }

  .recente-badge {
    max-width: 100%;
    padding: 3px 7px;
    font-size: 7px;
    white-space: nowrap;
  }

  .recente-seta {
    grid-area: seta;
    align-self: center;
    justify-self: end;
  }
}
</style>
