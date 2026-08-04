<template>
  <div class="cards-grid">
    <CardResumo
      titulo="Chamados em aberto"
      :valor="5"
      status="Ativos"
      icone="assignment_turned_in"
      cor-icone="#2563eb"
      cor-fundo-icone="#eff6ff"
    />

    <CardResumo
      titulo="Técnicos a caminho"
      :valor="2"
      status="Em rota"
      icone="local_shipping"
      cor-icone="#f97316"
      cor-fundo-icone="#fff7ed"
    />

    <CardResumo
      titulo="Propriedades cadastradas"
      :valor="3"
      status="Geral"
      icone="home"
      cor-icone="#10b981"
      cor-fundo-icone="#ecfdf3"
    />
  </div>
</template>

<script setup>
import CardResumo from './CardResumo.vue'
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>