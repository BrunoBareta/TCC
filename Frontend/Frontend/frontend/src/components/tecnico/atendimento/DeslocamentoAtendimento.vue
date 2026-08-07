<template>
  <div class="deslocamento-card">
    <div class="card-cabecalho">
      <div>
        <div class="card-titulo">
          Deslocamento
        </div>

        <div class="card-subtitulo">
          Registre a quilometragem utilizada nesta assistência.
        </div>
      </div>

      <q-icon
        name="route"
        size="30px"
        color="deep-purple"
      />
    </div>

    <div
      v-if="carregando"
      class="estado-central"
    >
      <q-spinner color="orange" size="35px" />

      <div class="text-grey-7 q-mt-sm">
        Carregando deslocamento...
      </div>
    </div>

    <template v-else>
      <div
        v-if="statusAtual === 'ACEITO' && !deslocamento"
        class="inicio-container"
      >
        <div class="formulario-inicial">
          <q-input
            v-model="kmSaida"
            outlined
            type="number"
            min="0"
            step="0.1"
            label="KM de saída"
            suffix="km"
            :disable="processando"
          >
            <template #prepend>
              <q-icon name="speed" />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="deep-purple"
            icon="local_shipping"
            label="Iniciar deslocamento"
            class="botao-acao"
            :loading="processando"
            :disable="processando"
            @click="iniciarDeslocamento"
          />
        </div>

        <q-separator class="q-my-lg" />

        <div class="desistencia-container">
          <div>
            <div class="desistencia-titulo">
              Não poderá atender este chamado?
            </div>

            <div class="desistencia-texto">
              O chamado será devolvido para a fila de pendentes.
            </div>
          </div>

          <q-btn
            outline
            no-caps
            color="negative"
            icon="undo"
            label="Desistir do chamado"
            :loading="desistindo"
            :disable="processando || desistindo"
            @click="confirmarDesistencia"
          />
        </div>
      </div>

      <div
        v-else-if="deslocamento"
        class="informacoes-deslocamento"
      >
        <div class="informacoes-grid">
          <div class="informacao">
            <div class="informacao-label">
              KM de saída
            </div>

            <div class="informacao-valor">
              {{ formatarKm(deslocamento.km_saida) }}
            </div>
          </div>

          <div class="informacao">
            <div class="informacao-label">
              Saída registrada em
            </div>

            <div class="informacao-valor">
              {{ formatarData(deslocamento.data_saida) }}
            </div>
          </div>

          <div
            v-if="
              deslocamento.km_retorno !== null &&
              deslocamento.km_retorno !== undefined
            "
            class="informacao"
          >
            <div class="informacao-label">
              KM de retorno
            </div>

            <div class="informacao-valor">
              {{ formatarKm(deslocamento.km_retorno) }}
            </div>
          </div>

          <div
            v-if="
              deslocamento.km_total !== null &&
              deslocamento.km_total !== undefined
            "
            class="informacao destaque"
          >
            <div class="informacao-label">
              Distância percorrida
            </div>

            <div class="informacao-valor">
              {{ formatarKm(deslocamento.km_total) }}
            </div>
          </div>

          <div
            v-if="deslocamento.data_retorno"
            class="informacao"
          >
            <div class="informacao-label">
              Retorno registrado em
            </div>

            <div class="informacao-valor">
              {{ formatarData(deslocamento.data_retorno) }}
            </div>
          </div>
        </div>

        <q-separator
          v-if="statusAtual === 'EM_ATENDIMENTO'"
          class="q-my-lg"
        />

        <div
          v-if="statusAtual === 'EM_ATENDIMENTO'"
          class="retorno-container"
        >
          <q-input
            v-model="kmRetorno"
            outlined
            type="number"
            min="0"
            step="0.1"
            label="KM de retorno"
            suffix="km"
            :disable="processando"
          >
            <template #prepend>
              <q-icon name="speed" />
            </template>
          </q-input>

          <div class="previsao-km">
            <div class="previsao-label">
              Distância prevista
            </div>

            <div class="previsao-valor">
              {{ kmTotalPrevisto }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="sem-deslocamento"
      >
        Nenhum deslocamento registrado para este chamado.
      </div>

      <q-separator
        v-if="
          statusAtual !== 'ACEITO' ||
          deslocamento
        "
        class="q-my-lg"
      />

      <div class="acoes">
        <q-btn
          v-if="statusAtual === 'EM_ROTA'"
          unelevated
          no-caps
          color="orange"
          icon="engineering"
          label="Iniciar atendimento"
          class="full-width"
          :loading="processando"
          :disable="processando"
          @click="iniciarAtendimento"
        />

        <q-btn
          v-else-if="statusAtual === 'EM_ATENDIMENTO'"
          unelevated
          no-caps
          color="positive"
          icon="check_circle"
          label="Finalizar atendimento"
          class="full-width"
          :loading="processando"
          :disable="processando"
          @click="finalizarAtendimento"
        />

        <div
          v-else-if="atendimentoFinalizado"
          class="atendimento-concluido"
        >
          <q-icon
            name="task_alt"
            color="positive"
            size="38px"
          />

          <div class="concluido-titulo">
            Atendimento finalizado
          </div>

          <div class="concluido-texto">
            Quilometragem e atendimento concluídos.
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import chamadoService from 'src/services/chamadoService'
import deslocamentoService from 'src/services/deslocamentoService'
import chamadoFuncionarioService from 'src/services/chamadoFuncionarioService'

const props = defineProps({
  chamado: {
    type: Object,
    required: true
  },

  observacao: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'chamado-atualizado'
])

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const deslocamento = ref(null)
const kmSaida = ref('')
const kmRetorno = ref('')
const carregando = ref(false)
const processando = ref(false)
const desistindo = ref(false)

const statusAtual = computed(() =>
  String(props.chamado?.status || '').toUpperCase()
)

const atendimentoFinalizado = computed(() =>
  ['FINALIZADO', 'CONCLUIDO'].includes(
    statusAtual.value
  )
)

const kmTotalPrevisto = computed(() => {
  if (
    !deslocamento.value ||
    kmRetorno.value === ''
  ) {
    return 'Informe o KM de retorno'
  }

  const saida = converterNumero(
    deslocamento.value.km_saida
  )

  const retorno = converterNumero(
    kmRetorno.value
  )

  if (
    !Number.isFinite(saida) ||
    !Number.isFinite(retorno) ||
    retorno < saida
  ) {
    return 'KM inválido'
  }

  return formatarKm(retorno - saida)
})

async function carregarDeslocamento() {
  carregando.value = true

  try {
    const resposta =
      await deslocamentoService.buscarPorChamado(
        props.chamado.id_chamado
      )

    deslocamento.value = resposta || null

    if (
      deslocamento.value?.km_retorno !== null &&
      deslocamento.value?.km_retorno !== undefined
    ) {
      kmRetorno.value =
        deslocamento.value.km_retorno
    }
  } catch (error) {
    const statusHttp = error.response?.status

    if (statusHttp === 404) {
      deslocamento.value = null
      return
    }

    console.error(
      'Erro ao carregar deslocamento:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar o deslocamento.'
    })
  } finally {
    carregando.value = false
  }
}

async function confirmarDesistencia() {
  const confirmou = window.confirm(
    `Deseja desistir do chamado #${props.chamado.id_chamado} e devolvê-lo para a fila de pendentes?`
  )

  if (!confirmou) {
    return
  }

  await desistirChamado()
}

async function desistirChamado() {
  const idFuncionario = Number(
    authStore.usuario?.id_usuario
  )

  if (
    !Number.isInteger(idFuncionario) ||
    idFuncionario <= 0
  ) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível identificar o técnico logado.'
    })

    return
  }

  desistindo.value = true

  try {
    const resposta =
      await chamadoFuncionarioService.desistir(
        props.chamado.id_chamado,
        idFuncionario
      )

    $q.notify({
      type: 'positive',
      message:
        resposta.message ||
        'Chamado devolvido para a fila de pendentes.'
    })

    await router.replace({
      name: 'tecnico-pendentes'
    })
  } catch (error) {
    tratarErro(
      error,
      'Não foi possível desistir do chamado.'
    )
  } finally {
    desistindo.value = false
  }
}

async function iniciarDeslocamento() {
  const idFuncionario = Number(
    authStore.usuario?.id_usuario
  )

  const saida = converterNumero(kmSaida.value)

  if (
    !Number.isInteger(idFuncionario) ||
    idFuncionario <= 0
  ) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível identificar o técnico.'
    })

    return
  }

  if (
    !Number.isFinite(saida) ||
    saida < 0
  ) {
    $q.notify({
      type: 'warning',
      message: 'Informe um KM de saída válido.'
    })

    return
  }

  processando.value = true

  try {
    const respostaDeslocamento =
      await deslocamentoService.iniciar({
        id_chamado: props.chamado.id_chamado,
        id_funcionario: idFuncionario,
        km_saida: saida
      })

    deslocamento.value =
      respostaDeslocamento.deslocamento ||
      respostaDeslocamento

    await atualizarStatus(
      'EM_ROTA',
      'O técnico iniciou o deslocamento para a propriedade.'
    )

    $q.notify({
      type: 'positive',
      message: 'Deslocamento iniciado com sucesso.'
    })
  } catch (error) {
    tratarErro(
      error,
      'Não foi possível iniciar o deslocamento.'
    )
  } finally {
    processando.value = false
  }
}

async function iniciarAtendimento() {
  processando.value = true

  try {
    await atualizarStatus(
      'EM_ATENDIMENTO',
      'O técnico chegou à propriedade e iniciou o atendimento.'
    )

    $q.notify({
      type: 'positive',
      message: 'Atendimento iniciado com sucesso.'
    })
  } catch (error) {
    tratarErro(
      error,
      'Não foi possível iniciar o atendimento.'
    )
  } finally {
    processando.value = false
  }
}

async function finalizarAtendimento() {
  const retorno = converterNumero(
    kmRetorno.value
  )

  const saida = converterNumero(
    deslocamento.value?.km_saida
  )

  if (!props.observacao.trim()) {
    $q.notify({
      type: 'warning',
      message:
        'Digite as observações do atendimento.'
    })

    return
  }

  if (
    !Number.isFinite(retorno) ||
    retorno < 0
  ) {
    $q.notify({
      type: 'warning',
      message: 'Informe um KM de retorno válido.'
    })

    return
  }

  if (retorno < saida) {
    $q.notify({
      type: 'warning',
      message:
        'O KM de retorno não pode ser menor que o KM de saída.'
    })

    return
  }

  processando.value = true

  try {
    const respostaDeslocamento =
      await deslocamentoService.finalizar(
        props.chamado.id_chamado,
        retorno
      )

    deslocamento.value =
      respostaDeslocamento.deslocamento ||
      respostaDeslocamento

    await atualizarStatus(
      'FINALIZADO',
      props.observacao.trim(),
      props.observacao.trim()
    )

    $q.notify({
      type: 'positive',
      message: 'Atendimento finalizado com sucesso.'
    })
  } catch (error) {
    tratarErro(
      error,
      'Não foi possível finalizar o atendimento.'
    )
  } finally {
    processando.value = false
  }
}

async function atualizarStatus(
  novoStatus,
  observacaoHistorico,
  respostaTecnico = null
) {
  const idUsuario = Number(
    authStore.usuario?.id_usuario
  )

  const resposta =
    await chamadoService.atualizarStatus(
      props.chamado.id_chamado,
      {
        status: novoStatus,
        id_usuario_responsavel: idUsuario,
        observacao: observacaoHistorico,
        resposta_tecnico: respostaTecnico
      }
    )

  emit(
    'chamado-atualizado',
    resposta.chamado
  )
}

function converterNumero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return NaN
  }

  return Number(
    String(valor).replace(',', '.')
  )
}

function formatarKm(valor) {
  const numero = converterNumero(valor)

  if (!Number.isFinite(numero)) {
    return 'Não informado'
  }

  return `${numero.toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  })} km`
}

function formatarData(valor) {
  if (!valor) {
    return 'Não informada'
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function tratarErro(error, mensagemPadrao) {
  console.error(mensagemPadrao, error)

  $q.notify({
    type: 'negative',
    message:
      error.response?.data?.message ||
      error.response?.data?.erro ||
      mensagemPadrao
  })
}

watch(
  () => props.chamado.id_chamado,
  carregarDeslocamento
)

onMounted(carregarDeslocamento)
</script>

<style scoped>
.deslocamento-card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.05);
}

.card-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.card-titulo {
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

.card-subtitulo {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
}

.estado-central {
  padding: 25px;
  text-align: center;
}

.formulario-inicial {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto;
  gap: 12px;
}

.botao-acao {
  min-height: 56px;
  padding: 0 22px;
}

.desistencia-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.desistencia-titulo {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.desistencia-texto {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
  line-height: 1.4;
}

.informacoes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.informacao {
  padding: 15px;
  border-radius: 14px;
  background: #f9fafb;
}

.informacao.destaque {
  background: #ecfdf3;
}

.informacao-label {
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.informacao-valor {
  margin-top: 5px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.retorno-container {
  display: grid;
  grid-template-columns:
    minmax(200px, 1fr)
    minmax(180px, 0.6fr);
  gap: 14px;
}

.previsao-km {
  padding: 11px 16px;
  border-radius: 12px;
  background: #f2f4f7;
}

.previsao-label {
  color: #667085;
  font-size: 12px;
}

.previsao-valor {
  margin-top: 4px;
  color: #101828;
  font-size: 16px;
  font-weight: 800;
}

.sem-deslocamento {
  padding: 16px;
  border-radius: 12px;
  color: #667085;
  background: #f9fafb;
  text-align: center;
}

.atendimento-concluido {
  padding: 18px;
  text-align: center;
}

.concluido-titulo {
  margin-top: 8px;
  color: #027a48;
  font-size: 16px;
  font-weight: 800;
}

.concluido-texto {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

@media (max-width: 650px) {
  .deslocamento-card {
    padding: 20px;
  }

  .formulario-inicial,
  .retorno-container,
  .informacoes-grid {
    grid-template-columns: 1fr;
  }

  .desistencia-container {
    align-items: stretch;
    flex-direction: column;
  }

  .botao-acao,
  .desistencia-container .q-btn {
    width: 100%;
  }
}
</style>