<template>
  <div class="header-produtor">
    <div>
      <div class="text-h5 text-weight-bold">
        Painel do Produtor
      </div>

      <div class="text-grey-7">
        Bem-vindo de volta, João da Silva.
      </div>
    </div>

    <div class="header-acoes">
      <q-btn
        outline
        color="dark"
        icon="assessment"
        label="Relatórios"
      />

      <q-btn
        flat
        round
        icon="notifications_none"
      />

      <div class="text-right">
        <div class="text-weight-bold">
          Fazenda Boa Vista
        </div>

        <div class="text-grey-6 text-caption">
          Chapecó - SC
        </div>
      </div>

      <q-avatar color="grey-3" text-color="dark">
        JD
      </q-avatar>

      <div>
        <div class="text-weight-bold">
          João da Silva
        </div>

        <div class="text-caption text-grey">
          PRODUTOR
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-produtor {
  min-height: 92px;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid #eaecf0;
  background: #ffffff;
}

.header-acoes {
  display: flex;
  align-items: center;
  gap: 18px;
}

@media (max-width: 1023px) {
  .header-produtor {
    padding: 20px;
  }

  .header-acoes {
    display: none;
  }
}
</style>