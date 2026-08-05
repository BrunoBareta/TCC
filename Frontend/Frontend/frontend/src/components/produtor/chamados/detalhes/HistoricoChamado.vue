<template>
  <div class="historico-card">
    <div class="card-titulo">
      Andamento do chamado
    </div>

    <div class="linha-tempo">
      <div class="evento">
        <div class="evento-marcador ativo">
          <q-icon name="add_task" size="18px" />
        </div>

        <div>
          <div class="evento-titulo">
            Chamado aberto
          </div>

          <div class="evento-data">
            {{ formatarData(chamado.data_abertura) }}
          </div>
        </div>
      </div>

      <div class="linha" />

      <div class="evento">
        <div
          class="evento-marcador"
          :class="{ ativo: statusAvancado }"
        >
          <q-icon name="engineering" size="18px" />
        </div>

        <div>
          <div class="evento-titulo">
            Atendimento técnico
          </div>

          <div class="evento-data">
            {{
              statusAvancado
                ? 'Chamado em atendimento'
                : 'Aguardando atendimento'
            }}
          </div>
        </div>
      </div>

      <div class="linha" />

      <div class="evento">
        <div
          class="evento-marcador"
          :class="{ ativo: chamadoFinalizado }"
        >
          <q-icon name="check_circle" size="18px" />
        </div>

        <div>
          <div class="evento-titulo">
            Finalização
          </div>

          <div class="evento-data">
            {{
              chamadoFinalizado
                ? formatarData(
                    chamado.data_finalizacao ||
                    chamado.data_fechamento
                  )
                : 'Ainda não finalizado'
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chamado: {
    type: Object,
    required: true
  }
})

const statusAtual = computed(() =>
  String(props.chamado.status || '').toUpperCase()
)

const statusAvancado = computed(() =>
  [
    'ACEITO',
    'EM_ROTA',
    'EM_ATENDIMENTO',
    'CONCLUIDO',
    'FINALIZADO'
  ].includes(statusAtual.value)
)

const chamadoFinalizado = computed(() =>
  ['CONCLUIDO', 'FINALIZADO'].includes(statusAtual.value)
)

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

.evento {
  display: flex;
  align-items: center;
  gap: 13px;
}

.evento-marcador {
  width: 38px;
  height: 38px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f2f4f7;
  color: #98a2b3;
}

.evento-marcador.ativo {
  background: #fff1e6;
  color: #f97316;
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

.linha {
  width: 2px;
  height: 38px;
  margin: 5px 0 5px 18px;
  background: #eaecf0;
}
</style>