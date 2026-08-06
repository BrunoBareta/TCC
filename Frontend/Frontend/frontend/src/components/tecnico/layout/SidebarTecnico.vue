<template>
  <q-drawer
    show-if-above
    :width="260"
    bordered
    class="bg-white"
  >
    <div class="sidebar-conteudo">
      <div class="row items-center q-mb-xl">
        <q-avatar
          color="orange"
          text-color="white"
          icon="engineering"
          size="48px"
        />

        <div class="q-ml-md">
          <div class="text-h6 text-weight-bold">
            Avioeste
          </div>

          <div class="text-grey">
            Portal do Técnico
          </div>
        </div>
      </div>

      <q-list class="menu-lista">
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
      </q-list>
    </div>
  </q-drawer>
</template>

<style scoped>
.sidebar-conteudo {
  min-height: 100%;
  padding: 24px;
}

.menu-lista {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item {
  min-height: 48px;
  border-radius: 12px;
  color: #344054;
  font-weight: 500;
}

.menu-item:hover {
  color: #f97316;
  background: #fff7ed;
}

.menu-ativo {
  color: #f97316;
  background: #fff1e6;
  font-weight: 700;
}
</style>