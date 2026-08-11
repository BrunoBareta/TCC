<template>
  <div
    class="formulario-card"
    :class="{
      'formulario-card--dark':
        $q.dark.isActive
    }"
  >
    <!-- CABEÇALHO -->
    <div class="card-topo">
      <div>
        <div class="card-titulo">
          {{
            modoComercial
              ? 'Solicitar orçamento'
              : 'Abrir chamado'
          }}
        </div>

        <div class="card-subtitulo">
          {{
            modoComercial
              ? 'Informe rapidamente o que você precisa.'
              : 'Conte o que está acontecendo e envie sua solicitação.'
          }}
        </div>
      </div>

      <div class="tipo-icone">
        <q-icon
          :name="
            modoComercial
              ? 'request_quote'
              : 'support_agent'
          "
          size="26px"
        />
      </div>
    </div>

    <q-form
      class="q-mt-lg"
      @submit.prevent="enviarChamado"
    >
      <!-- TIPO -->
      <div class="campo-grupo">
        <div class="campo-label">
          Tipo da solicitação
        </div>

        <div class="tipo-solicitacao">
          <button
            type="button"
            class="tipo-card"
            :class="{
              selecionado:
                form.tipo_chamado ===
                'ASSISTENCIA'
            }"
            @click="
              selecionarTipo(
                'ASSISTENCIA'
              )
            "
          >
            <div class="tipo-card-icone">
              <q-icon
                name="engineering"
                size="23px"
              />
            </div>

            <div>
              <div class="tipo-card-titulo">
                Assistência técnica
              </div>

              <div class="tipo-card-texto">
                Preciso de atendimento técnico.
              </div>
            </div>
          </button>

          <button
            type="button"
            class="tipo-card"
            :class="{
              selecionado:
                form.tipo_chamado ===
                'VENDEDOR'
            }"
            @click="
              selecionarTipo(
                'VENDEDOR'
              )
            "
          >
            <div class="tipo-card-icone">
              <q-icon
                name="request_quote"
                size="23px"
              />
            </div>

            <div>
              <div class="tipo-card-titulo">
                Solicitar orçamento
              </div>

              <div class="tipo-card-texto">
                Quero falar com o setor comercial.
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- DESCRIÇÃO ÚNICA -->
      <div class="campo-grupo">
        <div class="campo-label">
          {{
            modoComercial
              ? 'O que você deseja orçar?'
              : 'O que está acontecendo?'
          }}
        </div>

        <q-input
          v-model="form.solicitacao"
          outlined
          type="textarea"
          autogrow
          maxlength="1000"
          counter
          :disable="enviando"
          :placeholder="
            modoComercial
              ? 'Ex.: Preciso de orçamento para novos ventiladores...'
              : 'Ex.: Os ventiladores pararam de funcionar...'
          "
        />
      </div>

      <!-- FOTOS -->
      <div class="campo-grupo">
        <div class="campo-label">
          Fotos ou vídeos
          <span class="opcional">
            Opcional
          </span>
        </div>

        <q-file
          v-model="arquivos"
          outlined
          multiple
          clearable
          accept="image/*,video/*"
          :max-files="5"
          :max-file-size="31457280"
          :disable="enviando"
          label="Adicionar fotos ou vídeos"
          @rejected="
            arquivosRejeitados
          "
        >
          <template #prepend>
            <q-icon
              name="add_photo_alternate"
              color="orange"
            />
          </template>
        </q-file>

        <div class="anexos-ajuda">
          Até 5 arquivos.
        </div>

        <div
          v-if="
            arquivosSelecionados.length
          "
          class="arquivos-selecionados"
        >
          <div
            v-for="
              (
                arquivo,
                index
              ) in arquivosSelecionados
            "
            :key="
              `${arquivo.name}-${index}`
            "
            class="arquivo-item"
          >
            <q-icon
              :name="
                arquivo.type
                  ?.startsWith(
                    'video/'
                  )
                  ? 'videocam'
                  : 'image'
              "
              color="orange"
              size="22px"
            />

            <div class="arquivo-dados">
              <div class="arquivo-nome">
                {{ arquivo.name }}
              </div>

              <div class="arquivo-tamanho">
                {{
                  formatarTamanhoArquivo(
                    arquivo.size
                  )
                }}
              </div>
            </div>

            <q-btn
              flat
              round
              dense
              icon="close"
              @click.stop="
                removerArquivo(index)
              "
            />
          </div>
        </div>
      </div>

      <!-- URGÊNCIA -->
      <div class="campo-grupo">
        <div class="campo-label">
          {{
            modoComercial
              ? 'Prioridade'
              : 'Urgência'
          }}
        </div>

        <div class="urgencias">
          <button
            v-for="
              opcao in
              opcoesUrgencia
            "
            :key="opcao.value"
            type="button"
            class="urgencia"
            :class="[
              `urgencia--${opcao.value.toLowerCase()}`,
              {
                selecionada:
                  form.urgencia ===
                  opcao.value
              }
            ]"
            @click="
              form.urgencia =
                opcao.value
            "
          >
            {{ opcao.label }}
          </button>
        </div>
      </div>

      <!-- MAPA -->
      <div class="campo-grupo">
        <MapaLocalizacao
          v-if="propriedade"
          :latitude="
            propriedade.latitude
          "
          :longitude="
            propriedade.longitude
          "
          :nome-local="
            propriedade.nome_propriedade
          "
          :endereco="
            enderecoPropriedade
          "
          titulo="Localização"
          subtitulo="A localização da propriedade será enviada automaticamente."
        />

        <div
          v-else-if="carregandoPropriedade"
          class="carregando-localizacao"
        >
          <q-spinner
            color="orange"
            size="26px"
          />

          Carregando localização...
        </div>
      </div>

      <!-- AÇÕES -->
      <div class="acoes">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          color="grey-7"
          :disable="enviando"
          @click="cancelar"
        />

        <q-btn
          unelevated
          no-caps
          color="orange"
          :icon="
            modoComercial
              ? 'request_quote'
              : 'send'
          "
          :label="
            modoComercial
              ? 'Enviar solicitação'
              : 'Abrir chamado'
          "
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
  ref
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

import anexoService from
  'src/services/anexoService'

import propriedadeService from
  'src/services/propriedadeService'

import MapaLocalizacao from
  'src/components/shared/MapaLocalizacao.vue'

const router =
  useRouter()

const $q =
  useQuasar()

const authStore =
  useAuthStore()

/*
  Temporário enquanto existe
  apenas uma propriedade vinculada
  neste protótipo.
*/
const ID_PROPRIEDADE = 1

const propriedade =
  ref(null)

const carregandoPropriedade =
  ref(false)

const enviando =
  ref(false)

const arquivos =
  ref([])

const form =
  reactive({
    solicitacao: '',
    tipo_chamado:
      'ASSISTENCIA',
    urgencia:
      'MEDIA'
  })

const modoComercial =
  computed(
    () =>
      form.tipo_chamado ===
      'VENDEDOR'
  )

const arquivosSelecionados =
  computed(() => {
    if (
      Array.isArray(
        arquivos.value
      )
    ) {
      return arquivos.value
    }

    if (arquivos.value) {
      return [
        arquivos.value
      ]
    }

    return []
  })

const enderecoPropriedade =
  computed(() => {
    if (!propriedade.value) {
      return ''
    }

    return [
      propriedade.value.endereco,
      propriedade.value.cidade,
      propriedade.value.estado
    ]
      .filter(Boolean)
      .join(' - ')
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

async function carregarPropriedade() {
  carregandoPropriedade.value =
    true

  try {
    propriedade.value =
      await propriedadeService
        .buscarPorId(
          ID_PROPRIEDADE
        )

    if (!propriedade.value) {
      $q.notify({
        type: 'negative',
        message:
          'Não foi possível localizar a propriedade do produtor.'
      })
    }
  } catch (error) {
    console.error(
      'Erro ao carregar propriedade:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        'Não foi possível carregar a propriedade.'
    })
  } finally {
    carregandoPropriedade.value =
      false
  }
}

function selecionarTipo(tipo) {
  if (enviando.value) {
    return
  }

  form.tipo_chamado =
    tipo
}

function criarResumo(texto) {
  const normalizado =
    texto.trim()

  if (
    normalizado.length <= 150
  ) {
    return normalizado
  }

  return `${normalizado.substring(
    0,
    147
  )}...`
}

function validarFormulario() {
  if (!propriedade.value) {
    $q.notify({
      type: 'warning',
      message:
        'A propriedade não foi carregada.'
    })

    return false
  }

  if (
    !form.solicitacao.trim()
  ) {
    $q.notify({
      type: 'warning',
      message:
        modoComercial.value
          ? 'Informe o que você deseja orçar.'
          : 'Informe o que está acontecendo.'
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

function arquivosRejeitados(
  rejeitados
) {
  if (!rejeitados?.length) {
    return
  }

  $q.notify({
    type: 'warning',
    message:
      'Verifique o formato, quantidade ou tamanho dos arquivos.'
  })
}

function removerArquivo(index) {
  const lista = [
    ...arquivosSelecionados.value
  ]

  lista.splice(
    index,
    1
  )

  arquivos.value =
    lista
}

function formatarTamanhoArquivo(
  bytes
) {
  const mb =
    Number(bytes) /
    1024 /
    1024

  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`
  }

  return `${(
    Number(bytes) /
    1024
  ).toFixed(0)} KB`
}

async function enviarChamado() {
  if (
    !validarFormulario()
  ) {
    return
  }

  const idUsuario =
    Number(
      authStore.usuario
        ?.id_usuario
    )

  if (
    !Number.isInteger(
      idUsuario
    ) ||
    idUsuario <= 0
  ) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível identificar o produtor.'
    })

    return
  }

  enviando.value = true

  try {
    const texto =
      form.solicitacao.trim()

    const dados = {
      id_usuario:
        idUsuario,

      id_propriedade:
        Number(
          propriedade.value
            .id_propriedade
        ),

      /*
        Não há mais seleção
        obrigatória de Aviário.
      */
      id_unidade:
        null,

      /*
        O usuário digita uma vez.

        problema recebe um resumo
        porque a coluna é curta.

        descrição recebe o texto
        completo.
      */
      problema:
        criarResumo(texto),

      descricao:
        texto,

      tipo_cultura:
        propriedade.value
          .cultura_principal ||
        'AVES',

      tipo_chamado:
        form.tipo_chamado,

      urgencia:
        form.urgencia
    }

    const resposta =
      await chamadoService.criar(
        dados
      )

    const idChamado =
      resposta?.chamado
        ?.id_chamado ||
      resposta?.id_chamado

    let erroAnexo =
      false

    if (
      idChamado &&
      arquivosSelecionados.value
        .length
    ) {
      try {
        await anexoService.enviar(
          idChamado,
          arquivosSelecionados.value
        )
      } catch (error) {
        erroAnexo = true

        console.error(
          'Erro ao enviar anexos:',
          error
        )
      }
    }

    if (erroAnexo) {
      $q.notify({
        type: 'warning',
        timeout: 5000,
        message:
          'A solicitação foi criada, mas algum anexo não pôde ser enviado.'
      })
    } else {
      $q.notify({
        type: 'positive',
        message:
          modoComercial.value
            ? 'Solicitação enviada com sucesso.'
            : 'Chamado aberto com sucesso.'
      })
    }

    if (idChamado) {
      await router.replace({
        name:
          'produtor-detalhes-chamado',

        params: {
          id:
            idChamado
        }
      })

      return
    }

    await router.replace({
      name:
        'produtor-chamados'
    })
  } catch (error) {
    console.error(
      'Erro ao criar solicitação:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível criar a solicitação.'
    })
  } finally {
    enviando.value =
      false
  }
}

function cancelar() {
  router.push({
    name:
      'produtor-chamados'
  })
}

onMounted(
  carregarPropriedade
)
</script>

<style scoped>
.formulario-card {
  padding: 26px;

  border:
    1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.05);
}

.card-topo {
  display: flex;
  justify-content:
    space-between;
  gap: 20px;
}

.card-titulo {
  color: #101828;
  font-size: 21px;
  font-weight: 800;
}

.card-subtitulo {
  margin-top: 4px;

  color: #667085;

  font-size: 12px;
}

.tipo-icone {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 13px;

  color: #f97316;

  background: #fff1e6;
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

.opcional {
  margin-left: 5px;

  color: #98a2b3;

  font-size: 10px;

  font-weight: 500;
}

/* TIPOS */

.tipo-solicitacao {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 12px;
}

.tipo-card {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 15px;

  border:
    2px solid #eaecf0;

  border-radius: 14px;

  color: inherit;

  background: transparent;

  cursor: pointer;

  text-align: left;
}

.tipo-card.selecionado {
  border-color: #f97316;

  background: #fff7ed;
}

.tipo-card-icone {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  color: #667085;

  background: #f2f4f7;
}

.tipo-card.selecionado
.tipo-card-icone {
  color: #f97316;

  background: #ffedd5;
}

.tipo-card-titulo {
  color: #344054;

  font-size: 13px;

  font-weight: 800;
}

.tipo-card-texto {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;
}

/* URGÊNCIA */

.urgencias {
  display: flex;
  gap: 10px;

  flex-wrap: wrap;
}

.urgencia {
  min-width: 90px;

  padding: 10px 18px;

  border:
    1px solid #d0d5dd;

  border-radius: 10px;

  color: #475467;

  background: transparent;

  cursor: pointer;

  font-weight: 700;
}

.urgencia--baixa.selecionada {
  border-color: #1570ef;

  color: #1570ef;

  background: #eff8ff;
}

.urgencia--media.selecionada {
  border-color: #f97316;

  color: #c2410c;

  background: #fff7ed;
}

.urgencia--alta.selecionada {
  border-color: #d92d20;

  color: #b42318;

  background: #fef3f2;
}

/* ANEXOS */

.anexos-ajuda {
  margin-top: 6px;

  color: #98a2b3;

  font-size: 10px;
}

.arquivos-selecionados {
  margin-top: 12px;

  padding: 12px;

  border:
    1px solid #eaecf0;

  border-radius: 12px;

  background: #f9fafb;
}

.arquivo-item {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 8px 0;

  border-bottom:
    1px solid #eaecf0;
}

.arquivo-item:last-child {
  border-bottom: none;
}

.arquivo-dados {
  flex: 1;

  min-width: 0;
}

.arquivo-nome {
  overflow: hidden;

  color: #344054;

  font-size: 11px;

  font-weight: 700;

  text-overflow:
    ellipsis;

  white-space: nowrap;
}

.arquivo-tamanho {
  color: #98a2b3;

  font-size: 9px;
}

/* LOCAL */

.carregando-localizacao {
  min-height: 120px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #667085;
}

/* AÇÕES */

.acoes {
  display: flex;

  justify-content:
    flex-end;

  gap: 10px;

  margin-top: 25px;
}

/* DARK */

.formulario-card--dark {
  border-color: #2b2f36;

  background: #16191f;
}

.formulario-card--dark
.card-titulo,
.formulario-card--dark
.campo-label,
.formulario-card--dark
.tipo-card-titulo,
.formulario-card--dark
.arquivo-nome {
  color: #f9fafb;
}

.formulario-card--dark
.card-subtitulo,
.formulario-card--dark
.tipo-card-texto {
  color: #98a2b3;
}

.formulario-card--dark
.tipo-card {
  border-color: #353a43;
}

.formulario-card--dark
.tipo-card.selecionado {
  border-color: #f97316;

  background: #292018;
}

.formulario-card--dark
.tipo-card-icone {
  background: #22262d;
}

.formulario-card--dark
.arquivos-selecionados {
  border-color: #2b2f36;

  background: #1b1f25;
}

.formulario-card--dark
.arquivo-item {
  border-color: #2b2f36;
}

/* TABLET */

@media (max-width: 900px) {
  .formulario-card {
    padding: 22px;
  }
}

/* CELULAR */

@media (max-width: 600px) {
  .formulario-card {
    padding: 17px;

    border-radius: 18px;
  }

  .tipo-solicitacao {
    grid-template-columns:
      1fr;
  }

  .card-titulo {
    font-size: 18px;
  }

  .tipo-icone {
    width: 40px;
    height: 40px;
  }

  .urgencias {
    display: grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .urgencia {
    min-width: 0;

    width: 100%;

    padding:
      10px 4px;
  }

  .acoes {
    flex-direction:
      column-reverse;
  }

  .acoes .q-btn {
    width: 100%;
  }
}
</style>