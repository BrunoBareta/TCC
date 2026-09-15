<template>
  <div class="historico-card">
    <div class="card-titulo">
      Andamento do chamado
    </div>

    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner
        color="orange"
        size="34px"
      />

      <div class="estado-texto">
        Carregando histórico...
      </div>
    </div>

    <div
      v-else-if="eventos.length === 0"
      class="estado-vazio"
    >
      <q-icon
        name="history"
        size="32px"
        color="grey-5"
      />

      <div class="estado-vazio-titulo">
        Nenhum histórico registrado
      </div>

      <div class="estado-vazio-texto">
        As alterações deste chamado aparecerão aqui.
      </div>
    </div>

    <div
      v-else
      class="linha-tempo"
    >
      <template
        v-for="(evento, index) in eventos"
        :key="evento.id_historico || index"
      >
        <div class="evento">
          <div
            class="evento-marcador"
            :class="classeMarcador(evento.status_novo)"
          >
            <q-icon
              :name="iconeStatus(evento.status_novo)"
              size="18px"
            />
          </div>

          <div class="evento-conteudo">
            <div class="evento-topo">
              <div class="evento-titulo">
                {{ tituloEvento(evento) }}
              </div>

              <div class="evento-data">
                {{ formatarData(evento.data_alteracao) }}
              </div>
            </div>

            <div
              v-if="evento.observacao"
              class="evento-observacao"
            >
              {{ evento.observacao }}
            </div>

            <div
              v-if="evento.status_anterior"
              class="evento-transicao"
            >
              <span>
                {{ formatarTexto(evento.status_anterior) }}
              </span>

              <q-icon
                name="arrow_forward"
                size="14px"
              />

              <span>
                {{ formatarTexto(evento.status_novo) }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="index < eventos.length - 1"
          class="linha"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chamado: {
    type: Object,
    required: true
  },

  historicos: {
    type: Array,
    default: () => []
  },

  carregando: {
    type: Boolean,
    default: false
  }
})

const eventos = computed(() => {
  const lista = Array.isArray(props.historicos)
    ? [...props.historicos]
    : []

  if (
    lista.length === 0 &&
    props.chamado
  ) {
    return [
      {
        id_historico:
          `abertura-${props.chamado.id_chamado}`,
        status_anterior: null,
        status_novo: 'PENDENTE',
        observacao:
          'Chamado aberto pelo produtor.',
        data_alteracao:
          props.chamado.data_abertura
      }
    ]
  }

  return lista.sort((a, b) => {
    const dataA =
      new Date(a.data_alteracao).getTime()

    const dataB =
      new Date(b.data_alteracao).getTime()

    return dataA - dataB
  })
})

function formatarTexto(valor) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase())
}

function formatarData(valor) {
  if (!valor) {
    return 'Data não informada'
  }

  const data = new Date(valor)

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return valor
  }

  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function tituloEvento(evento) {
  const status =
    String(
      evento.status_novo || ''
    ).toUpperCase()

  const titulos = {
    PENDENTE: 'Chamado aberto',
    AGUARDANDO_CONFIRMACAO:
      'Aguardando confirmação',
    ACEITO: 'Chamado aceito',
    EM_ROTA: 'Técnico em deslocamento',
    EM_ATENDIMENTO:
      'Atendimento iniciado',
    CONCLUIDO: 'Chamado concluído',
    FINALIZADO: 'Chamado finalizado',
    CANCELADO: 'Chamado cancelado'
  }

  return (
    titulos[status] ||
    formatarTexto(status)
  )
}

function iconeStatus(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  const icones = {
    PENDENTE: 'add_task',
    AGUARDANDO_CONFIRMACAO: 'schedule',
    ACEITO: 'thumb_up_alt',
    EM_ROTA: 'local_shipping',
    EM_ATENDIMENTO: 'engineering',
    CONCLUIDO: 'check_circle',
    FINALIZADO: 'task_alt',
    CANCELADO: 'cancel'
  }

  return (
    icones[valor] ||
    'history'
  )
}

function classeMarcador(status) {
  const valor =
    String(
      status || ''
    ).toUpperCase()

  if (
    ['CONCLUIDO', 'FINALIZADO']
      .includes(valor)
  ) {
    return 'marcador-concluido'
  }

  if (
    [
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO'
    ].includes(valor)
  ) {
    return 'marcador-atendimento'
  }

  if (
    valor === 'CANCELADO'
  ) {
    return 'marcador-cancelado'
  }

  return 'marcador-pendente'
}
</script>

<style scoped>
.historico-card {
  height: 100%;

  padding: 20px;

  border: 1px solid #eaecf0;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.045);
}

.card-titulo {
  margin-bottom: 15px;

  color: #101828;

  font-size: 19px;
  font-weight: 900;
}

.estado-central,
.estado-vazio {
  padding: 28px 12px;
  text-align: center;
}

.estado-texto,
.estado-vazio-texto {
  margin-top: 8px;

  color: #98a2b3;

  font-size: 13px;
}

.estado-vazio-titulo {
  margin-top: 10px;

  color: #475467;

  font-size: 14px;
  font-weight: 800;
}

.evento {
  display: flex;
  align-items: flex-start;

  gap: 11px;
}

.evento-marcador {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;
}

.marcador-pendente {
  color: #f97316;
  background: #fff1e6;
}

.marcador-atendimento {
  color: #2563eb;
  background: #dbeafe;
}

.marcador-concluido {
  color: #059669;
  background: #d1fae5;
}

.marcador-cancelado {
  color: #dc2626;
  background: #fee2e2;
}

.evento-conteudo {
  min-width: 0;
  flex: 1;

  padding-top: 1px;
}

.evento-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;
}

.evento-titulo {
  color: #344054;

  font-size: 15px;
  font-weight: 800;
}

.evento-data {
  flex-shrink: 0;

  color: #98a2b3;

  font-size: 11px;
  font-weight: 600;
}

.evento-observacao {
  margin-top: 5px;

  color: #667085;

  font-size: 13px;
  line-height: 1.45;
}

.evento-transicao {
  display: flex;
  align-items: center;

  gap: 5px;

  margin-top: 6px;

  color: #98a2b3;

  font-size: 11px;
  font-weight: 700;
}

.linha {
  width: 2px;
  height: 24px;

  margin: 4px 0 4px 18px;

  background: #eaecf0;
}

.body--dark .historico-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .card-titulo,
.body--dark .evento-titulo {
  color: #f9fafb;
}

.body--dark .linha {
  background: #2b2f36;
}

@media (max-width: 650px) {
  .historico-card {
    padding: 16px;
  }

  .evento-topo {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
