<template>
  <div class="resumo-card">
    <div class="resumo-topo">
      <div>
        <div class="protocolo">
          Chamado #{{ chamado.id_chamado }}
        </div>

        <div class="problema">
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

    <div class="resumo-grid">
      <div class="resumo-item">
        <q-icon
          name="calendar_today"
          size="20px"
          color="grey-6"
        />

        <div>
          <div class="item-label">Data de abertura</div>
          <div class="item-valor">
            {{ formatarData(chamado.data_abertura) }}
          </div>
        </div>
      </div>

      <div class="resumo-item">
        <q-icon
          name="priority_high"
          size="22px"
          color="grey-6"
        />

        <div>
          <div class="item-label">Urgência</div>
          <div class="item-valor">
            {{ formatarTexto(chamado.urgencia) }}
          </div>
        </div>
      </div>

      <div class="resumo-item">
        <q-icon
          name="agriculture"
          size="22px"
          color="grey-6"
        />

        <div>
          <div class="item-label">Cultura</div>
          <div class="item-valor">
            {{ formatarTexto(chamado.tipo_cultura) }}
          </div>
        </div>
      </div>

      <div class="resumo-item">
        <q-icon
          name="support_agent"
          size="22px"
          color="grey-6"
        />

        <div>
          <div class="item-label">Tipo do chamado</div>
          <div class="item-valor">
            {{ formatarTexto(chamado.tipo_chamado) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  chamado: {
    type: Object,
    required: true
  }
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
    return 'Não informada'
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

function classeStatus(status) {
  const valor = String(status || '').toUpperCase()

  if (['CONCLUIDO', 'FINALIZADO'].includes(valor)) {
    return 'status-concluido'
  }

  if (['EM_ATENDIMENTO', 'EM_ROTA', 'ACEITO'].includes(valor)) {
    return 'status-atendimento'
  }

  if (valor === 'CANCELADO') {
    return 'status-cancelado'
  }

  return 'status-pendente'
}
</script>

<style scoped>
.resumo-card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.05);
}

.resumo-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.protocolo {
  color: #f97316;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.problema {
  margin-top: 6px;
  font-size: 25px;
  font-weight: 800;
}

.resumo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.resumo-item {
  display: flex;
  align-items: center;
  gap: 13px;
}

.item-label {
  color: #98a2b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.item-valor {
  margin-top: 3px;
  font-size: 14px;
  font-weight: 600;
}

.status-pendente,
.status-atendimento,
.status-concluido,
.status-cancelado {
  padding: 7px 12px;
}

.status-pendente {
  color: #f97316;
  background: #fff1df;
}

.status-atendimento {
  color: #2563eb;
  background: #dbeafe;
}

.status-concluido {
  color: #059669;
  background: #d1fae5;
}

.status-cancelado {
  color: #dc2626;
  background: #fee2e2;
}

@media (max-width: 650px) {
  .resumo-topo {
    flex-direction: column;
  }

  .resumo-grid {
    grid-template-columns: 1fr;
  }
}
</style>