<template>
  <div class="resumo-card">
    <div class="resumo-topo">
      <div class="resumo-identificacao">
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

    <q-separator class="separador" />

    <div class="resumo-grid">
      <div class="resumo-item">
        <div class="item-icone">
          <q-icon
            name="calendar_today"
            size="20px"
          />
        </div>

        <div>
          <div class="item-label">
            Data de abertura
          </div>

          <div class="item-valor">
            {{ formatarData(chamado.data_abertura) }}
          </div>
        </div>
      </div>

      <div class="resumo-item">
        <div class="item-icone">
          <q-icon
            name="priority_high"
            size="21px"
          />
        </div>

        <div>
          <div class="item-label">
            Urgência
          </div>

          <div class="item-valor">
            {{ formatarTexto(chamado.urgencia) }}
          </div>
        </div>
      </div>

      <div class="resumo-item">
        <div class="item-icone">
          <q-icon
            name="support_agent"
            size="21px"
          />
        </div>

        <div>
          <div class="item-label">
            Tipo do chamado
          </div>

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
  height: 100%;

  padding: 20px;

  border: 1px solid #eaecf0;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.045);
}

.resumo-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 18px;
}

.resumo-identificacao {
  min-width: 0;
}

.protocolo {
  color: #f97316;

  font-size: 13px;
  font-weight: 900;

  letter-spacing: 0.45px;
  text-transform: uppercase;
}

.problema {
  margin-top: 5px;

  color: #101828;

  font-size: 23px;
  font-weight: 900;
  line-height: 1.2;
}

.separador {
  margin: 16px 0 !important;
}

.resumo-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 10px;
}

.resumo-item {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px 11px;

  border-radius: 12px;

  background: #f8fafc;
}

.item-icone {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;
  background: #fff1e6;
}

.item-label {
  color: #98a2b3;

  font-size: 10px;
  font-weight: 800;

  text-transform: uppercase;
}

.item-valor {
  margin-top: 3px;

  color: #344054;

  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
}

.status-pendente,
.status-atendimento,
.status-concluido,
.status-cancelado {
  padding: 7px 12px;

  font-size: 11px;
  font-weight: 800;
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

.body--dark .resumo-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .problema,
.body--dark .item-valor {
  color: #f9fafb;
}

.body--dark .resumo-item {
  background: #1b1f25;
}

@media (max-width: 1250px) {
  .resumo-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .resumo-topo {
    flex-direction: column;
  }

  .problema {
    font-size: 20px;
  }

  .resumo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
