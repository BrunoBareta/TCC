<template>
  <q-page class="recuperar-page">
    <div class="recuperar-container">
      <button
        type="button"
        class="voltar"
        @click="voltarLogin"
      >
        <q-icon
          name="arrow_back"
          size="19px"
        />

        Voltar para o login
      </button>

      <div class="recuperar-card">
        <div class="recuperacao-visual">
          <div class="visual-topo">
            <div class="visual-status">
              <span
                class="status-ponto"
                :class="{ ativo: carregando }"
              ></span>
              {{ textoStatus }}
            </div>

            <div class="etapa-contador">
              Etapa {{ etapa }} de 3
            </div>
          </div>

          <div
            class="fluxo"
            :class="`fluxo--etapa-${etapa}`"
          >
            <div class="fluxo-linha"></div>

            <div
              class="fluxo-preenchimento"
              :style="{ width: progressoFluxo }"
            ></div>

            <div
              class="fluxo-no fluxo-no--email"
              :class="{
                ativo: etapa >= 1,
                concluido: etapa > 1
              }"
            >
              <q-icon
                :name="etapa > 1 ? 'check' : 'mail_outline'"
                size="23px"
              />
            </div>

            <div
              class="fluxo-no fluxo-no--codigo"
              :class="{
                ativo: etapa >= 2,
                concluido: etapa > 2
              }"
            >
              <q-icon
                :name="etapa > 2 ? 'check' : 'password'"
                size="23px"
              />
            </div>

            <div
              class="fluxo-no fluxo-no--senha"
              :class="{ ativo: etapa >= 3 }"
            >
              <q-icon
                :name="etapa >= 3 ? 'lock_open' : 'lock_outline'"
                size="23px"
              />
            </div>

            <div
              v-if="etapa === 1"
              class="animacao-email"
            >
              <div class="email-orbita email-orbita--1"></div>
              <div class="email-orbita email-orbita--2"></div>

              <div class="email-centro">
                <q-icon
                  name="mark_email_unread"
                  size="32px"
                />
              </div>

              <span class="email-particula email-particula--1"></span>
              <span class="email-particula email-particula--2"></span>
              <span class="email-particula email-particula--3"></span>
            </div>

            <div
              v-else-if="etapa === 2"
              class="animacao-codigo"
            >
              <div
                v-for="numero in 6"
                :key="numero"
                class="digito"
                :style="{ animationDelay: `${numero * 0.09}s` }"
              >
                •
              </div>

              <div class="codigo-envelope">
                <q-icon
                  name="mail"
                  size="18px"
                />
              </div>
            </div>

            <div
              v-else
              class="animacao-senha"
            >
              <div class="cadeado-anel"></div>

              <div class="cadeado-centro">
                <q-icon
                  name="lock_open"
                  size="32px"
                />
              </div>

              <div class="senha-check">
                <q-icon
                  name="verified"
                  size="18px"
                />
              </div>
            </div>
          </div>

          <div class="fluxo-legendas">
            <span :class="{ ativo: etapa >= 1 }">
              E-mail
            </span>
            <span :class="{ ativo: etapa >= 2 }">
              Código
            </span>
            <span :class="{ ativo: etapa >= 3 }">
              Nova senha
            </span>
          </div>
        </div>

        <!-- =========================
             ETAPA 1 - EMAIL
        ========================== -->

        <template v-if="etapa === 1">
          <div class="titulo">
            Recuperar senha
          </div>

          <div class="subtitulo">
            Informe o e-mail da sua conta.
            Enviaremos um código para confirmar sua identidade.
          </div>

          <q-input
            v-model="email"
            outlined
            type="email"
            label="E-mail"
            :disable="carregando"
            class="q-mt-lg"
            @keyup.enter="enviarCodigo"
          >
            <template #prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="orange"
            label="Enviar código"
            class="botao-principal"
            :loading="carregando"
            @click="enviarCodigo"
          />
        </template>

        <!-- =========================
             ETAPA 2 - CÓDIGO
        ========================== -->

        <template v-else-if="etapa === 2">
          <div class="titulo">
            Verifique seu e-mail
          </div>

          <div class="subtitulo">
            Digite o código de 6 dígitos enviado para:
          </div>

          <div class="email-destino">
            {{ email }}
          </div>

          <q-input
            v-model="codigo"
            outlined
            label="Código de verificação"
            mask="######"
            maxlength="6"
            :disable="carregando"
            class="codigo-campo"
            input-class="codigo-input"
            @keyup.enter="confirmarCodigo"
          >
            <template #prepend>
              <q-icon name="password" />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="orange"
            label="Confirmar código"
            class="botao-principal"
            :loading="carregando"
            @click="confirmarCodigo"
          />

          <button
            type="button"
            class="reenviar"
            :disabled="carregando"
            @click="reenviarCodigo"
          >
            Não recebeu o código?
            <strong>Reenviar</strong>
          </button>
        </template>

        <!-- =========================
             ETAPA 3 - NOVA SENHA
        ========================== -->

        <template v-else>
          <div class="titulo">
            Criar nova senha
          </div>

          <div class="subtitulo">
            Sua identidade foi confirmada.
            Agora escolha uma nova senha para acessar sua conta.
          </div>

          <q-input
            v-model="novaSenha"
            outlined
            label="Nova senha"
            :type="
              mostrarSenha
                ? 'text'
                : 'password'
            "
            :disable="carregando"
            class="q-mt-lg"
          >
            <template #prepend>
              <q-icon name="lock_outline" />
            </template>

            <template #append>
              <q-icon
                :name="
                  mostrarSenha
                    ? 'visibility_off'
                    : 'visibility'
                "
                class="cursor-pointer"
                @click="
                  mostrarSenha =
                    !mostrarSenha
                "
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmarSenha"
            outlined
            label="Confirmar nova senha"
            type="password"
            :disable="carregando"
            class="q-mt-md"
            @keyup.enter="salvarNovaSenha"
          >
            <template #prepend>
              <q-icon name="verified_user" />
            </template>
          </q-input>

          <div class="senha-ajuda">
            A senha deve possuir pelo menos 6 caracteres.
          </div>

          <q-btn
            unelevated
            no-caps
            color="orange"
            label="Salvar nova senha"
            class="botao-principal"
            :loading="carregando"
            @click="salvarNovaSenha"
          />
        </template>
      </div>
    </div>
  </q-page>
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

import redefinicaoSenhaService from
  'src/services/redefinicaoSenhaService'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const etapa = ref(1)

const email = ref(
  String(
    route.query.email || ''
  )
)

const codigo = ref('')

const novaSenha = ref('')
const confirmarSenha = ref('')

const mostrarSenha = ref(false)

const carregando = ref(false)

const iconeEtapa = computed(() => {
  if (etapa.value === 1) {
    return 'mail_lock'
  }

  if (etapa.value === 2) {
    return 'password'
  }

  return 'lock_reset'
})


const textoStatus = computed(() => {
  if (carregando.value) {
    if (etapa.value === 1) {
      return 'Enviando código com segurança...'
    }

    if (etapa.value === 2) {
      return 'Validando sua identidade...'
    }

    return 'Atualizando sua senha...'
  }

  if (etapa.value === 1) {
    return 'Identificação da conta'
  }

  if (etapa.value === 2) {
    return 'Código enviado por e-mail'
  }

  return 'Identidade confirmada'
})

const progressoFluxo = computed(() => {
  if (etapa.value === 1) {
    return '0%'
  }

  if (etapa.value === 2) {
    return '50%'
  }

  return '78%'
})

async function enviarCodigo() {
  if (!email.value.trim()) {
    aviso(
      'Informe seu e-mail.'
    )

    return
  }

  carregando.value = true

  try {
    const resposta =
      await redefinicaoSenhaService
        .solicitarCodigo(
          email.value.trim()
        )

    $q.notify({
      type: 'positive',
      message:
        resposta.message ||
        'Código enviado.'
    })

    etapa.value = 2
  } catch (error) {
    mostrarErro(
      error,
      'Não foi possível enviar o código.'
    )
  } finally {
    carregando.value = false
  }
}

async function reenviarCodigo() {
  codigo.value = ''

  etapa.value = 1

  await enviarCodigo()
}

async function confirmarCodigo() {
  const codigoLimpo =
    String(codigo.value)
      .replace(/\D/g, '')

  if (codigoLimpo.length !== 6) {
    aviso(
      'Digite o código de 6 dígitos.'
    )

    return
  }

  carregando.value = true

  try {
    await redefinicaoSenhaService
      .verificarCodigo(
        email.value.trim(),
        codigoLimpo
      )

    codigo.value = codigoLimpo

    etapa.value = 3

    $q.notify({
      type: 'positive',
      message:
        'Código confirmado.'
    })
  } catch (error) {
    mostrarErro(
      error,
      'Código inválido ou expirado.'
    )
  } finally {
    carregando.value = false
  }
}

async function salvarNovaSenha() {
  if (
    novaSenha.value.length < 6
  ) {
    aviso(
      'A senha deve possuir pelo menos 6 caracteres.'
    )

    return
  }

  if (
    novaSenha.value !==
    confirmarSenha.value
  ) {
    aviso(
      'As senhas não coincidem.'
    )

    return
  }

  carregando.value = true

  try {
    await redefinicaoSenhaService
      .redefinirSenha(
        email.value.trim(),
        codigo.value,
        novaSenha.value
      )

    $q.notify({
      type: 'positive',
      timeout: 4500,

      message:
        'Senha alterada com sucesso. Entre com sua nova senha.'
    })

    await router.replace({
      name: 'login'
    })
  } catch (error) {
    mostrarErro(
      error,
      'Não foi possível redefinir sua senha.'
    )
  } finally {
    carregando.value = false
  }
}

function aviso(mensagem) {
  $q.notify({
    type: 'warning',
    message: mensagem
  })
}

function mostrarErro(
  error,
  mensagemPadrao
) {
  console.error(error)

  $q.notify({
    type: 'negative',

    message:
      error.response?.data
        ?.message ||
      error.response?.data
        ?.erro ||
      mensagemPadrao
  })
}

function voltarLogin() {
  router.push({
    name: 'login'
  })
}
</script>

<style scoped>
.recuperar-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background:
    radial-gradient(
      circle at 16% 12%,
      rgba(249, 115, 22, 0.09),
      transparent 27%
    ),
    radial-gradient(
      circle at 84% 82%,
      rgba(37, 99, 235, 0.08),
      transparent 31%
    ),
    #f5f6f8;
}

.recuperar-container {
  width: 100%;
  max-width: 520px;
}

.voltar {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 16px;
  padding: 0;
  border: none;
  color: #667085;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
}

.voltar:hover {
  color: #f97316;
}

.recuperar-card {
  padding: 28px 32px 34px;
  border: 1px solid #eaecf0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow:
    0 16px 42px
    rgba(16, 24, 40, 0.08);
}

/* ==================================================
   PAINEL ANIMADO
=================================================== */

.recuperacao-visual {
  margin-bottom: 27px;
  padding: 17px 17px 14px;
  overflow: hidden;
  border: 1px solid #edf0f5;
  border-radius: 20px;
  background:
    linear-gradient(
      145deg,
      #fffaf5 0%,
      #f7fbff 100%
    );
}

.visual-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.visual-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #475467;
  font-size: 11px;
  font-weight: 800;
}

.status-ponto {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #10b981;
}

.status-ponto.ativo {
  animation: statusPulse 1s ease-in-out infinite;
}

.etapa-contador {
  padding: 5px 9px;
  border-radius: 999px;
  background: #ffffff;
  color: #98a2b3;
  font-size: 10px;
  font-weight: 800;
  box-shadow:
    0 5px 12px
    rgba(16, 24, 40, 0.05);
}

.fluxo {
  position: relative;
  height: 126px;
}

.fluxo-linha,
.fluxo-preenchimento {
  position: absolute;
  top: 34px;
  left: 11%;
  height: 3px;
  border-radius: 999px;
}

.fluxo-linha {
  right: 11%;
  background: #e4e7ec;
}

.fluxo-preenchimento {
  max-width: 78%;
  background:
    linear-gradient(
      90deg,
      #f97316,
      #2563eb
    );
  transition: width 0.5s ease;
}

.fluxo-no {
  position: absolute;
  top: 13px;
  z-index: 5;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 2px solid #e4e7ec;
  border-radius: 50%;
  background: #ffffff;
  color: #98a2b3;
  box-shadow:
    0 8px 18px
    rgba(16, 24, 40, 0.06);
  transition: all 0.3s ease;
}

.fluxo-no.ativo {
  border-color: #fb923c;
  color: #f97316;
  box-shadow:
    0 0 0 6px
    rgba(249, 115, 22, 0.08);
}

.fluxo-no.concluido {
  border-color: #10b981;
  background: #ecfdf3;
  color: #059669;
}

.fluxo-no--email {
  left: 6%;
}

.fluxo-no--codigo {
  left: 50%;
  transform: translateX(-50%);
}

.fluxo-no--senha {
  right: 6%;
}

/* Etapa 1: e-mail sendo preparado */

.animacao-email {
  position: absolute;
  left: 5%;
  top: 68px;
  width: 58px;
  height: 58px;
}

.email-centro {
  position: absolute;
  z-index: 3;
  inset: 7px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #ffffff;
  color: #f97316;
  box-shadow:
    0 9px 20px
    rgba(249, 115, 22, 0.13);
  animation: emailFloat 2s ease-in-out infinite;
}

.email-orbita {
  position: absolute;
  border: 1px dashed
    rgba(249, 115, 22, 0.30);
  border-radius: 50%;
  animation: orbita 5s linear infinite;
}

.email-orbita--1 {
  inset: 0;
}

.email-orbita--2 {
  inset: 5px;
  animation-direction: reverse;
}

.email-particula {
  position: absolute;
  z-index: 4;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  animation: particula 1.8s ease-in-out infinite;
}

.email-particula--1 {
  right: 2px;
  top: 7px;
}

.email-particula--2 {
  right: -7px;
  top: 26px;
  animation-delay: 0.3s;
}

.email-particula--3 {
  right: 4px;
  bottom: 2px;
  animation-delay: 0.6s;
}

/* Etapa 2: código recebido */

.animacao-codigo {
  position: absolute;
  left: 50%;
  top: 77px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
}

.digito {
  width: 18px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #ffffff;
  color: #2563eb;
  font-size: 18px;
  font-weight: 900;
  box-shadow:
    0 7px 14px
    rgba(37, 99, 235, 0.08);
  animation: digitBounce 1.3s ease-in-out infinite;
}

.codigo-envelope {
  position: absolute;
  left: -36px;
  top: 2px;
  color: #f97316;
  animation: envelopeMove 2.4s ease-in-out infinite;
}

/* Etapa 3: desbloqueio */

.animacao-senha {
  position: absolute;
  right: 5%;
  top: 67px;
  width: 62px;
  height: 62px;
}

.cadeado-centro {
  position: absolute;
  z-index: 3;
  inset: 7px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #ffffff;
  color: #059669;
  box-shadow:
    0 9px 20px
    rgba(16, 185, 129, 0.13);
  animation: unlockFloat 2s ease-in-out infinite;
}

.cadeado-anel {
  position: absolute;
  inset: 0;
  border: 2px dashed
    rgba(16, 185, 129, 0.27);
  border-radius: 50%;
  animation: orbita 6s linear infinite;
}

.senha-check {
  position: absolute;
  z-index: 5;
  right: -4px;
  top: -5px;
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ffffff;
  color: #10b981;
  box-shadow:
    0 7px 16px
    rgba(16, 185, 129, 0.14);
  animation: checkPop 1.8s ease-in-out infinite;
}

.fluxo-legendas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #98a2b3;
  font-size: 10px;
  font-weight: 800;
  text-align: center;
}

.fluxo-legendas span.ativo {
  color: #344054;
}

/* ==================================================
   CONTEÚDO
=================================================== */

.titulo {
  color: #101828;
  font-size: 26px;
  font-weight: 900;
}

.subtitulo {
  margin-top: 7px;
  color: #667085;
  font-size: 13px;
  line-height: 1.55;
}

.email-destino {
  margin-top: 7px;
  margin-bottom: 22px;
  color: #f97316;
  font-size: 13px;
  font-weight: 800;
  word-break: break-all;
}

.codigo-campo {
  margin-top: 4px;
}

:deep(.codigo-input) {
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 8px;
}

.botao-principal {
  width: 100%;
  min-height: 50px;
  margin-top: 20px;
  border-radius: 11px;
  font-weight: 800;
}

.reenviar {
  width: 100%;
  margin-top: 18px;
  border: none;
  color: #667085;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
}

.reenviar strong {
  color: #f97316;
}

.senha-ajuda {
  margin-top: 8px;
  color: #98a2b3;
  font-size: 10px;
}

/* ==================================================
   ANIMAÇÕES
=================================================== */

@keyframes statusPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.4;
    transform: scale(0.78);
  }
}

@keyframes emailFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes orbita {
  to {
    transform: rotate(360deg);
  }
}

@keyframes particula {
  0%,
  100% {
    opacity: 0.25;
    transform: translateX(0) scale(0.8);
  }

  50% {
    opacity: 1;
    transform: translateX(8px) scale(1.15);
  }
}

@keyframes digitBounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes envelopeMove {
  0%,
  100% {
    transform: translateX(0) rotate(-7deg);
  }

  50% {
    transform: translateX(12px) rotate(7deg);
  }
}

@keyframes unlockFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-5px) rotate(4deg);
  }
}

@keyframes checkPop {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.14);
  }
}

/* ==================================================
   MOBILE
=================================================== */

@media (max-width: 500px) {
  .recuperar-page {
    align-items: flex-start;
    padding:
      22px 16px
      calc(
        35px +
        env(safe-area-inset-bottom)
      );
  }

  .recuperar-container {
    max-width: 100%;
  }

  .recuperar-card {
    padding: 21px 17px 25px;
    border-radius: 20px;
  }

  .recuperacao-visual {
    margin-bottom: 23px;
    padding: 15px 12px 13px;
  }

  .visual-status {
    font-size: 10px;
  }

  .etapa-contador {
    font-size: 9px;
  }

  .fluxo {
    height: 112px;
  }

  .fluxo-no {
    width: 39px;
    height: 39px;
  }

  .fluxo-linha,
  .fluxo-preenchimento {
    top: 32px;
  }

  .animacao-email,
  .animacao-senha {
    transform: scale(0.88);
    transform-origin: center top;
  }

  .animacao-codigo {
    transform:
      translateX(-50%)
      scale(0.88);
  }

  .titulo {
    font-size: 22px;
  }

  .subtitulo {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-ponto,
  .email-centro,
  .email-orbita,
  .email-particula,
  .digito,
  .codigo-envelope,
  .cadeado-centro,
  .cadeado-anel,
  .senha-check {
    animation: none !important;
  }
}
</style>