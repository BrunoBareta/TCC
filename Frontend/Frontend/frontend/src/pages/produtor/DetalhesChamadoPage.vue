<template>
  <q-page class="detalhes-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Detalhes do chamado
        </div>

        <div class="pagina-subtitulo">
          Acompanhe as informações e o andamento da solicitação.
        </div>
      </div>

      <div class="cabecalho-acoes">
        <q-btn
          v-if="podeAlterarChamado"
          outline
          no-caps
          color="primary"
          icon="edit"
          label="Editar chamado"
          @click="abrirEdicao"
        />

        <q-btn
          v-if="podeAlterarChamado"
          outline
          no-caps
          color="negative"
          icon="cancel"
          label="Cancelar chamado"
          @click="abrirCancelamento"
        />

        <q-btn
          flat
          no-caps
          icon="arrow_back"
          label="Voltar"
          color="grey-7"
          :to="{ name: 'produtor-chamados' }"
        />
      </div>
    </div>

    <div
      v-if="carregando"
      class="text-center q-pa-xl"
    >
      <q-spinner
        color="orange"
        size="48px"
      />

      <div class="text-grey-7 q-mt-md">
        Carregando chamado...
      </div>
    </div>

    <q-banner
      v-else-if="erro"
      rounded
      class="bg-red-1 text-negative"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarDados"
        />
      </template>
    </q-banner>

    <template v-else-if="chamado">
      <q-banner
        v-if="!podeAlterarChamado"
        rounded
        class="banner-bloqueado q-mb-lg"
      >
        <div class="banner-conteudo">
          <q-icon
            name="lock"
            size="22px"
          />

          <div>
            <div class="banner-titulo">
              Alterações bloqueadas
            </div>

            <div class="banner-texto">
              Este chamado não pode mais ser editado ou cancelado,
              pois já foi aceito para atendimento.
            </div>
          </div>
        </div>
      </q-banner>

      <div class="detalhes-grid">
        <div>
          <ResumoChamado
            :chamado="chamado"
          />

          <div class="q-mt-lg">
            <InformacoesChamado
              :chamado="chamado"
            />
          </div>
        </div>

        <HistoricoChamado
          :chamado="chamado"
          :historicos="historicos"
          :carregando="carregandoHistorico"
        />
      </div>
    </template>

    <!-- ========================= -->
    <!-- EDITAR CHAMADO -->
    <!-- ========================= -->

    <q-dialog
      v-model="dialogEditar"
      persistent
    >
      <q-card class="dialog-card">
        <q-card-section class="dialog-cabecalho">
          <div>
            <div class="dialog-titulo">
              Editar chamado
            </div>

            <div class="dialog-subtitulo">
              Atualize as informações antes que o chamado seja aceito.
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="grey-7"
            :disable="salvando"
            @click="fecharEdicao"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-conteudo">
          <q-input
            v-model="formulario.problema"
            outlined
            label="Problema"
            maxlength="150"
            :disable="salvando"
          />

          <q-input
            v-model="formulario.descricao"
            outlined
            type="textarea"
            autogrow
            label="Descrição do problema"
            maxlength="1000"
            counter
            class="q-mt-md"
            :disable="salvando"
          />

          <div class="form-grid q-mt-md">
            <q-input
              v-model="formulario.tipo_cultura"
              outlined
              label="Cultura"
              :disable="salvando"
            />

            <q-input
              v-model="formulario.tipo_chamado"
              outlined
              label="Tipo do chamado"
              :disable="salvando"
            />
          </div>

          <q-select
            v-model="formulario.urgencia"
            outlined
            emit-value
            map-options
            label="Urgência"
            class="q-mt-md"
            :options="opcoesUrgencia"
            :disable="salvando"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="right"
          class="q-pa-md"
        >
          <q-btn
            flat
            no-caps
            color="grey-7"
            label="Cancelar"
            :disable="salvando"
            @click="fecharEdicao"
          />

          <q-btn
            unelevated
            no-caps
            color="orange"
            icon="save"
            label="Salvar alterações"
            :loading="salvando"
            @click="salvarEdicao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ========================= -->
    <!-- CANCELAR CHAMADO -->
    <!-- ========================= -->

    <q-dialog
      v-model="dialogCancelar"
      persistent
    >
      <q-card class="cancelamento-card">
        <q-card-section>
          <div class="cancelamento-icone">
            <q-icon
              name="warning_amber"
              color="negative"
              size="42px"
            />
          </div>

          <div class="cancelamento-titulo">
            Cancelar chamado?
          </div>

          <div class="cancelamento-texto">
            O chamado
            <strong>
              #{{ chamado?.id_chamado }}
            </strong>
            será cancelado e não ficará mais disponível para
            atendimento.
          </div>
        </q-card-section>

        <q-card-actions
          align="center"
          class="q-px-lg q-pb-lg"
        >
          <q-btn
            flat
            no-caps
            color="grey-7"
            label="Voltar"
            :disable="cancelando"
            @click="dialogCancelar = false"
          />

          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="cancel"
            label="Sim, cancelar chamado"
            :loading="cancelando"
            @click="cancelarChamado"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import chamadoService from 'src/services/chamadoService'
import historicoService from 'src/services/historicoService'

import ResumoChamado from 'src/components/produtor/chamados/detalhes/ResumoChamado.vue'
import InformacoesChamado from 'src/components/produtor/chamados/detalhes/InformacoesChamado.vue'
import HistoricoChamado from 'src/components/produtor/chamados/detalhes/HistoricoChamado.vue'

const route = useRoute()
const $q = useQuasar()

const chamado = ref(null)
const historicos = ref([])

const carregando = ref(false)
const carregandoHistorico = ref(false)

const salvando = ref(false)
const cancelando = ref(false)

const erro = ref('')

const dialogEditar = ref(false)
const dialogCancelar = ref(false)

const formulario = reactive({
  problema: '',
  descricao: '',
  tipo_cultura: '',
  tipo_chamado: '',
  urgencia: ''
})

const opcoesUrgencia = [
  {
    label: 'Baixa',
    value: 'BAIXA'
  },
  {
    label: 'Média',
    value: 'MEDIA'
  },
  {
    label: 'Alta',
    value: 'ALTA'
  }
]

const statusAtual = computed(() =>
  String(
    chamado.value?.status || ''
  ).toUpperCase()
)

const podeAlterarChamado = computed(() =>
  statusAtual.value === 'PENDENTE'
)

async function carregarDados() {
  carregando.value = true
  erro.value = ''

  try {
    const idChamado = Number(
      route.params.id
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      throw new Error(
        'ID do chamado inválido.'
      )
    }

    chamado.value =
      await chamadoService.buscarPorId(
        idChamado
      )

    await carregarHistorico()
  } catch (error) {
    console.error(
      'Erro ao carregar chamado:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar os detalhes do chamado.'
  } finally {
    carregando.value = false
  }
}

async function carregarHistorico() {
  if (!chamado.value?.id_chamado) {
    return
  }

  carregandoHistorico.value = true

  try {
    const resposta =
      await historicoService.listarPorChamado(
        chamado.value.id_chamado
      )

    historicos.value = Array.isArray(resposta)
      ? resposta
      : resposta?.data || []
  } catch (error) {
    console.error(
      'Erro ao carregar histórico:',
      error
    )

    historicos.value = []
  } finally {
    carregandoHistorico.value = false
  }
}

function abrirEdicao() {
  if (!podeAlterarChamado.value) {
    $q.notify({
      type: 'warning',
      message:
        'Este chamado não pode mais ser editado.'
    })

    return
  }

  formulario.problema =
    chamado.value.problema || ''

  formulario.descricao =
    chamado.value.descricao || ''

  formulario.tipo_cultura =
    chamado.value.tipo_cultura || ''

  formulario.tipo_chamado =
    chamado.value.tipo_chamado || ''

  formulario.urgencia =
    chamado.value.urgencia || ''

  dialogEditar.value = true
}

function fecharEdicao() {
  if (salvando.value) {
    return
  }

  dialogEditar.value = false
}

async function salvarEdicao() {
  const problema =
    formulario.problema.trim()

  const descricao =
    formulario.descricao.trim()

  const tipoCultura =
    formulario.tipo_cultura.trim()

  const tipoChamado =
    formulario.tipo_chamado.trim()

  if (!problema) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o problema do chamado.'
    })

    return
  }

  if (!descricao) {
    $q.notify({
      type: 'warning',
      message:
        'Informe a descrição do problema.'
    })

    return
  }

  if (!tipoCultura) {
    $q.notify({
      type: 'warning',
      message:
        'Informe a cultura.'
    })

    return
  }

  if (!tipoChamado) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o tipo do chamado.'
    })

    return
  }

  if (!formulario.urgencia) {
    $q.notify({
      type: 'warning',
      message:
        'Informe a urgência.'
    })

    return
  }

  salvando.value = true

  try {
    const chamadoAtualizado =
      await chamadoService.atualizar(
        chamado.value.id_chamado,
        {
          tipo_cultura: tipoCultura,
          tipo_chamado: tipoChamado,
          problema,
          descricao,
          urgencia:
            formulario.urgencia,

          // Mantemos essas informações porque
          // o PUT atual do backend atualiza
          // todas essas colunas.
          status:
            chamado.value.status,

          resposta_tecnico:
            chamado.value.resposta_tecnico ||
            null
        }
      )

    chamado.value =
      chamadoAtualizado.chamado ||
      chamadoAtualizado

    dialogEditar.value = false

    $q.notify({
      type: 'positive',
      message:
        'Chamado atualizado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao atualizar chamado:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível atualizar o chamado.'
    })
  } finally {
    salvando.value = false
  }
}

function abrirCancelamento() {
  if (!podeAlterarChamado.value) {
    $q.notify({
      type: 'warning',
      message:
        'Este chamado não pode mais ser cancelado.'
    })

    return
  }

  dialogCancelar.value = true
}

async function cancelarChamado() {
  cancelando.value = true

  try {
    const resposta =
      await chamadoService.cancelar(
        chamado.value.id_chamado
      )

    chamado.value =
      resposta.chamado ||
      {
        ...chamado.value,
        status: 'CANCELADO'
      }

    dialogCancelar.value = false

    await carregarHistorico()

    $q.notify({
      type: 'positive',
      message:
        resposta.message ||
        'Chamado cancelado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao cancelar chamado:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível cancelar o chamado.'
    })
  } finally {
    cancelando.value = false
  }
}

onMounted(carregarDados)
</script>

<style scoped>
.detalhes-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.pagina-titulo {
  color: #101828;
  font-size: 30px;
  font-weight: 800;
}

.pagina-subtitulo {
  margin-top: 5px;
  color: #667085;
  font-size: 14px;
}

.cabecalho-acoes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.detalhes-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(300px, 1fr);
  gap: 24px;
}

.banner-bloqueado {
  color: #475467;
  background: #f2f4f7;
}

.banner-conteudo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-titulo {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.banner-texto {
  margin-top: 2px;
  color: #667085;
  font-size: 12px;
}

.dialog-card {
  width: 650px;
  max-width: 94vw;
  border-radius: 20px;
}

.dialog-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
}

.dialog-conteudo {
  padding: 24px;
}

.dialog-titulo {
  color: #101828;
  font-size: 21px;
  font-weight: 800;
}

.dialog-subtitulo {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.cancelamento-card {
  width: 450px;
  max-width: 92vw;
  padding: 10px;
  border-radius: 20px;
}

.cancelamento-icone {
  text-align: center;
}

.cancelamento-titulo {
  margin-top: 12px;
  color: #101828;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}

.cancelamento-texto {
  margin-top: 10px;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

@media (max-width: 1000px) {
  .detalhes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .detalhes-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .cabecalho-acoes {
    width: 100%;
  }

  .cabecalho-acoes .q-btn {
    flex: 1;
  }

  .pagina-titulo {
    font-size: 25px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>