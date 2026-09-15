<template>

  <q-page

    class="login-page"

    :class="{ 'login-page--dark': $q.dark.isActive }"

  >

    <div class="login-wrapper">

      <!-- ==================================================

           LADO ESQUERDO - DESKTOP

      =================================================== -->

      <section class="login-branding">

        <div class="branding-glow branding-glow--orange"></div>

        <div class="branding-glow branding-glow--blue"></div>

        <div class="branding-content">

          <img

            :src="logoAvicola"

            alt="Avícola Pinhal"

            class="branding-logo"

          />

          <div class="branding-badge">

            <q-icon name="agriculture" size="18px" />

            Portal de Atendimento Rural

          </div>

          <h1 class="branding-title">

            Assistência técnica conectada ao campo.

          </h1>

          <p class="branding-text">

            Do chamado até a conclusão do serviço, acompanhe cada etapa

            do atendimento em um só lugar.

          </p>

        </div>

        <!-- ==================================================

             CENÁRIO ANIMADO

        =================================================== -->

        <div class="service-stage" aria-hidden="true">

          <div class="stage-sky">

            <div class="stage-sun"></div>

            <div class="stage-cloud stage-cloud--one"></div>

            <div class="stage-cloud stage-cloud--two"></div>

          </div>

          <div class="stage-status">

            <div class="status-dot"></div>

            Atendimento em andamento

          </div>

          <div class="eta-card">

            <q-icon name="route" size="18px" />

            Técnico a caminho

          </div>

          <div class="farm-area">

            <div class="farm-alert">

              <q-icon name="priority_high" size="18px" />

            </div>

            <div class="farm-pin">

              <q-icon name="place" size="18px" />

            </div>

            <div class="farm-icon">

              <q-icon name="warehouse" size="62px" />

            </div>

            <div class="farm-title">

              Propriedade rural

            </div>

            <div class="farm-subtitle">

              Local aguardando atendimento

            </div>

          </div>

          <div class="road-area">

            <div class="road-line"></div>

            <div class="road-dashes"></div>

            <div class="road-badge road-badge--left">

              Local confirmado

            </div>

            <div class="road-badge road-badge--right">

              Rota aberta

            </div>

            <div class="vehicle">

              <div class="vehicle-label">

                Técnico indo à propriedade

              </div>

              <div class="vehicle-box">

                <q-icon

                  name="local_shipping"

                  size="42px"

                  class="vehicle-truck-icon"

                />

              </div>

            </div>

          </div>

          <div class="tech-area">

            <div class="tech-box">

              <q-icon name="engineering" size="58px" />

            </div>

            <div class="tech-tool">

              <q-icon name="build" size="24px" />

            </div>

            <div class="tech-title">

              Assistência técnica

            </div>

            <div class="tech-subtitle">

              Equipe pronta para sair

            </div>

          </div>

          <div class="field-note">

            <q-icon name="description" size="18px" />

            Histórico atualizado em tempo real

          </div>

          <div class="stage-ground stage-ground--back"></div>

          <div class="stage-ground stage-ground--front"></div>

        </div>

        <div class="feature-row">

          <div class="feature-item">

            <q-icon name="assignment_turned_in" size="21px" />

            <span>Chamados organizados</span>

          </div>

          <div class="feature-item">

            <q-icon name="location_on" size="21px" />

            <span>Localização do atendimento</span>

          </div>

          <div class="feature-item">

            <q-icon name="description" size="21px" />

            <span>Histórico e relatórios</span>

          </div>

        </div>

      </section>

      <!-- ==================================================

           LADO DIREITO

      =================================================== -->

      <section class="login-panel">

        <div class="login-box">

          <!-- ==================================================

               MOBILE

          =================================================== -->

          <div class="mobile-brand">

            <img

              :src="logoAvicola"

              alt="Avícola Pinhal"

              class="mobile-logo"

            />

            <div class="mobile-flow" aria-hidden="true">

              <div class="mobile-node mobile-node--farm">

                <q-icon name="warehouse" size="25px" />

              </div>

              <div class="mobile-line"></div>

              <div class="mobile-truck">

                <q-icon name="local_shipping" size="25px" />

              </div>

              <div class="mobile-node mobile-node--tech">

                <q-icon name="engineering" size="27px" />

              </div>

            </div>

            <div class="mobile-frase">

              Do chamado ao atendimento, tudo conectado.

            </div>

          </div>

          <!-- ==================================================

               CABEÇALHO

          =================================================== -->

          <div class="login-header">

            <div class="login-title">

              Bem-vindo

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

      </section>

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

\=================================================== */

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

\=================================================== */

function abrirCadastro() {

  router.push({

    name: 'cadastro'

  })

}

/* ==================================================

   RECUPERAÇÃO DE SENHA

\=================================================== */

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

   BASE

\=================================================== */

.login-page {

  min-height: 100vh;

  background: #f5f7fb;

}

.login-wrapper {

  min-height: 100vh;

  display: grid;

  grid-template-columns:

    minmax(720px, 1.12fr)

    minmax(510px, 0.88fr);

}

/* ==================================================

   BRANDING

\=================================================== */

.login-branding {

  position: relative;

  min-height: 100vh;

  overflow: hidden;

  padding: 44px 54px 34px;

  background:

    linear-gradient(

      145deg,

      #fff9f3 0%,

      #fff1df 30%,

      #edf5ff 70%,

      #e3efff 100%

    );

}

.branding-glow {

  position: absolute;

  border-radius: 50%;

  filter: blur(8px);

  pointer-events: none;

}

.branding-glow--orange {

  top: -140px;

  left: -120px;

  width: 380px;

  height: 380px;

  background:

    rgba(249, 115, 22, 0.15);

}

.branding-glow--blue {

  right: -120px;

  bottom: 90px;

  width: 380px;

  height: 380px;

  background:

    rgba(37, 99, 235, 0.10);

}

.branding-content {

  position: relative;

  z-index: 5;

  width: min(610px, 66%);

}

.branding-logo {

  display: block;

  width: 285px;

  max-width: 100%;

  height: auto;

  object-fit: contain;

  margin-bottom: 18px;

  filter:

    drop-shadow(

      0 10px 18px

      rgba(16, 24, 40, 0.08)

    );

}

.branding-badge {

  width: fit-content;

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 14px;

  border:

    1px solid

    rgba(255, 255, 255, 0.85);

  border-radius: 999px;

  background:

    rgba(255, 255, 255, 0.82);

  color: #ea580c;

  font-size: 12px;

  font-weight: 800;

  box-shadow:

    0 8px 20px

    rgba(249, 115, 22, 0.08);

}

.branding-title {

  margin: 19px 0 0;

  color: #101828;

  font-size: clamp(34px, 3vw, 48px);

  font-weight: 900;

  line-height: 1.05;

  letter-spacing: -1px;

}

.branding-text {

  max-width: 540px;

  margin-top: 15px;

  color: #475467;

  font-size: 16px;

  line-height: 1.62;

}

/* ==================================================

   CENÁRIO ANIMADO

\=================================================== */

.service-stage {

  position: absolute;

  z-index: 3;

  left: 5%;

  right: 5%;

  bottom: 108px;

  height: 338px;

  overflow: hidden;

  border:

    1px solid

    rgba(255, 255, 255, 0.78);

  border-radius: 30px;

  background:

    linear-gradient(

      180deg,

      rgba(255, 255, 255, 0.82) 0%,

      rgba(241, 247, 255, 0.88) 58%,

      rgba(232, 246, 234, 0.92) 58%,

      rgba(211, 239, 218, 0.96) 100%

    );

  box-shadow:

    0 25px 55px

    rgba(16, 24, 40, 0.08);

}

.stage-sky {

  position: absolute;

  inset: 0 0 42% 0;

}

.stage-sun {

  position: absolute;

  top: 18px;

  right: 28px;

  width: 56px;

  height: 56px;

  border-radius: 50%;

  background:

    rgba(251, 146, 60, 0.24);

  box-shadow:

    0 0 0 13px

    rgba(251, 146, 60, 0.08);

  animation:

    sunPulse 3.5s ease-in-out infinite;

}

.stage-cloud {

  position: absolute;

  width: 78px;

  height: 20px;

  border-radius: 999px;

  background:

    rgba(255, 255, 255, 0.92);

  box-shadow:

    0 8px 18px

    rgba(37, 99, 235, 0.05);

}

.stage-cloud::before,

.stage-cloud::after {

  content: '';

  position: absolute;

  bottom: 0;

  border-radius: 50%;

  background:

    rgba(255, 255, 255, 0.95);

}

.stage-cloud::before {

  left: 13px;

  width: 32px;

  height: 32px;

}

.stage-cloud::after {

  right: 12px;

  width: 25px;

  height: 25px;

}

.stage-cloud--one {

  top: 60px;

  left: 44%;

  animation:

    cloudFloat 8s ease-in-out infinite;

}

.stage-cloud--two {

  top: 112px;

  right: 22%;

  transform: scale(0.78);

  opacity: 0.8;

  animation:

    cloudFloat 10s ease-in-out infinite reverse;

}

.stage-status {

  position: absolute;

  top: 20px;

  left: 22px;

  z-index: 8;

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  background:

    rgba(255, 255, 255, 0.90);

  color: #059669;

  font-size: 11px;

  font-weight: 800;

  box-shadow:

    0 8px 20px

    rgba(16, 24, 40, 0.07);

}

.status-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #10b981;

  animation:

    statusBlink 1.5s ease-in-out infinite;

}









.eta-card {

  position: absolute;

  z-index: 10;

  top: 28px;

  right: 118px;

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  background:

    rgba(255, 255, 255, 0.90);

  color: #2563eb;

  font-size: 11px;

  font-weight: 800;

  box-shadow:

    0 8px 20px

    rgba(16, 24, 40, 0.07);

}

.done-badge {

  position: absolute;

  z-index: 12;

  right: 28px;

  top: 88px;

  display: flex;

  align-items: center;

  gap: 6px;

  padding: 8px 11px;

  border-radius: 999px;

  background:

    rgba(255, 255, 255, 0.92);

  color: #059669;

  font-size: 10px;

  font-weight: 800;

  box-shadow:

    0 8px 20px

    rgba(16, 24, 40, 0.07);

  animation:

    doneFade 7s ease-in-out infinite;

}

/* PROPRIEDADE */

.farm-area {

  position: absolute;

  z-index: 7;

  left: 55px;

  bottom: 56px;

  width: 170px;

  text-align: center;

}

.farm-icon {

  width: 118px;

  height: 104px;

  margin: 0 auto;

  display: grid;

  place-items: center;

  border:

    1px solid

    rgba(37, 99, 235, 0.12);

  border-radius: 24px;

  background:

    rgba(255, 255, 255, 0.92);

  color: #2563eb;

  box-shadow:

    0 16px 34px

    rgba(37, 99, 235, 0.11);

}

.farm-alert {

  position: absolute;

  z-index: 9;

  top: -12px;

  right: 2px;

  width: 38px;

  height: 38px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #fff7ed;

  color: #f97316;

  box-shadow:

    0 8px 18px

    rgba(249, 115, 22, 0.16);

  animation:

    alertPulse 1.9s ease-in-out infinite;

}

.farm-pin {

  position: absolute;

  left: -4px;

  top: 26px;

  width: 32px;

  height: 32px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #ffffff;

  color: #2563eb;

  box-shadow:

    0 8px 18px

    rgba(37, 99, 235, 0.12);

}

.farm-title {

  margin-top: 10px;

  color: #344054;

  font-size: 13px;

  font-weight: 800;

}

.farm-subtitle {

  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;

  font-weight: 700;

}

/* ESTRADA */

.road-area {

  position: absolute;

  z-index: 6;

  left: 220px;

  right: 230px;

  bottom: 88px;

  height: 92px;

}

.road-line {

  position: absolute;

  left: 0;

  right: 0;

  bottom: 24px;

  height: 24px;

  border-radius: 999px;

  background:

    linear-gradient(

      180deg,

      #cfd8e3,

      #b8c3d1

    );

  box-shadow:

    inset 0 3px 0

    rgba(255, 255, 255, 0.38);

}

.road-dashes {

  position: absolute;

  left: 20px;

  right: 20px;

  bottom: 35px;

  height: 3px;

  background:

    repeating-linear-gradient(

      90deg,

      rgba(255, 255, 255, 0.92) 0 22px,

      transparent 22px 43px

    );

}

.road-badge {

  position: absolute;

  padding: 6px 10px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.92);

  color: #667085;

  font-size: 10px;

  font-weight: 800;

  box-shadow:

    0 8px 18px

    rgba(16, 24, 40, 0.06);

}

.road-badge--left {

  left: 8px;

  bottom: -12px;

}

.road-badge--right {

  right: 0;

  bottom: -12px;

}

.vehicle {

  position: absolute;

  z-index: 9;

  left: 68%;

  bottom: 14px;

  animation:

    vehicleTravel 7s ease-in-out infinite;

}

.vehicle-box {

  width: 74px;

  height: 58px;

  display: grid;

  place-items: center;

  border-radius: 18px;

  background: #ffffff;

  color: #f97316;

  box-shadow:

    0 13px 28px

    rgba(16, 24, 40, 0.13);

}

/* O caminhão aponta para a esquerda, em direção à propriedade */

.vehicle-truck-icon {

  transform: scaleX(-1);

}

.vehicle-label {

  position: absolute;

  left: 50%;

  bottom: calc(100% + 8px);

  width: max-content;

  transform: translateX(-50%);

  padding: 6px 9px;

  border-radius: 9px;

  background: #ffffff;

  color: #475467;

  font-size: 10px;

  font-weight: 800;

  box-shadow:

    0 8px 18px

    rgba(16, 24, 40, 0.08);

}

/* TÉCNICO */

.tech-area {

  position: absolute;

  z-index: 8;

  right: 50px;

  bottom: 55px;

  width: 175px;

  text-align: center;

}

.tech-box {

  position: relative;

  z-index: 4;

  width: 106px;

  height: 106px;

  margin: 0 auto;

  display: grid;

  place-items: center;

  border-radius: 26px;

  background: #ffffff;

  color: #2563eb;

  box-shadow:

    0 17px 36px

    rgba(37, 99, 235, 0.14);

  animation:

    techFloat 3.2s ease-in-out infinite;

}

.tech-pulse {

  position: absolute;

  z-index: 2;

  left: 50%;

  top: -10px;

  width: 126px;

  height: 126px;

  transform: translateX(-50%);

  border:

    2px dashed

    rgba(16, 185, 129, 0.32);

  border-radius: 50%;

  animation:

    ringRotate 9s linear infinite;

}

.tech-tool {

  position: absolute;

  z-index: 7;

  top: 72px;

  right: 20px;

  width: 39px;

  height: 39px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #fff7ed;

  color: #f97316;

  box-shadow:

    0 8px 18px

    rgba(249, 115, 22, 0.18);

  animation:

    toolWork 1.7s ease-in-out infinite;

}

.tech-title {

  margin-top: 11px;

  color: #344054;

  font-size: 13px;

  font-weight: 800;

}

.tech-subtitle {

  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;

  font-weight: 700;

}

.field-note {

  position: absolute;

  z-index: 11;

  left: 50%;

  bottom: 22px;

  transform: translateX(-50%);

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.92);

  color: #059669;

  font-size: 10px;

  font-weight: 800;

  box-shadow:

    0 8px 18px

    rgba(16, 24, 40, 0.07);

}

/* TERRENO */

.stage-ground {

  position: absolute;

  left: -8%;

  right: -8%;

  border-radius:

    50% 50% 0 0 /

    40% 40% 0 0;

}

.stage-ground--back {

  bottom: -25px;

  height: 120px;

  background: #dff2e3;

}

.stage-ground--front {

  bottom: -55px;

  height: 115px;

  background: #cde9d4;

}

/* ==================================================

   RECURSOS

\=================================================== */

.feature-row {

  position: absolute;

  z-index: 8;

  left: 5%;

  right: 5%;

  bottom: 30px;

  display: grid;

  grid-template-columns:

    repeat(3, 1fr);

  gap: 12px;

}

.feature-item {

  min-height: 56px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  padding: 10px 14px;

  border:

    1px solid

    rgba(255, 255, 255, 0.85);

  border-radius: 15px;

  background:

    rgba(255, 255, 255, 0.82);

  color: #344054;

  font-size: 12px;

  font-weight: 800;

  box-shadow:

    0 10px 24px

    rgba(16, 24, 40, 0.05);

}

.feature-item:nth-child(1) {

  color: #ea580c;

}

.feature-item:nth-child(2) {

  color: #2563eb;

}

.feature-item:nth-child(3) {

  color: #059669;

}

/* ==================================================

   LOGIN

\=================================================== */

.login-panel {

  position: relative;

  z-index: 20;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 42px 34px;

  background: #ffffff;

}

.login-box {

  width: 100%;

  max-width: 470px;

}

.mobile-brand {

  display: none;

}

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

  justify-content: space-between;

  gap: 12px;

}

.forgot-password {

  padding: 0;

  border: none;

  background: transparent;

  color: #f97316;

  cursor: pointer;

  font-family: inherit;

  font-size: 12px;

  font-weight: 700;

}

.forgot-password:hover {

  text-decoration: underline;

}

.forgot-password:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}

.login-input

:deep(.q-field__control) {

  min-height: 58px;

  border-radius: 14px;

  background: #ffffff;

}

.login-input

:deep(.q-field__native) {

  font-size: 14px;

}

.login-button {

  width: 100%;

  min-height: 54px;

  margin-top: 8px;

  border-radius: 14px;

  font-size: 15px;

  font-weight: 800;

}

.divider {

  display: flex;

  align-items: center;

  gap: 14px;

  margin: 28px 0 18px;

  color: #98a2b3;

  font-size: 11px;

  text-align: center;

}

.divider::before,

.divider::after {

  content: '';

  height: 1px;

  flex: 1;

  background: #eaecf0;

}

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

  background: #ffffff;

  color: #344054;

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

  border-color: #f97316;

  color: #f97316;

  background: #fff7ed;

}

.register-button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}

.register-help {

  margin-top: 12px;

  color: #98a2b3;

  font-size: 11px;

  line-height: 1.5;

  text-align: center;

}

/* ==================================================

   MOBILE

\=================================================== */

.mobile-logo {

  display: block;

  width: 190px;

  max-width: 66vw;

  height: auto;

  margin: 0 auto;

  object-fit: contain;

}

.mobile-flow {

  position: relative;

  width: min(300px, 80vw);

  height: 64px;

  margin: 11px auto 5px;

}

.mobile-line {

  position: absolute;

  left: 35px;

  right: 35px;

  top: 30px;

  border-top:

    2px dashed

    rgba(249, 115, 22, 0.30);

}

.mobile-node,

.mobile-truck {

  position: absolute;

  top: 9px;

  width: 42px;

  height: 42px;

  display: grid;

  place-items: center;

  border-radius: 13px;

  background: #ffffff;

  box-shadow:

    0 8px 18px

    rgba(16, 24, 40, 0.08);

}

.mobile-node--farm {

  left: 0;

  color: #2563eb;

}

.mobile-node--tech {

  right: 0;

  color: #2563eb;

}

.mobile-truck {

  left: 72%;

  color: #f97316;

  transform: scaleX(-1);

  animation:

    mobileTravel 5.2s ease-in-out infinite;

}



.mobile-frase {

  max-width: 300px;

  margin: 3px auto 0;

  color: #667085;

  font-size: 11px;

  line-height: 1.5;

  text-align: center;

}

/* ==================================================

   ANIMAÇÕES

\=================================================== */

@keyframes sunPulse {

  0%,

  100% {

    transform: scale(1);

  }

  50% {

    transform: scale(1.10);

  }

}

@keyframes cloudFloat {

  0%,

  100% {

    transform: translateX(0);

  }

  50% {

    transform: translateX(22px);

  }

}

@keyframes statusBlink {

  0%,

  100% {

    opacity: 1;

    transform: scale(1);

  }

  50% {

    opacity: 0.45;

    transform: scale(0.8);

  }

}

@keyframes alertPulse {

  0%,

  100% {

    transform: scale(1);

  }

  50% {

    transform: scale(1.13);

  }

}

@keyframes vehicleTravel {

  /* Surge ao lado do técnico */

  0% {

    left: calc(100% - 76px);

    opacity: 0;

    transform: translateY(0);

  }

  7% {

    left: calc(100% - 76px);

    opacity: 1;

    transform: translateY(0);

  }

  18% {

    left: calc(100% - 76px);

    opacity: 1;

    transform: translateY(0);

  }

  /* Vai somente em direção à propriedade */

  72% {

    left: 0;

    opacity: 1;

    transform: translateY(-3px);

  }

  86% {

    left: 0;

    opacity: 1;

    transform: translateY(-3px);

  }

  /* Some na propriedade e reinicia invisível ao lado do técnico */

  95%,

  100% {

    left: 0;

    opacity: 0;

    transform: translateY(-3px);

  }

}

@keyframes techFloat {

  0%,

  100% {

    transform: translateY(0);

  }

  50% {

    transform: translateY(-8px);

  }

}

@keyframes toolWork {

  0%,

  100% {

    transform:

      rotate(-16deg)

      translateY(0);

  }

  50% {

    transform:

      rotate(24deg)

      translateY(-3px);

  }

}

@keyframes ringRotate {

  to {

    transform:

      translateX(-50%)

      rotate(360deg);

  }

}

@keyframes doneFade {

  0%,

  55% {

    opacity: 0.25;

    transform: translateY(-4px);

  }

  70%,

  95% {

    opacity: 1;

    transform: translateY(0);

  }

  100% {

    opacity: 0.25;

  }

}

@keyframes mobileTravel {

  0% {

    left: 72%;

    opacity: 0;

  }

  7% {

    left: 72%;

    opacity: 1;

  }

  68% {

    left: 17%;

    opacity: 1;

  }

  82% {

    left: 17%;

    opacity: 1;

  }

  88% {

    left: 17%;

    opacity: 0;

  }

  89% {

    left: 72%;

    opacity: 0;

  }

  100% {

    left: 72%;

    opacity: 0;

  }

}

/* ==================================================

   DARK

\=================================================== */

.login-page--dark {

  background: #0f1115;

}

.login-page--dark

.login-branding {

  background:

    linear-gradient(

      145deg,

      #111827 0%,

      #172554 48%,

      #33251c 100%

    );

}

.login-page--dark

.branding-title,

.login-page--dark

.login-title,

.login-page--dark

.field-label {

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

.service-stage {

  border-color:

    rgba(255, 255, 255, 0.08);

  background:

    linear-gradient(

      180deg,

      rgba(17, 24, 39, 0.90) 0%,

      rgba(30, 41, 59, 0.92) 58%,

      rgba(20, 50, 38, 0.94) 58%,

      rgba(19, 66, 45, 0.96) 100%

    );

}

.login-page--dark

.farm-icon,

.login-page--dark

.tech-box,

.login-page--dark

.vehicle-box,

.login-page--dark

.vehicle-label,

.login-page--dark

.stage-status,

.login-page--dark

.done-badge,

.login-page--dark

.eta-card,

.login-page--dark

.field-note,

.login-page--dark

.road-badge,

.login-page--dark

.feature-item,

.login-page--dark

.farm-pin,

.login-page--dark

.mobile-node,

.login-page--dark

.mobile-truck {

  background:

    rgba(17, 24, 39, 0.90);

  border-color:

    rgba(255, 255, 255, 0.07);

}

.login-page--dark

.farm-title,

.login-page--dark

.tech-title,

.login-page--dark

.vehicle-label,

.login-page--dark

.feature-item,

.login-page--dark

.login-page--dark

.mini-card-text,

.login-page--dark

.farm-subtitle,

.login-page--dark

.tech-subtitle {

  color: #cbd5e1;

}

.login-page--dark

.login-panel {

  background: #16191f;

}

.login-page--dark

.login-input

:deep(.q-field__control) {

  background: #16191f;

}

.login-page--dark

.register-button {

  background: #16191f;

  color: #f3f4f6;

  border-color: #353a43;

}

.login-page--dark

.register-button:hover {

  border-color: #f97316;

  color: #fb923c;

  background: #292018;

}

.login-page--dark

.divider::before,

.login-page--dark

.divider::after {

  background: #2b2f36;

}

/* ==================================================

   NOTEBOOK

\=================================================== */

@media (max-width: 1360px) {

  .login-wrapper {

    grid-template-columns:

      minmax(620px, 1fr)

      minmax(470px, 1fr);

  }

  .login-branding {

    padding:

      36px 38px 30px;

  }

  .branding-content {

    width: 68%;

  }

  .branding-title {

    font-size: 37px;

  }

  .service-stage {

    left: 4%;

    right: 4%;

    bottom: 100px;

    height: 308px;

  }

  .feature-row {

    left: 4%;

    right: 4%;

  }

  .road-area {

    right: 214px;

  }

  .tech-area {

    right: 36px;

  }

}

@media (max-height: 820px) and (min-width: 851px) {

  .branding-logo {

    width: 230px;

    margin-bottom: 12px;

  }

  .branding-title {

    margin-top: 13px;

    font-size: 32px;

  }

  .branding-text {

    margin-top: 10px;

    font-size: 14px;

  }

  .service-stage {

    height: 288px;

    bottom: 92px;

  }

  .feature-row {

    bottom: 22px;

  }

}

/* ==================================================

   TABLET / CELULAR

\=================================================== */

@media (max-width: 850px) {

  .login-wrapper {

    display: block;

    width: 100%;

    min-height: 100vh;

  }

  .login-branding {

    display: none;

  }

  .login-panel {

    width: 100%;

    min-height: 100vh;

    display: flex;

    align-items: flex-start;

    justify-content: center;

    overflow-x: hidden;

    padding:

      calc(

        20px +

        env(safe-area-inset-top)

      )

      20px

      calc(

        34px +

        env(safe-area-inset-bottom)

      );

    background: #f7f8fa;

  }

  .login-box {

    width: 100%;

    max-width: 460px;

    margin: 0 auto;

  }

  .mobile-brand {

    width: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    margin-bottom: 19px;

    padding: 0 12px;

    text-align: center;

  }

  .login-header {

    margin-bottom: 24px;

  }

  .login-title {

    font-size: 28px;

  }

  .login-subtitle {

    font-size: 14px;

  }

  .login-page--dark

  .login-panel {

    background: #16191f;

  }

}

@media (max-width: 500px) {

  .login-panel {

    padding:

      calc(

        17px +

        env(safe-area-inset-top)

      )

      18px

      calc(

        28px +

        env(safe-area-inset-bottom)

      );

  }

  .mobile-logo {

    width: 178px;

  }

  .mobile-flow {

    height: 58px;

    margin-top: 8px;

  }

  .mobile-node,

  .mobile-truck {

    width: 38px;

    height: 38px;

  }

  .mobile-line {

    top: 27px;

  }

  .login-title {

    font-size: 26px;

  }

  .login-subtitle {

    font-size: 13px;

  }

  .login-input

  :deep(.q-field__control) {

    min-height: 54px;

  }

  .login-button,

  .register-button {

    min-height: 52px;

  }

}

@media (max-width: 390px) {

  .mobile-logo {

    width: 165px;

  }

  .mobile-flow {

    transform: scale(0.95);

    transform-origin: center top;

    margin-bottom: -2px;

  }

  .login-title {

    font-size: 25px;

  }

}

/* ==================================================

   ACESSIBILIDADE

\=================================================== */

@media (prefers-reduced-motion: reduce) {

  .stage-sun,

  .stage-cloud,

  .status-dot,

  .farm-alert,

  .vehicle,

  .tech-box,

  .tech-pulse,

  .tech-tool,

  .done-badge,

  .mobile-truck {

    animation: none !important;

  }

}


/* ==================================================
   AJUSTE VISUAL DO CENÁRIO
   Mantém somente o caminhão em movimento.
=================================================== */

.stage-sun,
.stage-cloud,
.status-dot,
.farm-alert,
.tech-box,
.tech-tool {
  animation: none !important;
}

.done-badge {
  display: none !important;
}

.tech-pulse {
  display: none !important;
}

.vehicle {
  animation:
    vehicleTravelClean 8s ease-in-out infinite !important;
}

.tech-box {
  box-shadow:
    0 14px 30px
    rgba(37, 99, 235, 0.12);
}

.farm-icon {
  box-shadow:
    0 14px 30px
    rgba(37, 99, 235, 0.10);
}

.stage-status,
.eta-card,
.field-note,
.road-badge,
.vehicle-label {
  backdrop-filter: blur(5px);
}

@keyframes vehicleTravelClean {
  0% {
    left: calc(100% - 76px);
    opacity: 0;
    transform: translateY(0);
  }

  10% {
    left: calc(100% - 76px);
    opacity: 1;
    transform: translateY(0);
  }

  22% {
    left: calc(100% - 76px);
    opacity: 1;
    transform: translateY(0);
  }

  72% {
    left: 0;
    opacity: 1;
    transform: translateY(-2px);
  }

  86% {
    left: 0;
    opacity: 1;
    transform: translateY(-2px);
  }

  96%,
  100% {
    left: 0;
    opacity: 0;
    transform: translateY(-2px);
  }
}

</style>