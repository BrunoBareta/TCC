<template>
  <q-page class="pendentes-page">
    <TabelaChamadosPendentes />
  </q-page>
</template>

<script setup>
import TabelaChamadosPendentes from
  'src/components/tecnico/chamados/pendentes/TabelaChamadosPendentes.vue'
</script>

<style scoped>
.pendentes-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

.body--dark .pendentes-page {
  background: #0d0f12;
}

@media (max-width: 1023px) {
  .pendentes-page {
    padding: 14px 14px 30px;
  }
}

@media (max-width: 700px) {
  .pendentes-page {
    padding: 12px 12px 28px;
  }
}
</style>
