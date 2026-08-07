<template>
  <div class="header-tecnico">
    <div>
      <div class="header-titulo">
        Painel do Técnico
      </div>

      <div class="header-subtitulo">
        Gerencie seus chamados e atendimentos.
      </div>
    </div>

    <div class="header-acoes">
      <!-- MODO ESCURO -->
      <q-btn
        flat
        round
        :icon="iconeTema"
        :color="modoEscuro ? 'orange' : 'dark'"
        @click="alternarTema"
      >
        <q-tooltip>
          {{ textoTema }}
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        round
        icon="notifications_none"
        :color="modoEscuro ? 'orange' : 'dark'"
      />

      <q-btn
        flat
        no-caps
        class="usuario-botao"
      >
        <q-avatar
          :color="modoEscuro ? 'grey-9' : 'grey-3'"
          :text-color="modoEscuro ? 'orange' : 'dark'"
        >
          {{ iniciais }}
        </q-avatar>

        <div class="usuario-dados">
          <div class="usuario-nome">
            {{ nomeUsuario }}
          </div>

          <div class="usuario-tipo">
            TÉCNICO
          </div>
        </div>

        <q-icon
          name="keyboard_arrow_down"
          size="18px"
          :color="modoEscuro ? 'grey-5' : 'grey-7'"
        />

        <q-menu
          anchor="bottom right"
          self="top right"
        >
          <q-list style="min-width: 220px">
            <q-item>
              <q-item-section>
                <div class="text-weight-bold">
                  {{ nomeUsuario }}
                </div>

                <div class="text-caption text-grey">
                  {{ authStore.tipoUsuario }}
                </div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item
              clickable
              v-close-popup
              @click="alternarTema"
            >
              <q-item-section avatar>
                <q-icon
                  :name="iconeTema"
                  color="orange"
                />
              </q-item-section>

              <q-item-section>
                {{ textoTema }}
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item
              clickable
              v-close-popup
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
import { useTheme } from 'src/composables/useTheme'

const router = useRouter()
const authStore = useAuthStore()

const {
  modoEscuro,
  iconeTema,
  textoTema,
  alternarTema
} = useTheme()

const nomeUsuario = computed(
  () =>
    authStore.usuario?.nome ||
    'Técnico'
)

const iniciais = computed(() => {
  const partes = nomeUsuario.value
    .trim()
    .split(' ')
    .filter(Boolean)

  return partes
    .slice(0, 2)
    .map(
      (parte) =>
        parte.charAt(0)
    )
    .join('')
    .toUpperCase()
})

async function sair() {
  authStore.logout()

  await router.replace('/')
}
</script>

<style scoped>
.header-tecnico {
  min-height: 94px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 32px;
  border-bottom: 1px solid #eaecf0;
  background: #ffffff;
  transition:
    background 0.25s,
    border-color 0.25s;
}

.header-titulo {
  color: #101828;
  font-size: 25px;
  font-weight: 800;
}

.header-subtitulo {
  margin-top: 3px;
  color: #667085;
  font-size: 14px;
}

.header-acoes {
  display: flex;
  align-items: center;
  gap: 13px;
}

.usuario-botao {
  padding: 4px 6px;
  border-radius: 12px;
}

.usuario-dados {
  margin-left: 10px;
  margin-right: 4px;
  text-align: left;
}

.usuario-nome {
  color: #101828;
  font-size: 14px;
  font-weight: 700;
}

.usuario-tipo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

/* MODO ESCURO */

.body--dark .header-tecnico {
  border-bottom-color: #2b2f36;
  background: #16191f;
}

.body--dark .header-titulo,
.body--dark .usuario-nome {
  color: #f9fafb;
}

.body--dark .header-subtitulo,
.body--dark .usuario-tipo {
  color: #98a2b3;
}

@media (max-width: 700px) {
  .header-tecnico {
    padding: 14px 16px;
  }

  .header-subtitulo,
  .usuario-dados {
    display: none;
  }
}
</style>