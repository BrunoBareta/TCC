<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-weight-bold">
      Meus Chamados
    </div>

    <div class="text-grey-7 q-mb-xl">
      Consulte todos os chamados da sua propriedade.
    </div>

    <FiltroChamados />

    <div class="q-mt-xl">
      <TabelaChamados />
    </div>
  </q-page>
</template>

<script setup>
import FiltroChamados from 'src/components/produtor/chamados/FiltroChamados.vue'
import TabelaChamados from 'src/components/produtor/chamados/TabelaChamados.vue'
</script>