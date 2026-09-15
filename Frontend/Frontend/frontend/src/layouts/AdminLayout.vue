<template>
  <q-layout
    view="lHh Lpr lFf"
    class="admin-layout"
    :class="{
      'admin-layout--dark': $q.dark.isActive
    }"
  >
    <!-- ==================================================
         SIDEBAR DESKTOP
    =================================================== -->

    <q-drawer
      v-if="!isMobile"
      v-model="drawerAberto"
      show-if-above
      :width="240"
      bordered
      class="admin-drawer"
    >
      <div class="drawer-conteudo">
        <div>
          <div class="admin-brand">
            <div class="brand-icon">
              <q-icon
                name="admin_panel_settings"
                size="25px"
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

          <nav class="menu-lista">
            <router-link
              :to="{ name: 'admin-dashboard' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="dashboard" size="22px" />
              <span>Dashboard</span>
            </router-link>

            <router-link
              :to="{ name: 'admin-chamados' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="confirmation_number" size="22px" />
              <span>Chamados</span>
            </router-link>

            <router-link
              :to="{ name: 'admin-tecnicos' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="engineering" size="22px" />
              <span>Técnicos</span>
            </router-link>

            <router-link
              :to="{ name: 'admin-produtores' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="agriculture" size="22px" />
              <span>Produtores</span>
            </router-link>

            <router-link
              :to="{ name: 'admin-relatorios' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="assessment" size="22px" />
              <span>Relatórios</span>
            </router-link>

            <router-link
              :to="{ name: 'admin-perfil' }"
              class="menu-item"
              exact-active-class="menu-item--ativo"
            >
              <q-icon name="person" size="22px" />
              <span>Perfil</span>
            </router-link>
          </nav>
        </div>

        <!-- RODAPÉ DA SIDEBAR -->

        <div class="sidebar-rodape">
          <div
            class="usuario-resumo"
            @click="irPara('admin-perfil')"
          >
            <div class="usuario-avatar">
              {{ iniciaisUsuario }}
            </div>

            <div class="usuario-dados">
              <strong>
                {{ nomeUsuario }}
              </strong>

              <span>
                ADMINISTRADOR
              </span>
            </div>

            <q-icon
              name="chevron_right"
              size="18px"
              class="usuario-seta"
            />
          </div>

          <button
            type="button"
            class="rodape-acao"
            @click="alternarTema"
          >
            <q-icon
              :name="
                $q.dark.isActive
                  ? 'light_mode'
                  : 'dark_mode'
              "
              size="21px"
            />

            <span>
              {{
                $q.dark.isActive
                  ? 'Modo claro'
                  : 'Modo escuro'
              }}
            </span>
          </button>

          <button
            type="button"
            class="rodape-acao rodape-acao--sair"
            @click="sair"
          >
            <q-icon
              name="logout"
              size="21px"
            />

            <span>
              Sair do sistema
            </span>
          </button>
        </div>
      </div>
    </q-drawer>

    <!-- ==================================================
         HEADER DESKTOP
         Na dashboard o próprio conteúdo possui o topo.
    =================================================== -->

    <q-header
      v-if="
        !isMobile &&
        route.name !== 'admin-dashboard'
      "
      bordered
      class="admin-header"
    >
      <q-toolbar class="admin-toolbar">
        <div class="header-conteudo">
          <div class="header-detalhe"></div>

          <div>
            <div class="header-titulo">
              {{ tituloPagina }}
            </div>

            <div class="header-subtitulo">
              {{ subtituloPagina }}
            </div>
          </div>
        </div>

        <q-space />

        <div class="header-marca">
          <span class="header-marca-ponto"></span>
          AVIOESTE
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
          <q-icon
            name="confirmation_number"
            size="23px"
          />

          <span>
            Chamados
          </span>
        </button>

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
      typeof authStore.logout ===
      'function'
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

/* =========================================================
   SIDEBAR
========================================================= */

.admin-drawer {
  background: #ffffff;
}

.drawer-conteudo {
  min-height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 28px 20px 20px;
}

.admin-brand {
  display: flex;
  align-items: center;

  gap: 13px;

  padding: 4px 8px 32px;
}

.brand-icon {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 15px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9500,
      #f97316
    );

  box-shadow:
    0 8px 18px
    rgba(249, 115, 22, 0.18);
}

.brand-nome {
  color: #101828;

  font-size: 20px;
  font-weight: 900;
}

.brand-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;
  font-weight: 600;
}

.menu-lista {
  display: flex;
  flex-direction: column;

  gap: 7px;
}

.menu-item {
  min-height: 52px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 0 14px;

  border-radius: 13px;

  color: #475467;

  text-decoration: none;

  font-size: 13px;
  font-weight: 700;

  transition:
    color 0.18s ease,
    background 0.18s ease;
}

.menu-item:hover {
  color: #f97316;
  background: #fff7ed;
}

.menu-item--ativo {
  color: #f97316;

  background: #fff1e6;

  box-shadow:
    inset 3px 0 0 #f97316;
}

/* RODAPÉ */

.sidebar-rodape {
  padding-top: 16px;

  border-top: 1px solid #eaecf0;
}

.usuario-resumo {
  display: grid;

  grid-template-columns:
    42px
    minmax(0, 1fr)
    18px;

  align-items: center;

  gap: 10px;

  margin-bottom: 8px;
  padding: 9px 10px;

  border-radius: 12px;

  background: #f9fafb;

  cursor: pointer;
}

.usuario-avatar {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #17233c;

  background: #ffedd5;

  font-size: 14px;
  font-weight: 900;
}

.usuario-dados {
  min-width: 0;
}

.usuario-dados strong {
  display: block;

  overflow: hidden;

  color: #101828;

  font-size: 10px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.usuario-dados span {
  display: block;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;
  font-weight: 800;

  letter-spacing: 0.6px;
}

.usuario-seta {
  color: #98a2b3;
}

.rodape-acao {
  width: 100%;
  min-height: 42px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 11px;

  border: 0;
  border-radius: 10px;

  color: #667085;

  background: transparent;

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  text-align: left;

  cursor: pointer;
}

.rodape-acao:hover {
  color: #f97316;
  background: #fff7ed;
}

.rodape-acao--sair:hover {
  color: #d92d20;
  background: #fef3f2;
}

/* =========================================================
   HEADER DESKTOP
========================================================= */

.admin-header {
  color: #101828;

  background:
    linear-gradient(
      90deg,
      #ffffff 0%,
      #ffffff 72%,
      #fffaf5 100%
    );
}

.admin-toolbar {
  min-height: 68px;

  padding: 0 24px;
}

.header-conteudo {
  display: flex;
  align-items: center;

  gap: 11px;
}

.header-detalhe {
  width: 4px;
  height: 36px;

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      #ff9d1f,
      #f97316
    );
}

.header-titulo {
  color: #17233c;

  font-size: 20px;
  font-weight: 900;

  line-height: 1.1;
}

.header-subtitulo {
  margin-top: 3px;

  color: #667085;

  font-size: 10px;
}

.header-marca {
  display: flex;
  align-items: center;

  gap: 7px;

  color: #98a2b3;

  font-size: 8px;
  font-weight: 900;

  letter-spacing: 1.5px;
}

.header-marca-ponto {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #f97316;

  box-shadow:
    0 0 0 4px
    rgba(249, 115, 22, 0.12);
}

/* =========================================================
   MOBILE
========================================================= */

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

  min-height: 58px;

  display: grid;

  grid-template-columns:
    54px
    minmax(0, 1fr)
    54px;

  align-items: center;

  padding:
    calc(
      6px +
      env(safe-area-inset-top)
    )
    8px
    7px;

  border-bottom: 1px solid #eaecf0;

  background:
    rgba(255, 255, 255, 0.97);

  backdrop-filter: blur(12px);
}

.mobile-header--dashboard {
  min-height: 78px;
}

.mobile-header__lado {
  width: 54px;
}

.mobile-header__lado--direita {
  display: flex;
  justify-content: flex-end;
}

.mobile-header__centro {
  min-width: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
}

.mobile-logo-avicola {
  width: 150px;
  max-width: 100%;

  height: auto;

  object-fit: contain;
}

.mobile-header__portal {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 9px;
  font-weight: 600;
}

.mobile-header__titulo {
  color: #101828;

  font-size: 16px;
  font-weight: 800;

  text-align: center;
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

/* =========================================================
   DARK
========================================================= */

.admin-layout--dark {
  background: #0d0f12;
}

.admin-layout--dark .admin-drawer,
.admin-layout--dark .admin-header {
  border-color: #2b2f36;

  background: #15181d;
}

.admin-layout--dark .brand-nome,
.admin-layout--dark .usuario-dados strong,
.admin-layout--dark .header-titulo {
  color: #f9fafb;
}

.admin-layout--dark .menu-item {
  color: #cbd5e1;
}

.admin-layout--dark .menu-item:hover {
  color: #fb923c;
  background: #1b1f25;
}

.admin-layout--dark .menu-item--ativo {
  color: #fb923c;

  background: #292018;

  box-shadow:
    inset 3px 0 0 #f97316;
}

.admin-layout--dark .sidebar-rodape {
  border-color: #2b2f36;
}

.admin-layout--dark .usuario-resumo {
  background: #1b1f25;
}

.admin-layout--dark .rodape-acao {
  color: #cbd5e1;
}

.admin-layout--dark .admin-header {
  background:
    linear-gradient(
      90deg,
      #16191f 0%,
      #16191f 72%,
      #1f1b18 100%
    );
}

.admin-layout--dark .mobile-header {
  border-color: #2b2f36;

  background:
    rgba(22, 25, 31, 0.96);
}

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
