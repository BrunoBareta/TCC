<template>
  <div
    class="formulario-card"
    :class="{
      'formulario-card--dark':
        $q.dark.isActive
    }"
  >
    <q-form
      class="formulario-form"
      @submit.prevent="enviarChamado"
    >
      <!-- ===================================================
           DADOS PRINCIPAIS
      ==================================================== -->

      <section class="secao-formulario">
        <div class="secao-cabecalho">
          <div>
            <div class="secao-titulo">
              Dados da solicitação
            </div>

            <div class="secao-subtitulo">
              Preencha somente as informações necessárias para abrir o chamado.
            </div>
          </div>

          <div class="secao-indicador">
            <q-icon
              :name="
                modoComercial
                  ? 'request_quote'
                  : 'support_agent'
              "
              size="20px"
            />

            <span>
              {{
                modoComercial
                  ? 'Comercial'
                  : 'Assistência'
              }}
            </span>
          </div>
        </div>

        <!-- TIPO -->

        <div class="campo-grupo campo-grupo--compacto">
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
                  size="20px"
                />
              </div>

              <div class="tipo-card-conteudo">
                <div class="tipo-card-titulo">
                  Assistência técnica
                </div>

                <div class="tipo-card-texto">
                  Atendimento técnico na propriedade
                </div>
              </div>

              <q-icon
                v-if="
                  form.tipo_chamado ===
                  'ASSISTENCIA'
                "
                name="check_circle"
                class="tipo-check"
                size="19px"
              />
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
                  size="20px"
                />
              </div>

              <div class="tipo-card-conteudo">
                <div class="tipo-card-titulo">
                  Solicitar orçamento
                </div>

                <div class="tipo-card-texto">
                  Falar com o setor comercial
                </div>
              </div>

              <q-icon
                v-if="
                  form.tipo_chamado ===
                  'VENDEDOR'
                "
                name="check_circle"
                class="tipo-check"
                size="19px"
              />
            </button>
          </div>
        </div>

        <!-- DESCRIÇÃO -->

        <div class="campo-grupo campo-grupo--compacto">
          <div class="campo-label-linha">
            <div class="campo-label">
              {{
                modoComercial
                  ? 'O que você deseja orçar?'
                  : 'O que está acontecendo?'
              }}
            </div>

            <span class="campo-dica">
              Seja direto para agilizar o atendimento
            </span>
          </div>

          <q-input
            v-model="form.solicitacao"
            outlined
            type="textarea"
            rows="3"
            maxlength="1000"
            counter
            :disable="enviando"
            class="descricao-input"
            :placeholder="
              modoComercial
                ? 'Ex.: Preciso de orçamento para novos ventiladores...'
                : 'Ex.: Os ventiladores pararam de funcionar...'
            "
          />
        </div>

        <!-- URGÊNCIA + ANEXOS -->

        <div class="linha-dupla">
          <div class="campo-grupo campo-grupo--sem-margem">
            <div class="campo-label">
              {{
                modoComercial
                  ? 'Prioridade'
                  : 'Urgência'
              }}
            </div>

            <div class="urgencias">
              <button
                v-for="opcao in opcoesUrgencia"
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
                <q-icon
                  :name="
                    opcao.value === 'ALTA'
                      ? 'priority_high'
                      : opcao.value === 'MEDIA'
                        ? 'warning_amber'
                        : 'low_priority'
                  "
                  size="16px"
                />

                {{ opcao.label }}
              </button>
            </div>
          </div>

          <div class="campo-grupo campo-grupo--sem-margem">
            <div class="campo-label-linha">
              <div class="campo-label">
                Fotos ou vídeos
              </div>

              <span class="opcional">
                Opcional
              </span>
            </div>

            <q-file
              v-model="arquivos"
              outlined
              dense
              multiple
              clearable
              accept="image/*,video/*"
              :max-files="5"
              :max-file-size="31457280"
              :disable="enviando"
              class="arquivo-input"
              label="Adicionar arquivos"
              @rejected="arquivosRejeitados"
            >
              <template #prepend>
                <q-icon
                  name="add_photo_alternate"
                  color="orange"
                  size="20px"
                />
              </template>

              <template #append>
                <span class="arquivo-limite">
                  até 5
                </span>
              </template>
            </q-file>
          </div>
        </div>

        <!-- ARQUIVOS SELECIONADOS -->

        <div
          v-if="arquivosSelecionados.length"
          class="arquivos-selecionados"
        >
          <div class="arquivos-selecionados__titulo">
            {{ arquivosSelecionados.length }}
            {{
              arquivosSelecionados.length === 1
                ? 'arquivo selecionado'
                : 'arquivos selecionados'
            }}
          </div>

          <div class="arquivos-grid">
            <div
              v-for="(
                arquivo,
                index
              ) in arquivosSelecionados"
              :key="
                `${arquivo.name}-${index}`
              "
              class="arquivo-item"
            >
              <q-icon
                :name="
                  arquivo.type?.startsWith(
                    'video/'
                  )
                    ? 'videocam'
                    : 'image'
                "
                color="orange"
                size="19px"
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
                size="sm"
                icon="close"
                @click.stop="
                  removerArquivo(index)
                "
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================
           LOCAL DO ATENDIMENTO
      ==================================================== -->

      <section class="secao-formulario secao-localizacao">
        <div class="secao-cabecalho">
          <div>
            <div class="secao-titulo">
              Local do atendimento
            </div>

            <div class="secao-subtitulo">
              O endereço cadastrado já vem selecionado para agilizar a abertura.
            </div>
          </div>

          <div class="secao-indicador secao-indicador--local">
            <q-icon
              name="location_on"
              size="20px"
            />

            <span>
              {{
                modoLocalizacao === 'CADASTRO'
                  ? 'Endereço cadastrado'
                  : 'Outro local'
              }}
            </span>
          </div>
        </div>

        <div
          v-if="carregandoPropriedade"
          class="carregando-localizacao"
        >
          <q-spinner
            color="orange"
            size="27px"
          />

          <span>
            Carregando localização...
          </span>
        </div>

        <template v-else-if="propriedade">
          <!-- ESCOLHA -->

          <div class="localizacao-opcoes">
            <button
              type="button"
              class="localizacao-opcao"
              :class="{
                'localizacao-opcao--ativa':
                  modoLocalizacao ===
                  'CADASTRO'
              }"
              :disabled="enviando"
              @click="
                selecionarModoLocalizacao(
                  'CADASTRO'
                )
              "
            >
              <div class="opcao-radio">
                <div
                  v-if="
                    modoLocalizacao ===
                    'CADASTRO'
                  "
                  class="opcao-radio-centro"
                ></div>
              </div>

              <div class="localizacao-opcao__conteudo">
                <strong>
                  Usar endereço cadastrado
                </strong>

                <span>
                  {{
                    enderecoPropriedade ||
                    'Endereço cadastrado no perfil'
                  }}
                </span>
              </div>

              <q-icon
                name="home"
                size="19px"
                class="localizacao-opcao__icone"
              />
            </button>

            <button
              type="button"
              class="localizacao-opcao"
              :class="{
                'localizacao-opcao--ativa':
                  modoLocalizacao ===
                  'OUTRO'
              }"
              :disabled="enviando"
              @click="
                selecionarModoLocalizacao(
                  'OUTRO'
                )
              "
            >
              <div class="opcao-radio">
                <div
                  v-if="
                    modoLocalizacao ===
                    'OUTRO'
                  "
                  class="opcao-radio-centro"
                ></div>
              </div>

              <div class="localizacao-opcao__conteudo">
                <strong>
                  Informar outro local
                </strong>

                <span>
                  Pesquise um endereço ou use sua localização atual
                </span>
              </div>

              <q-icon
                name="edit_location_alt"
                size="19px"
                class="localizacao-opcao__icone"
              />
            </button>
          </div>

          <!-- ENDEREÇO CADASTRADO -->

          <div
            v-if="
              modoLocalizacao ===
              'CADASTRO'
            "
            class="localizacao-conteudo"
          >
            <div class="local-resumo">
              <div class="local-resumo__icone">
                <q-icon
                  name="location_on"
                  size="20px"
                />
              </div>

              <div class="local-resumo__dados">
                <span>
                  Local selecionado
                </span>

                <strong>
                  {{
                    enderecoPropriedade ||
                    'Endereço cadastrado'
                  }}
                </strong>
              </div>

              <q-btn
                v-if="possuiCoordenadasCadastro"
                flat
                no-caps
                dense
                class="botao-mapa"
                :icon="
                  mostrarMapaCadastro
                    ? 'expand_less'
                    : 'map'
                "
                :label="
                  mostrarMapaCadastro
                    ? 'Ocultar mapa'
                    : 'Ver mapa'
                "
                @click="
                  mostrarMapaCadastro =
                    !mostrarMapaCadastro
                "
              />
            </div>

            <q-slide-transition>
              <div
                v-if="
                  mostrarMapaCadastro &&
                  possuiCoordenadasCadastro
                "
                class="mapa-recolhivel"
              >
                <MapaLocalizacao
                  :key="
                    `cadastro-${propriedade.latitude}-${propriedade.longitude}`
                  "
                  :latitude="
                    propriedade.latitude
                  "
                  :longitude="
                    propriedade.longitude
                  "
                  nome-local="Endereço cadastrado"
                  :endereco="
                    enderecoPropriedade
                  "
                  titulo="Localização cadastrada"
                  subtitulo="Localização registrada no perfil."
                />
              </div>
            </q-slide-transition>

            <div
              v-if="
                !possuiCoordenadasCadastro
              "
              class="sem-coordenadas"
            >
              <q-icon
                name="info_outline"
                size="18px"
              />

              <span>
                O endereço cadastrado será enviado junto com o chamado.
              </span>
            </div>
          </div>

          <!-- OUTRO LOCAL -->

          <div
            v-else
            class="localizacao-conteudo"
          >
            <div class="busca-localizacao-topo">
              <q-input
                v-model="termoLocalizacao"
                outlined
                dense
                clearable
                class="busca-localizacao-input"
                placeholder="Pesquisar endereço ou local"
                :disable="
                  enviando ||
                  usandoLocalizacaoAtual
                "
                @keyup.enter="buscarLocalizacao"
              >
                <template #prepend>
                  <q-icon
                    name="search"
                    size="19px"
                  />
                </template>
              </q-input>

              <q-btn
                unelevated
                no-caps
                class="botao-pesquisar"
                icon="search"
                label="Pesquisar"
                :loading="buscandoLocalizacao"
                :disable="
                  enviando ||
                  usandoLocalizacaoAtual
                "
                @click="buscarLocalizacao"
              />

              <q-btn
                outline
                no-caps
                class="botao-local-atual"
                icon="my_location"
                label="Usar localização atual"
                :loading="usandoLocalizacaoAtual"
                :disable="
                  enviando ||
                  buscandoLocalizacao
                "
                @click="usarLocalizacaoAtual"
              />
            </div>

            <div
              v-if="
                resultadosLocalizacao.length
              "
              class="resultados-localizacao"
            >
              <button
                v-for="(
                  resultado,
                  index
                ) in resultadosLocalizacao"
                :key="
                  `${resultado.place_id}-${index}`
                "
                type="button"
                class="resultado-localizacao"
                @click="
                  selecionarResultado(
                    resultado
                  )
                "
              >
                <q-icon
                  name="location_on"
                  size="18px"
                />

                <div>
                  <strong>
                    {{
                      nomeResultado(
                        resultado
                      )
                    }}
                  </strong>

                  <span>
                    {{
                      resultado.display_name
                    }}
                  </span>
                </div>

                <q-icon
                  name="chevron_right"
                  size="19px"
                />
              </button>
            </div>

            <div
              v-if="
                possuiLocalAlternativo
              "
              class="local-alternativo-selecionado"
            >
              <div class="local-resumo">
                <div class="local-resumo__icone">
                  <q-icon
                    :name="
                      origemLocalizacao ===
                      'ATUAL'
                        ? 'my_location'
                        : 'location_on'
                    "
                    size="20px"
                  />
                </div>

                <div class="local-resumo__dados">
                  <span>
                    {{
                      origemLocalizacao ===
                      'ATUAL'
                        ? 'Sua localização atual'
                        : 'Local pesquisado'
                    }}
                  </span>

                  <strong>
                    {{
                      localSelecionado.endereco ||
                      'Localização selecionada'
                    }}
                  </strong>
                </div>

                <q-btn
                  flat
                  no-caps
                  dense
                  class="botao-mapa"
                  :icon="
                    mostrarMapaAlternativo
                      ? 'expand_less'
                      : 'map'
                  "
                  :label="
                    mostrarMapaAlternativo
                      ? 'Ocultar mapa'
                      : 'Ver mapa'
                  "
                  @click="
                    mostrarMapaAlternativo =
                      !mostrarMapaAlternativo
                  "
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="
                    limparLocalAlternativo
                  "
                />
              </div>

              <q-slide-transition>
                <div
                  v-if="
                    mostrarMapaAlternativo
                  "
                  class="mapa-recolhivel"
                >
                  <MapaLocalizacao
                    :key="
                      chaveMapaAlternativo
                    "
                    :latitude="
                      localSelecionado.latitude
                    "
                    :longitude="
                      localSelecionado.longitude
                    "
                    nome-local="Local selecionado"
                    :endereco="
                      localSelecionado.endereco
                    "
                    titulo="Local selecionado"
                    subtitulo="Este será o endereço enviado junto com o chamado."
                  />
                </div>
              </q-slide-transition>
            </div>

            <div
              v-else-if="
                !buscandoLocalizacao &&
                !usandoLocalizacaoAtual &&
                !resultadosLocalizacao.length
              "
              class="localizacao-dica"
            >
              <q-icon
                name="info_outline"
                size="17px"
              />

              <span>
                O local informado aqui será usado somente neste chamado e não altera seu cadastro.
              </span>
            </div>
          </div>
        </template>

        <div
          v-else
          class="sem-propriedade"
        >
          <q-icon
            name="warning_amber"
            size="24px"
          />

          <div>
            <strong>
              Propriedade não encontrada
            </strong>

            <span>
              Verifique o cadastro da propriedade antes de abrir o chamado.
            </span>
          </div>
        </div>
      </section>

      <!-- ===================================================
           AÇÕES
      ==================================================== -->

      <div class="acoes">
        <div class="acoes-resumo">
          <q-icon
            name="info_outline"
            size="17px"
          />

          <span>
            {{
              modoComercial
                ? 'Revise os dados e envie a solicitação.'
                : 'Revise os dados e abra o chamado.'
            }}
          </span>
        </div>

        <div class="acoes-botoes">
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
            class="botao-enviar"
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

/* =====================================================
   ESTADOS
===================================================== */

const propriedade =
  ref(null)

const carregandoPropriedade =
  ref(false)

const enviando =
  ref(false)

const arquivos =
  ref([])

/* LOCALIZAÇÃO */

const modoLocalizacao =
  ref('CADASTRO')

const origemLocalizacao =
  ref('CADASTRO')

const termoLocalizacao =
  ref('')

const buscandoLocalizacao =
  ref(false)

const usandoLocalizacaoAtual =
  ref(false)

const mostrarMapaCadastro =
  ref(false)

const mostrarMapaAlternativo =
  ref(false)

const resultadosLocalizacao =
  ref([])

const localSelecionado =
  reactive({
    latitude:
      null,

    longitude:
      null,

    endereco:
      ''
  })

/* FORMULÁRIO */

const form =
  reactive({
    solicitacao:
      '',

    tipo_chamado:
      'ASSISTENCIA',

    urgencia:
      'MEDIA'
  })

/* =====================================================
   COMPUTEDS
===================================================== */

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
    if (
      !propriedade.value
    ) {
      return ''
    }

    const cidadeEstado =
      [
        propriedade.value.cidade,
        propriedade.value.estado
      ]
        .filter(Boolean)
        .join(' - ')

    return [
      propriedade.value.endereco,
      cidadeEstado
    ]
      .filter(Boolean)
      .join(', ')
  })

const possuiCoordenadasCadastro =
  computed(() => {
    const latitude =
      converterCoordenada(
        propriedade.value
          ?.latitude
      )

    const longitude =
      converterCoordenada(
        propriedade.value
          ?.longitude
      )

    return (
      Number.isFinite(
        latitude
      ) &&
      Number.isFinite(
        longitude
      )
    )
  })

const possuiLocalAlternativo =
  computed(() => {
    return (
      Number.isFinite(
        converterCoordenada(
          localSelecionado.latitude
        )
      ) &&
      Number.isFinite(
        converterCoordenada(
          localSelecionado.longitude
        )
      )
    )
  })

const chaveMapaAlternativo =
  computed(() => {
    return (
      `${localSelecionado.latitude}-` +
      `${localSelecionado.longitude}`
    )
  })

const opcoesUrgencia = [
  {
    label:
      'Baixa',

    value:
      'BAIXA'
  },

  {
    label:
      'Média',

    value:
      'MEDIA'
  },

  {
    label:
      'Alta',

    value:
      'ALTA'
  }
]

/* =====================================================
   PROPRIEDADE DO PRODUTOR LOGADO
===================================================== */

async function carregarPropriedade() {
  carregandoPropriedade.value =
    true

  try {
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
      throw new Error(
        'Produtor logado não identificado.'
      )
    }

    /*
      Não usamos mais ID fixo.

      A propriedade é buscada pelo
      produtor que realmente está logado.
    */

    propriedade.value =
      await propriedadeService
        .buscarPorUsuario(
          idUsuario
        )

    if (
      !propriedade.value
    ) {
      $q.notify({
        type:
          'warning',

        message:
          'Nenhuma propriedade cadastrada foi encontrada para este produtor.'
      })
    }
  } catch (error) {
    console.error(
      'Erro ao carregar propriedade:',
      error
    )

    propriedade.value =
      null

    $q.notify({
      type:
        'negative',

      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        error.message ||
        'Não foi possível carregar a propriedade.'
    })
  } finally {
    carregandoPropriedade.value =
      false
  }
}

/* =====================================================
   TIPO
===================================================== */

function selecionarTipo(
  tipo
) {
  if (
    enviando.value
  ) {
    return
  }

  form.tipo_chamado =
    tipo
}

/* =====================================================
   LOCALIZAÇÃO
===================================================== */

function selecionarModoLocalizacao(
  modo
) {
  if (
    enviando.value
  ) {
    return
  }

  modoLocalizacao.value =
    modo

  if (
    modo ===
    'CADASTRO'
  ) {
    mostrarMapaAlternativo.value =
      false
    origemLocalizacao.value =
      'CADASTRO'

    limparLocalAlternativo(
      false
    )

    return
  }

  mostrarMapaCadastro.value =
    false
}

/* =====================================================
   PESQUISAR ENDEREÇO
===================================================== */

async function buscarLocalizacao() {
  const termo =
    String(
      termoLocalizacao.value ||
      ''
    ).trim()

  if (
    termo.length < 3
  ) {
    $q.notify({
      type:
        'warning',

      message:
        'Digite pelo menos 3 caracteres para pesquisar o local.'
    })

    return
  }

  buscandoLocalizacao.value =
    true

  resultadosLocalizacao.value =
    []

  try {
    const consulta =
      encodeURIComponent(
        `${termo}, Brasil`
      )

    /*
      Para o protótipo utilizamos a
      pesquisa do OpenStreetMap.

      O mapa do projeto continua sendo
      exibido pelo componente Leaflet
      já utilizado no sistema.
    */

    const response =
      await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=br&accept-language=pt-BR&q=${consulta}`
      )

    if (
      !response.ok
    ) {
      throw new Error(
        'Não foi possível consultar o endereço.'
      )
    }

    const dados =
      await response.json()

    resultadosLocalizacao.value =
      Array.isArray(
        dados
      )
        ? dados
        : []

    if (
      resultadosLocalizacao
        .value.length === 0
    ) {
      $q.notify({
        type:
          'warning',

        message:
          'Nenhum local foi encontrado. Tente informar mais detalhes.'
      })
    }
  } catch (error) {
    console.error(
      'Erro ao pesquisar localização:',
      error
    )

    $q.notify({
      type:
        'negative',

      message:
        'Não foi possível pesquisar o endereço no momento.'
    })
  } finally {
    buscandoLocalizacao.value =
      false
  }
}

/* =====================================================
   SELECIONAR RESULTADO
===================================================== */

function selecionarResultado(
  resultado
) {
  const latitude =
    converterCoordenada(
      resultado?.lat
    )

  const longitude =
    converterCoordenada(
      resultado?.lon
    )

  if (
    !Number.isFinite(
      latitude
    ) ||
    !Number.isFinite(
      longitude
    )
  ) {
    $q.notify({
      type:
        'negative',

      message:
        'O local selecionado não possui coordenadas válidas.'
    })

    return
  }

  localSelecionado.latitude =
    latitude

  localSelecionado.longitude =
    longitude

  localSelecionado.endereco =
    resultado.display_name ||
    termoLocalizacao.value

  origemLocalizacao.value =
    'PESQUISA'

  mostrarMapaAlternativo.value =
    false

  resultadosLocalizacao.value =
    []

  termoLocalizacao.value =
    ''

  $q.notify({
    type:
      'positive',

    message:
      'Local do atendimento selecionado.'
  })
}

/* =====================================================
   LOCALIZAÇÃO ATUAL
===================================================== */

function usarLocalizacaoAtual() {
  if (
    !navigator.geolocation
  ) {
    $q.notify({
      type:
        'negative',

      message:
        'Seu navegador não oferece suporte à localização atual.'
    })

    return
  }

  usandoLocalizacaoAtual.value =
    true

  navigator.geolocation
    .getCurrentPosition(
      async position => {
        const latitude =
          position.coords
            .latitude

        const longitude =
          position.coords
            .longitude

        localSelecionado.latitude =
          latitude

        localSelecionado.longitude =
          longitude

        localSelecionado.endereco =
          'Localização atual'

        origemLocalizacao.value =
          'ATUAL'

        mostrarMapaAlternativo.value =
          false

        resultadosLocalizacao.value =
          []

        termoLocalizacao.value =
          ''

        try {
          const endereco =
            await buscarEnderecoCoordenadas(
              latitude,
              longitude
            )

          if (endereco) {
            localSelecionado.endereco =
              endereco
          }
        } catch (error) {
          console.warn(
            'Não foi possível obter o endereço da localização atual:',
            error
          )
        }

        usandoLocalizacaoAtual.value =
          false

        $q.notify({
          type:
            'positive',

          message:
            'Localização atual encontrada.'
        })
      },

      error => {
        console.error(
          'Erro ao obter localização atual:',
          error
        )

        usandoLocalizacaoAtual.value =
          false

        let mensagem =
          'Não foi possível obter sua localização atual.'

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          mensagem =
            'A permissão de localização foi negada. Autorize o acesso no navegador ou pesquise o endereço manualmente.'
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          mensagem =
            'Sua localização não está disponível no momento.'
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          mensagem =
            'A busca pela localização demorou demais. Tente novamente.'
        }

        $q.notify({
          type:
            'warning',

          timeout:
            5000,

          message:
            mensagem
        })
      },

      {
        enableHighAccuracy:
          true,

        timeout:
          12000,

        maximumAge:
          30000
      }
    )
}

/* =====================================================
   ENDEREÇO DAS COORDENADAS
===================================================== */

async function buscarEnderecoCoordenadas(
  latitude,
  longitude
) {
  const response =
    await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=pt-BR&lat=${latitude}&lon=${longitude}`
    )

  if (
    !response.ok
  ) {
    return ''
  }

  const dados =
    await response.json()

  return (
    dados?.display_name ||
    ''
  )
}

/* =====================================================
   LIMPAR LOCAL ALTERNATIVO
===================================================== */

function limparLocalAlternativo(
  notificar = true
) {
  localSelecionado.latitude =
    null

  localSelecionado.longitude =
    null

  localSelecionado.endereco =
    ''

  mostrarMapaAlternativo.value =
    false

  termoLocalizacao.value =
    ''

  resultadosLocalizacao.value =
    []

  if (
    modoLocalizacao.value ===
    'OUTRO'
  ) {
    origemLocalizacao.value =
      null
  }

  if (
    notificar
  ) {
    $q.notify({
      type:
        'info',

      message:
        'Localização removida. Escolha outro local ou use o endereço cadastrado.'
    })
  }
}

/* =====================================================
   COORDENADAS
===================================================== */

function converterCoordenada(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return NaN
  }

  const numero =
    Number(
      String(valor)
        .replace(
          ',',
          '.'
        )
    )

  return numero
}

/* =====================================================
   RESUMO DO TEXTO
===================================================== */

function criarResumo(
  texto
) {
  const normalizado =
    texto.trim()

  if (
    normalizado.length <=
    150
  ) {
    return normalizado
  }

  return `${normalizado.substring(
    0,
    147
  )}...`
}

/* =====================================================
   VALIDAÇÃO
===================================================== */

function validarFormulario() {
  if (
    !propriedade.value
  ) {
    $q.notify({
      type:
        'warning',

      message:
        'A propriedade não foi carregada.'
    })

    return false
  }

  if (
    !form.solicitacao
      .trim()
  ) {
    $q.notify({
      type:
        'warning',

      message:
        modoComercial.value
          ? 'Informe o que você deseja orçar.'
          : 'Informe o que está acontecendo.'
    })

    return false
  }

  if (
    !form.urgencia
  ) {
    $q.notify({
      type:
        'warning',

      message:
        'Selecione a urgência.'
    })

    return false
  }

  /*
    Se escolheu outro local,
    obrigatoriamente precisa ter
    pesquisado ou usado o GPS.
  */

  if (
    modoLocalizacao.value ===
      'OUTRO' &&
    !possuiLocalAlternativo.value
  ) {
    $q.notify({
      type:
        'warning',

      message:
        'Pesquise um local ou utilize sua localização atual antes de abrir o chamado.'
    })

    return false
  }

  return true
}

/* =====================================================
   ANEXOS
===================================================== */

function arquivosRejeitados(
  rejeitados
) {
  if (
    !rejeitados?.length
  ) {
    return
  }

  $q.notify({
    type:
      'warning',

    message:
      'Verifique o formato, a quantidade ou o tamanho dos arquivos.'
  })
}

function removerArquivo(
  index
) {
  const lista = [
    ...arquivosSelecionados
      .value
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

  if (
    mb >= 1
  ) {
    return `${mb.toFixed(
      1
    )} MB`
  }

  return `${(
    Number(bytes) /
    1024
  ).toFixed(0)} KB`
}

/* =====================================================
   DADOS DA LOCALIZAÇÃO PARA O CHAMADO
===================================================== */

function montarLocalizacaoChamado() {
  /*
    LOCAL ALTERNATIVO
  */

  if (
    modoLocalizacao.value ===
    'OUTRO'
  ) {
    return {
      latitude_atendimento:
        localSelecionado.latitude,

      longitude_atendimento:
        localSelecionado.longitude,

      endereco_atendimento:
        localSelecionado.endereco,

      origem_localizacao:
        origemLocalizacao.value
    }
  }

  /*
    LOCALIZAÇÃO DO CADASTRO

    Salvamos uma cópia da localização
    da propriedade no chamado.
  */

  return {
    latitude_atendimento:
      possuiCoordenadasCadastro
        .value
        ? converterCoordenada(
            propriedade.value
              ?.latitude
          )
        : null,

    longitude_atendimento:
      possuiCoordenadasCadastro
        .value
        ? converterCoordenada(
            propriedade.value
              ?.longitude
          )
        : null,

    endereco_atendimento:
      enderecoPropriedade.value ||
      null,

    origem_localizacao:
      'CADASTRO'
  }
}

/* =====================================================
   ENVIAR CHAMADO
===================================================== */

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
      type:
        'negative',

      message:
        'Não foi possível identificar o produtor.'
    })

    return
  }

  enviando.value =
    true

  try {
    const texto =
      form.solicitacao
        .trim()

    const localizacao =
      montarLocalizacaoChamado()

    const dados = {
      id_usuario:
        idUsuario,

      id_propriedade:
        Number(
          propriedade.value
            .id_propriedade
        ),

      id_unidade:
        null,

      problema:
        criarResumo(
          texto
        ),

      descricao:
        texto,

      tipo_cultura:
        propriedade.value
          .cultura_principal ||
        'AVES',

      tipo_chamado:
        form.tipo_chamado,

      urgencia:
        form.urgencia,

      /*
        LOCALIZAÇÃO ESPECÍFICA
        DO ATENDIMENTO
      */

      latitude_atendimento:
        localizacao
          .latitude_atendimento,

      longitude_atendimento:
        localizacao
          .longitude_atendimento,

      endereco_atendimento:
        localizacao
          .endereco_atendimento,

      origem_localizacao:
        localizacao
          .origem_localizacao
    }

    const resposta =
      await chamadoService
        .criar(
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
      arquivosSelecionados
        .value
        .length
    ) {
      try {
        await anexoService
          .enviar(
            idChamado,
            arquivosSelecionados
              .value
          )
      } catch (error) {
        erroAnexo =
          true

        console.error(
          'Erro ao enviar anexos:',
          error
        )
      }
    }

    if (
      erroAnexo
    ) {
      $q.notify({
        type:
          'warning',

        timeout:
          5000,

        message:
          'A solicitação foi criada, mas algum anexo não pôde ser enviado.'
      })
    } else {
      $q.notify({
        type:
          'positive',

        message:
          modoComercial.value
            ? 'Solicitação enviada com sucesso.'
            : 'Chamado aberto com sucesso.'
      })
    }

    if (
      idChamado
    ) {
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
      type:
        'negative',

      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível criar a solicitação.'
    })
  } finally {
    enviando.value =
      false
  }
}

/* =====================================================
   CANCELAR
===================================================== */

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
  border: 1px solid #eaecf0;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.formulario-form {
  display: grid;
  gap: 12px;
}

/* =====================================================
   SEÇÕES
===================================================== */

.secao-formulario {
  padding: 16px;

  border-bottom: 1px solid #eef0f3;
}

.secao-formulario:last-of-type {
  border-bottom: none;
}

.secao-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 14px;

  margin-bottom: 13px;
}

.secao-titulo {
  color: #101828;

  font-size: 14px;
  font-weight: 900;
}

.secao-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
}

.secao-indicador {
  display: flex;
  align-items: center;

  gap: 6px;

  padding: 6px 9px;

  border-radius: 9px;

  color: #f97316;

  background: #fff1e6;

  font-size: 8px;
  font-weight: 800;
}

.secao-indicador--local {
  color: #475467;
  background: #f2f4f7;
}

/* =====================================================
   CAMPOS
===================================================== */

.campo-grupo {
  margin-bottom: 14px;
}

.campo-grupo--compacto {
  margin-bottom: 13px;
}

.campo-grupo--sem-margem {
  margin-bottom: 0;
}

.campo-label-linha {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 6px;
}

.campo-label {
  margin-bottom: 6px;

  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.campo-label-linha .campo-label {
  margin-bottom: 0;
}

.campo-dica,
.opcional {
  color: #98a2b3;

  font-size: 8px;
}

.descricao-input :deep(.q-field__control) {
  min-height: 80px;

  border-radius: 11px;
}

.descricao-input :deep(textarea) {
  font-size: 11px;
  line-height: 1.45;
}

/* =====================================================
   TIPO DA SOLICITAÇÃO
===================================================== */

.tipo-solicitacao {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 8px;
}

.tipo-card {
  appearance: none;

  min-width: 0;
  min-height: 58px;

  display: grid;

  grid-template-columns:
    34px
    minmax(0, 1fr)
    20px;

  align-items: center;

  gap: 9px;

  padding: 9px 10px;

  border: 1px solid #d0d5dd;
  border-radius: 11px;

  color: inherit;

  background: transparent;

  font-family: inherit;
  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.tipo-card:hover {
  transform: translateY(-1px);

  border-color: #fdba74;
}

.tipo-card.selecionado {
  border-color: #f97316;

  background: #fff7ed;
}

.tipo-card-icone {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  color: #667085;

  background: #f2f4f7;
}

.tipo-card.selecionado
.tipo-card-icone {
  color: #f97316;

  background: #ffedd5;
}

.tipo-card-conteudo {
  min-width: 0;
}

.tipo-card-titulo {
  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.tipo-card-texto {
  overflow: hidden;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.tipo-check {
  color: #f97316;
}

/* =====================================================
   URGÊNCIA + ANEXOS
===================================================== */

.linha-dupla {
  display: grid;

  grid-template-columns:
    minmax(300px, 0.75fr)
    minmax(360px, 1.25fr);

  gap: 14px;

  align-items: end;
}

.urgencias {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 7px;
}

.urgencia {
  min-height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  padding: 7px 9px;

  border: 1px solid #d0d5dd;
  border-radius: 10px;

  color: #475467;

  background: transparent;

  font-family: inherit;

  font-size: 9px;
  font-weight: 800;

  cursor: pointer;
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

.arquivo-input :deep(.q-field__control) {
  min-height: 40px;
  height: 40px;

  border-radius: 10px;
}

.arquivo-input :deep(.q-field__native),
.arquivo-input :deep(.q-field__input) {
  font-size: 10px;
}

.arquivo-limite {
  color: #98a2b3;

  font-size: 7px;
  font-weight: 700;
}

/* =====================================================
   ARQUIVOS
===================================================== */

.arquivos-selecionados {
  margin-top: 11px;
  padding: 10px;

  border: 1px solid #eaecf0;
  border-radius: 11px;

  background: #f9fafb;
}

.arquivos-selecionados__titulo {
  margin-bottom: 7px;

  color: #667085;

  font-size: 8px;
  font-weight: 800;
}

.arquivos-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 6px;
}

.arquivo-item {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 7px 8px;

  border: 1px solid #eef0f3;
  border-radius: 9px;

  background: #ffffff;
}

.arquivo-dados {
  min-width: 0;
  flex: 1;
}

.arquivo-nome {
  overflow: hidden;

  color: #344054;

  font-size: 8px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.arquivo-tamanho {
  margin-top: 1px;

  color: #98a2b3;

  font-size: 7px;
}

/* =====================================================
   LOCALIZAÇÃO
===================================================== */

.secao-localizacao {
  padding-top: 15px;
}

.localizacao-opcoes {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 8px;

  margin-bottom: 10px;
}

.localizacao-opcao {
  appearance: none;

  min-width: 0;
  min-height: 56px;

  display: grid;

  grid-template-columns:
    18px
    minmax(0, 1fr)
    20px;

  align-items: center;

  gap: 8px;

  padding: 9px 10px;

  border: 1px solid #d0d5dd;
  border-radius: 11px;

  color: inherit;

  background: transparent;

  font-family: inherit;
  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.localizacao-opcao:hover {
  border-color: #fdba74;
}

.localizacao-opcao--ativa {
  border-color: #f97316;

  background: #fff7ed;
}

.opcao-radio {
  width: 17px;
  height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #d0d5dd;
  border-radius: 50%;
}

.localizacao-opcao--ativa
.opcao-radio {
  border-color: #f97316;
}

.opcao-radio-centro {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #f97316;
}

.localizacao-opcao__conteudo {
  min-width: 0;
}

.localizacao-opcao strong {
  display: block;

  color: #344054;

  font-size: 9px;
  font-weight: 800;
}

.localizacao-opcao span {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.localizacao-opcao__icone {
  color: #98a2b3;
}

.localizacao-opcao--ativa
.localizacao-opcao__icone {
  color: #f97316;
}

.localizacao-conteudo {
  margin-top: 2px;
}

/* RESUMO LOCAL */

.local-resumo {
  display: flex;
  align-items: center;

  gap: 9px;

  padding: 9px 10px;

  border: 1px solid #eaecf0;
  border-radius: 11px;

  background: #f9fafb;
}

.local-resumo__icone {
  width: 33px;
  height: 33px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  color: #f97316;

  background: #fff1e6;
}

.local-resumo__dados {
  min-width: 0;
  flex: 1;
}

.local-resumo__dados span {
  display: block;

  color: #98a2b3;

  font-size: 6px;

  text-transform: uppercase;
}

.local-resumo__dados strong {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #344054;

  font-size: 9px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.botao-mapa {
  flex-shrink: 0;

  color: #f97316;

  font-size: 8px;
  font-weight: 800;
}

.mapa-recolhivel {
  margin-top: 9px;
}

/* BUSCA OUTRO LOCAL */

.busca-localizacao-topo {
  display: grid;

  grid-template-columns:
    minmax(260px, 1fr)
    auto
    auto;

  align-items: center;

  gap: 7px;
}

.busca-localizacao-input :deep(.q-field__control) {
  min-height: 40px;
  height: 40px;

  border-radius: 10px;
}

.busca-localizacao-input :deep(.q-field__native),
.busca-localizacao-input :deep(.q-field__input) {
  font-size: 10px;
}

.botao-pesquisar,
.botao-local-atual {
  min-height: 40px;

  border-radius: 10px;

  font-size: 9px;
  font-weight: 800;
}

.botao-pesquisar {
  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );
}

.botao-local-atual {
  color: #f97316;
}

.localizacao-dica,
.sem-coordenadas {
  display: flex;
  align-items: center;

  gap: 7px;

  margin-top: 8px;
  padding: 8px 10px;

  border-radius: 9px;

  color: #667085;

  background: #f9fafb;

  font-size: 7px;
}

.resultados-localizacao {
  overflow: hidden;

  margin-top: 8px;

  border: 1px solid #eaecf0;
  border-radius: 10px;
}

.resultado-localizacao {
  appearance: none;

  width: 100%;

  display: grid;

  grid-template-columns:
    22px
    minmax(0, 1fr)
    18px;

  align-items: center;

  gap: 7px;

  padding: 9px 10px;

  border: none;
  border-bottom: 1px solid #f2f4f7;

  color: #667085;

  background: #ffffff;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
}

.resultado-localizacao:last-child {
  border-bottom: none;
}

.resultado-localizacao:hover {
  background: #fff7ed;
}

.resultado-localizacao strong {
  display: block;

  overflow: hidden;

  color: #344054;

  font-size: 8px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.resultado-localizacao span {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.local-alternativo-selecionado {
  margin-top: 8px;
}

/* ESTADOS */

.carregando-localizacao {
  min-height: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  color: #667085;

  font-size: 9px;
}

.sem-propriedade {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 11px;

  border-radius: 10px;

  color: #b42318;

  background: #fef3f2;
}

.sem-propriedade strong,
.sem-propriedade span {
  display: block;
}

.sem-propriedade strong {
  font-size: 9px;
}

.sem-propriedade span {
  margin-top: 2px;

  font-size: 8px;
}

/* =====================================================
   AÇÕES
===================================================== */

.acoes {
  position: sticky;
  bottom: 0;
  z-index: 15;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 11px 16px;

  border-top: 1px solid #eaecf0;
  border-radius: 0 0 18px 18px;

  background:
    rgba(255, 255, 255, 0.96);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.acoes-resumo {
  display: flex;
  align-items: center;

  gap: 6px;

  color: #98a2b3;

  font-size: 8px;
}

.acoes-botoes {
  display: flex;
  align-items: center;

  gap: 7px;
}

.botao-enviar {
  min-height: 39px;

  padding: 0 14px;

  border-radius: 10px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ff9d1f,
      #f97316
    );

  font-size: 10px;
  font-weight: 800;

  box-shadow:
    0 4px 12px
    rgba(249, 115, 22, 0.18);
}

/* =====================================================
   DARK
===================================================== */

.formulario-card--dark {
  border-color: #2b2f36;

  background: #16191f;
}

.formulario-card--dark
.secao-formulario,
.formulario-card--dark
.acoes {
  border-color: #2b2f36;
}

.formulario-card--dark
.secao-titulo,
.formulario-card--dark
.campo-label,
.formulario-card--dark
.tipo-card-titulo,
.formulario-card--dark
.arquivo-nome,
.formulario-card--dark
.localizacao-opcao strong,
.formulario-card--dark
.local-resumo__dados strong,
.formulario-card--dark
.resultado-localizacao strong {
  color: #f9fafb;
}

.formulario-card--dark
.secao-subtitulo,
.formulario-card--dark
.tipo-card-texto,
.formulario-card--dark
.campo-dica {
  color: #98a2b3;
}

.formulario-card--dark
.tipo-card,
.formulario-card--dark
.localizacao-opcao,
.formulario-card--dark
.local-resumo,
.formulario-card--dark
.resultados-localizacao {
  border-color: #353a43;
}

.formulario-card--dark
.tipo-card.selecionado,
.formulario-card--dark
.localizacao-opcao--ativa {
  border-color: #f97316;

  background: #292018;
}

.formulario-card--dark
.tipo-card-icone,
.formulario-card--dark
.local-resumo,
.formulario-card--dark
.localizacao-dica,
.formulario-card--dark
.sem-coordenadas,
.formulario-card--dark
.arquivos-selecionados {
  background: #1b1f25;
}

.formulario-card--dark
.arquivo-item,
.formulario-card--dark
.resultado-localizacao {
  border-color: #2b2f36;

  background: #16191f;
}

.formulario-card--dark
.resultado-localizacao:hover {
  background: #292018;
}

.formulario-card--dark
.acoes {
  background:
    rgba(22, 25, 31, 0.96);
}

/* =====================================================
   TABLET
===================================================== */

@media (max-width: 950px) {
  .linha-dupla {
    grid-template-columns: 1fr;
  }

  .busca-localizacao-topo {
    grid-template-columns:
      1fr
      1fr;
  }

  .busca-localizacao-input {
    grid-column:
      1 / 3;
  }
}

/* =====================================================
   CELULAR
===================================================== */

@media (max-width: 650px) {
  .formulario-card {
    border-radius: 15px;
  }

  .secao-formulario {
    padding: 13px;
  }

  .secao-cabecalho {
    align-items: flex-start;
  }

  .secao-indicador {
    display: none;
  }

  .tipo-solicitacao,
  .localizacao-opcoes {
    grid-template-columns: 1fr;
  }

  .tipo-card {
    min-height: 54px;
  }

  .campo-dica {
    display: none;
  }

  .urgencias {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .arquivos-grid {
    grid-template-columns: 1fr;
  }

  .busca-localizacao-topo {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .busca-localizacao-topo .q-btn {
    width: 100%;
  }

  .local-resumo {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .local-resumo__dados {
    min-width: calc(100% - 50px);
  }

  .botao-mapa {
    margin-left: 42px;
  }

  .acoes {
    align-items: stretch;
    flex-direction: column;

    padding: 10px 13px;
  }

  .acoes-resumo {
    display: none;
  }

  .acoes-botoes {
    width: 100%;
  }

  .acoes-botoes .q-btn {
    flex: 1;
  }
}
</style>