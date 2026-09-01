<template>
  <div class="filtros-container">
    <!-- ==================================================
         PESQUISA
    =================================================== -->

    <q-input
      :model-value="pesquisa"
      outlined
      clearable
      dense
      debounce="250"
      placeholder="Pesquisar chamado..."
      class="campo-pesquisa"
      @update:model-value="atualizarPesquisa"
    >
      <template #prepend>
        <q-icon
          name="search"
          size="22px"
        />
      </template>
    </q-input>

    <!-- ==================================================
         STATUS
    =================================================== -->

    <q-select
      :model-value="status"
      outlined
      clearable
      dense
      emit-value
      map-options
      label="Status"
      :options="opcoesStatus"
      class="campo-status"
      @update:model-value="atualizarStatus"
    >
      <template #prepend>
        <q-icon
          name="filter_alt"
          size="21px"
        />
      </template>

      <template #no-option>
        <q-item>
          <q-item-section
            class="text-grey"
          >
            Nenhum status encontrado
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- ==================================================
         LIMPAR
    =================================================== -->

    <q-btn
      v-if="possuiFiltro"
      flat
      no-caps
      color="grey-7"
      icon="filter_alt_off"
      label="Limpar"
      class="botao-limpar"
      @click="limparFiltros"
    />
  </div>
</template>

<script setup>
import {
  computed
} from 'vue'

const props = defineProps({
  pesquisa: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  'update:pesquisa',
  'update:status'
])

const opcoesStatus = [
  {
    label: 'Pendente',
    value: 'PENDENTE'
  },
  {
    label: 'Aceito',
    value: 'ACEITO'
  },
  {
    label: 'Em rota',
    value: 'EM_ROTA'
  },
  {
    label: 'Em atendimento',
    value: 'EM_ATENDIMENTO'
  },
  {
    label: 'Em andamento',
    value: 'EM_ANDAMENTO'
  },
  {
    label: 'Finalizado',
    value: 'FINALIZADO'
  },
  {
    label: 'Cancelado',
    value: 'CANCELADO'
  }
]

const possuiFiltro =
  computed(() => {
    return Boolean(
      String(
        props.pesquisa || ''
      ).trim() ||
      props.status
    )
  })

function atualizarPesquisa(
  valor
) {
  emit(
    'update:pesquisa',
    valor || ''
  )
}

function atualizarStatus(
  valor
) {
  emit(
    'update:status',
    valor || null
  )
}

function limparFiltros() {
  emit(
    'update:pesquisa',
    ''
  )

  emit(
    'update:status',
    null
  )
}
</script>

<style scoped>
.filtros-container {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 14px;

  width: 100%;
}

.campo-pesquisa {
  width: 420px;

  max-width: 100%;
}

.campo-status {
  width: 260px;

  max-width: 100%;
}

.botao-limpar {
  min-height: 40px;
}

/* ==================================================
   MOBILE
=================================================== */

@media (max-width: 700px) {
  .filtros-container {
    display: grid;

    grid-template-columns:
      minmax(0, 1fr)
      135px;

    gap: 9px;

    width: 100%;
  }

  .campo-pesquisa,
  .campo-status {
    width: 100%;

    min-width: 0;
  }

  .botao-limpar {
    grid-column:
      1 / -1;

    justify-self:
      flex-start;

    min-height: 32px;

    margin-top: -3px;

    font-size: 12px;
  }
}

/* CELULAR PEQUENO */

@media (max-width: 390px) {
  .filtros-container {
    grid-template-columns:
      minmax(0, 1fr)
      120px;

    gap: 7px;
  }
}
</style>