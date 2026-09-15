<template>
  <q-drawer
    v-model="drawerAberto"
    show-if-above
    bordered
    :width="240"
    :breakpoint="1024"
    class="sidebar-tecnico"
  >
    <div class="sidebar-conteudo">
      <!-- TOPO -->
      <div>
        <!-- MARCA -->
        <div class="logo-area">
          <div class="logo-icone">
            <q-icon name="engineering" size="29px" />
          </div>

          <div class="logo-texto">
            <div class="logo-titulo">
              Avioeste
            </div>

            <div class="logo-subtitulo">
              Portal do Técnico
            </div>
          </div>
        </div>

        <!-- MENU -->
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

          <q-item
            clickable
            exact
            :to="{ name: 'tecnico-perfil' }"
            active-class="menu-ativo"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon name="person_outline" />
            </q-item-section>

            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- RODAPÉ DA SIDEBAR -->
      <div class="sidebar-rodape">
        <button
          type="button"
          class="usuario-area"
          @click="irPerfil"
        >
          <q-avatar
            size="39px"
            class="usuario-avatar"
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
            name="chevron_right"
            size="18px"
            class="usuario-seta"
          />
        </button>

        <div class="acoes-rodape">
          <button
            type="button"
            class="acao-rodape"
            @click="alternarTema"
          >
            <q-icon
              :name="iconeTema"
              size="20px"
            />

            <span>
              {{ modoEscuro ? 'Modo claro' : 'Modo escuro' }}
            </span>
          </button>

          <button
            type="button"
            class="acao-rodape acao-rodape--sair"
            @click="sair"
          >
            <q-icon
              name="logout"
              size="20px"
            />

            <span>
              Sair do sistema
            </span>
          </button>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useTheme } from 'src/composables/useTheme'

const drawerAberto = defineModel({
  type: Boolean,
  default: false
})

const router = useRouter()
const authStore = useAuthStore()

const {
  modoEscuro,
  iconeTema,
  alternarTema
} = useTheme()

const nomeUsuario = computed(() => {
  return (
    authStore.usuario?.nome ||
    authStore.nomeUsuario ||
    'Técnico'
  )
})

const iniciais = computed(() => {
  const partes = nomeUsuario.value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return partes
    .slice(0, 2)
    .map(parte =>
      parte.charAt(0)
    )
    .join('')
    .toUpperCase()
})

function irPerfil() {
  router.push({
    name: 'tecnico-perfil'
  })
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
.sidebar-tecnico {
  background: #ffffff;
  border-right: 1px solid #eaecf0;
}

.sidebar-conteudo {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 22px 16px 16px;
}

/* =============================
   MARCA
============================= */

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 5px 8px 24px;
}

.logo-icone {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 15px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );

  box-shadow:
    0 8px 20px
    rgba(249, 115, 22, 0.2);
}

.logo-texto {
  min-width: 0;
}

.logo-titulo {
  color: #17233c;

  font-size: 19px;
  font-weight: 900;

  line-height: 1.1;
}

.logo-subtitulo {
  margin-top: 4px;

  color: #98a2b3;

  font-size: 11px;
  font-weight: 500;
}

/* =============================
   MENU
============================= */

.menu-lista {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.menu-item {
  min-height: 48px;

  padding: 6px 12px;

  border-radius: 12px;

  color: #475467;

  font-size: 13px;
  font-weight: 700;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.menu-item:hover {
  color: #17233c;
  background: #f8fafc;

  transform: translateX(2px);
}

.menu-item :deep(.q-item__section--avatar) {
  min-width: 38px;
}

.menu-item :deep(.q-icon) {
  font-size: 21px;
}

.menu-ativo {
  color: #f97316 !important;

  background:
    linear-gradient(
      90deg,
      #fff1e6,
      #fff8f2
    ) !important;

  box-shadow:
    inset 3px 0 0 #f97316;
}

.menu-ativo :deep(.q-icon) {
  color: #f97316 !important;
}

/* =============================
   RODAPÉ
============================= */

.sidebar-rodape {
  padding-top: 14px;

  border-top: 1px solid #eaecf0;
}

.usuario-area {
  appearance: none;

  width: 100%;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 10px;

  border: 0;
  border-radius: 13px;

  color: inherit;

  background: #f8fafc;

  font-family: inherit;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.usuario-area:hover {
  background: #fff1e6;

  transform: translateY(-1px);
}

.usuario-avatar {
  flex-shrink: 0;

  color: #17233c;

  background:
    linear-gradient(
      135deg,
      #ffedd5,
      #fed7aa
    );

  font-size: 13px;
  font-weight: 900;
}

.usuario-dados {
  min-width: 0;
  flex: 1;
}

.usuario-nome {
  overflow: hidden;

  color: #17233c;

  font-size: 12px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.usuario-tipo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 0.8px;
}

.usuario-seta {
  flex-shrink: 0;

  color: #98a2b3;
}

/* AÇÕES */

.acoes-rodape {
  display: grid;
  gap: 3px;

  margin-top: 7px;
}

.acao-rodape {
  appearance: none;

  width: 100%;
  min-height: 39px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 7px 11px;

  border: 0;
  border-radius: 10px;

  color: #667085;

  background: transparent;

  font-family: inherit;

  font-size: 11px;
  font-weight: 700;

  text-align: left;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.acao-rodape:hover {
  color: #f97316;
  background: #fff7ed;
}

.acao-rodape--sair:hover {
  color: #dc2626;
  background: #fff1f2;
}

/* =============================
   DARK
============================= */

.body--dark .sidebar-tecnico {
  border-color: #292d33;

  background: #12151a;
}

.body--dark .logo-titulo {
  color: #f9fafb;
}

.body--dark .menu-item {
  color: #cbd5e1;
}

.body--dark .menu-item:hover {
  color: #ffffff;
  background: #1b1f25;
}

.body--dark .menu-ativo {
  color: #fb923c !important;

  background:
    linear-gradient(
      90deg,
      #292018,
      #1e1b18
    ) !important;
}

.body--dark .sidebar-rodape {
  border-color: #292d33;
}

.body--dark .usuario-area {
  background: #191d23;
}

.body--dark .usuario-area:hover {
  background: #292018;
}

.body--dark .usuario-nome {
  color: #f9fafb;
}

.body--dark .usuario-avatar {
  color: #fb923c;
  background: #292018;
}

.body--dark .acao-rodape {
  color: #cbd5e1;
}

.body--dark .acao-rodape:hover {
  color: #fb923c;
  background: #292018;
}

.body--dark .acao-rodape--sair:hover {
  color: #f87171;
  background: #2b191b;
}
</style>