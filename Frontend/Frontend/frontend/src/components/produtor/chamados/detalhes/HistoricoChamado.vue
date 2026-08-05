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
        size="36px"
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
        size="34px"
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
            <div class="evento-titulo">
              {{ tituloEvento(evento) }}
            </div>

            <div class="evento-data">
              {{ formatarData(evento.data_alteracao) }}
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
              {{ formatarTexto(evento.status_anterior) }}
              <q-icon
                name="arrow_forward"
                size="14px"
              />
              {{ formatarTexto(evento.status_novo) }}
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

  if (lista.length === 0 && props.chamado) {
    return [
      {
        id_historico: `abertura-${props.chamado.id_chamado}`,
        status_anterior: null,
        status_novo: 'PENDENTE',
        observacao: 'Chamado aberto pelo produtor.',
        data_alteracao: props.chamado.data_abertura
      }
    ]
  }

  return lista.sort((a, b) => {
    const dataA = new Date(a.data_alteracao).getTime()
    const dataB = new Date(b.data_alteracao).getTime()

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

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function tituloEvento(evento) {
  const status = String(evento.status_novo || '').toUpperCase()

  const titulos = {
    PENDENTE: 'Chamado aberto',
    AGUARDANDO_CONFIRMACAO: 'Aguardando confirmação',
    ACEITO: 'Chamado aceito',
    EM_ROTA: 'Técnico em deslocamento',
    EM_ATENDIMENTO: 'Atendimento iniciado',
    CONCLUIDO: 'Chamado concluído',
    FINALIZADO: 'Chamado finalizado',
    CANCELADO: 'Chamado cancelado'
  }

  return titulos[status] || formatarTexto(status)
}

function iconeStatus(status) {
  const valor = String(status || '').toUpperCase()

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

  return icones[valor] || 'history'
}

function classeMarcador(status) {
  const valor = String(status || '').toUpperCase()

  if (['CONCLUIDO', 'FINALIZADO'].includes(valor)) {
    return 'marcador-concluido'
  }

  if (['ACEITO', 'EM_ROTA', 'EM_ATENDIMENTO'].includes(valor)) {
    return 'marcador-atendimento'
  }

  if (valor === 'CANCELADO') {
    return 'marcador-cancelado'
  }

  return 'marcador-pendente'
}
</script>

<style scoped>
.historico-card {
  align-self: start;
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.05);
}

.card-titulo {
  margin-bottom: 24px;
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

.estado-central,
.estado-vazio {
  padding: 36px 16px;
  text-align: center;
}

.estado-texto,
.estado-vazio-texto {
  margin-top: 10px;
  color: #98a2b3;
  font-size: 13px;
}

.estado-vazio-titulo {
  margin-top: 12px;
  color: #475467;
  font-size: 14px;
  font-weight: 700;
}

.evento {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.evento-marcador {
  width: 40px;
  height: 40px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.marcador-pendente {
  background: #fff1e6;
  color: #f97316;
}

.marcador-atendimento {
  background: #dbeafe;
  color: #2563eb;
}

.marcador-concluido {
  background: #d1fae5;
  color: #059669;
}

.marcador-cancelado {
  background: #fee2e2;
  color: #dc2626;
}

.evento-conteudo {
  min-width: 0;
  flex: 1;
  padding-top: 2px;
}

.evento-titulo {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.evento-data {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 12px;
}

.evento-observacao {
  margin-top: 9px;
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
}

.evento-transicao {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 9px;
  color: #98a2b3;
  font-size: 11px;
  font-weight: 600;
}

.linha {
  width: 2px;
  height: 38px;
  margin: 5px 0 5px 19px;
  background: #eaecf0;
}
</style>