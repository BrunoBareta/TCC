<template>
  <div
    class="formulario-card"
    :class="{
      'formulario-card--dark':
        $q.dark.isActive
    }"
  >
    <!-- =====================================================
         CABEÇALHO
    ====================================================== -->

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
      <!-- ===================================================
           TIPO DA SOLICITAÇÃO
      ==================================================== -->

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

      <!-- ===================================================
           DESCRIÇÃO
      ==================================================== -->

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

      <!-- ===================================================
           FOTOS
      ==================================================== -->

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
          @rejected="arquivosRejeitados"
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
          v-if="arquivosSelecionados.length"
          class="arquivos-selecionados"
        >
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

      <!-- ===================================================
           URGÊNCIA
      ==================================================== -->

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
            {{ opcao.label }}
          </button>
        </div>
      </div>

      <!-- ===================================================
     LOCALIZAÇÃO
==================================================== -->

<div class="campo-grupo">
  <div class="localizacao-card">
    <!-- CARREGANDO -->

    <div
      v-if="carregandoPropriedade"
      class="carregando-localizacao"
    >
      <q-spinner
        color="orange"
        size="28px"
      />

      <span>
        Carregando localização...
      </span>
    </div>

    <template v-else-if="propriedade">
      <!-- ESCOLHA DA LOCALIZAÇÃO -->

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

          <div>
            <strong>
              Usar endereço cadastrado
            </strong>

            <span>
              {{
                enderecoPropriedade ||
                'Utilizar o endereço cadastrado no perfil.'
              }}
            </span>
          </div>
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

          <div>
            <strong>
              Informar outro local
            </strong>

            <span>
              Pesquise um endereço ou utilize sua localização atual.
            </span>
          </div>
        </button>
      </div>

      <!-- ===============================================
           ENDEREÇO CADASTRADO
      ================================================ -->

      <div
        v-if="
          modoLocalizacao ===
          'CADASTRO'
        "
        class="localizacao-conteudo"
      >
        <MapaLocalizacao
          v-if="
            possuiCoordenadasCadastro
          "
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

        <div
          v-else
          class="sem-coordenadas"
        >
          <q-icon
            name="location_on"
            size="22px"
          />

          <div>
            <strong>
              {{ enderecoPropriedade || 'Endereço cadastrado' }}
            </strong>

            <span>
              O endereço será enviado junto com o chamado.
            </span>
          </div>
        </div>
      </div>

      <!-- ===============================================
           OUTRO LOCAL
      ================================================ -->

      <div
        v-else
        class="localizacao-conteudo"
      >
        <div class="busca-localizacao-topo">
          <q-input
            v-model="termoLocalizacao"
            outlined
            clearable
            class="busca-localizacao-input"
            label="Pesquisar endereço ou local"
            placeholder="Ex.: Linha Taipas, Pinhalzinho - SC"
            :disable="
              enviando ||
              usandoLocalizacaoAtual
            "
            @keyup.enter="buscarLocalizacao"
          >
            <template #prepend>
              <q-icon
                name="search"
                size="20px"
              />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="orange"
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
            color="orange"
            icon="my_location"
            label="Usar minha localização atual"
            :loading="usandoLocalizacaoAtual"
            :disable="
              enviando ||
              buscandoLocalizacao
            "
            @click="usarLocalizacaoAtual"
          />
        </div>

        <div class="localizacao-ajuda">
          <q-icon
            name="info_outline"
            size="17px"
          />

          <span>
            A localização escolhida será utilizada apenas neste chamado e não alterará o cadastro da propriedade.
          </span>
        </div>

        <!-- RESULTADOS -->

        <div
          v-if="
            resultadosLocalizacao.length
          "
          class="resultados-localizacao"
        >
          <div class="resultados-titulo">
            Locais encontrados
          </div>

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
              size="20px"
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
              size="20px"
            />
          </button>
        </div>

        <!-- LOCAL ESCOLHIDO -->

        <div
          v-if="
            possuiLocalAlternativo
          "
          class="local-alternativo-selecionado"
        >
          <div class="local-selecionado">
            <q-icon
              :name="
                origemLocalizacao ===
                'ATUAL'
                  ? 'my_location'
                  : 'location_on'
              "
              size="20px"
            />

            <div>
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
              round
              dense
              icon="close"
              @click="
                limparLocalAlternativo
              "
            />
          </div>

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

        <div
          v-else-if="
            !buscandoLocalizacao &&
            !usandoLocalizacaoAtual
          "
          class="aguardando-local"
        >
          <div class="aguardando-local-icone">
            <q-icon
              name="map"
              size="30px"
            />
          </div>

          <strong>
            Nenhum local selecionado
          </strong>

          <span>
            Pesquise um endereço ou utilize sua localização atual.
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
        size="28px"
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
  </div>
</div>

      <!-- ===================================================
           AÇÕES
      ==================================================== -->

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
    origemLocalizacao.value =
      'CADASTRO'

    limparLocalAlternativo(
      false
    )
  }
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
/* =====================================================
   CARD PRINCIPAL
===================================================== */

.formulario-card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.05);
}

.card-topo {
  display: flex;
  justify-content: space-between;
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

/* =====================================================
   TIPOS
===================================================== */

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

  border: 2px solid #eaecf0;
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

/* =====================================================
   URGÊNCIA
===================================================== */

.urgencias {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.urgencia {
  min-width: 90px;

  padding: 10px 18px;

  border: 1px solid #d0d5dd;
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

/* =====================================================
   ANEXOS
===================================================== */

.anexos-ajuda {
  margin-top: 6px;
  color: #98a2b3;
  font-size: 10px;
}

.arquivos-selecionados {
  margin-top: 12px;

  padding: 12px;

  border: 1px solid #eaecf0;
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

  text-overflow: ellipsis;
  white-space: nowrap;
}

.arquivo-tamanho {
  color: #98a2b3;
  font-size: 9px;
}

/* =====================================================
   LOCALIZAÇÃO
===================================================== */

.localizacao-card {
  overflow: hidden;

  border: 1px solid #eaecf0;
  border-radius: 18px;

  background: #ffffff;
}

.localizacao-cabecalho {
  padding: 18px 20px;

  border-bottom:
    1px solid #f2f4f7;
}

.localizacao-titulo-area {
  display: flex;
  align-items: center;

  gap: 10px;
}

.localizacao-icone {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  color: #f97316;
  background: #fff1e6;
}

.localizacao-titulo {
  color: #101828;

  font-size: 14px;
  font-weight: 800;
}

.localizacao-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 10px;
}

/* PROPRIEDADE */

.propriedade-resumo {
  display: flex;
  align-items: center;

  gap: 11px;

  margin:
    18px 20px 0;

  padding: 13px;

  border-radius: 12px;

  background: #f9fafb;
}

.propriedade-resumo-icone {
  width: 39px;
  height: 39px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;
  background: #fff1e6;
}

.propriedade-resumo-dados {
  min-width: 0;
}

.propriedade-resumo-dados span,
.local-selecionado span {
  display: block;

  color: #98a2b3;

  font-size: 8px;

  text-transform: uppercase;
}

.propriedade-resumo-dados strong,
.local-selecionado strong {
  display: block;

  margin-top: 2px;

  color: #344054;

  font-size: 11px;
  font-weight: 800;
}

.propriedade-resumo-dados small,
.local-selecionado small {
  display: block;

  margin-top: 2px;

  color: #667085;

  font-size: 9px;
}

/* OPÇÕES */

.localizacao-opcoes {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin:
    14px 20px;
}

.localizacao-opcao {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  min-height: 76px;

  padding: 13px;

  border:
    1px solid #d0d5dd;

  border-radius: 12px;

  color: inherit;

  background: transparent;

  cursor: pointer;

  text-align: left;
}

.localizacao-opcao:hover {
  border-color: #fdba74;
}

.localizacao-opcao--ativa {
  border-color: #f97316;
  background: #fff7ed;
}

.opcao-radio {
  width: 18px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  margin-top: 2px;

  border: 2px solid #d0d5dd;
  border-radius: 50%;
}

.localizacao-opcao--ativa
.opcao-radio {
  border-color: #f97316;
}

.opcao-radio-centro {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #f97316;
}

.localizacao-opcao strong {
  display: block;

  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.localizacao-opcao span {
  display: block;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 8px;

  line-height: 1.45;
}

/* CONTEÚDO */

.localizacao-conteudo {
  padding:
    0 20px 20px;
}

.local-selecionado {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 12px;

  padding: 12px;

  border-radius: 11px;

  color: #f97316;

  background: #fff7ed;
}

.local-selecionado > div {
  flex: 1;
}

.local-selecionado strong {
  color: #344054;
}

.sem-coordenadas {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  padding: 14px;

  border-radius: 11px;

  color: #b54708;

  background: #fffaeb;
}

.sem-coordenadas strong,
.sem-coordenadas span {
  display: block;
}

.sem-coordenadas strong {
  color: #93370d;

  font-size: 10px;
}

.sem-coordenadas span {
  margin-top: 3px;

  font-size: 9px;

  line-height: 1.5;
}

/* BUSCA */

.busca-localizacao-topo {
  display: grid;

  grid-template-columns:
    minmax(260px, 1fr)
    auto
    auto;

  align-items: center;

  gap: 8px;
}

.busca-localizacao-input {
  width: 100%;
}

.localizacao-ajuda {
  display: flex;
  align-items: flex-start;

  gap: 7px;

  margin-top: 10px;

  padding: 9px 11px;

  border-radius: 9px;

  color: #667085;

  background: #f9fafb;

  font-size: 8px;

  line-height: 1.5;
}

/* RESULTADOS */

.resultados-localizacao {
  margin-top: 13px;

  overflow: hidden;

  border:
    1px solid #eaecf0;

  border-radius: 11px;
}

.resultados-titulo {
  padding:
    10px 12px;

  color: #667085;

  background: #f9fafb;

  font-size: 8px;

  font-weight: 800;

  text-transform: uppercase;
}

.resultado-localizacao {
  width: 100%;

  display: grid;

  grid-template-columns:
    24px
    minmax(0, 1fr)
    20px;

  align-items: center;

  gap: 8px;

  padding:
    11px 12px;

  border: none;

  border-top:
    1px solid #f2f4f7;

  color: #667085;

  background: #ffffff;

  cursor: pointer;

  text-align: left;
}

.resultado-localizacao:hover {
  background: #fff7ed;
}

.resultado-localizacao strong {
  display: block;

  overflow: hidden;

  color: #344054;

  font-size: 9px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.resultado-localizacao span {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

/* SELEÇÃO ALTERNATIVA */

.local-alternativo-selecionado {
  margin-top: 13px;
}

.aguardando-local {
  min-height: 150px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 13px;

  padding: 20px;

  border-radius: 12px;

  color: #98a2b3;

  background: #f9fafb;

  text-align: center;
}

.aguardando-local-icone {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 8px;

  border-radius: 14px;

  color: #f97316;

  background: #fff1e6;
}

.aguardando-local strong {
  color: #475467;

  font-size: 10px;
}

.aguardando-local span {
  margin-top: 4px;

  font-size: 8px;
}

/* CARREGAMENTO */

.carregando-localizacao {
  min-height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #667085;
}

.sem-propriedade {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  margin: 18px 20px;

  padding: 14px;

  border-radius: 11px;

  color: #b42318;

  background: #fef3f2;
}

.sem-propriedade strong,
.sem-propriedade span {
  display: block;
}

.sem-propriedade strong {
  font-size: 10px;
}

.sem-propriedade span {
  margin-top: 3px;
  font-size: 9px;
}

/* =====================================================
   AÇÕES
===================================================== */

.acoes {
  display: flex;

  justify-content:
    flex-end;

  gap: 10px;

  margin-top: 25px;
}

/* =====================================================
   DARK
===================================================== */

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
.arquivo-nome,
.formulario-card--dark
.localizacao-titulo,
.formulario-card--dark
.propriedade-resumo-dados strong,
.formulario-card--dark
.localizacao-opcao strong,
.formulario-card--dark
.local-selecionado strong,
.formulario-card--dark
.resultado-localizacao strong {
  color: #f9fafb;
}

.formulario-card--dark
.card-subtitulo,
.formulario-card--dark
.tipo-card-texto {
  color: #98a2b3;
}

.formulario-card--dark
.tipo-card,
.formulario-card--dark
.localizacao-opcao,
.formulario-card--dark
.localizacao-card,
.formulario-card--dark
.resultados-localizacao {
  border-color: #353a43;
}

.formulario-card--dark
.localizacao-card {
  background: #16191f;
}

.formulario-card--dark
.tipo-card.selecionado,
.formulario-card--dark
.localizacao-opcao--ativa,
.formulario-card--dark
.local-selecionado {
  border-color: #f97316;
  background: #292018;
}

.formulario-card--dark
.tipo-card-icone {
  background: #22262d;
}

.formulario-card--dark
.arquivos-selecionados,
.formulario-card--dark
.propriedade-resumo,
.formulario-card--dark
.localizacao-ajuda,
.formulario-card--dark
.aguardando-local {
  border-color: #2b2f36;
  background: #1b1f25;
}

.formulario-card--dark
.arquivo-item,
.formulario-card--dark
.localizacao-cabecalho {
  border-color: #2b2f36;
}

.formulario-card--dark
.resultados-titulo {
  background: #1b1f25;
}

.formulario-card--dark
.resultado-localizacao {
  border-color: #2b2f36;
  background: #16191f;
}

.formulario-card--dark
.resultado-localizacao:hover {
  background: #292018;
}

/* =====================================================
   TABLET
===================================================== */

@media (max-width: 900px) {
  .formulario-card {
    padding: 22px;
  }

  .busca-localizacao-topo {
    grid-template-columns:
      1fr 1fr;
  }

  .busca-localizacao-input {
    grid-column:
      1 / 3;
  }
}

/* =====================================================
   CELULAR
===================================================== */

@media (max-width: 600px) {
  .formulario-card {
    padding: 17px;

    border-radius: 18px;
  }

  .tipo-solicitacao,
  .localizacao-opcoes {
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

  .localizacao-cabecalho,
  .localizacao-conteudo {
    padding-left: 14px;
    padding-right: 14px;
  }

  .propriedade-resumo {
    margin-left: 14px;
    margin-right: 14px;
  }

  .localizacao-opcoes {
    margin-left: 14px;
    margin-right: 14px;
  }

  .busca-localizacao-topo {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .busca-localizacao-topo .q-btn {
    width: 100%;
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