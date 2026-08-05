<template>
  <q-drawer
    show-if-above
    :width="260"
    bordered
    class="bg-white"
  >
    <div class="sidebar-conteudo">
      <div>
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
          no-caps
          :to="{ name: 'produtor-novo-chamado' }"
        />

        <q-list class="menu-lista">
          <q-item
            clickable
            exact
            :to="{ name: 'produtor-dashboard' }"
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
            :to="{ name: 'produtor-chamados' }"
            active-class="menu-ativo"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon name="confirmation_number" />
            </q-item-section>

            <q-item-section>
              Meus Chamados
            </q-item-section>
          </q-item>

          <q-item
            clickable
            exact
            :to="{ name: 'produtor-relatorios' }"
            active-class="menu-ativo"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon name="assessment" />
            </q-item-section>

            <q-item-section>
              Relatórios
            </q-item-section>
          </q-item>

          <q-item
            clickable
            exact
            :to="{ name: 'produtor-perfil' }"
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
  background: #fff7ed;
  color: #f97316;
}

.menu-ativo {
  background: #fff1e6;
  color: #f97316;
  font-weight: 700;
}
</style>