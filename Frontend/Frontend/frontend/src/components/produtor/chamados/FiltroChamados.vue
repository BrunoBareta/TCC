<template>
  <div class="filtros-container">
    <q-input
      :model-value="pesquisa"
      outlined
      clearable
      debounce="250"
      label="Pesquisar chamado"
      placeholder="Número, problema ou descrição..."
      class="campo-pesquisa"
      @update:model-value="atualizarPesquisa"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-select
      :model-value="status"
      outlined
      clearable
      emit-value
      map-options
      label="Status"
      :options="opcoesStatus"
      class="campo-status"
      @update:model-value="atualizarStatus"
    >
      <template #prepend>
        <q-icon name="filter_alt" />
      </template>

      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">
            Nenhum status encontrado
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-btn
      v-if="possuiFiltro"
      flat
      no-caps
      color="grey-7"
      icon="filter_alt_off"
      label="Limpar filtros"
      class="botao-limpar"
      @click="limparFiltros"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const possuiFiltro = computed(() => {
  return Boolean(
    String(props.pesquisa || '').trim() ||
    props.status
  )
})

function atualizarPesquisa(valor) {
  emit(
    'update:pesquisa',
    valor || ''
  )
}

function atualizarStatus(valor) {
  emit(
    'update:status',
    valor || null
  )
}

function limparFiltros() {
  emit('update:pesquisa', '')
  emit('update:status', null)
}
</script>

<style scoped>
.filtros-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.campo-pesquisa {
  width: 470px;
  max-width: 100%;
}

.campo-status {
  width: 350px;
  max-width: 100%;
}

.botao-limpar {
  min-height: 46px;
}

@media (max-width: 850px) {
  .filtros-container {
    align-items: stretch;
    flex-direction: column;
  }

  .campo-pesquisa,
  .campo-status {
    width: 100%;
  }

  .botao-limpar {
    align-self: flex-start;
  }
}
</style>