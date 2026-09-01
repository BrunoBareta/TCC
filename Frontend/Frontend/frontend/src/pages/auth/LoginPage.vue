<template>
  <q-page
    class="login-page"
    :class="{ 'login-page--dark': $q.dark.isActive }"
  >
    <div class="login-wrapper">
      <!-- ==================================================
           LADO ESQUERDO - DESKTOP
      =================================================== -->

      <div class="login-branding">
        <div class="branding-overlay"></div>

        <div class="branding-content">
          <div class="branding-logo-wrap">
            <img
              :src="logoAvicola"
              alt="Avícola Pinhal"
              class="branding-logo"
            />
          </div>

          <div class="branding-badge">
            Portal de Atendimento Rural
          </div>

          <h1 class="branding-title">
            Conectando produtores, técnicos e administração em um só lugar.
          </h1>

          <p class="branding-text">
            Uma solução pensada para agilizar chamados, organizar atendimentos
            e facilitar a comunicação no campo.
          </p>

          <div class="branding-cards">
            <div class="branding-card">
              <q-icon
                name="assignment"
                size="24px"
                color="orange"
              />

              <span>
                Abertura de chamados
              </span>
            </div>

            <div class="branding-card">
              <q-icon
                name="engineering"
                size="24px"
                color="primary"
              />

              <span>
                Acompanhamento de técnicos
              </span>
            </div>

            <div class="branding-card">
              <q-icon
                name="insights"
                size="24px"
                color="positive"
              />

              <span>
                Gestão e relatórios
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================
           LADO DIREITO
      =================================================== -->

      <div class="login-panel">
        <div class="login-box">
          <!-- ==================================================
               LOGO SOMENTE NO MOBILE
          =================================================== -->

          <div class="mobile-brand">
            <img
              :src="logoAvicola"
              alt="Avícola Pinhal"
              class="mobile-logo"
            />

            <div class="mobile-frase">
              Tecnologia para facilitar o atendimento no campo.
            </div>
          </div>

          <!-- ==================================================
               CABEÇALHO
          =================================================== -->

          <div class="login-header">
            <div class="login-title">
              Bem-vindo de volta
            </div>

            <div class="login-subtitle">
              Entre com seus dados para acessar sua conta.
            </div>
          </div>

          <!-- ==================================================
               FORMULÁRIO
          =================================================== -->

          <q-form
            class="login-form"
            @submit.prevent="fazerLogin"
          >
            <!-- E-MAIL -->

            <div class="field-group">
              <label class="field-label">
                E-mail
              </label>

              <q-input
                v-model="email"
                outlined
                type="email"
                placeholder="seuemail@exemplo.com"
                :disable="carregando"
                autocomplete="email"
                class="login-input"
              >
                <template #prepend>
                  <q-icon
                    name="mail_outline"
                    size="21px"
                  />
                </template>
              </q-input>
            </div>

            <!-- SENHA -->

            <div class="field-group">
              <div class="password-header">
                <label class="field-label">
                  Senha
                </label>

                <button
                  type="button"
                  class="forgot-password"
                  :disabled="carregando"
                  @click="esqueciMinhaSenha"
                >
                  Esqueci minha senha
                </button>
              </div>

              <q-input
                v-model="senha"
                outlined
                :type="mostrarSenha ? 'text' : 'password'"
                placeholder="Digite sua senha"
                :disable="carregando"
                autocomplete="current-password"
                class="login-input"
              >
                <template #prepend>
                  <q-icon
                    name="lock_outline"
                    size="21px"
                  />
                </template>

                <template #append>
                  <q-icon
                    :name="
                      mostrarSenha
                        ? 'visibility_off'
                        : 'visibility'
                    "
                    class="cursor-pointer"
                    size="21px"
                    @click="mostrarSenha = !mostrarSenha"
                  />
                </template>
              </q-input>
            </div>

            <!-- ENTRAR -->

            <q-btn
              unelevated
              no-caps
              color="orange"
              type="submit"
              class="login-button"
              :loading="carregando"
            >
              <span>
                Entrar
              </span>

              <q-icon
                name="arrow_forward"
                size="19px"
                class="q-ml-sm"
              />
            </q-btn>
          </q-form>

          <!-- ==================================================
               CADASTRO
          =================================================== -->

          <div class="divider">
            <span>
              Novo por aqui?
            </span>
          </div>

          <button
            type="button"
            class="register-button"
            :disabled="carregando"
            @click="abrirCadastro"
          >
            <q-icon
              name="person_add_alt"
              size="20px"
            />

            Criar minha conta
          </button>

          <div class="register-help">
            O cadastro permitirá registrar sua propriedade e sua localização
            para os atendimentos.
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { redirecionarPorPerfil } from 'src/router/auth'

import logoAvicola from
  'src/assets/logo/logo-avicola-pinhal.png'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const carregando = ref(false)
const mostrarSenha = ref(false)

/* ==================================================
   LOGIN
=================================================== */

const fazerLogin = async () => {
  if (
    !email.value.trim() ||
    !senha.value
  ) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o e-mail e a senha.'
    })

    return
  }

  carregando.value = true

  try {
    await authStore.login(
      email.value.trim(),
      senha.value
    )

    $q.notify({
      type: 'positive',
      message:
        'Login realizado com sucesso.'
    })

    const destino =
      redirecionarPorPerfil(
        authStore.tipoUsuario
      )

    await router.replace(
      destino
    )
  } catch (error) {
    console.error(
      'Erro ao realizar login:',
      error
    )

    const mensagem =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível realizar o login.'

    $q.notify({
      type: 'negative',
      message: mensagem
    })
  } finally {
    carregando.value = false
  }
}

/* ==================================================
   CADASTRO
=================================================== */

function abrirCadastro() {
  router.push({
    name: 'cadastro'
  })
}

/* ==================================================
   RECUPERAÇÃO DE SENHA
=================================================== */

function esqueciMinhaSenha() {
  const emailDigitado =
    email.value.trim()

  router.push({
    name: 'recuperar-senha',

    query:
      emailDigitado
        ? {
            email:
              emailDigitado
          }
        : {}
  })
}
</script>

<style scoped>
/* ==================================================
   PÁGINA
=================================================== */

.login-page {
  min-height: 100vh;
  background: #f5f7fb;
}

.login-wrapper {
  min-height: 100vh;

  display: grid;

  grid-template-columns:
    1.1fr 0.9fr;
}

/* ==================================================
   LADO ESQUERDO
=================================================== */

.login-branding {
  position: relative;

  overflow: hidden;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 56px;

  background:
    linear-gradient(
      135deg,
      #fff8f1 0%,
      #ffe8cc 18%,
      #ffd6a5 35%,
      #fde6c8 52%,
      #e9f2ff 72%,
      #dbeafe 100%
    );
}

.branding-overlay {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at top left,
      rgba(249, 115, 22, 0.28),
      transparent 35%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(251, 146, 60, 0.22),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(37, 99, 235, 0.16),
      transparent 30%
    );
}

.branding-content {
  position: relative;

  z-index: 1;

  width: 100%;

  max-width: 590px;
}

/* ==================================================
   LOGO DESKTOP
=================================================== */

.branding-logo-wrap {
  display: flex;

  align-items: center;

  justify-content: flex-start;

  margin-bottom: 20px;
}

.branding-logo {
  display: block;

  width: 290px;

  max-width: 100%;

  height: auto;

  object-fit: contain;

  filter:
    drop-shadow(
      0 10px 18px
      rgba(16, 24, 40, 0.08)
    );
}

/* ==================================================
   IDENTIDADE
=================================================== */

.branding-badge {
  display: inline-flex;

  align-items: center;

  padding:
    9px 16px;

  margin-bottom: 18px;

  border:
    1px solid
    rgba(255, 255, 255, 0.7);

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.78);

  color: #ea580c;

  font-size: 13px;

  font-weight: 800;

  box-shadow:
    0 8px 20px
    rgba(249, 115, 22, 0.10);
}

.branding-title {
  margin: 0;

  color: #101828;

  font-size: 38px;

  font-weight: 900;

  line-height: 1.12;
}

.branding-text {
  max-width: 520px;

  margin-top: 18px;

  color: #475467;

  font-size: 17px;

  line-height: 1.7;
}

/* ==================================================
   CARDS ESQUERDA
=================================================== */

.branding-cards {
  display: flex;

  flex-direction: column;

  gap: 14px;

  margin-top: 34px;
}

.branding-card {
  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    16px 18px;

  border:
    1px solid
    rgba(255, 255, 255, 0.78);

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.84);

  color: #1f2937;

  font-size: 15px;

  font-weight: 700;

  box-shadow:
    0 12px 28px
    rgba(16, 24, 40, 0.06);
}

/* ==================================================
   LADO DIREITO
=================================================== */

.login-panel {
  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    42px 30px;

  background:
    #ffffff;
}

.login-box {
  width: 100%;

  max-width: 470px;
}

/* ==================================================
   MOBILE BRAND
   DESKTOP = ESCONDIDO
=================================================== */

.mobile-brand {
  display: none;
}

.mobile-logo {
  display: block;

  width: 200px;

  max-width: 100%;

  height: auto;

  margin: 0 auto;

  object-fit: contain;
}

.mobile-frase {
  max-width: 310px;

  margin:
    10px auto 0;

  color: #667085;

  font-size: 12px;

  line-height: 1.5;

  text-align: center;
}

/* ==================================================
   CABEÇALHO
=================================================== */

.login-header {
  margin-bottom: 30px;
}

.login-title {
  color: #101828;

  font-size: 38px;

  font-weight: 900;

  line-height: 1.15;

  letter-spacing: -0.5px;
}

.login-subtitle {
  margin-top: 10px;

  color: #667085;

  font-size: 15px;

  line-height: 1.6;
}

/* ==================================================
   FORMULÁRIO
=================================================== */

.login-form {
  width: 100%;
}

.field-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;

  margin-bottom: 8px;

  color: #344054;

  font-size: 13px;

  font-weight: 700;
}

.password-header {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 12px;
}

.forgot-password {
  padding: 0;

  border: none;

  background:
    transparent;

  color: #f97316;

  cursor: pointer;

  font-family: inherit;

  font-size: 12px;

  font-weight: 700;
}

.forgot-password:hover {
  text-decoration:
    underline;
}

.forgot-password:disabled {
  opacity: 0.6;

  cursor:
    not-allowed;
}

/* INPUT */

.login-input
:deep(.q-field__control) {
  min-height: 58px;

  border-radius: 14px;

  background:
    #ffffff;
}

.login-input
:deep(.q-field__native) {
  font-size: 14px;
}

/* ==================================================
   ENTRAR
=================================================== */

.login-button {
  width: 100%;

  min-height: 54px;

  margin-top: 8px;

  border-radius: 14px;

  font-size: 15px;

  font-weight: 800;
}

/* ==================================================
   DIVISOR
=================================================== */

.divider {
  display: flex;

  align-items: center;

  gap: 14px;

  margin:
    28px 0 18px;

  color: #98a2b3;

  font-size: 11px;

  text-align: center;
}

.divider::before,
.divider::after {
  content: '';

  height: 1px;

  flex: 1;

  background:
    #eaecf0;
}

/* ==================================================
   CADASTRO
=================================================== */

.register-button {
  width: 100%;

  min-height: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border:
    1px solid #d0d5dd;

  border-radius: 14px;

  background:
    #ffffff;

  color:
    #344054;

  cursor: pointer;

  font-family: inherit;

  font-size: 14px;

  font-weight: 700;

  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.register-button:hover {
  border-color:
    #f97316;

  color:
    #f97316;

  background:
    #fff7ed;
}

.register-button:disabled {
  opacity: 0.6;

  cursor:
    not-allowed;
}

.register-help {
  margin-top: 12px;

  color:
    #98a2b3;

  font-size: 11px;

  line-height: 1.5;

  text-align: center;
}

/* ==================================================
   DARK
=================================================== */

.login-page--dark {
  background:
    #0f1115;
}

.login-page--dark
.login-branding {
  background:
    linear-gradient(
      135deg,
      #111827 0%,
      #172554 35%,
      #1e3a8a 60%,
      #7c2d12 100%
    );
}

.login-page--dark
.branding-overlay {
  background:
    radial-gradient(
      circle at top left,
      rgba(96, 165, 250, 0.15),
      transparent 34%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(251, 146, 60, 0.18),
      transparent 30%
    );
}

.login-page--dark
.branding-badge,

.login-page--dark
.branding-card {
  background:
    rgba(17, 24, 39, 0.52);

  border-color:
    rgba(255, 255, 255, 0.08);
}

.login-page--dark
.branding-title,

.login-page--dark
.field-label,

.login-page--dark
.login-title {
  color: #f9fafb;
}

.login-page--dark
.branding-text,

.login-page--dark
.login-subtitle,

.login-page--dark
.register-help,

.login-page--dark
.mobile-frase {
  color: #cbd5e1;
}

.login-page--dark
.branding-card {
  color: #e5e7eb;
}

.login-page--dark
.login-panel {
  background:
    #16191f;
}

.login-page--dark
.login-input
:deep(.q-field__control) {
  background:
    #16191f;
}

.login-page--dark
.register-button {
  background:
    #16191f;

  color:
    #f3f4f6;

  border-color:
    #353a43;
}

.login-page--dark
.register-button:hover {
  border-color:
    #f97316;

  color:
    #fb923c;

  background:
    #292018;
}

.login-page--dark
.divider::before,

.login-page--dark
.divider::after {
  background:
    #2b2f36;
}

/* ==================================================
   NOTEBOOK MENOR
=================================================== */

@media (max-width: 1100px) {
  .login-wrapper {
    grid-template-columns:
      1fr 1fr;
  }

  .branding-title {
    font-size:
      31px;
  }

  .login-title {
    font-size:
      34px;
  }
}

/* ==================================================
   TABLET / CELULAR
=================================================== */

@media (max-width: 850px) {
  .login-wrapper {
    display: block;

    width: 100%;

    min-height: 100vh;
  }

  /* some completamente com
     a coluna esquerda */

  .login-branding {
    display: none;
  }

  .login-panel {
    width: 100%;

    min-height: 100vh;

    display: flex;

    align-items:
      flex-start;

    justify-content:
      center;

    overflow-x:
      hidden;

    padding:
      calc(
        26px +
        env(safe-area-inset-top)
      )
      20px
      calc(
        34px +
        env(safe-area-inset-bottom)
      );

    background:
      #f7f8fa;
  }

  .login-box {
    width: 100%;

    max-width: 460px;

    margin:
      0 auto;
  }

  /* AQUI ESTAVA O ERRO.
     Agora a logo aparece. */

  .mobile-brand {
    width: 100%;

    display: flex;

    flex-direction:
      column;

    align-items:
      center;

    justify-content:
      center;

    margin-bottom:
      30px;

    padding:
      0 16px;

    text-align:
      center;
  }

  .mobile-logo {
    display: block;

    width: 210px;

    max-width: 72vw;

    height: auto;

    max-height: 90px;

    margin:
      0 auto;

    object-fit:
      contain;
  }

  .mobile-frase {
    max-width: 300px;

    margin:
      9px auto 0;

    color:
      #667085;

    font-size:
      12px;

    line-height:
      1.5;

    text-align:
      center;
  }

  .login-header {
    margin-bottom:
      24px;

    text-align:
      left;
  }

  .login-title {
    font-size:
      28px;
  }

  .login-subtitle {
    font-size:
      14px;
  }
}

/* ==================================================
   CELULAR
=================================================== */

@media (max-width: 500px) {
  .login-panel {
    padding:
      calc(
        20px +
        env(safe-area-inset-top)
      )
      18px
      calc(
        28px +
        env(safe-area-inset-bottom)
      );
  }

  .login-box {
    width: 100%;

    max-width: 100%;
  }

  .mobile-brand {
    margin-bottom:
      28px;

    padding:
      0 10px;
  }

  .mobile-logo {
    width: 195px;

    max-width: 68vw;

    max-height: 82px;
  }

  .mobile-frase {
    max-width:
      280px;

    margin-top:
      8px;

    font-size:
      11px;
  }

  .login-title {
    font-size:
      26px;
  }

  .login-subtitle {
    font-size:
      13px;
  }

  .login-input
  :deep(.q-field__control) {
    min-height:
      54px;
  }

  .login-button,

  .register-button {
    min-height:
      52px;
  }
}

/* ==================================================
   IPHONE PEQUENO
=================================================== */

@media (max-width: 390px) {
  .mobile-logo {
    width: 180px;

    max-width: 65vw;
  }

  .mobile-brand {
    padding:
      0 8px;
  }

  .login-title {
    font-size:
      25px;
  }
}
</style>