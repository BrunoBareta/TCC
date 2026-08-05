<template>
  <div class="informacoes-card">
    <div class="card-titulo">
      Informações da solicitação
    </div>

    <div class="informacao-bloco">
      <div class="informacao-label">
        Descrição do problema
      </div>

      <div class="informacao-texto">
        {{ chamado.descricao || 'Nenhuma descrição informada.' }}
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <div class="informacao-bloco">
      <div class="informacao-label">
        Resposta do técnico
      </div>

      <div
        v-if="chamado.resposta_tecnico"
        class="informacao-texto"
      >
        {{ chamado.resposta_tecnico }}
      </div>

      <div v-else class="sem-resposta">
        <q-icon
          name="hourglass_empty"
          size="22px"
          color="orange"
        />

        <span>
          O técnico ainda não enviou uma resposta.
        </span>
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
</script>

<style scoped>
.informacoes-card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.05);
}

.card-titulo {
  margin-bottom: 22px;
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

.informacao-label {
  margin-bottom: 8px;
  color: #98a2b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.informacao-texto {
  color: #475467;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
}

.sem-resposta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 14px;
}
</style>