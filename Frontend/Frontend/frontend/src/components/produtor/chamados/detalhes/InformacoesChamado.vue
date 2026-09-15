<template>
  <div class="informacoes-card">
    <div class="card-titulo">
      Informações da solicitação
    </div>

    <div class="informacao-grid">
      <div class="informacao-bloco">
        <div class="informacao-label">
          Descrição do problema
        </div>

        <div class="informacao-texto">
          {{ chamado.descricao || 'Nenhuma descrição informada.' }}
        </div>
      </div>

      <div class="informacao-bloco">
        <div class="informacao-label">
          Resposta do técnico
        </div>

        <div
          v-if="chamado.resposta_tecnico"
          class="informacao-texto resposta-tecnico"
        >
          {{ chamado.resposta_tecnico }}
        </div>

        <div
          v-else
          class="sem-resposta"
        >
          <q-icon
            name="hourglass_empty"
            size="21px"
            color="orange"
          />

          <span>
            O técnico ainda não enviou uma resposta.
          </span>
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
</script>

<style scoped>
.informacoes-card {
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

.informacao-grid {
  display: grid;
  gap: 12px;
}

.informacao-bloco {
  padding: 14px;

  border-radius: 12px;

  background: #f8fafc;
}

.informacao-label {
  margin-bottom: 6px;

  color: #98a2b3;

  font-size: 11px;
  font-weight: 800;

  text-transform: uppercase;
}

.informacao-texto {
  color: #475467;

  font-size: 15px;
  line-height: 1.5;

  white-space: pre-line;
}

.resposta-tecnico {
  color: #344054;
}

.sem-resposta {
  display: flex;
  align-items: center;

  gap: 9px;

  padding: 12px 13px;

  border-radius: 11px;

  background: #fff7ed;
  color: #9a3412;

  font-size: 14px;
  font-weight: 600;
}

.body--dark .informacoes-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .card-titulo {
  color: #f9fafb;
}

.body--dark .informacao-bloco {
  background: #1b1f25;
}

.body--dark .informacao-texto {
  color: #d0d5dd;
}

.body--dark .sem-resposta {
  color: #fdba74;
  background: #292018;
}

@media (max-width: 650px) {
  .informacoes-card {
    padding: 16px;
  }

  .informacao-texto {
    font-size: 14px;
  }
}
</style>
