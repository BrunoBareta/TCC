<template>
  <q-footer bordered class="mobile-footer bg-white">
    <div class="mobile-nav">
      <q-btn
        flat
        no-caps
        class="mobile-nav__item"
        :class="{ active: rotaAtual === 'dashboard' }"
        icon="dashboard"
        label="Início"
        @click="$router.push(rotaDashboard)"
      />

      <q-btn
        flat
        no-caps
        class="mobile-nav__item"
        :class="{ active: rotaAtual === 'chamados' }"
        icon="confirmation_number"
        label="Chamados"
        @click="$router.push(rotaChamados)"
      />

      <q-btn
        round
        unelevated
        color="orange"
        class="mobile-nav__center"
        icon="add"
        @click="$router.push(rotaNovo)"
      />

      <q-btn
        flat
        no-caps
        class="mobile-nav__item"
        :class="{ active: rotaAtual === 'relatorios' }"
        icon="assessment"
        label="Relatórios"
        @click="$router.push(rotaRelatorios)"
      />

      <q-btn
        flat
        no-caps
        class="mobile-nav__item"
        :class="{ active: rotaAtual === 'perfil' }"
        icon="person"
        label="Perfil"
        @click="$router.push(rotaPerfil)"
      />
    </div>
  </q-footer>
</template>

<script setup>
defineProps({
  rotaAtual: String,
  rotaDashboard: String,
  rotaChamados: String,
  rotaNovo: String,
  rotaRelatorios: String,
  rotaPerfil: String
})
</script>

<style scoped>
.mobile-footer {
  border-top: 1px solid #eaecf0;
}

.mobile-nav {
  height: 78px;
  display: grid;
  grid-template-columns: 1fr 1fr 72px 1fr 1fr;
  align-items: center;
  padding: 0 8px;
  position: relative;
}

.mobile-nav__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #98a2b3;
  font-size: 11px;
}

.mobile-nav__item.active {
  color: #f79009;
}

.mobile-nav__center {
  width: 58px;
  height: 58px;
  margin: 0 auto;
  margin-top: -18px;
  box-shadow: 0 8px 20px rgba(247, 144, 9, 0.25);
}
</style>