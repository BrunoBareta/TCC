<template>
  <q-drawer
    show-if-above
    :width="240"
    bordered
    class="sidebar-produtor"
  >
    <div class="sidebar-conteudo">
      <div>
        <!-- MARCA -->
        <div class="logo-area">
          <div class="logo-icone">
            <q-icon name="agriculture" size="27px" />
          </div>

          <div class="logo-texto">
            <div class="logo-titulo">
              Avioeste
            </div>

            <div class="logo-subtitulo">
              Portal do Produtor
            </div>
          </div>
        </div>

        <!-- NOVO CHAMADO -->
        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Novo Chamado"
          class="novo-chamado-btn"
          :to="{ name: 'produtor-novo-chamado' }"
        />

        <!-- MENU -->
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
              <q-icon name="person_outline" />
            </q-item-section>

            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- RODAPÉ -->
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
              PRODUTOR
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

const router = useRouter()
const authStore = useAuthStore()

const {
  modoEscuro,
  iconeTema,
  alternarTema
} = useTheme()

function obterUsuarioLocal() {
  const chaves = [
    'usuario',
    'user',
    'authUser'
  ]

  for (const chave of chaves) {
    try {
      const valor =
        localStorage.getItem(chave)

      if (!valor) {
        continue
      }

      const usuario =
        JSON.parse(valor)

      if (usuario) {
        return usuario
      }
    } catch {
      // continua procurando
    }
  }

  return {}
}

const nomeUsuario = computed(() => {
  const local =
    obterUsuarioLocal()

  return (
    authStore.nomeUsuario ||
    authStore.usuario?.nome ||
    local.nome ||
    local.nome_usuario ||
    local.name ||
    'Produtor'
  )
})

const iniciais = computed(() => {
  const partes =
    nomeUsuario.value
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  return partes
    .slice(0, 2)
    .map(
      parte =>
        parte.charAt(0)
    )
    .join('')
    .toUpperCase()
})

function irPerfil() {
  router.push({
    name: 'produtor-perfil'
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
.sidebar-produtor {
  border-right: 1px solid #eaecf0;
  background: #ffffff;
}

.sidebar-conteudo {
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 22px 16px 16px;
}

/* MARCA */

.logo-area {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 5px 8px 20px;
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

/* NOVO CHAMADO */

.novo-chamado-btn {
  width: 100%;
  min-height: 44px;

  margin-bottom: 18px;

  border-radius: 12px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );

  font-size: 12px;
  font-weight: 800;

  box-shadow:
    0 6px 16px
    rgba(249, 115, 22, 0.2);
}

/* MENU */

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

/* RODAPÉ */

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
  color: #98a2b3;
}

/* AÇÕES RODAPÉ */

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

/* DARK */

.body--dark .sidebar-produtor {
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
