<template>
  <q-layout
    view="lHh Lpr lFf"
    class="admin-layout"
    :class="{
      'admin-layout--dark': $q.dark.isActive
    }"
  >
    <!-- ==================================================
         DESKTOP - MENU LATERAL
    =================================================== -->

    <q-drawer
      v-if="!isMobile"
      v-model="drawerAberto"
      show-if-above
      :width="270"
      bordered
      class="admin-drawer"
    >
      <div class="drawer-conteudo">
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

        <div class="menu-titulo">
          MENU PRINCIPAL
        </div>

        <nav class="menu-lista">
          <router-link
            :to="{ name: 'admin-dashboard' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="dashboard" size="22px" />
            <span>Dashboard</span>
          </router-link>

          <router-link
            :to="{ name: 'admin-chamados' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="confirmation_number" size="22px" />
            <span>Chamados</span>
          </router-link>

          <router-link
            :to="{ name: 'admin-tecnicos' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="engineering" size="22px" />
            <span>Técnicos</span>
          </router-link>

          <router-link
            :to="{ name: 'admin-produtores' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="agriculture" size="22px" />
            <span>Produtores</span>
          </router-link>

          <router-link
            :to="{ name: 'admin-relatorios' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="assessment" size="22px" />
            <span>Relatórios</span>
          </router-link>

          <router-link
            :to="{ name: 'admin-perfil' }"
            class="menu-item"
            active-class="menu-item--ativo"
          >
            <q-icon name="person" size="22px" />
            <span>Perfil</span>
          </router-link>
        </nav>
      </div>
    </q-drawer>

    <!-- ==================================================
         HEADER DESKTOP
    =================================================== -->

    <q-header
      v-if="!isMobile"
      bordered
      class="admin-header"
    >
      <q-toolbar class="admin-toolbar">
        <div>
          <div class="header-titulo">
            {{ tituloPagina }}
          </div>

          <div class="header-subtitulo">
            {{ subtituloPagina }}
          </div>
        </div>

        <q-space />

        <div class="header-acoes">
          <q-btn
            flat
            round
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            @click="alternarTema"
          />

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
          </q-btn>

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
            />

            <q-menu>
              <q-list style="min-width: 220px">
                <q-item>
                  <q-item-section>
                    <div class="text-weight-bold">
                      {{ nomeUsuario }}
                    </div>

                    <div class="text-caption text-grey">
                      Administrador
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item
                  clickable
                  v-close-popup
                  @click="irPara('admin-perfil')"
                >
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>

                  <q-item-section>
                    Perfil
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item
                  clickable
                  v-close-popup
                  class="text-negative"
                  @click="sair"
                >
                  <q-item-section avatar>
                    <q-icon
                      name="logout"
                      color="negative"
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

    <!-- ==================================================
         CONTEÚDO
    =================================================== -->

    <q-page-container>
      <!-- HEADER MOBILE -->

      <div
        v-if="isMobile"
        class="mobile-header"
        :class="{
          'mobile-header--dashboard':
            route.name === 'admin-dashboard'
        }"
      >
        <div class="mobile-header__lado"></div>

        <div class="mobile-header__centro">
          <template
            v-if="route.name === 'admin-dashboard'"
          >
            <img
              :src="logoAvicola"
              alt="Avícola Pinhal"
              class="mobile-logo-avicola"
            />

            <div class="mobile-header__boas-vindas">
              Bem-vindo, {{ primeiroNome }}
            </div>

            <div class="mobile-header__portal">
              Painel Administrativo
            </div>
          </template>

          <template v-else>
            <div class="mobile-header__titulo">
              {{ tituloPagina }}
            </div>
          </template>
        </div>

        <div
          class="
            mobile-header__lado
            mobile-header__lado--direita
          "
        >
          <q-btn
            flat
            round
            dense
            icon="notifications_none"
            class="mobile-header__acao"
          />

          <q-btn
            flat
            round
            dense
            icon="logout"
            class="mobile-header__sair"
            @click="sair"
          >
            <q-tooltip>
              Sair
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div
        :class="{
          'conteudo-mobile': isMobile
        }"
      >
        <router-view />
      </div>
    </q-page-container>

    <!-- ==================================================
         MENU INFERIOR MOBILE
    =================================================== -->

    <q-footer
      v-if="isMobile"
      class="mobile-footer"
    >
      <div class="mobile-nav">
        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'admin-dashboard'
          }"
          @click="irPara('admin-dashboard')"
        >
          <q-icon name="dashboard" size="23px" />
          <span>Início</span>
        </button>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'admin-chamados'
          }"
          @click="irPara('admin-chamados')"
        >
          <q-icon name="confirmation_number" size="23px" />
          <span>Chamados</span>
        </button>

        <!-- GESTÃO -->

        <div class="mobile-nav__novo-container">
          <button
            type="button"
            class="mobile-nav__novo"
            :class="{
              'mobile-nav__novo--ativo':
                ehRotaGestao
            }"
            @click="gestaoAberta = true"
          >
            <q-icon
              name="groups"
              size="27px"
            />
          </button>

          <span class="mobile-nav__novo-label">
            Gestão
          </span>
        </div>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'admin-relatorios'
          }"
          @click="irPara('admin-relatorios')"
        >
          <q-icon name="bar_chart" size="23px" />
          <span>Relatórios</span>
        </button>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'admin-perfil'
          }"
          @click="irPara('admin-perfil')"
        >
          <q-icon name="person" size="23px" />
          <span>Perfil</span>
        </button>
      </div>
    </q-footer>

    <!-- ==================================================
         GESTÃO MOBILE
    =================================================== -->

    <q-dialog
      v-model="gestaoAberta"
      position="bottom"
    >
      <q-card class="gestao-card">
        <div class="gestao-puxador"></div>

        <div class="gestao-titulo">
          Gestão
        </div>

        <div class="gestao-subtitulo">
          Escolha o que deseja gerenciar.
        </div>

        <q-list class="q-mt-md">
          <q-item
            clickable
            v-close-popup
            class="gestao-item"
            @click="irPara('admin-tecnicos')"
          >
            <q-item-section avatar>
              <q-icon
                name="engineering"
                color="orange"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                Técnicos
              </q-item-label>

              <q-item-label caption>
                Gerenciar equipe técnica
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            class="gestao-item"
            @click="irPara('admin-produtores')"
          >
            <q-item-section avatar>
              <q-icon
                name="agriculture"
                color="orange"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                Produtores
              </q-item-label>

              <q-item-label caption>
                Consultar produtores
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
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

import logoAvicola from
  'src/assets/logo/logo-avicola-pinhal.png'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const drawerAberto = ref(true)
const gestaoAberta = ref(false)

const isMobile =
  computed(() =>
    $q.screen.lt.md
  )

const nomeUsuario =
  computed(() =>
    authStore.usuario?.nome ||
    authStore.nomeUsuario ||
    'Administrador'
  )

const primeiroNome =
  computed(() =>
    nomeUsuario.value
      .trim()
      .split(/\s+/)[0]
  )

const iniciaisUsuario =
  computed(() => {
    const partes =
      nomeUsuario.value
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (!partes.length) {
      return 'AD'
    }

    if (partes.length === 1) {
      return partes[0]
        .substring(0, 2)
        .toUpperCase()
    }

    return (
      partes[0][0] +
      partes[partes.length - 1][0]
    ).toUpperCase()
  })

const ehRotaGestao =
  computed(() =>
    [
      'admin-tecnicos',
      'admin-produtores'
    ].includes(route.name)
  )

const tituloPagina =
  computed(() => {
    switch (route.name) {
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
        return 'Meu perfil'

      default:
        return 'Painel Administrativo'
    }
  })

const subtituloPagina =
  computed(() => {
    switch (route.name) {
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

async function irPara(nomeRota) {
  gestaoAberta.value = false

  if (route.name === nomeRota) {
    return
  }

  await router.push({
    name: nomeRota
  })
}

function alternarTema() {
  $q.dark.set(
    !$q.dark.isActive
  )

  localStorage.setItem(
    'tema-escuro',
    String($q.dark.isActive)
  )
}

async function sair() {
  try {
    if (
      typeof authStore.logout === 'function'
    ) {
      await authStore.logout()
    }
  } catch (error) {
    console.error(
      'Erro ao encerrar sessão:',
      error
    )
  } finally {
    localStorage.removeItem('usuario')
    localStorage.removeItem('user')
    localStorage.removeItem('authUser')
    localStorage.removeItem('token')

    await router.replace('/')
  }
}
</script>

<style scoped>
.admin-layout {
  background: #f5f6f8;
}

/* DESKTOP */

.admin-drawer {
  background: #ffffff;
}

.drawer-conteudo {
  min-height: 100%;
  padding: 25px 18px;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 8px 28px;
}

.brand-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9500,
      #f97316
    );
}

.brand-nome {
  color: #101828;
  font-size: 20px;
  font-weight: 900;
}

.brand-subtitulo {
  color: #98a2b3;
  font-size: 10px;
  font-weight: 600;
}

.menu-titulo {
  padding: 0 12px 10px;

  color: #98a2b3;

  font-size: 9px;
  font-weight: 800;
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

  padding: 0 14px;

  border-radius: 12px;

  color: #475467;

  text-decoration: none;

  font-size: 13px;
  font-weight: 700;
}

.menu-item:hover {
  color: #f97316;
  background: #fff7ed;
}

.menu-item--ativo {
  color: #f97316;
  background: #fff1e6;
}

.admin-header {
  color: #101828;
  background: #ffffff;
}

.admin-toolbar {
  min-height: 78px;
  padding: 0 30px;
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

.header-usuario {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-left: 7px;

  padding: 4px 5px 4px 15px;

  border: 0;
  border-left: 1px solid #eaecf0;

  color: inherit;
  background: transparent;

  cursor: pointer;
}

.header-usuario-texto {
  text-align: right;
}

.header-usuario-texto strong {
  display: block;

  color: #344054;

  font-size: 11px;
}

.header-usuario-texto span {
  display: block;

  color: #98a2b3;

  font-size: 9px;
}

.header-avatar {
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

/* MOBILE */

.conteudo-mobile {
  min-height: 100vh;

  padding-bottom:
    calc(
      82px +
      env(safe-area-inset-bottom)
    );

  background: #f7f8fa;
}

.mobile-header {
  position: sticky;
  top: 0;

  z-index: 1000;

  min-height: 60px;

  display: grid;

  grid-template-columns:
    76px
    minmax(0, 1fr)
    76px;

  align-items: center;

  gap: 4px;

  padding:
    calc(
      7px +
      env(safe-area-inset-top)
    )
    8px
    8px;

  border-bottom: 1px solid #eaecf0;

  background:
    rgba(255, 255, 255, 0.97);

  backdrop-filter: blur(12px);
}

.mobile-header--dashboard {
  min-height: 110px;
}

.mobile-header__lado {
  width: 76px;

  display: flex;
  align-items: center;
}

.mobile-header__lado--direita {
  justify-content: flex-end;
  gap: 0;
}

.mobile-header__centro {
  min-width: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
}

.mobile-logo-avicola {
  display: block;

  width: 175px;
  max-width: 100%;

  height: auto;

  margin-bottom: 3px;

  object-fit: contain;
}

.mobile-header__boas-vindas {
  color: #101828;

  font-size: 16px;
  font-weight: 800;

  line-height: 1.15;

  text-align: center;

  white-space: nowrap;
}

.mobile-header__portal {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;
  font-weight: 500;

  text-align: center;
}

.mobile-header__titulo {
  color: #101828;

  font-size: 16px;
  font-weight: 800;

  text-align: center;
}

.mobile-header__acao {
  color: #344054;
}

.mobile-header__sair {
  color: #d92d20;
}

/* FOOTER */

.mobile-footer {
  z-index: 1100;

  color: #344054;

  background: transparent;
}

.mobile-nav {
  position: relative;

  min-height: 70px;

  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  align-items: center;

  padding:
    6px
    5px
    calc(
      6px +
      env(safe-area-inset-bottom)
    );

  border-top: 1px solid #eaecf0;

  background:
    rgba(255, 255, 255, 0.97);

  box-shadow:
    0 -6px 22px
    rgba(16, 24, 40, 0.06);
}

.mobile-nav__item {
  min-width: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 3px;

  padding: 5px 2px;

  border: 0;

  color: #98a2b3;
  background: transparent;

  font-family: inherit;

  cursor: pointer;
}

.mobile-nav__item span {
  font-size: 9px;
  font-weight: 700;
}

.mobile-nav__item--ativo {
  color: #f97316;
}

.mobile-nav__novo-container {
  position: relative;

  height: 58px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: flex-end;
}

.mobile-nav__novo {
  position: absolute;

  top: -26px;

  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 5px solid #ffffff;

  border-radius: 50%;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9a1f,
      #f97316
    );

  box-shadow:
    0 8px 18px
    rgba(249, 115, 22, 0.28);

  cursor: pointer;
}

.mobile-nav__novo-label {
  color: #f97316;

  font-size: 9px;
  font-weight: 800;
}

/* GESTÃO */

.gestao-card {
  width: 100%;

  padding:
    10px
    16px
    calc(
      20px +
      env(safe-area-inset-bottom)
    );

  border-radius: 22px 22px 0 0;
}

.gestao-puxador {
  width: 42px;
  height: 4px;

  margin: 0 auto 18px;

  border-radius: 10px;

  background: #d0d5dd;
}

.gestao-titulo {
  color: #101828;

  font-size: 20px;
  font-weight: 800;
}

.gestao-subtitulo {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 12px;
}

.gestao-item {
  min-height: 68px;
  border-radius: 13px;
}

/* DARK */

.admin-layout--dark {
  background: #0d0f12;
}

.admin-layout--dark .admin-drawer,
.admin-layout--dark .admin-header {
  background: #15181d;
}

.admin-layout--dark .mobile-header {
  border-color: #2b2f36;

  background:
    rgba(22, 25, 31, 0.96);
}

.admin-layout--dark .mobile-header__boas-vindas,
.admin-layout--dark .mobile-header__titulo {
  color: #f9fafb;
}

.admin-layout--dark .mobile-nav {
  border-color: #2b2f36;

  background:
    rgba(22, 25, 31, 0.97);
}

.admin-layout--dark .mobile-nav__novo {
  border-color: #16191f;
}

.admin-layout--dark .conteudo-mobile {
  background: #0d0f12;
}
</style>