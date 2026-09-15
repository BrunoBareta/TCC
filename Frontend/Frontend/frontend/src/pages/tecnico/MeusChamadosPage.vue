<template>
  <q-page class="meus-chamados-page">
    <!--
      O título e o subtítulo já são exibidos pelo HeaderTecnico.
      Aqui deixamos apenas o conteúdo da tela.
    -->

    <TabelaMeusChamados />
  </q-page>
</template>

<script setup>
import TabelaMeusChamados from 'src/components/tecnico/chamados/meus/TabelaMeusChamados.vue'
</script>

<style scoped>
.meus-chamados-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

/* DARK */

.body--dark .meus-chamados-page {
  background: #0d0f12;
}

/* TABLET */

@media (max-width: 1023px) {
  .meus-chamados-page {
    padding: 14px 14px 30px;
  }
}

/* MOBILE */

@media (max-width: 700px) {
  .meus-chamados-page {
    padding: 12px 12px 28px;
  }
}
</style>
