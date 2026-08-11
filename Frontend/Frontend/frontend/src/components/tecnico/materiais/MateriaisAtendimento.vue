<template>
  <div
    class="materiais-card"
    :class="{
      'materiais-card--dark': $q.dark.isActive
    }"
  >
    <div class="materiais-cabecalho">
      <div>
        <div class="materiais-titulo">
          Materiais utilizados
        </div>

        <div class="materiais-subtitulo">
          Registre os itens utilizados durante a assistência.
        </div>
      </div>
    </div>

    <!-- FORMULÁRIO -->
    <div
      v-if="!somenteLeitura"
      class="formulario-material"
    >
      <q-input
        v-model="formulario.descricao_material"
        outlined
        label="Descrição do material"
        maxlength="150"
        :disable="salvando"
      />

      <q-input
        v-model.number="formulario.quantidade"
        outlined
        type="number"
        min="0.01"
        step="0.01"
        label="Quantidade"
        :disable="salvando"
      />

      <q-btn
        unelevated
        no-caps
        color="orange"
        :icon="editandoId ? 'save' : 'add'"
        :label="editandoId ? 'Salvar' : 'Adicionar'"
        class="botao-adicionar"
        :loading="salvando"
        @click="salvarMaterial"
      />

      <q-btn
        v-if="editandoId"
        flat
        no-caps
        color="grey-7"
        icon="close"
        label="Cancelar"
        class="botao-cancelar"
        :disable="salvando"
        @click="cancelarEdicao"
      />
    </div>

    <!-- SEM MATERIAIS -->
    <div
      v-if="materiais.length === 0"
      class="sem-materiais"
    >
      Nenhum material registrado.
    </div>

    <!-- LISTA -->
    <div
      v-else
      class="lista-materiais"
    >
      <div
        v-for="material in materiais"
        :key="material.id_material"
        class="material-item"
      >
        <div class="material-informacoes">
          <div class="material-descricao">
            {{ material.descricao_material }}
          </div>

          <div class="material-detalhes">
            Quantidade:
            {{ formatarQuantidade(material.quantidade) }}
          </div>
        </div>

        <div
          v-if="!somenteLeitura"
          class="material-acoes"
        >
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            :disable="
              salvando ||
              removendoId === material.id_material
            "
            @click="editarMaterial(material)"
          >
            <q-tooltip>
              Editar material
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete_outline"
            :loading="
              removendoId === material.id_material
            "
            :disable="salvando"
            @click="removerMaterial(material)"
          >
            <q-tooltip>
              Excluir material
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="resumo-materiais">
        <span>
          Itens registrados
        </span>

        <strong>
          {{ materiais.length }}
        </strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref
} from 'vue'

import { useQuasar } from 'quasar'

import materialService from
  'src/services/materialService'

const props = defineProps({
  idChamado: {
    type: [Number, String],
    required: true
  },

  somenteLeitura: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()

const materiais = ref([])
const salvando = ref(false)
const removendoId = ref(null)
const editandoId = ref(null)

const formulario = reactive({
  descricao_material: '',
  quantidade: 1
})

async function carregarMateriais() {
  try {
    const resposta =
      await materialService
        .listarPorChamado(
          props.idChamado
        )

    materiais.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.data || []
  } catch (error) {
    console.error(
      'Erro ao carregar materiais:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar os materiais.'
    })
  }
}

async function salvarMaterial() {
  const descricao =
    formulario.descricao_material.trim()

  const quantidade =
    Number(formulario.quantidade)

  if (!descricao) {
    $q.notify({
      type: 'warning',
      message:
        'Informe a descrição do material.'
    })

    return
  }

  if (
    !Number.isFinite(quantidade) ||
    quantidade <= 0
  ) {
    $q.notify({
      type: 'warning',
      message:
        'Informe uma quantidade válida.'
    })

    return
  }

  salvando.value = true

  try {
    if (editandoId.value) {
      const resposta =
        await materialService.atualizar(
          editandoId.value,
          {
            descricao_material:
              descricao,

            quantidade
          }
        )

      const materialAtualizado =
        resposta.material ||
        resposta

      const indice =
        materiais.value.findIndex(
          (item) =>
            item.id_material ===
            editandoId.value
        )

      if (indice !== -1) {
        materiais.value[indice] =
          materialAtualizado
      }

      $q.notify({
        type: 'positive',
        message:
          resposta.message ||
          'Material atualizado com sucesso.'
      })
    } else {
      const resposta =
        await materialService.criar({
          id_chamado:
            Number(props.idChamado),

          descricao_material:
            descricao,

          quantidade
        })

      materiais.value.push(
        resposta.material ||
        resposta
      )

      $q.notify({
        type: 'positive',
        message:
          resposta.message ||
          'Material adicionado com sucesso.'
      })
    }

    limparFormulario()
  } catch (error) {
    console.error(
      'Erro ao salvar material:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível salvar o material.'
    })
  } finally {
    salvando.value = false
  }
}

function editarMaterial(material) {
  editandoId.value =
    material.id_material

  formulario.descricao_material =
    material.descricao_material

  formulario.quantidade =
    Number(material.quantidade)
}

function cancelarEdicao() {
  limparFormulario()
}

function limparFormulario() {
  editandoId.value = null

  formulario.descricao_material = ''

  formulario.quantidade = 1
}

async function removerMaterial(material) {
  removendoId.value =
    material.id_material

  try {
    await materialService.remover(
      material.id_material
    )

    materiais.value =
      materiais.value.filter(
        (item) =>
          item.id_material !==
          material.id_material
      )

    if (
      editandoId.value ===
      material.id_material
    ) {
      limparFormulario()
    }

    $q.notify({
      type: 'positive',
      message:
        'Material removido com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao remover material:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível remover o material.'
    })
  } finally {
    removendoId.value = null
  }
}

function formatarQuantidade(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return '0'
  }

  return numero.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2
    }
  )
}

onMounted(carregarMateriais)
</script>

<style scoped>
.materiais-card {
  width: 100%;
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.05);
}

.materiais-cabecalho {
  margin-bottom: 20px;
}

.materiais-titulo {
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

.materiais-subtitulo {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

/* FORMULÁRIO */

.formulario-material {
  display: grid;

  grid-template-columns:
    minmax(0, 2fr)
    minmax(140px, 0.7fr)
    auto
    auto;

  gap: 12px;
  align-items: start;
}

.botao-adicionar,
.botao-cancelar {
  min-height: 56px;
  padding: 0 20px;
}

/* SEM MATERIAIS */

.sem-materiais {
  margin-top: 20px;
  padding: 18px;

  border: 1px solid #eaecf0;
  border-radius: 14px;

  color: #667085;
  background: #f9fafb;

  text-align: center;
}

/* LISTA */

.lista-materiais {
  margin-top: 22px;
}

.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  padding: 14px 0;

  border-bottom:
    1px solid #eaecf0;
}

.material-informacoes {
  flex: 1;
  min-width: 0;
}

.material-descricao {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.material-detalhes {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.material-acoes {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

/* RESUMO */

.resumo-materiais {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-top: 16px;
  padding: 16px;

  border: 1px solid #f2f4f7;
  border-radius: 14px;

  color: #344054;
  background: #f9fafb;
}

.resumo-materiais strong {
  color: #027a48;
  font-size: 16px;
}

/* =========================
   DARK MODE
========================= */

.materiais-card--dark {
  border-color: #2b2f36;
  background: #16191f;

  box-shadow:
    0 3px 12px
    rgba(0, 0, 0, 0.28);
}

.materiais-card--dark
.materiais-titulo {
  color: #f9fafb;
}

.materiais-card--dark
.materiais-subtitulo {
  color: #98a2b3;
}

.materiais-card--dark
.material-item {
  border-color: #2b2f36;
}

.materiais-card--dark
.material-descricao {
  color: #f2f4f7;
}

.materiais-card--dark
.material-detalhes {
  color: #98a2b3;
}

.materiais-card--dark
.sem-materiais {
  border-color: #2b2f36;
  color: #98a2b3;
  background: #1b1f25;
}

.materiais-card--dark
.resumo-materiais {
  border-color: #2b2f36;
  color: #d0d5dd;
  background: #1b1f25;
}

.materiais-card--dark
.resumo-materiais strong {
  color: #32d583;
}

/* INPUT DARK */

.materiais-card--dark
:deep(.q-field__control) {
  background: #1b1f25;
}

.materiais-card--dark
:deep(
  .q-field--outlined
  .q-field__control::before
) {
  border-color: #3a3f47;
}

.materiais-card--dark
:deep(.q-field__native),
.materiais-card--dark
:deep(.q-field__input) {
  color: #f2f4f7;
}

.materiais-card--dark
:deep(.q-field__label) {
  color: #98a2b3;
}

/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .formulario-material {
    grid-template-columns:
      1fr
      minmax(130px, 0.45fr);
  }

  .formulario-material
  :deep(.q-field:first-child) {
    grid-column: 1 / -1;
  }

  .botao-adicionar,
  .botao-cancelar {
    width: 100%;
  }
}

/* =========================
   CELULAR
========================= */

@media (max-width: 600px) {
  .materiais-card {
    padding: 18px;
    border-radius: 18px;
  }

  .materiais-titulo {
    font-size: 17px;
  }

  .materiais-subtitulo {
    font-size: 11px;
    line-height: 1.4;
  }

  .formulario-material {
    grid-template-columns: 1fr;
  }

  .formulario-material
  :deep(.q-field:first-child) {
    grid-column: auto;
  }

  .botao-adicionar,
  .botao-cancelar {
    width: 100%;
    min-height: 50px;
  }

  .material-item {
    align-items: flex-start;
  }
}

/* CELULAR PEQUENO */

@media (max-width: 380px) {
  .materiais-card {
    padding: 15px;
  }

  .material-item {
    flex-wrap: wrap;
  }

  .material-acoes {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>