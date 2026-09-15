<template>
  <q-page class="novo-chamado-page">
    <div class="pagina-container">
      <FormularioChamado />
    </div>
  </q-page>
</template>

<script setup>
import FormularioChamado from
  'src/components/produtor/chamados/FormularioChamado.vue'
</script>

<style scoped>
.novo-chamado-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

.pagina-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

/* DARK */

.body--dark .novo-chamado-page {
  background: #0d0f12;
}

/* RESPONSIVO */

@media (max-width: 1023px) {
  .novo-chamado-page {
    padding: 14px 14px 30px;
  }
}

@media (max-width: 700px) {
  .novo-chamado-page {
    padding: 12px 12px 28px;
  }
}
</style>
