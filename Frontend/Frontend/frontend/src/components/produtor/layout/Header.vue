<template>
  <div class="header-produtor">
    <!-- IDENTIDADE -->

    <div class="header-identidade">
      <img
        :src="logoAvicola"
        alt="Avícola Pinhal"
        class="logo-avicola"
      />

      <div class="header-boas-vindas">
        Bem-vindo, {{ primeiroNome }}
      </div>

      <div class="header-subtitulo">
        Portal do Produtor
      </div>
    </div>

    <!-- AÇÕES -->

    <div class="header-acoes">
      <q-btn
        outline
        no-caps
        :color="modoEscuro ? 'orange' : 'dark'"
        icon="assessment"
        label="Relatórios"
        :to="{ name: 'produtor-relatorios' }"
      />

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

      <div class="propriedade-dados">
        <div class="propriedade-nome">
          Fazenda Boa Vista
        </div>

        <div class="propriedade-local">
          Chapecó - SC
        </div>
      </div>

      <q-btn
        flat
        round
        class="q-pa-none"
      >
        <q-avatar
          :color="modoEscuro ? 'grey-9' : 'grey-3'"
          :text-color="modoEscuro ? 'orange' : 'dark'"
        >
          {{ iniciais }}
        </q-avatar>

        <q-menu>
          <q-list style="min-width: 220px">
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
              v-close-popup
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

import logoAvicola from
  'src/assets/logo/logo-avicola-pinhal.png'

const router = useRouter()
const auth = useAuthStore()

const {
  modoEscuro,
  iconeTema,
  textoTema,
  alternarTema
} = useTheme()

const primeiroNome = computed(() => {
  if (!auth.nomeUsuario) {
    return 'Produtor'
  }

  return auth.nomeUsuario
    .trim()
    .split(/\s+/)[0]
})

const iniciais = computed(() => {
  if (!auth.nomeUsuario) {
    return '?'
  }

  return auth.nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(nome => nome[0])
    .join('')
    .toUpperCase()
})

async function sair() {
  auth.logout()
  await router.replace('/')
}
</script>

<style scoped>
.header-produtor {
  min-height: 112px;

  padding: 12px 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 30px;

  border-bottom: 1px solid #eaecf0;

  background: #ffffff;

  transition:
    background 0.25s,
    border-color 0.25s;
}

/* IDENTIDADE */

.header-identidade {
  width: 250px;

  flex-shrink: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
}

/* AGORA A IMAGEM NÃO É CORTADA */

.logo-avicola {
  display: block;

  width: 230px;
  max-width: 100%;

  height: auto;

  margin-bottom: 3px;

  object-fit: contain;
}

.header-boas-vindas {
  width: 100%;

  color: #101828;

  font-size: 17px;
  font-weight: 800;

  line-height: 1.2;

  text-align: center;
}

.header-subtitulo {
  width: 100%;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 11px;
  font-weight: 500;

  text-align: center;
}

/* AÇÕES */

.header-acoes {
  display: flex;
  align-items: center;

  gap: 14px;
}

/* PROPRIEDADE */

.propriedade-dados {
  text-align: right;
}

.propriedade-nome {
  color: #101828;

  font-size: 14px;
  font-weight: 700;
}

.propriedade-local {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 12px;
}

/* DARK */

.body--dark .header-produtor {
  border-bottom-color: #2b2f36;

  background: #16191f;
}

.body--dark .header-boas-vindas,
.body--dark .propriedade-nome {
  color: #f9fafb;
}

.body--dark .header-subtitulo,
.body--dark .propriedade-local {
  color: #98a2b3;
}

@media (max-width: 1200px) {
  .header-produtor {
    padding:
      12px
      22px;
  }

  .header-identidade {
    width: 220px;
  }

  .logo-avicola {
    width: 205px;
  }

  .header-acoes {
    gap: 9px;
  }
}

@media (max-width: 1023px) {
  .header-acoes {
    display: none;
  }
}
</style>