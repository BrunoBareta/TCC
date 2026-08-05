<template>
  <q-form
    ref="formRef"
    class="formulario-card"
    @submit.prevent="enviarChamado"
  >
    <div class="formulario-cabecalho">
      <div>
        <div class="formulario-titulo">
          Novo Chamado de Assistência
        </div>

        <div class="formulario-subtitulo">
          Preencha os detalhes para solicitar um técnico.
        </div>
      </div>

      <q-icon
        name="support_agent"
        size="36px"
        color="orange"
      />
    </div>

    <q-separator />

    <div class="formulario-conteudo">
      <CamposChamado :formulario="formulario" />

      <div class="q-mt-lg">
        <UploadArquivos />
      </div>
    </div>

    <q-separator />

    <div class="formulario-acoes">
      <q-btn
        flat
        no-caps
        label="Cancelar"
        color="grey-7"
        :disable="carregando"
        @click="cancelar"
      />

      <q-btn
        unelevated
        no-caps
        type="submit"
        icon-right="check_circle_outline"
        label="Abrir chamado"
        class="botao-enviar"
        :loading="carregando"
      />
    </div>
  </q-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import chamadoService from 'src/services/chamadoService'
import CamposChamado from './CamposChamado.vue'
import UploadArquivos from './UploadArquivos.vue'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const formRef = ref(null)
const carregando = ref(false)

const formulario = reactive({
  id_propriedade: 1,
  tipo_cultura: 'AVES',
  tipo_chamado: 'ASSISTENCIA',
  problema: '',
  descricao: '',
  urgencia: 'BAIXA'
})

async function enviarChamado() {
  const valido = await formRef.value?.validate()

  if (!valido) {
    $q.notify({
      type: 'warning',
      message: 'Preencha corretamente os campos obrigatórios.'
    })

    return
  }

  const idUsuario = authStore.usuario?.id_usuario
  
  console.log('Usuário logado:', authStore.usuario)
  console.log('ID do usuário:', idUsuario)

  if (!idUsuario) {
    $q.notify({
      type: 'negative',
      message: 'Não foi possível identificar o usuário logado.'
    })

    return
  }

  carregando.value = true

  try {
    const dados = {
      id_usuario: idUsuario,
      id_propriedade: formulario.id_propriedade,
      tipo_cultura: formulario.tipo_cultura,
      tipo_chamado: formulario.tipo_chamado,
      problema: formulario.problema.trim(),
      descricao: formulario.descricao.trim(),
      urgencia: formulario.urgencia
    }

    const chamado = await chamadoService.criar(dados)

    $q.notify({
      type: 'positive',
      message: `Chamado #${chamado.id_chamado} aberto com sucesso.`
    })

    await router.replace({
      name: 'produtor-chamados'
    })
  } catch (error) {
    console.error('Erro ao abrir chamado:', error)

    const mensagem =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      'Não foi possível abrir o chamado.'

    $q.notify({
      type: 'negative',
      message: mensagem
    })
  } finally {
    carregando.value = false
  }
}

async function cancelar() {
  await router.push({
    name: 'produtor-chamados'
  })
}
</script>

<style scoped>
.formulario-card {
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
}

.formulario-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 30px;
}

.formulario-titulo {
  color: #101828;
  font-size: 22px;
  font-weight: 800;
}

.formulario-subtitulo {
  margin-top: 4px;
  color: #667085;
  font-size: 14px;
}

.formulario-conteudo {
  padding: 28px 30px;
}

.formulario-acoes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 30px;
}

.botao-enviar {
  min-height: 48px;
  padding: 0 28px;
  border-radius: 14px;
  background: #ff7a1a;
  color: #ffffff;
  font-weight: 700;
}

@media (max-width: 700px) {
  .formulario-cabecalho,
  .formulario-conteudo,
  .formulario-acoes {
    padding-left: 18px;
    padding-right: 18px;
  }

  .formulario-acoes {
    flex-direction: column-reverse;
  }

  .formulario-acoes :deep(.q-btn) {
    width: 100%;
  }
}
</style>