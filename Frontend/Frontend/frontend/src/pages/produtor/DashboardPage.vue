<template>
  <q-page class="dashboard-page">
    <!-- CABEÇALHO -->
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Dashboard
        </div>

        <div class="pagina-subtitulo">
          Acompanhe um resumo dos chamados da sua propriedade.
        </div>
      </div>
    </div>

    <!-- CARREGANDO -->
    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner
        color="orange"
        size="48px"
      />

      <div class="text-grey-7 q-mt-md">
        Carregando dashboard...
      </div>
    </div>

    <!-- ERRO -->
    <q-banner
      v-else-if="erro"
      rounded
      class="bg-red-1 text-negative"
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

    <template v-else>
      <!-- INDICADORES -->
      <div class="cards-grid">
        <div
          class="indicador-card"
          @click="abrirChamados()"
        >
          <div class="indicador-topo">
            <div class="icone-wrapper total">
              <q-icon
                name="confirmation_number"
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
            {{ totalChamados }}
          </div>

          <div class="indicador-titulo">
            Total de chamados
          </div>

          <div class="indicador-descricao">
            Todos os chamados registrados
          </div>
        </div>

        <div
          class="indicador-card"
          @click="abrirChamados('PENDENTE')"
        >
          <div class="indicador-topo">
            <div class="icone-wrapper pendente">
              <q-icon
                name="schedule"
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
            Pendentes
          </div>

          <div class="indicador-descricao">
            Aguardando atendimento
          </div>
        </div>

        <div
          class="indicador-card"
          @click="abrirChamados('EM_ATENDIMENTO')"
        >
          <div class="indicador-topo">
            <div class="icone-wrapper atendimento">
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

          <div class="indicador-descricao">
            Aceitos, em rota ou atendimento
          </div>
        </div>

        <div
          class="indicador-card"
          @click="abrirChamados('FINALIZADO')"
        >
          <div class="indicador-topo">
            <div class="icone-wrapper finalizado">
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

          <div class="indicador-descricao">
            Atendimentos concluídos
          </div>
        </div>

        <div
          class="indicador-card"
          @click="abrirChamados('CANCELADO')"
        >
          <div class="indicador-topo">
            <div class="icone-wrapper cancelado">
              <q-icon
                name="cancel"
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
            {{ totalCancelados }}
          </div>

          <div class="indicador-titulo">
            Cancelados
          </div>

          <div class="indicador-descricao">
            Chamados cancelados
          </div>
        </div>
      </div>

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="dashboard-grid">
        <!-- RESUMO POR STATUS -->
        <div class="painel-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Chamados por status
              </div>

              <div class="card-subtitulo">
                Distribuição atual dos seus chamados.
              </div>
            </div>

            <q-icon
              name="bar_chart"
              size="28px"
              color="grey-5"
            />
          </div>

          <div class="status-lista">
            <div
              v-for="item in resumoStatus"
              :key="item.status"
              class="status-item"
            >
              <div class="status-item-topo">
                <div class="status-info">
                  <span
                    class="status-bolinha"
                    :class="item.classe"
                  />

                  <span class="status-nome">
                    {{ item.label }}
                  </span>
                </div>

                <div class="status-quantidade">
                  {{ item.total }}
                </div>
              </div>

              <div class="barra-fundo">
                <div
                  class="barra-preenchimento"
                  :class="item.classe"
                  :style="{
                    width: `${calcularPercentual(item.total)}%`
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- URGÊNCIAS -->
        <div class="painel-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Atenção necessária
              </div>

              <div class="card-subtitulo">
                Chamados ainda não finalizados com maior urgência.
              </div>
            </div>

            <q-icon
              name="priority_high"
              size="28px"
              color="red-4"
            />
          </div>

          <div
            v-if="chamadosUrgentes.length === 0"
            class="estado-vazio"
          >
            <q-icon
              name="check_circle"
              color="positive"
              size="38px"
            />

            <div class="estado-vazio-titulo">
              Nenhum chamado urgente
            </div>

            <div class="estado-vazio-texto">
              Não existem chamados de alta urgência pendentes.
            </div>
          </div>

          <div
            v-else
            class="urgencias-lista"
          >
            <div
              v-for="chamado in chamadosUrgentes"
              :key="chamado.id_chamado"
              class="urgencia-item"
              @click="verDetalhes(chamado)"
            >
              <div>
                <div class="urgencia-numero">
                  CHAMADO #{{ chamado.id_chamado }}
                </div>

                <div class="urgencia-problema">
                  {{ chamado.problema }}
                </div>

                <div class="urgencia-data">
                  Aberto em
                  {{ formatarData(chamado.data_abertura) }}
                </div>
              </div>

              <div class="urgencia-lateral">
                <q-badge
                  rounded
                  class="badge-alta"
                >
                  Alta
                </q-badge>

                <q-icon
                  name="chevron_right"
                  color="grey-5"
                  size="22px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ÚLTIMOS CHAMADOS -->
      <div class="painel-card q-mt-lg">
        <div class="card-cabecalho">
          <div>
            <div class="card-titulo">
              Últimos chamados
            </div>

            <div class="card-subtitulo">
              Acompanhe suas solicitações mais recentes.
            </div>
          </div>

          <q-btn
            flat
            no-caps
            color="orange"
            label="Ver todos"
            icon-right="arrow_forward"
            :to="{ name: 'produtor-chamados' }"
          />
        </div>

        <div
          v-if="ultimosChamados.length === 0"
          class="estado-vazio"
        >
          <q-icon
            name="inbox"
            size="42px"
            color="grey-5"
          />

          <div class="estado-vazio-titulo">
            Nenhum chamado registrado
          </div>

          <div class="estado-vazio-texto">
            Seus chamados recentes aparecerão aqui.
          </div>
        </div>

        <div
          v-else
          class="ultimos-container"
        >
          <div class="tabela-cabecalho">
            <div>Número</div>
            <div>Problema</div>
            <div>Data</div>
            <div>Status</div>
            <div class="text-right">
              Ação
            </div>
          </div>

          <div
            v-for="chamado in ultimosChamados"
            :key="chamado.id_chamado"
            class="tabela-linha"
          >
            <div class="numero-chamado">
              #{{ chamado.id_chamado }}
            </div>

            <div class="problema-chamado">
              {{ chamado.problema || 'Não informado' }}
            </div>

            <div class="data-chamado">
              {{ formatarData(chamado.data_abertura) }}
            </div>

            <div>
              <q-badge
                rounded
                :class="classeStatus(chamado.status)"
              >
                {{ formatarStatus(chamado.status) }}
              </q-badge>
            </div>

            <div class="acao-chamado">
              <q-btn
                outline
                no-caps
                color="orange"
                size="sm"
                label="Ver detalhes"
                @click="verDetalhes(chamado)"
              />
            </div>
          </div>
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

import { useRouter } from 'vue-router'

import chamadoService from 'src/services/chamadoService'

const router = useRouter()

const chamados = ref([])
const carregando = ref(false)
const erro = ref('')

const totalChamados = computed(() =>
  chamados.value.length
)

const totalPendentes = computed(() =>
  contarStatus([
    'PENDENTE'
  ])
)

const totalEmAndamento = computed(() =>
  contarStatus([
    'ACEITO',
    'EM_ROTA',
    'EM_ATENDIMENTO',
    'AGUARDANDO_CONFIRMACAO'
  ])
)

const totalFinalizados = computed(() =>
  contarStatus([
    'FINALIZADO',
    'CONCLUIDO'
  ])
)

const totalCancelados = computed(() =>
  contarStatus([
    'CANCELADO'
  ])
)

const resumoStatus = computed(() => [
  {
    status: 'PENDENTE',
    label: 'Pendentes',
    total: totalPendentes.value,
    classe: 'pendente'
  },
  {
    status: 'ANDAMENTO',
    label: 'Em andamento',
    total: totalEmAndamento.value,
    classe: 'andamento'
  },
  {
    status: 'FINALIZADO',
    label: 'Finalizados',
    total: totalFinalizados.value,
    classe: 'finalizado'
  },
  {
    status: 'CANCELADO',
    label: 'Cancelados',
    total: totalCancelados.value,
    classe: 'cancelado'
  }
])

const ultimosChamados = computed(() => {
  return [...chamados.value]
    .sort((a, b) => {
      const dataA =
        new Date(a.data_abertura).getTime()

      const dataB =
        new Date(b.data_abertura).getTime()

      return dataB - dataA
    })
    .slice(0, 5)
})

const chamadosUrgentes = computed(() => {
  return chamados.value
    .filter((chamado) => {
      const urgencia =
        String(
          chamado.urgencia || ''
        ).toUpperCase()

      const status =
        String(
          chamado.status || ''
        ).toUpperCase()

      return (
        urgencia === 'ALTA' &&
        ![
          'FINALIZADO',
          'CONCLUIDO',
          'CANCELADO'
        ].includes(status)
      )
    })
    .sort((a, b) => {
      const dataA =
        new Date(a.data_abertura).getTime()

      const dataB =
        new Date(b.data_abertura).getTime()

      return dataA - dataB
    })
    .slice(0, 4)
})

function contarStatus(statusPermitidos) {
  return chamados.value.filter(
    (chamado) =>
      statusPermitidos.includes(
        String(
          chamado.status || ''
        ).toUpperCase()
      )
  ).length
}

function calcularPercentual(total) {
  if (totalChamados.value === 0) {
    return 0
  }

  return Math.round(
    (total / totalChamados.value) * 100
  )
}

function formatarData(valor) {
  if (!valor) {
    return 'Não informada'
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleDateString(
    'pt-BR'
  )
}

function formatarStatus(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  const nomes = {
    PENDENTE: 'Pendente',
    AGUARDANDO_CONFIRMACAO:
      'Aguardando confirmação',
    ACEITO: 'Aceito',
    EM_ROTA: 'Em rota',
    EM_ATENDIMENTO:
      'Em atendimento',
    FINALIZADO: 'Finalizado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado'
  }

  return nomes[valor] ||
    'Não informado'
}

function classeStatus(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  if (valor === 'PENDENTE') {
    return 'status-pendente'
  }

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
    return 'status-rota'
  }

  if (
    valor === 'EM_ATENDIMENTO' ||
    valor === 'AGUARDANDO_CONFIRMACAO'
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

  if (valor === 'CANCELADO') {
    return 'status-cancelado'
  }

  return 'status-padrao'
}

async function verDetalhes(chamado) {
  await router.push({
    name: 'produtor-detalhes-chamado',
    params: {
      id: chamado.id_chamado
    }
  })
}

async function abrirChamados(status = null) {
  if (!status) {
    await router.push({
      name: 'produtor-chamados'
    })

    return
  }

  await router.push({
    name: 'produtor-chamados',
    query: {
      status
    }
  })
}

async function carregarDados() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta =
      await chamadoService.listar()

    chamados.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.chamados ||
          resposta?.data ||
          []
  } catch (error) {
    console.error(
      'Erro ao carregar dashboard:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar o dashboard.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)
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

.estado-central {
  padding: 60px;
  text-align: center;
}

/* CARDS */

.cards-grid {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.indicador-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #eaecf0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 2px 8px rgba(16, 24, 40, 0.04);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.indicador-card:hover {
  transform: translateY(-2px);
  border-color: #d0d5dd;
  box-shadow:
    0 8px 20px rgba(16, 24, 40, 0.08);
}

.indicador-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icone-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
}

.icone-wrapper.total {
  color: #344054;
  background: #f2f4f7;
}

.icone-wrapper.pendente {
  color: #f97316;
  background: #fff1e6;
}

.icone-wrapper.atendimento {
  color: #2563eb;
  background: #dbeafe;
}

.icone-wrapper.finalizado {
  color: #059669;
  background: #d1fae5;
}

.icone-wrapper.cancelado {
  color: #dc2626;
  background: #fee2e2;
}

.indicador-numero {
  margin-top: 20px;
  color: #101828;
  font-size: 29px;
  font-weight: 800;
}

.indicador-titulo {
  margin-top: 3px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.indicador-descricao {
  margin-top: 4px;
  overflow: hidden;
  color: #98a2b3;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* PAINÉIS */

.dashboard-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1.2fr)
    minmax(0, 0.8fr);
  gap: 20px;
  margin-top: 20px;
}

.painel-card {
  padding: 24px;
  border: 1px solid #eaecf0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 2px 8px rgba(16, 24, 40, 0.04);
}

.card-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
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

/* STATUS */

.status-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-item-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 9px;
}

.status-bolinha {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.status-nome {
  color: #475467;
  font-size: 13px;
  font-weight: 600;
}

.status-quantidade {
  color: #344054;
  font-size: 13px;
  font-weight: 800;
}

.barra-fundo {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 20px;
  background: #f2f4f7;
}

.barra-preenchimento {
  height: 100%;
  min-width: 0;
  border-radius: 20px;
  transition: width 0.4s;
}

.status-bolinha.pendente,
.barra-preenchimento.pendente {
  background: #f97316;
}

.status-bolinha.andamento,
.barra-preenchimento.andamento {
  background: #2563eb;
}

.status-bolinha.finalizado,
.barra-preenchimento.finalizado {
  background: #10b981;
}

.status-bolinha.cancelado,
.barra-preenchimento.cancelado {
  background: #ef4444;
}

/* URGÊNCIAS */

.urgencias-lista {
  display: flex;
  flex-direction: column;
}

.urgencia-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f2f4f7;
  cursor: pointer;
}

.urgencia-item:first-child {
  padding-top: 0;
}

.urgencia-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.urgencia-numero {
  color: #f97316;
  font-size: 10px;
  font-weight: 800;
}

.urgencia-problema {
  margin-top: 4px;
  color: #344054;
  font-size: 13px;
  font-weight: 700;
}

.urgencia-data {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 11px;
}

.urgencia-lateral {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-alta {
  padding: 6px 9px;
  color: #dc2626;
  background: #fee2e2;
}

/* TABELA */

.ultimos-container {
  overflow-x: auto;
}

.tabela-cabecalho,
.tabela-linha {
  display: grid;
  grid-template-columns:
    100px
    minmax(220px, 1fr)
    160px
    160px
    130px;
  align-items: center;
  gap: 12px;
}

.tabela-cabecalho {
  padding: 12px 10px;
  border-bottom: 1px solid #eaecf0;
  color: #667085;
  font-size: 11px;
  font-weight: 700;
}

.tabela-linha {
  min-width: 820px;
  padding: 14px 10px;
  border-bottom: 1px solid #f2f4f7;
}

.tabela-linha:last-child {
  border-bottom: 0;
}

.numero-chamado {
  color: #344054;
  font-size: 13px;
  font-weight: 700;
}

.problema-chamado {
  overflow: hidden;
  color: #344054;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-chamado {
  color: #667085;
  font-size: 12px;
}

.acao-chamado {
  display: flex;
  justify-content: flex-end;
}

/* STATUS */

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado,
.status-cancelado,
.status-padrao {
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

.status-cancelado {
  color: #dc2626;
  background: #fee2e2;
}

.status-padrao {
  color: #475467;
  background: #f2f4f7;
}

/* VAZIO */

.estado-vazio {
  padding: 35px 15px;
  text-align: center;
}

.estado-vazio-titulo {
  margin-top: 10px;
  color: #475467;
  font-size: 14px;
  font-weight: 700;
}

.estado-vazio-texto {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 12px;
}

/* RESPONSIVO */

@media (max-width: 1250px) {
  .cards-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1000px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 750px) {
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
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 500px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>