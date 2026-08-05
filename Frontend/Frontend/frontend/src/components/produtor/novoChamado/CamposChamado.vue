<template>
  <div class="campos-formulario">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.id_propriedade"
          :options="propriedades"
          option-label="nome"
          option-value="id"
          emit-value
          map-options
          outlined
          label="Propriedade"
          :rules="[
            (valor) => !!valor || 'Selecione uma propriedade'
          ]"
        >
          <template #prepend>
            <q-icon name="home_work_outlined" />
          </template>
        </q-select>
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.tipo_cultura"
          :options="culturas"
          emit-value
          map-options
          outlined
          label="Tipo de cultura"
          :rules="[
            (valor) => !!valor || 'Selecione o tipo de cultura'
          ]"
        >
          <template #prepend>
            <q-icon name="agriculture" />
          </template>
        </q-select>
      </div>

      <div class="col-12">
        <div class="campo-titulo">
          Tipo de assistência
        </div>

        <q-option-group
          v-model="formulario.tipo_chamado"
          :options="tiposChamado"
          type="radio"
          inline
          color="orange"
          class="opcoes-chamado"
        />
      </div>

      <div class="col-12">
        <q-input
          v-model="formulario.problema"
          outlined
          label="Problema identificado"
          maxlength="150"
          counter
          :rules="[
            (valor) =>
              !!valor?.trim() ||
              'Informe o problema identificado'
          ]"
        >
          <template #prepend>
            <q-icon name="build_outlined" />
          </template>
        </q-input>
      </div>

      <div class="col-12">
        <q-input
          v-model="formulario.descricao"
          outlined
          type="textarea"
          label="Descrição detalhada"
          placeholder="Descreva detalhadamente o que está acontecendo..."
          autogrow
          maxlength="1000"
          counter
          :rules="[
            (valor) =>
              !!valor?.trim() ||
              'Informe uma descrição do problema'
          ]"
        />
      </div>

      <div class="col-12">
        <div class="campo-titulo">
          Nível de urgência
        </div>

        <div class="urgencia-grid">
          <button
            v-for="opcao in urgencias"
            :key="opcao.valor"
            type="button"
            class="urgencia-opcao"
            :class="{
              selecionada:
                formulario.urgencia === opcao.valor
            }"
            @click="formulario.urgencia = opcao.valor"
          >
            <span
              class="urgencia-ponto"
              :style="{ backgroundColor: opcao.cor }"
            />

            <span>{{ opcao.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  formulario: {
    type: Object,
    required: true
  }
})

const propriedades = [
  {
    id: 1,
    nome: 'Fazenda Boa Vista'
  }
]

const culturas = [
  {
    label: 'Aves',
    value: 'AVES'
  },
  {
    label: 'Suínos',
    value: 'SUINOS'
  },
  {
    label: 'Bovinos',
    value: 'BOVINOS'
  },
  {
    label: 'Outros',
    value: 'OUTROS'
  }
]

const tiposChamado = [
  {
    label: 'Assistência técnica',
    value: 'ASSISTENCIA'
  },
  {
    label: 'Falar com vendedor',
    value: 'VENDEDOR'
  }
]

const urgencias = [
  {
    label: 'Baixa',
    valor: 'BAIXA',
    cor: '#3b82f6'
  },
  {
    label: 'Média',
    valor: 'MEDIA',
    cor: '#f97316'
  },
  {
    label: 'Alta',
    valor: 'ALTA',
    cor: '#ef4444'
  }
]
</script>

<style scoped>
.campo-titulo {
  margin-bottom: 12px;
  color: #667085;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
}

.opcoes-chamado {
  padding: 6px 0 14px;
}

.urgencia-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.urgencia-opcao {
  min-height: 64px;
  border: 1px solid #eaecf0;
  border-radius: 15px;
  background: #ffffff;
  color: #667085;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.urgencia-opcao:hover {
  border-color: #ff7a1a;
}

.urgencia-opcao.selecionada {
  border-color: #101828;
  background: #101828;
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(16, 24, 40, 0.16);
}

.urgencia-ponto {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
}

@media (max-width: 700px) {
  .urgencia-grid {
    grid-template-columns: 1fr;
  }
}
</style>