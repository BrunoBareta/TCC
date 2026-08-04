<template>
  <q-drawer
    show-if-above
    :width="260"
    bordered
  >
    <div class="q-pa-lg">

      <div class="row items-center q-mb-xl">
        <q-avatar
          color="orange"
          text-color="white"
          icon="agriculture"
          size="48px"
        />

        <div class="q-ml-md">
          <div class="text-h6 text-weight-bold">
            Avioeste
          </div>

          <div class="text-grey">
            Portal do Produtor
          </div>
        </div>
      </div>

      <q-btn
        color="orange"
        icon="add"
        label="Novo Chamado"
        class="full-width q-mb-xl"
        unelevated
      />

      <q-list>

        <q-item clickable to="/produtor/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            Dashboard
          </q-item-section>
        </q-item>

        <q-item clickable to="/produtor/chamados">
          <q-item-section avatar>
            <q-icon name="confirmation_number" />
          </q-item-section>

          <q-item-section>
            Meus Chamados
          </q-item-section>
        </q-item>

        <q-item clickable to="/produtor/relatorios">
          <q-item-section avatar>
            <q-icon name="assessment" />
          </q-item-section>

          <q-item-section>
            Relatórios
          </q-item-section>
        </q-item>

        <q-item clickable to="/produtor/perfil">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>
            Perfil
          </q-item-section>
        </q-item>

      </q-list>

    </div>
  </q-drawer>
</template>

<script setup>
</script>