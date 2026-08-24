<template>
  <q-page class="atendimento-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Atendimento técnico
        </div>

        <div class="pagina-subtitulo">
          Acompanhe e atualize o andamento da assistência.
        </div>
      </div>

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Voltar"
        color="grey-7"
        @click="voltar"
      />
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
        Carregando atendimento...
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
          @click="carregarChamado"
        />
      </template>
    </q-banner>

    <!-- =========================================
         ATENDIMENTO
    ========================================== -->

    <div
      v-else-if="chamado"
      class="atendimento-grid"
    >
      <!-- ===============================
           COLUNA PRINCIPAL
      ================================ -->

      <div class="coluna-principal">
        <!-- RESUMO -->

        <div class="card">
          <div class="card-topo">
            <div>
              <div class="chamado-numero">
                Chamado #{{ chamado.id_chamado }}
              </div>

              <div class="chamado-problema">
                {{ chamado.problema }}
              </div>
            </div>

            <q-badge
              rounded
              :class="classeStatus(chamado.status)"
            >
              {{ formatarTexto(chamado.status) }}
            </q-badge>
          </div>

          <q-separator class="q-my-lg" />

          <div class="informacoes-grid">
            <div class="informacao">
              <div class="informacao-label">
                Cultura
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.tipo_cultura) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Urgência
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.urgencia) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Data de abertura
              </div>

              <div class="informacao-valor">
                {{ formatarData(chamado.data_abertura) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Tipo do chamado
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.tipo_chamado) }}
              </div>
            </div>

            <div
              v-if="chamado.data_fechamento"
              class="informacao"
            >
              <div class="informacao-label">
                Data de fechamento
              </div>

              <div class="informacao-valor">
                {{ formatarData(chamado.data_fechamento) }}
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================
             ANDAMENTO
        ========================================== -->

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Andamento do atendimento
          </div>

          <div class="etapas">
            <div
              v-for="(etapa, index) in etapas"
              :key="etapa.status"
              class="etapa"
            >
              <div class="etapa-superior">
                <div
                  class="etapa-circulo"
                  :class="{
                    'etapa-concluida':
                      indiceEtapaAtual >= index,

                    'etapa-atual':
                      indiceEtapaAtual === index
                  }"
                >
                  <q-icon
                    :name="
                      indiceEtapaAtual > index
                        ? 'check'
                        : etapa.icone
                    "
                    size="18px"
                  />
                </div>

                <div
                  v-if="index < etapas.length - 1"
                  class="etapa-linha"
                  :class="{
                    'linha-concluida':
                      indiceEtapaAtual > index
                  }"
                ></div>
              </div>

              <div
                class="etapa-label"
                :class="{
                  'etapa-label-ativa':
                    indiceEtapaAtual >= index
                }"
              >
                {{ etapa.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================
             DESCRIÇÃO
        ========================================== -->

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Descrição do problema
          </div>

          <div class="descricao">
            {{
              chamado.descricao ||
              'Nenhuma descrição informada.'
            }}
          </div>
        </div>

        <!-- =========================================
             FOTOS E VÍDEOS
        ========================================== -->

        <div class="q-mt-lg">
          <AnexosChamado
            v-if="chamado?.id_chamado"
            :id-chamado="chamado.id_chamado"
          />
        </div>

        <!-- =========================================
             AVISO ANTES DE INICIAR
        ========================================== -->

        <div
          v-if="
            !podeRegistrarServico &&
            !atendimentoFinalizado
          "
          class="card q-mt-lg aguardando-card"
        >
          <div class="aguardando-conteudo">
            <div class="aguardando-icone">
              <q-icon
                :name="
                  statusAtual === 'EM_ROTA'
                    ? 'local_shipping'
                    : 'schedule'
                "
                size="28px"
              />
            </div>

            <div>
              <div class="aguardando-titulo">
                {{
                  statusAtual === 'EM_ROTA'
                    ? 'Atendimento ainda não iniciado'
                    : 'Aguardando início do deslocamento'
                }}
              </div>

              <div class="aguardando-texto">
                {{
                  statusAtual === 'EM_ROTA'
                    ? 'Quando chegar ao local, inicie o atendimento para liberar o registro de materiais e observações.'
                    : 'Os materiais e as observações serão liberados após o técnico chegar ao local e iniciar o atendimento.'
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================
             SERVIÇO
        ========================================== -->

        <template
          v-if="
            podeRegistrarServico ||
            atendimentoFinalizado
          "
        >
          <div class="q-mt-lg">
            <MateriaisAtendimento
              :id-chamado="chamado.id_chamado"
              :somente-leitura="atendimentoFinalizado"
            />
          </div>

          <div class="card q-mt-lg">
            <div class="card-titulo">
              Observações do atendimento
            </div>

            <q-input
              v-if="!atendimentoFinalizado"
              v-model="observacao"
              type="textarea"
              outlined
              autogrow
              label="Descreva o serviço realizado"
              maxlength="1000"
              counter
              hint="Informe o que foi identificado e o que foi realizado no atendimento."
            />

            <div
              v-else-if="chamado.resposta_tecnico"
              class="observacao-finalizada"
            >
              <div class="observacao-finalizada-label">
                Resposta registrada
              </div>

              <div class="observacao-finalizada-texto">
                {{ chamado.resposta_tecnico }}
              </div>
            </div>

            <div
              v-else
              class="sem-observacao"
            >
              Nenhuma observação foi registrada neste atendimento.
            </div>
          </div>
        </template>
      </div>

      <!-- ===============================
           COLUNA LATERAL
      ================================ -->

      <div class="coluna-lateral">
        <!-- =========================================
             DESLOCAMENTO
        ========================================== -->

        <DeslocamentoAtendimento
          :chamado="chamado"
          :observacao="observacao"
          @chamado-atualizado="atualizarChamadoLocal"
        />

        <!-- =========================================
             LOCAL DO ATENDIMENTO
        ========================================== -->

        <div class="card q-mt-lg local-card">
          <div class="local-topo">
            <div>
              <div class="card-titulo local-titulo">
                Local do atendimento
              </div>

              <div class="local-origem">
                {{ textoOrigemLocalizacao }}
              </div>
            </div>

            <div class="local-icone">
              <q-icon
                name="location_on"
                size="23px"
              />
            </div>
          </div>

          <div class="local-endereco">
            <q-icon
              name="place"
              color="orange"
              size="20px"
            />

            <div>
              <div class="local-endereco-label">
                Endereço
              </div>

              <div class="local-endereco-valor">
                {{ enderecoAtendimento }}
              </div>
            </div>
          </div>

          <div class="local-acoes">
            <q-btn
              v-if="possuiCoordenadasAtendimento"
              outline
              no-caps
              color="orange"
              :icon="
                mostrarMapa
                  ? 'map'
                  : 'map'
              "
              :label="
                mostrarMapa
                  ? 'Ocultar mapa'
                  : 'Ver mapa'
              "
              @click="
                mostrarMapa =
                  !mostrarMapa
              "
            />

            <q-btn
              v-if="possuiCoordenadasAtendimento"
              unelevated
              no-caps
              color="orange"
              icon="near_me"
              label="Abrir rota"
              @click="abrirRota"
            />
          </div>

          <q-slide-transition>
            <div
              v-show="
                mostrarMapa &&
                possuiCoordenadasAtendimento
              "
              class="local-mapa"
            >
              <MapaLocalizacao
                :key="
                  `atendimento-${latitudeAtendimento}-${longitudeAtendimento}`
                "
                :latitude="latitudeAtendimento"
                :longitude="longitudeAtendimento"
                nome-local="Local do atendimento"
                :endereco="enderecoAtendimento"
                titulo="Localização do atendimento"
                :subtitulo="textoOrigemLocalizacao"
              />
            </div>
          </q-slide-transition>

          <div
            v-if="!possuiCoordenadasAtendimento"
            class="local-sem-coordenadas"
          >
            <q-icon
              name="location_off"
              size="20px"
            />

            <span>
              Este chamado possui somente o endereço escrito.
            </span>
          </div>
        </div>

        <!-- =========================================
             EQUIPE
        ========================================== -->

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Equipe vinculada
          </div>

          <div
            v-if="equipe.length === 0"
            class="text-grey-6"
          >
            Nenhum funcionário vinculado.
          </div>

          <div
            v-for="funcionario in equipe"
            :key="funcionario.id_chamado_funcionario"
            class="funcionario-item"
          >
            <q-avatar
              color="grey-3"
              text-color="dark"
              size="38px"
            >
              {{ iniciais(funcionario.nome) }}
            </q-avatar>

            <div>
              <div class="funcionario-nome">
                {{ funcionario.nome }}
              </div>

              <div class="funcionario-funcao">
                {{
                  formatarTexto(
                    funcionario.funcao_atendimento
                  )
                }}
              </div>
            </div>
          </div>

          <div
            v-if="equipe.length > 0"
            class="total-equipe"
          >
            Total de funcionários:
            <strong>{{ equipe.length }}</strong>
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
  useRoute,
  useRouter
} from 'vue-router'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

import MateriaisAtendimento from
  'src/components/tecnico/materiais/MateriaisAtendimento.vue'

import DeslocamentoAtendimento from
  'src/components/tecnico/atendimento/DeslocamentoAtendimento.vue'

import AnexosChamado from
  'src/components/shared/AnexosChamado.vue'

import MapaLocalizacao from
  'src/components/shared/MapaLocalizacao.vue'

const route =
  useRoute()

const router =
  useRouter()

const chamado =
  ref(null)

const equipe =
  ref([])

const observacao =
  ref('')

const carregando =
  ref(false)

const erro =
  ref('')

const mostrarMapa =
  ref(false)

/* =========================================
   ETAPAS
========================================= */

const etapas = [
  {
    status: 'ACEITO',
    label: 'Aceito',
    icone: 'thumb_up'
  },

  {
    status: 'EM_ROTA',
    label: 'Em deslocamento',
    icone: 'local_shipping'
  },

  {
    status: 'EM_ATENDIMENTO',
    label: 'Em atendimento',
    icone: 'engineering'
  },

  {
    status: 'FINALIZADO',
    label: 'Finalizado',
    icone: 'check_circle'
  }
]

/* =========================================
   STATUS
========================================= */

const statusAtual =
  computed(() =>
    String(
      chamado.value?.status ||
      ''
    ).toUpperCase()
  )

const atendimentoFinalizado =
  computed(() =>
    [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(
      statusAtual.value
    )
  )

const podeRegistrarServico =
  computed(() =>
    statusAtual.value ===
    'EM_ATENDIMENTO'
  )

const indiceEtapaAtual =
  computed(() => {
    const status =
      statusAtual.value

    if (
      status === 'FINALIZADO' ||
      status === 'CONCLUIDO'
    ) {
      return 3
    }

    const indice =
      etapas.findIndex(
        etapa =>
          etapa.status ===
          status
      )

    return indice >= 0
      ? indice
      : 0
  })

/* =========================================
   LOCALIZAÇÃO
========================================= */

function converterCoordenada(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return null
  }

  const numero =
    Number(
      String(valor)
        .replace(',', '.')
    )

  return Number.isFinite(
    numero
  )
    ? numero
    : null
}

/*
  A localização escolhida no chamado
  sempre tem prioridade.

  Chamados antigos continuam funcionando
  usando a localização da propriedade.
*/

const latitudeAtendimento =
  computed(() => {
    const latitudeChamado =
      converterCoordenada(
        chamado.value
          ?.latitude_atendimento
      )

    if (
      latitudeChamado !==
      null
    ) {
      return latitudeChamado
    }

    return converterCoordenada(
      chamado.value
        ?.latitude_propriedade
    )
  })

const longitudeAtendimento =
  computed(() => {
    const longitudeChamado =
      converterCoordenada(
        chamado.value
          ?.longitude_atendimento
      )

    if (
      longitudeChamado !==
      null
    ) {
      return longitudeChamado
    }

    return converterCoordenada(
      chamado.value
        ?.longitude_propriedade
    )
  })

const possuiCoordenadasAtendimento =
  computed(() => {
    const latitude =
      latitudeAtendimento.value

    const longitude =
      longitudeAtendimento.value

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    )
  })

const enderecoAtendimento =
  computed(() => {
    /*
      1º - endereço específico do chamado
    */

    const enderecoChamado =
      String(
        chamado.value
          ?.endereco_atendimento ||
        ''
      ).trim()

    if (enderecoChamado) {
      return enderecoChamado
    }

    /*
      2º - endereço cadastrado
      da propriedade
    */

    const endereco =
      String(
        chamado.value
          ?.endereco_propriedade ||
        ''
      ).trim()

    const cidade =
      String(
        chamado.value
          ?.cidade_propriedade ||
        ''
      ).trim()

    const estado =
      String(
        chamado.value
          ?.estado_propriedade ||
        ''
      ).trim()

    const cidadeEstado =
      [
        cidade,
        estado
      ]
        .filter(Boolean)
        .join(' - ')

    return (
      [
        endereco,
        cidadeEstado
      ]
        .filter(Boolean)
        .join(', ') ||
      'Endereço não informado'
    )
  })

const origemLocalizacao =
  computed(() =>
    String(
      chamado.value
        ?.origem_localizacao ||
      ''
    )
      .trim()
      .toUpperCase()
  )

const textoOrigemLocalizacao =
  computed(() => {
    if (
      origemLocalizacao.value ===
      'ATUAL'
    ) {
      return 'Localização informada pelo produtor neste chamado.'
    }

    if (
      origemLocalizacao.value ===
      'PESQUISA'
    ) {
      return 'Endereço escolhido pelo produtor neste chamado.'
    }

    return 'Localização cadastrada da propriedade.'
  })

/* =========================================
   ABRIR ROTA
========================================= */

function abrirRota() {
  if (
    !possuiCoordenadasAtendimento
      .value
  ) {
    return
  }

  const latitude =
    latitudeAtendimento.value

  const longitude =
    longitudeAtendimento.value

  const url =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

  window.open(
    url,
    '_blank',
    'noopener,noreferrer'
  )
}

/* =========================================
   CARREGAR CHAMADO
========================================= */

async function carregarChamado() {
  carregando.value =
    true

  erro.value =
    ''

  try {
    const idChamado =
      Number(
        route.params.id
      )

    if (
      !Number.isInteger(
        idChamado
      ) ||
      idChamado <= 0
    ) {
      throw new Error(
        'ID do chamado inválido.'
      )
    }

    chamado.value =
      await chamadoService
        .buscarPorId(
          idChamado
        )

    observacao.value =
      chamado.value
        ?.resposta_tecnico ||
      ''

    const respostaEquipe =
      await chamadoFuncionarioService
        .listarPorChamado(
          idChamado
        )

    equipe.value =
      Array.isArray(
        respostaEquipe
      )
        ? respostaEquipe
        : respostaEquipe?.data ||
          []
  } catch (error) {
    console.error(
      'Erro ao carregar atendimento:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar o atendimento.'
  } finally {
    carregando.value =
      false
  }
}

/* =========================================
   VOLTAR
========================================= */

function voltar() {
  router.push({
    name:
      'tecnico-meus-chamados'
  })
}

/* =========================================
   ATUALIZAÇÃO LOCAL
========================================= */

function atualizarChamadoLocal(
  chamadoAtualizado
) {
  chamado.value =
    chamadoAtualizado

  if (
    [
      'FINALIZADO',
      'CONCLUIDO'
    ].includes(
      String(
        chamadoAtualizado
          ?.status ||
        ''
      ).toUpperCase()
    )
  ) {
    observacao.value =
      chamadoAtualizado
        ?.resposta_tecnico ||
      observacao.value
  }
}

/* =========================================
   FORMATAÇÕES
========================================= */

function formatarTexto(
  valor
) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
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

  return data.toLocaleString(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short'
    }
  )
}

/* =========================================
   STATUS
========================================= */

function classeStatus(
  status
) {
  const valor =
    String(
      status ||
      ''
    ).toUpperCase()

  if (
    valor ===
    'ACEITO'
  ) {
    return 'status-aceito'
  }

  if (
    valor ===
    'EM_ROTA'
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
    ].includes(
      valor
    )
  ) {
    return 'status-finalizado'
  }

  return 'status-pendente'
}

/* =========================================
   INICIAIS
========================================= */

function iniciais(
  nome
) {
  return String(
    nome ||
    '?'
  )
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      parte =>
        parte.charAt(0)
    )
    .join('')
    .toUpperCase()
}

onMounted(
  carregarChamado
)
</script>

<style scoped>
/* =========================================
   PÁGINA
========================================= */

.atendimento-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
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
  padding: 48px;
  text-align: center;
}

/* =========================================
   GRID
========================================= */

.atendimento-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(320px, 1fr);
  gap: 24px;
}

/* =========================================
   CARD
========================================= */

.card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
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

.card-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.chamado-numero {
  color: #f97316;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.chamado-problema {
  margin-top: 6px;
  color: #101828;
  font-size: 25px;
  font-weight: 800;
}

.card-titulo {
  margin-bottom: 18px;
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

/* =========================================
   INFORMAÇÕES
========================================= */

.informacoes-grid {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      1fr
    );
  gap: 22px;
}

.informacao-label {
  color: #98a2b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.informacao-valor {
  margin-top: 4px;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.descricao {
  color: #475467;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
}

/* =========================================
   ETAPAS
========================================= */

.etapas {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      1fr
    );
}

.etapa {
  min-width: 0;
}

.etapa-superior {
  display: flex;
  align-items: center;
}

.etapa-circulo {
  width: 38px;
  height: 38px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  border: 2px solid #eaecf0;
  border-radius: 50%;

  color: #98a2b3;
  background: #ffffff;
}

.etapa-concluida {
  border-color: #f97316;
  color: #f97316;
  background: #fff7ed;
}

.etapa-atual {
  color: #ffffff;
  background: #f97316;
}

.etapa-linha {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  background: #eaecf0;
}

.linha-concluida {
  background: #f97316;
}

.etapa-label {
  margin-top: 9px;
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
}

.etapa-label-ativa {
  color: #475467;
}

/* =========================================
   LOCALIZAÇÃO
========================================= */

.local-card {
  padding: 22px;
}

.local-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.local-titulo {
  margin-bottom: 4px;
}

.local-origem {
  max-width: 250px;
  color: #98a2b3;
  font-size: 11px;
  line-height: 1.4;
}

.local-icone {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  color: #f97316;
  background: #fff1e6;
}

.local-endereco {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  margin-top: 18px;
  padding: 14px;

  border-radius: 13px;

  background: #f9fafb;
}

.local-endereco-label {
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.local-endereco-valor {
  margin-top: 3px;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
}

.local-acoes {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  gap: 8px;
  margin-top: 14px;
}

.local-mapa {
  margin-top: 16px;
}

.local-sem-coordenadas {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 14px;
  padding: 11px 13px;

  border-radius: 12px;

  color: #667085;
  background: #f9fafb;

  font-size: 11px;
}

/* =========================================
   AVISO
========================================= */

.aguardando-card {
  border-color: #fed7aa;
  background: #fffaf5;
}

.aguardando-conteudo {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.aguardando-icone {
  width: 50px;
  height: 50px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  color: #f97316;
  background: #ffedd5;
}

.aguardando-titulo {
  color: #9a3412;
  font-size: 15px;
  font-weight: 800;
}

.aguardando-texto {
  margin-top: 5px;
  max-width: 700px;

  color: #c2410c;

  font-size: 12px;
  line-height: 1.5;
}

/* =========================================
   EQUIPE
========================================= */

.funcionario-item {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 0;

  border-bottom:
    1px solid #f2f4f7;
}

.funcionario-item:last-of-type {
  border-bottom: 0;
}

.funcionario-nome {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.funcionario-funcao {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 12px;
}

.total-equipe {
  margin-top: 14px;
  padding-top: 14px;

  border-top:
    1px solid #eaecf0;

  color: #667085;
  font-size: 13px;
}

/* =========================================
   OBSERVAÇÃO
========================================= */

.observacao-finalizada {
  padding: 16px;
  border-radius: 14px;
  background: #ecfdf3;
}

.observacao-finalizada-label {
  color: #027a48;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.observacao-finalizada-texto {
  margin-top: 7px;
  color: #344054;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

.sem-observacao {
  padding: 16px;
  border-radius: 12px;
  color: #667085;
  background: #f9fafb;
  font-size: 13px;
}

/* =========================================
   STATUS
========================================= */

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado {
  padding: 7px 12px;
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

/* =========================================
   DARK MODE
========================================= */

.body--dark .atendimento-page {
  background: #0d0f12;
}

.body--dark .card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .pagina-titulo,
.body--dark .chamado-problema,
.body--dark .card-titulo {
  color: #f9fafb;
}

.body--dark .pagina-subtitulo,
.body--dark .descricao,
.body--dark .informacao-valor,
.body--dark .funcionario-nome {
  color: #d0d5dd;
}

.body--dark .etapa-circulo {
  border-color: #3a3f47;
  background: #16191f;
}

.body--dark .etapa-linha {
  background: #3a3f47;
}

.body--dark .linha-concluida {
  background: #f97316;
}

.body--dark .etapa-concluida {
  border-color: #f97316;
  color: #f97316;
  background: #292018;
}

.body--dark .etapa-atual {
  color: #ffffff;
  background: #f97316;
}

.body--dark .local-endereco,
.body--dark .local-sem-coordenadas {
  background: #1b1f25;
}

.body--dark .local-endereco-valor {
  color: #f2f4f7;
}

.body--dark .local-icone {
  color: #fb923c;
  background: #332217;
}

.body--dark .aguardando-card {
  border-color: #7c2d12;
  background: #24160f;
}

.body--dark .aguardando-icone {
  background: #431407;
}

.body--dark .aguardando-titulo {
  color: #fdba74;
}

.body--dark .aguardando-texto {
  color: #fb923c;
}

.body--dark .funcionario-item,
.body--dark .total-equipe {
  border-color: #2b2f36;
}

.body--dark .sem-observacao {
  color: #98a2b3;
  background: #1b1f25;
}

.body--dark .observacao-finalizada {
  border: 1px solid #3a3f47;
  background: #1b1f25;
}

.body--dark .observacao-finalizada-label {
  color: #fb923c;
}

.body--dark .observacao-finalizada-texto {
  color: #f2f4f7;
}

/* =========================================
   RESPONSIVO
========================================= */

@media (max-width: 1100px) {
  .atendimento-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .atendimento-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .informacoes-grid {
    grid-template-columns: 1fr;
  }

  .pagina-titulo {
    font-size: 25px;
  }

  .card {
    padding: 20px;
  }

  .card-topo {
    flex-direction: column;
  }

  .etapas {
    grid-template-columns:
      repeat(
        2,
        1fr
      );
    gap: 20px;
  }

  .local-acoes {
    grid-template-columns: 1fr;
  }
}
</style>