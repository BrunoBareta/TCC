<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">
          Login
        </div>

        <div class="text-grey-7 q-mt-xs">
          Sistema de Chamados
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          label="E-mail"
          type="email"
          outlined
          :disable="carregando"
          @keyup.enter="fazerLogin"
        >
          <template #prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          v-model="senha"
          label="Senha"
          :type="mostrarSenha ? 'text' : 'password'"
          outlined
          class="q-mt-md"
          :disable="carregando"
          @keyup.enter="fazerLogin"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>

          <template #append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions class="q-px-md q-pb-lg">
        <q-btn
          label="Entrar"
          color="primary"
          class="full-width"
          unelevated
          :loading="carregando"
          @click="fazerLogin"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { redirecionarPorPerfil } from 'src/router/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const carregando = ref(false)
const mostrarSenha = ref(false)

const fazerLogin = async () => {
  if (!email.value.trim() || !senha.value) {
    $q.notify({
      type: 'warning',
      message: 'Informe o e-mail e a senha.'
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
      message: 'Login realizado com sucesso.'
    })

    const destino = redirecionarPorPerfil(
      authStore.tipoUsuario
    )

    await router.replace(destino)
  } catch (error) {
    const mensagem =
      error.response?.data?.message ||
      'Não foi possível realizar o login.'

    $q.notify({
      type: 'negative',
      message: mensagem
    })
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 400px;
  max-width: 90vw;
  border-radius: 14px;
}
</style>