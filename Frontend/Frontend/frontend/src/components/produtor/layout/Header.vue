<template>
  <div class="header-produtor">
    <div>
      <div class="text-h5 text-weight-bold">
        Painel do Produtor
      </div>

      <div class="text-grey-7">
        Bem-vindo de volta, {{ auth.nomeUsuario }}.
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

      <q-btn
        flat
        round
        class="q-pa-none"
      >
        <q-avatar color="grey-3" text-color="dark">
          {{ iniciais }}
        </q-avatar>

        <q-menu>
          <q-list style="min-width:220px">

            <q-item>
              <q-item-section>
                <div class="text-weight-bold">
                  {{ auth.nomeUsuario }}
                </div>

                <div class="text-caption text-grey">
                  {{ auth.tipoUsuario }}
                </div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item
              clickable
              :to="{ name: 'produtor-perfil' }"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                Perfil
              </q-item-section>
            </q-item>

            <q-item
              clickable
              @click="sair"
            >
              <q-item-section avatar>
                <q-icon
                  name="logout"
                  color="negative"
                />
              </q-item-section>

              <q-item-section class="text-negative">
                Sair
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const iniciais = computed(() => {
  if (!auth.nomeUsuario) return '?'

  return auth.nomeUsuario
    .split(' ')
    .map(nome => nome[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

function sair () {
  auth.logout()

  router.replace('/')
}
</script>

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