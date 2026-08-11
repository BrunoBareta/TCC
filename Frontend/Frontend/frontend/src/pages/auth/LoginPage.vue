<template>
  <q-page
    class="login-page"
    :class="{
      'login-page--dark': $q.dark.isActive
    }"
  >
    <div class="login-container">

      <!-- =========================
           LADO ESQUERDO
      ========================== -->

      <section class="login-brand">
        <div class="brand-conteudo">

          <div class="brand-logo">
            <q-icon
              name="agriculture"
              size="36px"
            />
          </div>

          <div class="brand-nome">
            Avioeste
          </div>

          <div class="brand-subtitulo">
            Portal de Atendimento
          </div>

          <div class="brand-linha"></div>

          <h1 class="brand-titulo">
            Assistência mais simples,
            rápida e organizada.
          </h1>

          <p class="brand-texto">
            Abra chamados, acompanhe seus atendimentos
            e mantenha sua propriedade conectada com
            a equipe técnica.
          </p>

          <div class="brand-recursos">

            <div class="recurso-item">
              <div class="recurso-icone">
                <q-icon
                  name="support_agent"
                  size="20px"
                />
              </div>

              <div>
                <strong>
                  Atendimento técnico
                </strong>

                <span>
                  Solicite assistência de forma rápida.
                </span>
              </div>
            </div>

            <div class="recurso-item">
              <div class="recurso-icone">
                <q-icon
                  name="location_on"
                  size="20px"
                />
              </div>

              <div>
                <strong>
                  Localização integrada
                </strong>

                <span>
                  Sua propriedade conectada ao atendimento.
                </span>
              </div>
            </div>

            <div class="recurso-item">
              <div class="recurso-icone">
                <q-icon
                  name="notifications_active"
                  size="20px"
                />
              </div>

              <div>
                <strong>
                  Acompanhamento
                </strong>

                <span>
                  Saiba o andamento dos seus chamados.
                </span>
              </div>
            </div>

          </div>
        </div>

        <div class="brand-rodape">
          Sistema de Chamados Avioeste
        </div>
      </section>

      <!-- =========================
           LOGIN
      ========================== -->

      <section class="login-area">
        <div class="login-box">

          <!-- MOBILE -->

          <div class="mobile-brand">
            <div class="mobile-logo">
              <q-icon
                name="agriculture"
                size="28px"
              />
            </div>

            <div>
              <div class="mobile-nome">
                Avioeste
              </div>

              <div class="mobile-subtitulo">
                Portal de Atendimento
              </div>
            </div>
          </div>

          <!-- CABEÇALHO -->

          <div class="login-cabecalho">
            <div class="login-bem-vindo">
              Bem-vindo de volta
            </div>

            <div class="login-descricao">
              Entre com seus dados para acessar sua conta.
            </div>
          </div>

          <!-- FORMULÁRIO -->

          <q-form
            class="login-form"
            @submit.prevent="fazerLogin"
          >

            <!-- EMAIL -->

            <div class="campo-grupo">
              <label class="campo-label">
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

            <div class="campo-grupo">

              <div class="senha-topo">
                <label class="campo-label">
                  Senha
                </label>

                <button
                  type="button"
                  class="esqueci-senha"
                  :disabled="carregando"
                  @click="esqueciMinhaSenha"
                >
                  Esqueci minha senha
                </button>
              </div>

              <q-input
                v-model="senha"
                outlined
                :type="
                  mostrarSenha
                    ? 'text'
                    : 'password'
                "
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
                    @click="
                      mostrarSenha =
                        !mostrarSenha
                    "
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
              class="entrar-btn"
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

          <!-- DIVISOR -->

          <div class="cadastro-divisor">
            <span>
              Novo por aqui?
            </span>
          </div>

          <!-- CADASTRO -->

          <button
            type="button"
            class="cadastro-btn"
            :disabled="carregando"
            @click="abrirCadastro"
          >
            <q-icon
              name="person_add_alt"
              size="20px"
            />

            Criar minha conta
          </button>

          <div class="cadastro-ajuda">
            O cadastro permitirá registrar sua propriedade
            e sua localização para os atendimentos.
          </div>

        </div>
      </section>

    </div>
  </q-page>
</template>

<script setup>
import {
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  useAuthStore
} from 'src/stores/auth'

import {
  redirecionarPorPerfil
} from 'src/router/auth'

const router =
  useRouter()

const $q =
  useQuasar()

const authStore =
  useAuthStore()

const email =
  ref('')

const senha =
  ref('')

const carregando =
  ref(false)

const mostrarSenha =
  ref(false)

/* =========================
   LOGIN
========================= */

const fazerLogin =
  async () => {
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

    carregando.value =
      true

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
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível realizar o login.'

      $q.notify({
        type: 'negative',
        message: mensagem
      })
    } finally {
      carregando.value =
        false
    }
  }

/* =========================
   CADASTRO
========================= */

function abrirCadastro() {
  router.push({
    name: 'cadastro'
  })
}

/* =========================
   RECUPERAR SENHA
========================= */

function esqueciMinhaSenha() {
  const emailDigitado =
    email.value.trim()

  router.push({
    name: 'recuperar-senha',

    query:
      emailDigitado
        ? {
            email: emailDigitado
          }
        : {}
  })
}
</script>

<style scoped>

/* =========================
   PÁGINA
========================= */

.login-page {
  min-height: 100vh;

  background: #f4f6f8;
}

.login-container {
  width: 100%;

  min-height: 100vh;

  display: grid;

  grid-template-columns:
    minmax(390px, 0.9fr)
    minmax(500px, 1.1fr);
}

/* =========================
   BRAND
========================= */

.login-brand {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  justify-content:
    space-between;

  position: relative;

  overflow: hidden;

  padding:
    58px 64px 38px;

  color: #ffffff;

  background:
    linear-gradient(
      145deg,
      #ff8a00 0%,
      #f97316 55%,
      #ea580c 100%
    );
}

.login-brand::before {
  content: '';

  position: absolute;

  width: 420px;

  height: 420px;

  top: -170px;

  right: -170px;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.08
    );
}

.login-brand::after {
  content: '';

  position: absolute;

  width: 340px;

  height: 340px;

  left: -170px;

  bottom: -140px;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.07
    );
}

.brand-conteudo,
.brand-rodape {
  position: relative;

  z-index: 1;
}

.brand-logo {
  width: 68px;

  height: 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 20px;

  color: #f97316;

  background: #ffffff;

  box-shadow:
    0 8px 30px
    rgba(
      0,
      0,
      0,
      0.12
    );
}

.brand-nome {
  margin-top: 22px;

  font-size: 30px;

  font-weight: 900;
}

.brand-subtitulo {
  margin-top: 2px;

  color:
    rgba(
      255,
      255,
      255,
      0.82
    );

  font-size: 14px;
}

.brand-linha {
  width: 45px;

  height: 4px;

  margin-top: 32px;

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.8
    );
}

.brand-titulo {
  max-width: 470px;

  margin:
    28px 0 0;

  font-size: 35px;

  line-height: 1.16;

  font-weight: 900;
}

.brand-texto {
  max-width: 470px;

  margin:
    17px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.84
    );

  font-size: 14px;

  line-height: 1.7;
}

.brand-recursos {
  display: flex;

  flex-direction: column;

  gap: 15px;

  margin-top: 37px;
}

.recurso-item {
  display: flex;

  align-items: center;

  gap: 13px;
}

.recurso-icone {
  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background:
    rgba(
      255,
      255,
      255,
      0.14
    );
}

.recurso-item strong {
  display: block;

  font-size: 13px;
}

.recurso-item span {
  display: block;

  margin-top: 2px;

  color:
    rgba(
      255,
      255,
      255,
      0.75
    );

  font-size: 11px;
}

.brand-rodape {
  color:
    rgba(
      255,
      255,
      255,
      0.65
    );

  font-size: 11px;
}

/* =========================
   ÁREA LOGIN
========================= */

.login-area {
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 50px;
}

.login-box {
  width: 100%;

  max-width: 470px;
}

.mobile-brand {
  display: none;
}

.login-cabecalho {
  margin-bottom: 32px;
}

.login-bem-vindo {
  color: #101828;

  font-size: 31px;

  font-weight: 900;

  letter-spacing: -0.5px;
}

.login-descricao {
  margin-top: 7px;

  color: #667085;

  font-size: 14px;
}

.login-form {
  width: 100%;
}

.campo-grupo {
  margin-bottom: 20px;
}

.campo-label {
  display: block;

  margin-bottom: 7px;

  color: #344054;

  font-size: 12px;

  font-weight: 700;
}

.senha-topo {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;
}

.esqueci-senha {
  padding: 0;

  border: none;

  color: #f97316;

  background: transparent;

  cursor: pointer;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;
}

.esqueci-senha:hover {
  text-decoration: underline;
}

.esqueci-senha:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.login-input :deep(.q-field__control) {
  min-height: 56px;

  border-radius: 12px;

  background: #ffffff;
}

.login-input :deep(.q-field__native) {
  font-size: 14px;
}

.entrar-btn {
  width: 100%;

  min-height: 52px;

  margin-top: 7px;

  border-radius: 12px;

  font-size: 14px;

  font-weight: 800;
}

/* =========================
   CADASTRO
========================= */

.cadastro-divisor {
  display: flex;

  align-items: center;

  gap: 14px;

  margin: 28px 0 18px;

  color: #98a2b3;

  font-size: 11px;

  text-align: center;
}

.cadastro-divisor::before,
.cadastro-divisor::after {
  content: '';

  height: 1px;

  flex: 1;

  background: #eaecf0;
}

.cadastro-btn {
  width: 100%;

  min-height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border:
    1px solid #d0d5dd;

  border-radius: 12px;

  color: #344054;

  background: #ffffff;

  cursor: pointer;

  font-family: inherit;

  font-size: 13px;

  font-weight: 700;

  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.cadastro-btn:hover {
  border-color: #f97316;

  color: #f97316;

  background: #fff7ed;
}

.cadastro-btn:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.cadastro-ajuda {
  max-width: 360px;

  margin:
    10px auto 0;

  color: #98a2b3;

  font-size: 10px;

  line-height: 1.5;

  text-align: center;
}

/* =========================
   DARK MODE
========================= */

.login-page--dark {
  background: #0d0f12;
}

.login-page--dark
.login-bem-vindo {
  color: #f9fafb;
}

.login-page--dark
.login-descricao,
.login-page--dark
.cadastro-ajuda {
  color: #98a2b3;
}

.login-page--dark
.campo-label {
  color: #d0d5dd;
}

.login-page--dark
.login-input
:deep(.q-field__control) {
  background: #16191f;
}

.login-page--dark
.cadastro-btn {
  border-color: #353a43;

  color: #f2f4f7;

  background: #16191f;
}

.login-page--dark
.cadastro-btn:hover {
  border-color: #f97316;

  color: #fb923c;

  background: #292018;
}

.login-page--dark
.cadastro-divisor::before,
.login-page--dark
.cadastro-divisor::after {
  background: #2b2f36;
}

/* =========================
   NOTEBOOK MENOR
========================= */

@media (max-width: 1100px) {
  .login-container {
    grid-template-columns:
      420px
      minmax(0, 1fr);
  }

  .login-brand {
    padding:
      45px 40px 32px;
  }

  .brand-titulo {
    font-size: 30px;
  }

  .login-area {
    padding: 40px;
  }
}

/* =========================
   TABLET
========================= */

@media (max-width: 850px) {
  .login-container {
    display: block;
  }

  .login-brand {
    display: none;
  }

  .login-area {
    min-height: 100vh;

    padding: 40px 24px;
  }

  .login-box {
    max-width: 460px;
  }

  .mobile-brand {
    display: flex;

    align-items: center;

    gap: 12px;

    margin-bottom: 42px;
  }

  .mobile-logo {
    width: 52px;

    height: 52px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 15px;

    color: #ffffff;

    background: #f97316;
  }

  .mobile-nome {
    color: #101828;

    font-size: 20px;

    font-weight: 900;
  }

  .mobile-subtitulo {
    margin-top: 1px;

    color: #667085;

    font-size: 11px;
  }

  .login-page--dark
  .mobile-nome {
    color: #f9fafb;
  }

  .login-page--dark
  .mobile-subtitulo {
    color: #98a2b3;
  }
}

/* =========================
   CELULAR
========================= */

@media (max-width: 500px) {
  .login-area {
    align-items: flex-start;

    padding:
      28px 18px 38px;
  }

  .mobile-brand {
    margin-bottom: 38px;
  }

  .login-bem-vindo {
    font-size: 26px;
  }

  .login-descricao {
    font-size: 12px;
  }

  .login-cabecalho {
    margin-bottom: 27px;
  }

  .login-input
  :deep(.q-field__control) {
    min-height: 54px;
  }
}
</style>