<template>
  <q-page class="detalhes-page">
    <!--
      O ProdutorLayout já exibe "Detalhes do chamado" no topo.
      Esta barra reúne status e ações sem criar espaço em branco.
    -->
    <div
      v-if="!carregando && !erro && chamado"
      class="cabecalho-compacto"
    >
      <div class="cabecalho-status">
        <div
          class="cabecalho-status-icone"
          :class="{
            'cabecalho-status-icone--bloqueado': !podeAlterarChamado,
            'cabecalho-status-icone--editavel': podeAlterarChamado
          }"
        >
          <q-icon
            :name="podeAlterarChamado ? 'edit_note' : 'lock'"
            size="20px"
          />
        </div>

        <div class="cabecalho-status-texto">
          <div class="cabecalho-status-titulo">
            {{
              podeAlterarChamado
                ? 'Chamado pendente'
                : 'Alterações bloqueadas'
            }}
          </div>

          <div class="cabecalho-status-subtitulo">
            {{
              podeAlterarChamado
                ? 'Você ainda pode editar ou cancelar esta solicitação.'
                : 'Este chamado já foi aceito para atendimento e não pode mais ser alterado.'
            }}
          </div>
        </div>
      </div>

      <div class="cabecalho-acoes">
        <q-btn
          v-if="podeAlterarChamado"
          outline
          no-caps
          color="primary"
          icon="edit"
          label="Editar"
          @click="abrirEdicao"
        />

        <q-btn
          v-if="podeAlterarChamado"
          outline
          no-caps
          color="negative"
          icon="cancel"
          label="Cancelar"
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
      class="estado-carregando"
    >
      <q-spinner
        color="orange"
        size="46px"
      />

      <div>
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
      <div class="detalhes-conteudo">
        <!-- PRIMEIRA LINHA -->
        <div class="detalhes-linha detalhes-linha--superior">
          <ResumoChamado
            :chamado="chamado"
          />

          <div class="anexos-coluna">
            <AnexosChamado
              v-if="chamado?.id_chamado"
              :id-chamado="chamado.id_chamado"
            />
          </div>
        </div>

        <!-- SEGUNDA LINHA -->
        <div class="detalhes-linha detalhes-linha--inferior">
          <InformacoesChamado
            :chamado="chamado"
          />

          <HistoricoChamado
            :chamado="chamado"
            :historicos="historicos"
            :carregando="carregandoHistorico"
          />
        </div>
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
import AnexosChamado from 'src/components/shared/AnexosChamado.vue'

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
  padding: 14px 20px 32px;
  background: #f7f8fa;
}

.pagina-acoes {
  width: 100%;
  max-width: 1460px;

  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  gap: 8px;

  margin: 0 auto 10px;
}

.pagina-acoes .q-btn {
  min-height: 38px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
}

.estado-carregando {
  min-height: 320px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 12px;

  color: #667085;
  font-size: 14px;
}

.banner-bloqueado {
  width: 100%;
  max-width: 1460px;

  margin: 0 auto 12px;

  color: #475467;
  background: #f2f4f7;
}

.banner-conteudo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-icone {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #475467;
  background: #ffffff;
}

.banner-titulo {
  color: #344054;
  font-size: 14px;
  font-weight: 800;
}

.banner-texto {
  margin-top: 2px;
  color: #667085;
  font-size: 12px;
  line-height: 1.4;
}

.detalhes-conteudo {
  width: 100%;
  max-width: 1460px;
  margin: 0 auto;
}

.detalhes-linha {
  display: grid;
  align-items: stretch;
  gap: 14px;
}

.detalhes-linha--superior {
  grid-template-columns:
    minmax(0, 2fr)
    minmax(310px, 0.92fr);
}

.detalhes-linha--inferior {
  grid-template-columns:
    minmax(0, 1.25fr)
    minmax(360px, 0.95fr);

  margin-top: 14px;
}

.anexos-coluna {
  min-width: 0;
  height: 100%;
}

/* Faz os componentes ocuparem a altura disponível da linha */
.detalhes-linha > :deep(*) {
  min-width: 0;
}

/* DARK */
.body--dark .detalhes-page {
  background: #0d0f12;
}

.body--dark .banner-bloqueado {
  color: #cbd5e1;
  background: #1b1f25;
}

.body--dark .banner-icone {
  color: #cbd5e1;
  background: #252a32;
}

.body--dark .banner-titulo {
  color: #f9fafb;
}

.body--dark .banner-texto {
  color: #98a2b3;
}

/* DIALOG */
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

@media (max-width: 1050px) {
  .detalhes-linha--superior,
  .detalhes-linha--inferior {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .detalhes-page {
    padding: 12px 14px 28px;
  }

  .pagina-acoes {
    justify-content: stretch;
  }

  .pagina-acoes .q-btn {
    flex: 1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   CABEÇALHO COMPACTO
========================================================= */

.cabecalho-compacto {
  width: 100%;
  max-width: 1460px;

  min-height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  margin: 0 auto 12px;
  padding: 10px 12px 10px 14px;

  border: 1px solid #eaecf0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(16, 24, 40, 0.025);
}

.cabecalho-status {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 10px;
}

.cabecalho-status-icone {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;
}

.cabecalho-status-icone--bloqueado {
  color: #475467;
  background: #f2f4f7;
}

.cabecalho-status-icone--editavel {
  color: #f97316;
  background: #fff1e6;
}

.cabecalho-status-texto {
  min-width: 0;
}

.cabecalho-status-titulo {
  color: #344054;

  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
}

.cabecalho-status-subtitulo {
  margin-top: 2px;

  color: #667085;

  font-size: 11px;
  line-height: 1.35;
}

.cabecalho-acoes {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  flex-wrap: wrap;

  gap: 7px;
}

.cabecalho-acoes .q-btn {
  min-height: 36px;

  border-radius: 8px;

  font-size: 11px;
  font-weight: 700;
}

/* Remove qualquer reserva de espaço do cabeçalho antigo */
.pagina-acoes,
.banner-bloqueado {
  display: none !important;
}

.body--dark .cabecalho-compacto {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .cabecalho-status-titulo {
  color: #f9fafb;
}

.body--dark .cabecalho-status-subtitulo {
  color: #98a2b3;
}

.body--dark .cabecalho-status-icone--bloqueado {
  color: #cbd5e1;
  background: #252a32;
}

@media (max-width: 760px) {
  .cabecalho-compacto {
    align-items: stretch;
    flex-direction: column;

    gap: 10px;
  }

  .cabecalho-acoes {
    width: 100%;
  }

  .cabecalho-acoes .q-btn {
    flex: 1;
  }
}

</style>
