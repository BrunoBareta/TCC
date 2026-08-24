<template>
  <q-layout
    view="lHh Lpr lFf"
    class="admin-layout"
    :class="{
      'admin-layout--dark': $q.dark.isActive
    }"
  >
    <!-- =========================
         MENU LATERAL
    ========================== -->

    <q-drawer
      v-model="drawerAberto"
      show-if-above
      :width="270"
      :breakpoint="900"
      bordered
      class="admin-drawer"
    >
      <div class="drawer-conteudo">
        <!-- LOGO / IDENTIDADE -->

        <div class="admin-brand">
          <div class="brand-icon">
            <q-icon
              name="admin_panel_settings"
              size="27px"
            />
          </div>

          <div>
            <div class="brand-nome">
              Avioeste
            </div>

            <div class="brand-subtitulo">
              Painel Administrativo
            </div>
          </div>
        </div>

        <!-- TÍTULO DO MENU -->

        <div class="menu-titulo">
          MENU PRINCIPAL
        </div>

        <!-- MENU -->

        <nav class="menu-lista">
          <router-link
            :to="{ name: 'admin-dashboard' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="dashboard"
              size="22px"
            />

            <span>
              Dashboard
            </span>
          </router-link>

          <router-link
            :to="{ name: 'admin-chamados' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="confirmation_number"
              size="22px"
            />

            <span>
              Chamados
            </span>
          </router-link>

          <router-link
            :to="{ name: 'admin-tecnicos' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="engineering"
              size="22px"
            />

            <span>
              Técnicos
            </span>
          </router-link>

          <router-link
            :to="{ name: 'admin-produtores' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="agriculture"
              size="22px"
            />

            <span>
              Produtores
            </span>
          </router-link>

          <!-- RELATÓRIOS -->

          <router-link
            :to="{ name: 'admin-relatorios' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="assessment"
              size="22px"
            />

            <span>
              Relatórios
            </span>
          </router-link>

          <router-link
            :to="{ name: 'admin-perfil' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon
              name="person"
              size="22px"
            />

            <span>
              Perfil
            </span>
          </router-link>
        </nav>
      </div>
    </q-drawer>

    <!-- =========================
         CABEÇALHO
    ========================== -->

    <q-header
      bordered
      class="admin-header"
    >
      <q-toolbar class="admin-toolbar">
        <!-- MENU MOBILE -->

        <q-btn
          flat
          round
          dense
          icon="menu"
          class="menu-mobile"
          @click="drawerAberto = !drawerAberto"
        />

        <!-- TÍTULO -->

        <div class="header-titulo-area">
          <div class="header-titulo">
            {{ tituloPagina }}
          </div>

          <div class="header-subtitulo">
            {{ subtituloPagina }}
          </div>
        </div>

        <q-space />

        <!-- AÇÕES -->

        <div class="header-acoes">
          <!-- MODO ESCURO -->

          <q-btn
            flat
            round
            :icon="
              $q.dark.isActive
                ? 'light_mode'
                : 'dark_mode'
            "
            @click="alternarTema"
          >
            <q-tooltip>
              {{
                $q.dark.isActive
                  ? 'Modo claro'
                  : 'Modo escuro'
              }}
            </q-tooltip>
          </q-btn>

          <!-- NOTIFICAÇÕES -->

          <q-btn
            flat
            round
            icon="notifications_none"
          >
            <q-badge
              floating
              color="red"
              rounded
            />

            <q-tooltip>
              Notificações
            </q-tooltip>
          </q-btn>

          <!-- USUÁRIO -->

          <button
            type="button"
            class="header-usuario"
          >
            <div class="header-usuario-texto">
              <strong>
                {{ nomeUsuario }}
              </strong>

              <span>
                Administrador
              </span>
            </div>

            <div class="header-avatar">
              {{ iniciaisUsuario }}
            </div>

            <q-icon
              name="keyboard_arrow_down"
              size="19px"
              class="usuario-seta"
            />

            <!-- MENU DO USUÁRIO -->

            <q-menu
              anchor="bottom right"
              self="top right"
              :offset="[0, 10]"
              class="usuario-menu"
            >
              <q-list
                class="usuario-menu-lista"
              >
                <!-- CABEÇALHO -->

                <q-item
                  class="usuario-menu-cabecalho"
                >
                  <q-item-section avatar>
                    <div class="menu-avatar">
                      {{ iniciaisUsuario }}
                    </div>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                      class="menu-usuario-nome"
                    >
                      {{ nomeUsuario }}
                    </q-item-label>

                    <q-item-label caption>
                      Administrador
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <!-- PERFIL -->

                <q-item
                  clickable
                  v-close-popup
                  @click="irParaPerfil"
                >
                  <q-item-section avatar>
                    <q-icon
                      name="person_outline"
                      size="20px"
                    />
                  </q-item-section>

                  <q-item-section>
                    Meu perfil
                  </q-item-section>
                </q-item>

                <q-separator />

                <!-- SAIR -->

                <q-item
                  clickable
                  v-close-popup
                  class="menu-sair"
                  @click="sair"
                >
                  <q-item-section avatar>
                    <q-icon
                      name="logout"
                      size="20px"
                    />
                  </q-item-section>

                  <q-item-section>
                    Sair
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </button>
        </div>
      </q-toolbar>
    </q-header>

    <!-- =========================
         CONTEÚDO
    ========================== -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  computed,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  useAuthStore
} from 'src/stores/auth'

const $q =
  useQuasar()

const route =
  useRoute()

const router =
  useRouter()

const authStore =
  useAuthStore()

const drawerAberto =
  ref(true)

/* =========================
   USUÁRIO
========================= */

const nomeUsuario =
  computed(() => {
    return (
      authStore.usuario?.nome ||
      'Administrador'
    )
  })

const iniciaisUsuario =
  computed(() => {
    const partes =
      nomeUsuario.value
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (
      partes.length === 0
    ) {
      return 'AD'
    }

    if (
      partes.length === 1
    ) {
      return partes[0]
        .substring(
          0,
          2
        )
        .toUpperCase()
    }

    return (
      partes[0][0] +
      partes[
        partes.length - 1
      ][0]
    ).toUpperCase()
  })

/* =========================
   TÍTULO DA PÁGINA
========================= */

const tituloPagina =
  computed(() => {
    switch (
      route.name
    ) {
      case 'admin-dashboard':
        return 'Dashboard'

      case 'admin-chamados':
        return 'Chamados'

      case 'admin-tecnicos':
        return 'Técnicos'

      case 'admin-produtores':
        return 'Produtores'

      case 'admin-relatorios':
        return 'Relatórios'

      case 'admin-perfil':
        return 'Meu Perfil'

      default:
        return 'Painel Administrativo'
    }
  })

const subtituloPagina =
  computed(() => {
    switch (
      route.name
    ) {
      case 'admin-dashboard':
        return 'Visão geral do sistema de atendimentos.'

      case 'admin-chamados':
        return 'Acompanhe todos os chamados registrados.'

      case 'admin-tecnicos':
        return 'Gerencie os técnicos da equipe.'

      case 'admin-produtores':
        return 'Consulte os produtores cadastrados.'

      case 'admin-relatorios':
        return 'Consulte os atendimentos e gere relatórios administrativos.'

      case 'admin-perfil':
        return 'Gerencie as informações da sua conta.'

      default:
        return 'Administração do sistema Avioeste.'
    }
  })

/* =========================
   TEMA
========================= */

function alternarTema() {
  $q.dark.set(
    !$q.dark.isActive
  )

  localStorage.setItem(
    'tema-escuro',
    String(
      $q.dark.isActive
    )
  )
}

/* =========================
   PERFIL
========================= */

async function irParaPerfil() {
  if (
    route.name ===
    'admin-perfil'
  ) {
    return
  }

  await router.push({
    name:
      'admin-perfil'
  })
}

/* =========================
   SAIR
========================= */

async function sair() {
  try {
    if (
      typeof authStore.logout ===
      'function'
    ) {
      await authStore.logout()
    } else {
      localStorage.removeItem(
        'usuario'
      )

      localStorage.removeItem(
        'token'
      )
    }

    await router.replace({
      name:
        'login'
    })
  } catch (error) {
    console.error(
      'Erro ao sair:',
      error
    )

    localStorage.removeItem(
      'usuario'
    )

    localStorage.removeItem(
      'token'
    )

    await router.replace({
      name:
        'login'
    })
  }
}
</script>

<style scoped>
/* =========================
   BASE
========================= */

.admin-layout {
  background: #f5f6f8;
}

/* =========================
   DRAWER
========================= */

.admin-drawer {
  background: #ffffff;
}

.drawer-conteudo {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 25px 18px;
}

/* =========================
   LOGO
========================= */

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding:
    5px 8px 28px;
}

.brand-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 14px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9500,
      #f97316
    );

  box-shadow:
    0 5px 16px
    rgba(
      249,
      115,
      22,
      0.22
    );
}

.brand-nome {
  color: #101828;
  font-size: 20px;
  font-weight: 900;
}

.brand-subtitulo {
  margin-top: 1px;
  color: #98a2b3;
  font-size: 10px;
  font-weight: 600;
}

/* =========================
   MENU
========================= */

.menu-titulo {
  padding:
    0 12px 10px;

  color: #98a2b3;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.menu-lista {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  min-height: 48px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding:
    0 14px;

  border-radius: 12px;

  color: #475467;

  text-decoration: none;

  font-size: 13px;
  font-weight: 700;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.menu-item:hover {
  color: #f97316;
  background: #fff7ed;
}

.menu-item--ativo {
  color: #f97316;
  background: #fff1e6;
}

/* =========================
   HEADER
========================= */

.admin-header {
  color: #101828;
  background: #ffffff;
}

.admin-toolbar {
  min-height: 78px;

  padding:
    0 30px;
}

.menu-mobile {
  display: none;
  margin-right: 8px;
}

.header-titulo {
  color: #101828;
  font-size: 20px;
  font-weight: 900;
}

.header-subtitulo {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 10px;
}

.header-acoes {
  display: flex;
  align-items: center;
  gap: 7px;
}

/* =========================
   USUÁRIO
========================= */

.header-usuario {
  appearance: none;

  display: flex;
  align-items: center;

  gap: 9px;

  margin-left: 7px;

  padding:
    4px 5px 4px 15px;

  border: none;

  border-left:
    1px solid #eaecf0;

  color: inherit;
  background: transparent;

  cursor: pointer;

  font-family: inherit;
  text-align: left;
}

.header-usuario:hover
.header-avatar {
  box-shadow:
    0 0 0 4px
    #fff7ed;
}

.header-usuario-texto {
  text-align: right;
}

.header-usuario-texto strong {
  display: block;

  max-width: 190px;

  overflow: hidden;

  color: #344054;

  font-size: 11px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-usuario-texto span {
  display: block;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 9px;
}

.header-avatar {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: #f97316;
  background: #fff1e6;

  font-size: 12px;
  font-weight: 900;

  transition:
    box-shadow 0.2s ease;
}

.usuario-seta {
  color: #667085;
}

/* =========================
   MENU DO USUÁRIO
========================= */

.usuario-menu-lista {
  min-width: 240px;

  padding:
    6px;
}

.usuario-menu-cabecalho {
  min-height: 66px;

  cursor: default;
}

.menu-avatar {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #f97316;
  background: #fff1e6;

  font-size: 12px;
  font-weight: 900;
}

.menu-usuario-nome {
  max-width: 150px;

  overflow: hidden;

  font-size: 12px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-sair {
  color: #d92d20;
}

/* =========================
   DARK MODE
========================= */

.admin-layout--dark {
  background: #0d0f12;
}

.admin-layout--dark
.admin-drawer {
  background: #15181d;
}

.admin-layout--dark
.admin-header {
  color: #f9fafb;
  background: #15181d;
}

.admin-layout--dark
.brand-nome,
.admin-layout--dark
.header-titulo {
  color: #f9fafb;
}

.admin-layout--dark
.menu-item {
  color: #d0d5dd;
}

.admin-layout--dark
.menu-item:hover {
  color: #fb923c;
  background: #292018;
}

.admin-layout--dark
.menu-item--ativo {
  color: #fb923c;
  background: #332217;
}

.admin-layout--dark
.header-usuario {
  border-color: #292d33;
}

.admin-layout--dark
.header-usuario-texto strong {
  color: #f2f4f7;
}

.admin-layout--dark
.header-avatar {
  color: #fb923c;
  background: #332217;
}

.admin-layout--dark
.header-usuario:hover
.header-avatar {
  box-shadow:
    0 0 0 4px
    #292018;
}

/* =========================
   TABLET / MOBILE
========================= */

@media (max-width: 900px) {
  .menu-mobile {
    display: inline-flex;
  }

  .admin-toolbar {
    padding:
      0 18px;
  }

  .header-usuario-texto {
    display: none;
  }

  .header-usuario {
    padding-left: 9px;
  }
}

@media (max-width: 600px) {
  .admin-toolbar {
    min-height: 70px;

    padding:
      0 12px;
  }

  .header-titulo {
    font-size: 17px;
  }

  .header-subtitulo {
    display: none;
  }

  .header-acoes {
    gap: 1px;
  }

  .header-usuario {
    margin-left: 2px;
    padding-left: 7px;
  }

  .header-avatar {
    width: 36px;
    height: 36px;
  }

  .usuario-seta {
    display: none;
  }
}
</style>