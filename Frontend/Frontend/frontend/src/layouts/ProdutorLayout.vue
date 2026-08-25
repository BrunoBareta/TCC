<template>
  <q-layout view="lHh Lpr lFf">
    <!-- DESKTOP -->

    <Sidebar
      v-if="!isMobile"
    />

    <q-page-container>
      <Header
        v-if="!isMobile"
      />

      <!-- ==================================================
           HEADER MOBILE
      =================================================== -->

      <div
        v-if="isMobile"
        class="mobile-header"
        :class="{
          'mobile-header--dashboard':
            route.name === 'produtor-dashboard'
        }"
      >
        <!-- ESQUERDA -->

        <div class="mobile-header__lado">
          <q-btn
            v-if="mostrarVoltar"
            flat
            round
            dense
            icon="arrow_back"
            class="mobile-header__voltar"
            @click="voltar"
          />
        </div>

        <!-- CENTRO -->

        <div class="mobile-header__centro">
          <template
            v-if="
              route.name ===
              'produtor-dashboard'
            "
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
              Portal do Produtor
            </div>
          </template>

          <template v-else>
            <div class="mobile-header__titulo">
              {{ tituloAtual }}
            </div>
          </template>
        </div>

        <!-- DIREITA -->

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

      <!-- CONTEÚDO -->

      <div
        :class="{
          'conteudo-mobile': isMobile
        }"
      >
        <router-view />
      </div>
    </q-page-container>

    <!-- ==================================================
         MENU INFERIOR
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
              route.name === 'produtor-dashboard'
          }"
          @click="irPara('produtor-dashboard')"
        >
          <q-icon name="dashboard" size="23px" />
          <span>Início</span>
        </button>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              ehRotaChamados
          }"
          @click="irPara('produtor-chamados')"
        >
          <q-icon
            name="confirmation_number"
            size="23px"
          />

          <span>Chamados</span>
        </button>

        <!-- NOVO -->

        <div class="mobile-nav__novo-container">
          <button
            type="button"
            class="mobile-nav__novo"
            @click="irPara('produtor-novo-chamado')"
          >
            <q-icon name="add" size="31px" />
          </button>

          <span class="mobile-nav__novo-label">
            Novo
          </span>
        </div>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'produtor-relatorios'
          }"
          @click="irPara('produtor-relatorios')"
        >
          <q-icon name="bar_chart" size="23px" />
          <span>Relatórios</span>
        </button>

        <button
          type="button"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--ativo':
              route.name === 'produtor-perfil'
          }"
          @click="irPara('produtor-perfil')"
        >
          <q-icon name="person" size="23px" />
          <span>Perfil</span>
        </button>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import {
  computed
} from 'vue'

import {
  useQuasar
} from 'quasar'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  useAuthStore
} from 'src/stores/auth'

import Sidebar from
  'src/components/produtor/layout/Sidebar.vue'

import Header from
  'src/components/produtor/layout/Header.vue'

import logoAvicola from
  'src/assets/logo/logo-avicola-pinhal.png'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobile =
  computed(() =>
    $q.screen.lt.md
  )

/* ==================================================
   USUÁRIO
=================================================== */

const nomeUsuario =
  computed(() => {
    const nomeStore =
      authStore.nomeUsuario ||
      authStore.usuario?.nome

    if (nomeStore) {
      return nomeStore
    }

    try {
      const usuario =
        JSON.parse(
          localStorage.getItem('usuario') ||
          localStorage.getItem('user') ||
          localStorage.getItem('authUser') ||
          '{}'
        )

      return (
        usuario.nome ||
        usuario.nome_usuario ||
        usuario.name ||
        'Produtor'
      )
    } catch {
      return 'Produtor'
    }
  })

const primeiroNome =
  computed(() =>
    nomeUsuario.value
      .trim()
      .split(/\s+/)[0]
  )

/* ==================================================
   TÍTULOS
=================================================== */

const configuracaoRotas = {
  'produtor-dashboard':
    'Início',

  'produtor-chamados':
    'Meus chamados',

  'produtor-detalhes-chamado':
    'Detalhes do chamado',

  'produtor-novo-chamado':
    'Novo chamado',

  'produtor-relatorios':
    'Relatórios',

  'produtor-perfil':
    'Meu perfil'
}

const tituloAtual =
  computed(() =>
    configuracaoRotas[
      route.name
    ] || 'Avioeste'
  )

/* VOLTAR */

const mostrarVoltar =
  computed(() =>
    [
      'produtor-detalhes-chamado',
      'produtor-novo-chamado'
    ].includes(route.name)
  )

function voltar() {
  if (
    route.name ===
    'produtor-novo-chamado'
  ) {
    router.push({
      name: 'produtor-chamados'
    })

    return
  }

  router.back()
}

/* NAVEGAÇÃO */

async function irPara(nomeRota) {
  if (route.name === nomeRota) {
    return
  }

  await router.push({
    name: nomeRota
  })
}

const ehRotaChamados =
  computed(() =>
    [
      'produtor-chamados',
      'produtor-detalhes-chamado'
    ].includes(route.name)
  )

/* ==================================================
   SAIR
=================================================== */

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
.conteudo-mobile {
  min-height: 100vh;

  padding-bottom:
    calc(
      82px +
      env(safe-area-inset-bottom)
    );

  background: #f7f8fa;
}

/* HEADER */

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

  -webkit-backdrop-filter: blur(12px);
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

.mobile-header__voltar,
.mobile-header__acao {
  color: #344054;
}

.mobile-header__sair {
  color: #d92d20;
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
  max-width: 100%;

  overflow: hidden;

  color: #101828;

  font-size: 16px;
  font-weight: 800;

  text-align: center;

  text-overflow: ellipsis;
  white-space: nowrap;
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

  backdrop-filter: blur(14px);

  -webkit-backdrop-filter: blur(14px);
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

/* BOTÃO CENTRAL */

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

.mobile-nav__novo:active {
  transform: scale(0.94);
}

.mobile-nav__novo-label {
  color: #f97316;

  font-size: 9px;
  font-weight: 800;
}

/* DARK */

.body--dark .mobile-header {
  border-color: #2b2f36;

  background:
    rgba(22, 25, 31, 0.96);
}

.body--dark .mobile-header__titulo,
.body--dark .mobile-header__boas-vindas {
  color: #f9fafb;
}

.body--dark .mobile-header__voltar,
.body--dark .mobile-header__acao {
  color: #f2f4f7;
}

.body--dark .mobile-nav {
  border-color: #2b2f36;

  background:
    rgba(22, 25, 31, 0.97);
}

.body--dark .mobile-nav__novo {
  border-color: #16191f;
}

.body--dark .conteudo-mobile {
  background: #0d0f12;
}
</style>