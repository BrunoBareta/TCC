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
        <div class="icone-topo">
          <q-icon
            :name="iconeEtapa"
            size="30px"
          />
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
            Escolha uma nova senha para acessar sua conta.
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

  background: #f5f6f8;
}

.recuperar-container {
  width: 100%;
  max-width: 470px;
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
  padding: 34px;

  border: 1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 8px 28px
    rgba(16, 24, 40, 0.07);
}

.icone-topo {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 21px;

  border-radius: 16px;

  color: #f97316;
  background: #fff1e6;
}

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

@media (max-width: 500px) {
  .recuperar-page {
    align-items: flex-start;

    padding:
      25px 16px 40px;
  }

  .recuperar-card {
    padding: 25px 19px;
  }

  .titulo {
    font-size: 22px;
  }
}
</style>