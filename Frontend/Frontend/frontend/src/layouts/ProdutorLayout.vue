<template>
  <q-layout view="lHh Lpr lFf">
    <Sidebar />

    <q-page-container>
      <Header />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Sidebar from 'src/components/produtor/layout/Sidebar.vue'
import Header from 'src/components/produtor/layout/Header.vue'
</script>