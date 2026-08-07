<template>
  <div class="materiais-card">
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

      <q-input
        v-model.number="formulario.valor_unitario"
        outlined
        type="number"
        min="0"
        step="0.01"
        label="Valor unitário"
        prefix="R$"
        :disable="salvando"
      />

      <q-btn
        unelevated
        no-caps
        color="orange"
        icon="add"
        label="Adicionar"
        class="botao-adicionar"
        :loading="salvando"
        @click="adicionarMaterial"
      />
    </div>

    <div
      v-if="materiais.length === 0"
      class="sem-materiais"
    >
      Nenhum material registrado.
    </div>

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
            {{ formatarQuantidade(material.quantidade) }}
            ×
            {{ formatarMoeda(material.valor_unitario) }}
          </div>
        </div>

        <div class="material-acoes">
          <div class="material-total">
            {{ formatarMoeda(material.valor_total) }}
          </div>

          <q-btn
            v-if="!somenteLeitura"
            flat
            round
            dense
            color="negative"
            icon="delete_outline"
            :loading="removendoId === material.id_material"
            @click="removerMaterial(material)"
          />
        </div>
      </div>

      <div class="total-geral">
        <span>Total dos materiais</span>

        <strong>
          {{ formatarMoeda(totalMateriais) }}
        </strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import materialService from 'src/services/materialService'

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

const formulario = reactive({
  descricao_material: '',
  quantidade: 1,
  valor_unitario: 0
})

const totalMateriais = computed(() =>
  materiais.value.reduce(
    (total, material) =>
      total + Number(material.valor_total || 0),
    0
  )
)

async function carregarMateriais() {
  try {
    const resposta =
      await materialService.listarPorChamado(
        props.idChamado
      )

    materiais.value = Array.isArray(resposta)
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

async function adicionarMaterial() {
  const descricao =
    formulario.descricao_material.trim()

  const quantidade =
    Number(formulario.quantidade)

  const valorUnitario =
    Number(formulario.valor_unitario)

  if (!descricao) {
    $q.notify({
      type: 'warning',
      message: 'Informe a descrição do material.'
    })

    return
  }

  if (
    !Number.isFinite(quantidade) ||
    quantidade <= 0
  ) {
    $q.notify({
      type: 'warning',
      message: 'Informe uma quantidade válida.'
    })

    return
  }

  if (
    !Number.isFinite(valorUnitario) ||
    valorUnitario < 0
  ) {
    $q.notify({
      type: 'warning',
      message: 'Informe um valor unitário válido.'
    })

    return
  }

  salvando.value = true

  try {
    const resposta = await materialService.criar({
      id_chamado: Number(props.idChamado),
      descricao_material: descricao,
      quantidade,
      valor_unitario: valorUnitario
    })

    materiais.value.push(
      resposta.material || resposta
    )

    formulario.descricao_material = ''
    formulario.quantidade = 1
    formulario.valor_unitario = 0

    $q.notify({
      type: 'positive',
      message:
        resposta.message ||
        'Material adicionado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao adicionar material:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível adicionar o material.'
    })
  } finally {
    salvando.value = false
  }
}

async function removerMaterial(material) {
  removendoId.value = material.id_material

  try {
    await materialService.remover(
      material.id_material
    )

    materiais.value = materiais.value.filter(
      (item) =>
        item.id_material !== material.id_material
    )

    $q.notify({
      type: 'positive',
      message: 'Material removido com sucesso.'
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

  return numero.toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  })
}

function formatarMoeda(valor) {
  const numero = Number(valor || 0)

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

onMounted(carregarMateriais)
</script>

<style scoped>
.materiais-card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.05);
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

.formulario-material {
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(120px, 0.7fr)
    minmax(150px, 0.9fr)
    auto;
  gap: 12px;
  align-items: start;
}

.botao-adicionar {
  min-height: 56px;
  padding: 0 20px;
}

.sem-materiais {
  margin-top: 20px;
  padding: 18px;
  border-radius: 14px;
  color: #667085;
  background: #f9fafb;
  text-align: center;
}

.lista-materiais {
  margin-top: 22px;
}

.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #eaecf0;
}

.material-descricao {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.material-detalhes {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.material-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-total {
  color: #101828;
  font-size: 14px;
  font-weight: 800;
}

.total-geral {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  color: #344054;
  background: #f9fafb;
}

.total-geral strong {
  color: #027a48;
  font-size: 16px;
}

@media (max-width: 900px) {
  .formulario-material {
    grid-template-columns: 1fr 1fr;
  }

  .formulario-material :deep(.q-field:first-child) {
    grid-column: 1 / -1;
  }

  .botao-adicionar {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .materiais-card {
    padding: 20px;
  }

  .formulario-material {
    grid-template-columns: 1fr;
  }

  .formulario-material :deep(.q-field:first-child) {
    grid-column: auto;
  }
}
</style>