<template>
  <q-page class="dashboard-page">
    <!-- =========================================
         CABEÇALHO DESKTOP
    ========================================== -->

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

    <!-- =========================================
         CARREGANDO
    ========================================== -->

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

    <!-- =========================================
         ERRO
    ========================================== -->

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

    <!-- =========================================
         CONTEÚDO
    ========================================== -->

    <div
      v-else
      class="dashboard-conteudo"
    >
      <!-- =======================================
           INDICADORES
      ======================================== -->

      <div class="cards-grid">
        <!-- TOTAL -->

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
              class="indicador-seta"
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

        <!-- PENDENTES -->

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
              class="indicador-seta"
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

        <!-- EM ANDAMENTO -->

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
              class="indicador-seta"
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

        <!-- FINALIZADOS -->

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
              class="indicador-seta"
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

        <!-- CANCELADOS -->

        <div
          class="indicador-card indicador-card--cancelado"
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
              class="indicador-seta"
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

      <!-- =======================================
           VISÃO PRINCIPAL
      ======================================== -->

      <div class="dashboard-grid">
        <!-- CHAMADOS POR STATUS -->

        <div class="painel-card status-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Chamados por status
              </div>

              <div class="card-subtitulo">
                Distribuição atual dos seus chamados.
              </div>
            </div>

            <div class="card-icone">
              <q-icon
                name="bar_chart"
                size="23px"
              />
            </div>
          </div>

          <div class="status-lista">
            <div
              v-for="item in resumoStatus"
              :key="item.status"
              class="status-item"
              @click="
                item.status === 'ANDAMENTO'
                  ? abrirChamados('EM_ATENDIMENTO')
                  : abrirChamados(item.status)
              "
            >
              <div class="status-item-topo">
                <div class="status-info">
                  <span
                    class="status-bolinha"
                    :class="item.classe"
                  ></span>

                  <span class="status-nome">
                    {{ item.label }}
                  </span>
                </div>

                <div class="status-lateral">
                  <strong class="status-quantidade">
                    {{ item.total }}
                  </strong>

                  <span class="status-percentual">
                    {{ calcularPercentual(item.total) }}%
                  </span>
                </div>
              </div>

              <div class="barra-fundo">
                <div
                  class="barra-preenchimento"
                  :class="item.classe"
                  :style="{
                    width: `${calcularPercentual(item.total)}%`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ATENÇÃO NECESSÁRIA -->

        <div class="painel-card atencao-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Atenção necessária
              </div>

              <div class="card-subtitulo">
                Chamados de maior urgência.
              </div>
            </div>

            <div class="card-icone card-icone--alerta">
              <q-icon
                name="priority_high"
                size="23px"
              />
            </div>
          </div>

          <div
            v-if="chamadosUrgentes.length === 0"
            class="estado-vazio estado-vazio--compacto"
          >
            <div class="estado-ok">
              <q-icon
                name="check"
                size="21px"
              />
            </div>

            <div>
              <div class="estado-vazio-titulo">
                Tudo tranquilo por aqui
              </div>

              <div class="estado-vazio-texto">
                Nenhum chamado de alta urgência em aberto.
              </div>
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
              <div class="urgencia-conteudo">
                <div class="urgencia-numero">
                  #{{ chamado.id_chamado }}
                </div>

                <div class="urgencia-problema">
                  {{
                    chamado.problema ||
                    'Solicitação de atendimento'
                  }}
                </div>

                <div class="urgencia-data">
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

      <!-- =======================================
           ÚLTIMOS CHAMADOS
      ======================================== -->

      <div class="painel-card ultimos-card">
        <div class="card-cabecalho ultimos-cabecalho">
          <div>
            <div class="card-titulo">
              Últimos chamados
            </div>

            <div class="card-subtitulo">
              Suas solicitações mais recentes.
            </div>
          </div>

          <q-btn
            flat
            no-caps
            dense
            color="orange"
            label="Ver todos"
            :to="{
              name: 'produtor-chamados'
            }"
          />
        </div>

        <!-- VAZIO -->

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

        <!-- DESKTOP -->

        <div
          v-else
          class="ultimos-container ultimos-desktop"
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
              {{
                chamado.problema ||
                'Não informado'
              }}
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

        <!-- MOBILE -->

        <div
          v-if="ultimosChamados.length"
          class="ultimos-mobile"
        >
          <button
            v-for="chamado in ultimosChamados"
            :key="`mobile-${chamado.id_chamado}`"
            type="button"
            class="chamado-mobile"
            @click="verDetalhes(chamado)"
          >
            <div class="chamado-mobile__principal">
              <div class="chamado-mobile__linha">
                <span class="chamado-mobile__numero">
                  #{{ chamado.id_chamado }}
                </span>

                <q-badge
                  rounded
                  :class="classeStatus(chamado.status)"
                >
                  {{ formatarStatus(chamado.status) }}
                </q-badge>
              </div>

              <strong>
                {{
                  chamado.problema ||
                  'Solicitação de atendimento'
                }}
              </strong>

              <span class="chamado-mobile__data">
                {{ formatarData(chamado.data_abertura) }}
              </span>
            </div>

            <q-icon
              name="chevron_right"
              size="22px"
              color="grey-5"
            />
          </button>
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

import chamadoService from
  'src/services/chamadoService'

const router =
  useRouter()

const chamados =
  ref([])

const carregando =
  ref(false)

const erro =
  ref('')

/* =========================================
   CONTADORES
========================================= */

const totalChamados =
  computed(() =>
    chamados.value.length
  )

const totalPendentes =
  computed(() =>
    contarStatus([
      'PENDENTE'
    ])
  )

const totalEmAndamento =
  computed(() =>
    contarStatus([
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO',
      'AGUARDANDO_CONFIRMACAO'
    ])
  )

const totalFinalizados =
  computed(() =>
    contarStatus([
      'FINALIZADO',
      'CONCLUIDO'
    ])
  )

const totalCancelados =
  computed(() =>
    contarStatus([
      'CANCELADO'
    ])
  )

/* =========================================
   RESUMO POR STATUS
========================================= */

const resumoStatus =
  computed(() => [
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

/* =========================================
   ÚLTIMOS
========================================= */

const ultimosChamados =
  computed(() => {
    return [...chamados.value]
      .sort(
        (a, b) => {
          const dataA =
            new Date(
              a.data_abertura
            ).getTime()

          const dataB =
            new Date(
              b.data_abertura
            ).getTime()

          return dataB - dataA
        }
      )
      .slice(0, 5)
  })

/* =========================================
   URGENTES
========================================= */

const chamadosUrgentes =
  computed(() => {
    return chamados.value
      .filter(
        chamado => {
          const urgencia =
            String(
              chamado.urgencia ||
              ''
            ).toUpperCase()

          const status =
            String(
              chamado.status ||
              ''
            ).toUpperCase()

          return (
            urgencia === 'ALTA' &&
            ![
              'FINALIZADO',
              'CONCLUIDO',
              'CANCELADO'
            ].includes(
              status
            )
          )
        }
      )
      .sort(
        (a, b) => {
          const dataA =
            new Date(
              a.data_abertura
            ).getTime()

          const dataB =
            new Date(
              b.data_abertura
            ).getTime()

          return dataA - dataB
        }
      )
      .slice(0, 4)
  })

/* =========================================
   CONTAR STATUS
========================================= */

function contarStatus(
  statusPermitidos
) {
  return chamados.value.filter(
    chamado =>
      statusPermitidos.includes(
        String(
          chamado.status ||
          ''
        ).toUpperCase()
      )
  ).length
}

/* =========================================
   PERCENTUAL
========================================= */

function calcularPercentual(
  total
) {
  if (
    totalChamados.value === 0
  ) {
    return 0
  }

  return Math.round(
    (
      total /
      totalChamados.value
    ) * 100
  )
}

/* =========================================
   DATA
========================================= */

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

/* =========================================
   STATUS
========================================= */

function formatarStatus(
  status
) {
  const valor =
    String(
      status ||
      ''
    ).toUpperCase()

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

    FINALIZADO:
      'Finalizado',

    CONCLUIDO:
      'Concluído',

    CANCELADO:
      'Cancelado'
  }

  return (
    nomes[valor] ||
    'Não informado'
  )
}

function classeStatus(
  status
) {
  const valor =
    String(
      status ||
      ''
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

  if (
    valor === 'CANCELADO'
  ) {
    return 'status-cancelado'
  }

  return 'status-padrao'
}

/* =========================================
   NAVEGAÇÃO
========================================= */

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

async function abrirChamados(
  status = null
) {
  if (!status) {
    await router.push({
      name:
        'produtor-chamados'
    })

    return
  }

  await router.push({
    name:
      'produtor-chamados',

    query: {
      status
    }
  })
}

/* =========================================
   CARREGAR
========================================= */

async function carregarDados() {
  carregando.value =
    true

  erro.value =
    ''

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
      'Erro ao carregar dashboard:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível carregar o dashboard.'
  } finally {
    carregando.value =
      false
  }
}

onMounted(
  carregarDados
)
</script>

<style scoped>
/* =========================================
   PÁGINA
========================================= */

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

/* =========================================
   CONTEÚDO
========================================= */

.dashboard-conteudo {
  width: 100%;
}

/* =========================================
   INDICADORES
========================================= */

.cards-grid {
  display: grid;

  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );

  gap: 16px;
}

.indicador-card {
  min-width: 0;

  padding: 20px;

  border:
    1px solid #eaecf0;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(
      16,
      24,
      40,
      0.04
    );

  cursor: pointer;

  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.indicador-card:hover {
  transform:
    translateY(-2px);

  border-color:
    #d0d5dd;

  box-shadow:
    0 8px 20px
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
  justify-content:
    space-between;
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

/* =========================================
   PAINÉIS
========================================= */

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

  border:
    1px solid #eaecf0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(
      16,
      24,
      40,
      0.04
    );
}

.card-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content:
    space-between;

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

.card-icone {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  color: #2563eb;
  background: #eff6ff;
}

.card-icone--alerta {
  color: #dc2626;
  background: #fef2f2;
}

/* =========================================
   STATUS
========================================= */

.status-lista {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

.status-item {
  cursor: pointer;
}

.status-item-topo {
  display: flex;
  align-items: center;
  justify-content:
    space-between;

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

  flex-shrink: 0;

  border-radius: 50%;
}

.status-nome {
  color: #475467;

  font-size: 13px;
  font-weight: 600;
}

.status-lateral {
  display: flex;
  align-items: center;

  gap: 7px;
}

.status-quantidade {
  color: #344054;

  font-size: 13px;
  font-weight: 800;
}

.status-percentual {
  color: #98a2b3;

  font-size: 10px;
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

  transition:
    width 0.4s;
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

/* =========================================
   ATENÇÃO
========================================= */

.urgencias-lista {
  display: flex;
  flex-direction: column;
}

.urgencia-item {
  display: flex;
  align-items: center;
  justify-content:
    space-between;

  gap: 15px;

  padding: 15px 0;

  border-bottom:
    1px solid #f2f4f7;

  cursor: pointer;
}

.urgencia-item:first-child {
  padding-top: 0;
}

.urgencia-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.urgencia-conteudo {
  min-width: 0;
}

.urgencia-numero {
  color: #f97316;

  font-size: 10px;
  font-weight: 800;
}

.urgencia-problema {
  margin-top: 4px;

  overflow: hidden;

  color: #344054;

  font-size: 13px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
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

  flex-shrink: 0;
}

.badge-alta {
  padding: 6px 9px;

  color: #dc2626;

  background: #fee2e2;
}

/* =========================================
   ÚLTIMOS CHAMADOS
========================================= */

.ultimos-card {
  margin-top: 20px;
}

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
  padding:
    12px 10px;

  border-bottom:
    1px solid #eaecf0;

  color: #667085;

  font-size: 11px;
  font-weight: 700;
}

.tabela-linha {
  min-width: 820px;

  padding:
    14px 10px;

  border-bottom:
    1px solid #f2f4f7;
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
  justify-content:
    flex-end;
}

/* MOBILE ESCONDIDO NO DESKTOP */

.ultimos-mobile {
  display: none;
}

/* =========================================
   STATUS BADGES
========================================= */

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

/* =========================================
   VAZIO
========================================= */

.estado-vazio {
  padding: 35px 15px;
  text-align: center;
}

.estado-vazio--compacto {
  min-height: 110px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 12px;

  padding: 18px;

  border-radius: 14px;

  background: #f9fafb;

  text-align: left;
}

.estado-ok {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: #059669;
  background: #d1fae5;
}

.estado-vazio-titulo {
  color: #475467;

  font-size: 14px;
  font-weight: 700;
}

.estado-vazio-texto {
  margin-top: 4px;

  color: #98a2b3;

  font-size: 12px;
}

/* =========================================
   RESPONSIVO
========================================= */

@media (max-width: 1250px) {
  .cards-grid {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 1000px) {
  .dashboard-grid {
    grid-template-columns:
      1fr;
  }
}

/* =========================================
   MOBILE / APP
========================================= */

@media (max-width: 750px) {
  .dashboard-page {
    padding:
      14px
      14px
      30px;
  }

  /*
    O layout mobile já possui
    o cabeçalho do aplicativo.
  */

  .pagina-cabecalho {
    display: none;
  }

  /*
    No celular alteramos a ordem:
    1 - gráficos
    2 - últimos chamados
    3 - indicadores
  */

  .dashboard-conteudo {
    display: flex;
    flex-direction: column;
  }

  .dashboard-grid {
    order: 1;

    display: flex;
    flex-direction: column;

    gap: 12px;

    margin-top: 0;
  }

  .status-card {
    order: 1;
  }

  .atencao-card {
    order: 2;
  }

  .ultimos-card {
    order: 2;

    margin-top: 12px;
  }

  .cards-grid {
    order: 3;

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 10px;

    margin-top: 12px;
  }

  /*
    Cards gerais menores,
    porque no celular são
    informações complementares.
  */

  .indicador-card {
    min-height: 112px;

    padding: 13px;

    border-radius: 15px;
  }

  .indicador-card--cancelado {
    grid-column:
      1 / -1;

    min-height: auto;

    display: grid;

    grid-template-columns:
      auto 1fr;

    column-gap: 11px;

    align-items: center;
  }

  .indicador-card--cancelado
  .indicador-topo {
    grid-row:
      1 / span 3;
  }

  .indicador-card--cancelado
  .indicador-seta {
    display: none;
  }

  .icone-wrapper {
    width: 36px;
    height: 36px;

    border-radius: 10px;
  }

  .icone-wrapper
  :deep(.q-icon) {
    font-size: 20px !important;
  }

  .indicador-seta {
    font-size: 17px !important;
  }

  .indicador-numero {
    margin-top: 10px;

    font-size: 24px;
    line-height: 1;
  }

  .indicador-card--cancelado
  .indicador-numero {
    margin-top: 0;

    grid-column: 2;
    grid-row: 1;
  }

  .indicador-titulo {
    margin-top: 4px;

    font-size: 12px;
  }

  .indicador-card--cancelado
  .indicador-titulo {
    grid-column: 2;
    grid-row: 2;
  }

  .indicador-descricao {
    display: none;
  }

  /*
    Painéis principais mais compactos.
  */

  .painel-card {
    padding: 17px;

    border-radius: 17px;
  }

  .card-cabecalho {
    margin-bottom: 17px;
  }

  .card-titulo {
    font-size: 16px;
  }

  .card-subtitulo {
    margin-top: 2px;

    font-size: 10px;
  }

  .card-icone {
    width: 36px;
    height: 36px;

    border-radius: 10px;
  }

  /*
    Gráfico aparece logo no começo
    e fica compacto.
  */

  .status-lista {
    gap: 14px;
  }

  .status-item {
    padding: 2px 0;
  }

  .status-item-topo {
    margin-bottom: 6px;
  }

  .status-nome {
    font-size: 12px;
  }

  .status-quantidade {
    font-size: 12px;
  }

  .status-percentual {
    font-size: 9px;
  }

  .barra-fundo {
    height: 6px;
  }

  /*
    Urgências compactas
  */

  .urgencia-item {
    padding: 11px 0;
  }

  .urgencia-problema {
    max-width: 210px;

    font-size: 12px;
  }

  .urgencia-data {
    font-size: 9px;
  }

  /*
    Últimos chamados passam de
    tabela para lista de aplicativo.
  */

  .ultimos-desktop {
    display: none;
  }

  .ultimos-mobile {
    display: flex;
    flex-direction: column;
  }

  .ultimos-cabecalho {
    margin-bottom: 8px;
  }

  .chamado-mobile {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content:
      space-between;

    gap: 12px;

    padding: 12px 2px;

    border: 0;
    border-bottom:
      1px solid #f2f4f7;

    color: inherit;
    background: transparent;

    font-family: inherit;
    text-align: left;

    cursor: pointer;
  }

  .chamado-mobile:last-child {
    border-bottom: 0;
  }

  .chamado-mobile__principal {
    min-width: 0;
    flex: 1;
  }

  .chamado-mobile__linha {
    display: flex;
    align-items: center;
    justify-content:
      space-between;

    gap: 8px;

    margin-bottom: 5px;
  }

  .chamado-mobile__numero {
    color: #f97316;

    font-size: 10px;
    font-weight: 800;
  }

  .chamado-mobile strong {
    display: block;

    overflow: hidden;

    color: #344054;

    font-size: 12px;
    font-weight: 700;

    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chamado-mobile__data {
    display: block;

    margin-top: 4px;

    color: #98a2b3;

    font-size: 9px;
  }

  /*
    Badges menores no app.
  */

  .status-pendente,
  .status-aceito,
  .status-rota,
  .status-atendimento,
  .status-finalizado,
  .status-cancelado,
  .status-padrao {
    padding: 4px 7px;

    font-size: 8px;
  }
}

/* =========================================
   CELULAR PEQUENO
========================================= */

@media (max-width: 380px) {
  .dashboard-page {
    padding:
      12px
      10px
      26px;
  }

  .cards-grid {
    gap: 8px;
  }

  .indicador-card {
    padding: 11px;
  }

  .painel-card {
    padding: 15px;
  }
}

/* =========================================
   DARK
========================================= */

.body--dark
.dashboard-page {
  background: #0d0f12;
}

.body--dark
.indicador-card,
.body--dark
.painel-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark
.pagina-titulo,
.body--dark
.indicador-numero,
.body--dark
.indicador-titulo,
.body--dark
.card-titulo,
.body--dark
.status-quantidade,
.body--dark
.urgencia-problema,
.body--dark
.numero-chamado,
.body--dark
.problema-chamado,
.body--dark
.chamado-mobile strong {
  color: #f9fafb;
}

.body--dark
.status-nome,
.body--dark
.data-chamado {
  color: #d0d5dd;
}

.body--dark
.barra-fundo {
  background: #2b2f36;
}

.body--dark
.chamado-mobile {
  border-color: #2b2f36;
}

.body--dark
.estado-vazio--compacto {
  background: #1b1f25;
}
</style>