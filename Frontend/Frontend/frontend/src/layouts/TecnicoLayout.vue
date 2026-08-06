<template>
  <q-layout view="lHh Lpr lFf" class="app-layout">
    <SidebarTecnico v-model="drawerAberto" />

    <q-header class="mobile-header bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="drawerAberto = !drawerAberto"
        />

        <q-toolbar-title class="text-weight-bold">
          Avioeste Técnico
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="notifications_none"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container">
      <HeaderTecnico />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SidebarTecnico from 'src/components/tecnico/layout/SidebarTecnico.vue'
import HeaderTecnico from 'src/components/tecnico/layout/HeaderTecnico.vue'

const drawerAberto = ref(false)
</script>

<style scoped>
.app-layout,
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.mobile-header {
  border-bottom: 1px solid #eaecf0;
  box-shadow: none;
}

@media (min-width: 1024px) {
  .mobile-header {
    display: none;
  }
}
</style>