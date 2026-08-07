<template>
  <div class="formulario-card">
    <div class="card-titulo">
      Informações do chamado
    </div>

    <div class="card-subtitulo">
      Preencha os dados abaixo para solicitar o atendimento.
    </div>

    <q-form
      class="q-mt-lg"
      @submit.prevent="enviarChamado"
    >
      <!-- PROPRIEDADE -->
      <div class="campo-grupo">
        <div class="campo-label">
          Propriedade
        </div>

        <q-select
          v-model="propriedadeSelecionada"
          outlined
          emit-value
          map-options
          :options="opcoesPropriedade"
          label="Selecione a propriedade"
          :disable="enviando"
        >
          <template #prepend>
            <q-icon name="agriculture" />
          </template>
        </q-select>
      </div>

      <!-- LOCAL -->
      <div class="campo-grupo">
        <div class="campo-label">
          Local do atendimento
        </div>

        <q-select
          v-model="form.id_unidade"
          outlined
          emit-value
          map-options
          :options="opcoesUnidades"
          label="Selecione o local"
          :loading="carregandoUnidades"
          :disable="
            enviando ||
            carregandoUnidades ||
            !propriedadeSelecionada
          "
          clearable
        >
          <template #prepend>
            <q-icon name="location_on" />
          </template>

          <template #no-option>
            <q-item>
              <q-item-section class="text-grey-7">
                Nenhum local cadastrado nesta propriedade.
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div
          v-if="unidadeSelecionada"
          class="local-info"
        >
          <div class="local-info-topo">
            <q-icon
              name="info"
              size="18px"
            />

            <strong>
              {{ unidadeSelecionada.nome_unidade }}
            </strong>
          </div>

          <div
            v-if="unidadeSelecionada.descricao"
            class="local-info-texto"
          >
            {{ unidadeSelecionada.descricao }}
          </div>

          <div
            v-if="unidadeSelecionada.referencia"
            class="local-referencia"
          >
            <q-icon
              name="near_me"
              size="16px"
            />

            <span>
              Referência:
              {{ unidadeSelecionada.referencia }}
            </span>
          </div>
        </div>
      </div>

      <!-- PROBLEMA -->
      <div class="campo-grupo">
        <div class="campo-label">
          Problema
        </div>

        <q-input
          v-model="form.problema"
          outlined
          label="Informe o problema"
          maxlength="150"
          :disable="enviando"
        >
          <template #prepend>
            <q-icon name="build_circle" />
          </template>
        </q-input>
      </div>

      <!-- DESCRIÇÃO -->
      <div class="campo-grupo">
        <div class="campo-label">
          Descrição do problema
        </div>

        <q-input
          v-model="form.descricao"
          outlined
          type="textarea"
          autogrow
          label="Descreva o que está acontecendo"
          maxlength="1000"
          counter
          :disable="enviando"
        >
          <template #prepend>
            <q-icon name="description" />
          </template>
        </q-input>
      </div>

      <!-- CULTURA + TIPO -->
      <div class="form-grid">
        <div class="campo-grupo">
          <div class="campo-label">
            Cultura
          </div>

          <q-select
            v-model="form.tipo_cultura"
            outlined
            emit-value
            map-options
            :options="opcoesCultura"
            label="Selecione a cultura"
            :disable="enviando"
          >
            <template #prepend>
              <q-icon name="agriculture" />
            </template>
          </q-select>
        </div>

        <div class="campo-grupo">
          <div class="campo-label">
            Tipo do chamado
          </div>

          <q-select
            v-model="form.tipo_chamado"
            outlined
            emit-value
            map-options
            :options="opcoesTipoChamado"
            label="Selecione o tipo"
            :disable="enviando"
          >
            <template #prepend>
              <q-icon name="support_agent" />
            </template>
          </q-select>
        </div>
      </div>

      <!-- URGÊNCIA -->
      <div class="campo-grupo">
        <div class="campo-label">
          Urgência
        </div>

        <div class="urgencias">
          <q-btn
            v-for="opcao in opcoesUrgencia"
            :key="opcao.value"
            no-caps
            :outline="form.urgencia !== opcao.value"
            :unelevated="form.urgencia === opcao.value"
            :color="corUrgencia(opcao.value)"
            :label="opcao.label"
            :disable="enviando"
            @click="form.urgencia = opcao.value"
          />
        </div>
      </div>

      <!-- RESUMO LOCAL -->
      <div
        v-if="unidadeSelecionada"
        class="resumo-local"
      >
        <div class="resumo-local-icone">
          <q-icon
            name="place"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-local-label">
            Atendimento será realizado em
          </div>

          <div class="resumo-local-titulo">
            {{ propriedadeNome }}
            •
            {{ unidadeSelecionada.nome_unidade }}
          </div>

          <div
            v-if="unidadeSelecionada.referencia"
            class="resumo-local-texto"
          >
            {{ unidadeSelecionada.referencia }}
          </div>
        </div>
      </div>

      <!-- AÇÕES -->
      <div class="acoes-formulario">
        <q-btn
          flat
          no-caps
          color="grey-7"
          label="Cancelar"
          :disable="enviando"
          @click="cancelar"
        />

        <q-btn
          unelevated
          no-caps
          color="orange"
          icon="send"
          label="Abrir chamado"
          type="submit"
          :loading="enviando"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  useAuthStore
} from 'src/stores/auth'

import chamadoService from
  'src/services/chamadoService'

import unidadePropriedadeService from
  'src/services/unidadePropriedadeService'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

/*
  Temporário.
  Depois vamos buscar as propriedades
  diretamente pelo usuário logado.
*/
const ID_PROPRIEDADE = 1

const enviando = ref(false)
const carregandoUnidades = ref(false)

const unidades = ref([])

const propriedadeSelecionada = ref(
  ID_PROPRIEDADE
)

const opcoesPropriedade = [
  {
    label: 'Fazenda Boa Vista',
    value: ID_PROPRIEDADE
  }
]

const form = reactive({
  id_usuario: null,
  id_unidade: null,
  problema: '',
  descricao: '',
  tipo_cultura: 'AVES',
  tipo_chamado: 'ASSISTENCIA',
  urgencia: 'MEDIA'
})

const opcoesCultura = [
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

const opcoesTipoChamado = [
  {
    label: 'Assistência',
    value: 'ASSISTENCIA'
  },
  {
    label: 'Manutenção',
    value: 'MANUTENCAO'
  },
  {
    label: 'Instalação',
    value: 'INSTALACAO'
  },
  {
    label: 'Outro',
    value: 'OUTRO'
  }
]

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

const opcoesUnidades = computed(() =>
  unidades.value.map((unidade) => ({
    label: unidade.nome_unidade,
    value: Number(unidade.id_unidade)
  }))
)

const unidadeSelecionada = computed(() =>
  unidades.value.find(
    (unidade) =>
      Number(unidade.id_unidade) ===
      Number(form.id_unidade)
  ) || null
)

const propriedadeNome = computed(() => {
  const propriedade =
    opcoesPropriedade.find(
      (item) =>
        Number(item.value) ===
        Number(propriedadeSelecionada.value)
    )

  return propriedade?.label || 'Propriedade'
})

async function carregarUnidades() {
  if (!propriedadeSelecionada.value) {
    unidades.value = []
    form.id_unidade = null
    return
  }

  carregandoUnidades.value = true
  form.id_unidade = null

  try {
    const resposta =
      await unidadePropriedadeService
        .listarPorPropriedade(
          propriedadeSelecionada.value
        )

    unidades.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.data || []

    /*
      Se existir apenas um local,
      já seleciona automaticamente.
    */
    if (unidades.value.length === 1) {
      form.id_unidade =
        Number(
          unidades.value[0].id_unidade
        )
    }
  } catch (error) {
    console.error(
      'Erro ao carregar locais:',
      error
    )

    unidades.value = []

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar os locais da propriedade.'
    })
  } finally {
    carregandoUnidades.value = false
  }
}

function validarFormulario() {
  if (!propriedadeSelecionada.value) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione a propriedade.'
    })

    return false
  }

  if (!form.id_unidade) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione o local do atendimento.'
    })

    return false
  }

  if (!form.problema.trim()) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o problema.'
    })

    return false
  }

  if (!form.descricao.trim()) {
    $q.notify({
      type: 'warning',
      message:
        'Descreva o problema.'
    })

    return false
  }

  if (!form.tipo_cultura) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione a cultura.'
    })

    return false
  }

  if (!form.tipo_chamado) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione o tipo do chamado.'
    })

    return false
  }

  if (!form.urgencia) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione a urgência.'
    })

    return false
  }

  return true
}

async function enviarChamado() {
  if (!validarFormulario()) {
    return
  }

  const idUsuario = Number(
    authStore.usuario?.id_usuario
  )

  if (
    !Number.isInteger(idUsuario) ||
    idUsuario <= 0
  ) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível identificar o produtor logado.'
    })

    return
  }

  enviando.value = true

  try {
    const dados = {
      id_usuario: idUsuario,
      id_propriedade:
        Number(
          propriedadeSelecionada.value
        ),
      id_unidade:
        Number(form.id_unidade),
      problema:
        form.problema.trim(),
      descricao:
        form.descricao.trim(),
      tipo_cultura:
        form.tipo_cultura,
      tipo_chamado:
        form.tipo_chamado,
      urgencia:
        form.urgencia
    }

    const resposta =
      await chamadoService.criar(
        dados
      )

    $q.notify({
      type: 'positive',
      message:
        resposta?.message ||
        'Chamado aberto com sucesso.'
    })

    const idChamado =
      resposta?.chamado?.id_chamado ||
      resposta?.id_chamado

    if (idChamado) {
      await router.replace({
        name: 'produtor-detalhes-chamado',
        params: {
          id: idChamado
        }
      })

      return
    }

    await router.replace({
      name: 'produtor-chamados'
    })
  } catch (error) {
    console.error(
      'Erro ao abrir chamado:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível abrir o chamado.'
    })
  } finally {
    enviando.value = false
  }
}

function cancelar() {
  router.push({
    name: 'produtor-chamados'
  })
}

function corUrgencia(valor) {
  if (valor === 'ALTA') {
    return 'negative'
  }

  if (valor === 'MEDIA') {
    return 'orange'
  }

  return 'primary'
}

watch(
  propriedadeSelecionada,
  carregarUnidades
)

onMounted(() => {
  form.id_usuario =
    authStore.usuario?.id_usuario ||
    null

  carregarUnidades()
})
</script>

<style scoped>
.formulario-card {
  padding: 28px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 3px 10px rgba(
      16,
      24,
      40,
      0.05
    );
}

.card-titulo {
  color: #101828;
  font-size: 20px;
  font-weight: 800;
}

.card-subtitulo {
  margin-top: 5px;
  color: #667085;
  font-size: 13px;
}

.campo-grupo {
  margin-bottom: 22px;
}

.campo-label {
  margin-bottom: 8px;
  color: #344054;
  font-size: 13px;
  font-weight: 700;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.urgencias {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.local-info {
  margin-top: 10px;
  padding: 14px;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  color: #9a3412;
  background: #fff7ed;
}

.local-info-topo {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
}

.local-info-texto {
  margin-top: 6px;
  color: #c2410c;
  font-size: 12px;
}

.local-referencia {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #c2410c;
  font-size: 11px;
}

.resumo-local {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-top: 6px;
  padding: 17px;
  border-radius: 14px;
  background: #f9fafb;
}

.resumo-local-icone {
  width: 46px;
  height: 46px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  color: #f97316;
  background: #fff1e6;
}

.resumo-local-label {
  color: #98a2b3;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.resumo-local-titulo {
  margin-top: 3px;
  color: #344054;
  font-size: 14px;
  font-weight: 800;
}

.resumo-local-texto {
  margin-top: 4px;
  color: #667085;
  font-size: 11px;
}

.acoes-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

/* DARK MODE */

.body--dark .formulario-card {
  border-color: #2b2f36;
  background: #16191f;
}

.body--dark .card-titulo,
.body--dark .campo-label,
.body--dark .resumo-local-titulo {
  color: #f9fafb;
}

.body--dark .card-subtitulo,
.body--dark .resumo-local-texto {
  color: #98a2b3;
}

.body--dark .local-info {
  border-color: #7c2d12;
  color: #fdba74;
  background: #24160f;
}

.body--dark .local-info-texto,
.body--dark .local-referencia {
  color: #fb923c;
}

.body--dark .resumo-local {
  background: #1b1f25;
}

@media (max-width: 700px) {
  .formulario-card {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .acoes-formulario {
    flex-direction: column-reverse;
  }

  .acoes-formulario .q-btn {
    width: 100%;
  }
}
</style>