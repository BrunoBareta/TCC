<template>
  <q-drawer
    v-model="drawerAberto"
    show-if-above
    bordered
    :width="240"
    :breakpoint="1024"
    class="sidebar-tecnico"
  >
    <div class="sidebar-conteudo">
      <!-- LOGO -->
      <div class="logo-area">
        <q-avatar
          size="58px"
          color="orange"
          text-color="white"
          icon="engineering"
        />

        <div class="logo-texto">
          <div class="logo-titulo">
            Avioeste
          </div>

          <div class="logo-subtitulo">
            Portal do Técnico
          </div>
        </div>
      </div>

      <!-- MENU -->
      <q-list class="menu-lista">
        <!-- DASHBOARD -->
        <q-item
          clickable
          exact
          :to="{ name: 'tecnico-dashboard' }"
          active-class="menu-ativo"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            Dashboard
          </q-item-section>
        </q-item>

        <!-- CHAMADOS PENDENTES -->
        <q-item
          clickable
          exact
          :to="{ name: 'tecnico-pendentes' }"
          active-class="menu-ativo"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>

          <q-item-section>
            Chamados pendentes
          </q-item-section>
        </q-item>

        <!-- MEUS CHAMADOS -->
        <q-item
          clickable
          exact
          :to="{ name: 'tecnico-meus-chamados' }"
          active-class="menu-ativo"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="assignment_ind" />
          </q-item-section>

          <q-item-section>
            Meus chamados
          </q-item-section>
        </q-item>

        <!-- ATENDIMENTO -->
        <q-item
          clickable
          exact
          :to="{ name: 'tecnico-atendimento' }"
          active-class="menu-ativo"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="engineering" />
          </q-item-section>

          <q-item-section>
            Atendimento
          </q-item-section>
        </q-item>

        <!-- PERFIL -->
        <q-item
          clickable
          exact
          :to="{ name: 'tecnico-perfil' }"
          active-class="menu-ativo"
          class="menu-item"
        >
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
const drawerAberto = defineModel({
  type: Boolean,
  default: false
})
</script>

<style scoped>
.sidebar-tecnico {
  background: #ffffff;
}

.sidebar-conteudo {
  min-height: 100%;
  padding: 28px 20px;
}

/* =============================
   LOGO
============================= */

.logo-area {
  display: flex;
  align-items: center;
  padding: 6px 8px 38px;
}

.logo-texto {
  margin-left: 14px;
}

.logo-titulo {
  color: #101828;
  font-size: 20px;
  font-weight: 800;
}

.logo-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 13px;
}

/* =============================
   MENU
============================= */

.menu-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  min-height: 58px;
  padding: 8px 14px;
  border-radius: 14px;

  color: #344054;

  font-size: 14px;
  font-weight: 600;

  transition:
    background 0.2s,
    color 0.2s;
}

.menu-item:hover {
  background: #f9fafb;
}

.menu-item :deep(.q-item__section--avatar) {
  min-width: 42px;
}

.menu-item :deep(.q-icon) {
  font-size: 23px;
}

/* ATIVO */

.menu-ativo {
  color: #f97316 !important;
  background: #fff1e6 !important;
}

.menu-ativo :deep(.q-icon) {
  color: #f97316 !important;
}

/* =============================
   DARK MODE
============================= */

.body--dark .sidebar-tecnico {
  background: #12151a;
}

.body--dark .logo-titulo {
  color: #f9fafb;
}

.body--dark .logo-subtitulo {
  color: #98a2b3;
}

.body--dark .menu-item {
  color: #d0d5dd;
}

.body--dark .menu-item:hover {
  background: #1b1f25;
}

.body--dark .menu-ativo {
  color: #f97316 !important;
  background: #292018 !important;
}

/* =============================
   MOBILE
============================= */

@media (max-width: 1023px) {
  .sidebar-conteudo {
    padding: 22px 16px;
  }
}
</style>