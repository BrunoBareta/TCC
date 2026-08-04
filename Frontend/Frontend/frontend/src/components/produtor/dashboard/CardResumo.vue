<template>
  <div class="card-resumo">
    <div
      class="icone-area"
      :style="{
        backgroundColor: corFundoIcone,
        color: corIcone
      }"
    >
      <q-icon :name="icone" size="24px" />
    </div>

    <div class="status">
      {{ status }}
    </div>

    <div class="valor">
      {{ valor }}
    </div>

    <div class="titulo">
      {{ titulo }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true
  },
  valor: {
    type: [String, Number],
    required: true
  },
  status: {
    type: String,
    default: ''
  },
  icone: {
    type: String,
    required: true
  },
  corIcone: {
    type: String,
    default: '#2563eb'
  },
  corFundoIcone: {
    type: String,
    default: '#eff6ff'
  }
})
</script>

<style scoped>
.card-resumo {
  position: relative;
  min-height: 150px;
  padding: 24px;
  border: 1px solid #eaecf0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.08);
}

.icone-area {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.status {
  position: absolute;
  top: 24px;
  right: 24px;
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
}

.valor {
  margin-top: 18px;
  color: #101828;
  font-size: 31px;
  font-weight: 800;
  line-height: 1;
}

.titulo {
  margin-top: 8px;
  color: #667085;
  font-size: 14px;
}
</style>