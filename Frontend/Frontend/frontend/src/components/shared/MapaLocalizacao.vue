<template>
  <div
    class="mapa-card"
    :class="{
      'mapa-card--dark': $q.dark.isActive
    }"
  >
    <!-- =========================
         CABEÇALHO
    ========================== -->

    <div class="mapa-cabecalho">
      <div>
        <div class="mapa-titulo">
          <q-icon
            name="location_on"
            color="orange"
            size="20px"
          />

          {{ titulo }}
        </div>

        <div class="mapa-subtitulo">
          {{ subtitulo }}
        </div>
      </div>

      <q-btn
        v-if="coordenadasValidas"
        flat
        round
        dense
        color="orange"
        icon="my_location"
        @click="centralizarMapa"
      >
        <q-tooltip>
          Centralizar localização
        </q-tooltip>
      </q-btn>
    </div>

    <!-- =========================
         SEM LOCALIZAÇÃO
    ========================== -->

    <div
      v-if="!coordenadasValidas"
      class="sem-localizacao"
    >
      <q-icon
        name="location_off"
        size="34px"
      />

      <div class="sem-localizacao-titulo">
        Localização ainda não cadastrada
      </div>

      <div class="sem-localizacao-texto">
        Defina uma localização para ela aparecer no mapa.
      </div>
    </div>

    <!-- =========================
         MAPA
    ========================== -->

    <div
      v-else
      ref="mapaElemento"
      class="mapa"
    ></div>

    <!-- =========================
         INFORMAÇÕES
    ========================== -->

    <div
      v-if="coordenadasValidas"
      class="localizacao-info"
    >
      <div class="localizacao-label">
        Local
      </div>

      <div class="localizacao-nome">
        {{ nomeLocal }}
      </div>

      <div
        v-if="endereco"
        class="localizacao-endereco"
      >
        {{ endereco }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  useQuasar
} from 'quasar'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

const props = defineProps({
  latitude: {
    type: [Number, String],
    default: null
  },

  longitude: {
    type: [Number, String],
    default: null
  },

  titulo: {
    type: String,
    default: 'Localização do atendimento'
  },

  subtitulo: {
    type: String,
    default: 'Localização cadastrada para este atendimento.'
  },

  nomeLocal: {
    type: String,
    default: 'Local do atendimento'
  },

  endereco: {
    type: String,
    default: ''
  },

  zoom: {
    type: Number,
    default: 16
  }
})

const $q =
  useQuasar()

const mapaElemento =
  ref(null)

let mapa =
  null

let marcador =
  null

let observadorTamanho =
  null

let timeout100 =
  null

let timeout300 =
  null

let timeout600 =
  null

/* =========================
   CONVERTER COORDENADAS
========================= */

function converterCoordenada(valor) {
  if (
    valor === null ||
    valor === undefined ||
    String(valor).trim() === ''
  ) {
    return null
  }

  const numero =
    Number(
      String(valor)
        .trim()
        .replace(',', '.')
    )

  if (
    !Number.isFinite(numero)
  ) {
    return null
  }

  return numero
}

const latitudeNumero =
  computed(() =>
    converterCoordenada(
      props.latitude
    )
  )

const longitudeNumero =
  computed(() =>
    converterCoordenada(
      props.longitude
    )
  )

/* =========================
   VALIDAR COORDENADAS
========================= */

const coordenadasValidas =
  computed(() => {
    const latitude =
      latitudeNumero.value

    const longitude =
      longitudeNumero.value

    if (
      latitude === null ||
      longitude === null
    ) {
      return false
    }

    /*
      Evita considerar 0,0 como
      localização cadastrada.
    */

    if (
      latitude === 0 &&
      longitude === 0
    ) {
      return false
    }

    return (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    )
  })

/* =========================
   COORDENADAS ATUAIS
========================= */

function obterCoordenadas() {
  if (
    !coordenadasValidas.value
  ) {
    return null
  }

  return [
    latitudeNumero.value,
    longitudeNumero.value
  ]
}

/* =========================
   INVALIDAR TAMANHO
========================= */

/*
  Essa função é importante porque
  o Leaflet pode ser criado enquanto
  o componente está escondido dentro
  de q-slide-transition.

  Quando o card aparece, precisamos
  pedir para o Leaflet recalcular
  largura e altura.
*/

function atualizarTamanhoMapa() {
  if (
    !mapa ||
    !mapaElemento.value
  ) {
    return
  }

  const largura =
    mapaElemento.value.offsetWidth

  const altura =
    mapaElemento.value.offsetHeight

  if (
    largura <= 0 ||
    altura <= 0
  ) {
    return
  }

  mapa.invalidateSize({
    pan: false,
    animate: false
  })
}

/* =========================
   AGENDAR RECÁLCULO
========================= */

function agendarAtualizacaoMapa() {
  limparTimeouts()

  requestAnimationFrame(() => {
    atualizarTamanhoMapa()
  })

  timeout100 =
    setTimeout(() => {
      atualizarTamanhoMapa()
    }, 100)

  timeout300 =
    setTimeout(() => {
      atualizarTamanhoMapa()
    }, 300)

  timeout600 =
    setTimeout(() => {
      atualizarTamanhoMapa()
    }, 600)
}

/* =========================
   MAPA
========================= */

async function iniciarMapa() {
  if (
    !coordenadasValidas.value
  ) {
    destruirMapa()
    return
  }

  await nextTick()

  if (
    !mapaElemento.value
  ) {
    return
  }

  const coordenadas =
    obterCoordenadas()

  if (
    !coordenadas
  ) {
    return
  }

  /*
    Se o mapa já existe, não recria.
    Apenas atualiza posição e tamanho.
  */

  if (mapa) {
    atualizarPosicaoMapa()
    agendarAtualizacaoMapa()
    return
  }

  mapa =
    L.map(
      mapaElemento.value,
      {
        zoomControl: true,
        attributionControl: true
      }
    )

  mapa.setView(
    coordenadas,
    props.zoom
  )

  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,

      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(mapa)

  marcador =
    L.circleMarker(
      coordenadas,
      {
        radius: 10,
        color: '#ffffff',
        weight: 3,
        fillColor: '#f97316',
        fillOpacity: 1
      }
    )

  marcador.addTo(mapa)

  atualizarPopup()

  /*
    Corrige o problema de mapa
    parcialmente cinza após animação.
  */

  agendarAtualizacaoMapa()
}

/* =========================
   ATUALIZAR POSIÇÃO
========================= */

function atualizarPosicaoMapa() {
  if (
    !mapa ||
    !coordenadasValidas.value
  ) {
    return
  }

  const coordenadas =
    obterCoordenadas()

  if (
    !coordenadas
  ) {
    return
  }

  mapa.setView(
    coordenadas,
    props.zoom
  )

  if (marcador) {
    marcador.setLatLng(
      coordenadas
    )
  }

  atualizarPopup()
}

/* =========================
   POPUP
========================= */

function atualizarPopup() {
  if (
    !marcador
  ) {
    return
  }

  const nome =
    String(
      props.nomeLocal ||
      'Local'
    ).trim()

  const endereco =
    String(
      props.endereco ||
      ''
    ).trim()

  let conteudo =
    `<strong>${escaparHtml(nome)}</strong>`

  if (endereco) {
    conteudo +=
      `<br><span>${escaparHtml(endereco)}</span>`
  }

  marcador.bindPopup(
    conteudo
  )
}

/* =========================
   SEGURANÇA DO POPUP
========================= */

function escaparHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

/* =========================
   CENTRALIZAR
========================= */

function centralizarMapa() {
  if (
    !mapa ||
    !coordenadasValidas.value
  ) {
    return
  }

  const coordenadas =
    obterCoordenadas()

  if (
    !coordenadas
  ) {
    return
  }

  atualizarTamanhoMapa()

  mapa.setView(
    coordenadas,
    props.zoom,
    {
      animate: true
    }
  )
}

/* =========================
   RESIZE OBSERVER
========================= */

/*
  Esta é a principal correção.

  Quando o q-slide-transition abre
  e o mapa passa de largura 0 para
  uma largura real, o ResizeObserver
  detecta e manda o Leaflet recalcular.
*/

function observarTamanhoMapa() {
  if (
    typeof ResizeObserver ===
    'undefined'
  ) {
    return
  }

  if (
    !mapaElemento.value
  ) {
    return
  }

  destruirObservador()

  observadorTamanho =
    new ResizeObserver(
      entries => {
        const entrada =
          entries[0]

        if (!entrada) {
          return
        }

        const largura =
          entrada.contentRect.width

        const altura =
          entrada.contentRect.height

        if (
          largura > 0 &&
          altura > 0
        ) {
          agendarAtualizacaoMapa()
        }
      }
    )

  observadorTamanho.observe(
    mapaElemento.value
  )
}

/* =========================
   WINDOW RESIZE
========================= */

function aoRedimensionarJanela() {
  agendarAtualizacaoMapa()
}

/* =========================
   DESTRUIR MAPA
========================= */

function destruirMapa() {
  limparTimeouts()

  if (mapa) {
    mapa.remove()
    mapa = null
  }

  marcador = null
}

/* =========================
   DESTRUIR OBSERVADOR
========================= */

function destruirObservador() {
  if (
    observadorTamanho
  ) {
    observadorTamanho.disconnect()
    observadorTamanho = null
  }
}

/* =========================
   TIMEOUTS
========================= */

function limparTimeouts() {
  if (timeout100) {
    clearTimeout(timeout100)
    timeout100 = null
  }

  if (timeout300) {
    clearTimeout(timeout300)
    timeout300 = null
  }

  if (timeout600) {
    clearTimeout(timeout600)
    timeout600 = null
  }
}

/* =========================
   WATCH COORDENADAS
========================= */

watch(
  () => [
    props.latitude,
    props.longitude
  ],
  async () => {
    if (
      !coordenadasValidas.value
    ) {
      destruirMapa()
      return
    }

    await nextTick()

    if (!mapa) {
      await iniciarMapa()
      observarTamanhoMapa()
      return
    }

    atualizarPosicaoMapa()
    agendarAtualizacaoMapa()
  }
)

/* =========================
   WATCH INFORMAÇÕES
========================= */

watch(
  () => [
    props.nomeLocal,
    props.endereco
  ],
  () => {
    atualizarPopup()
  }
)

/* =========================
   WATCH ZOOM
========================= */

watch(
  () => props.zoom,
  () => {
    centralizarMapa()
  }
)

/* =========================
   MONTAGEM
========================= */

onMounted(
  async () => {
    await iniciarMapa()

    await nextTick()

    observarTamanhoMapa()

    window.addEventListener(
      'resize',
      aoRedimensionarJanela
    )
  }
)

/* =========================
   DESTRUIÇÃO
========================= */

onBeforeUnmount(
  () => {
    window.removeEventListener(
      'resize',
      aoRedimensionarJanela
    )

    destruirObservador()
    destruirMapa()
  }
)
</script>

<style scoped>
/* =========================
   CARD
========================= */

.mapa-card {
  width: 100%;
  min-width: 0;

  padding: 18px;

  border: 1px solid #eaecf0;
  border-radius: 18px;

  background: #ffffff;
}

/* =========================
   CABEÇALHO
========================= */

.mapa-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 14px;
}

.mapa-titulo {
  display: flex;
  align-items: center;

  gap: 6px;

  color: #101828;

  font-size: 14px;
  font-weight: 800;
}

.mapa-subtitulo {
  margin-top: 4px;

  color: #667085;

  font-size: 11px;
  line-height: 1.4;
}

/* =========================
   MAPA
========================= */

.mapa {
  position: relative;

  width: 100%;
  min-width: 0;

  height: 230px;
  min-height: 230px;

  overflow: hidden;

  border-radius: 14px;

  background: #f2f4f7;

  z-index: 1;
}

/*
  Garante que o container interno
  criado pelo Leaflet ocupe todo
  o espaço disponível.
*/

.mapa :deep(.leaflet-container) {
  width: 100% !important;
  height: 100% !important;
}

/* =========================
   INFORMAÇÕES
========================= */

.localizacao-info {
  margin-top: 12px;
}

.localizacao-label {
  color: #98a2b3;

  font-size: 9px;
  font-weight: 700;

  text-transform: uppercase;
}

.localizacao-nome {
  margin-top: 2px;

  color: #344054;

  font-size: 13px;
  font-weight: 800;
}

.localizacao-endereco {
  margin-top: 4px;

  color: #667085;

  font-size: 11px;
  line-height: 1.45;
}

/* =========================
   SEM LOCALIZAÇÃO
========================= */

.sem-localizacao {
  min-height: 155px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 20px;

  border-radius: 14px;

  color: #98a2b3;
  background: #f9fafb;

  text-align: center;
}

.sem-localizacao-titulo {
  margin-top: 8px;

  color: #475467;

  font-size: 13px;
  font-weight: 800;
}

.sem-localizacao-texto {
  margin-top: 5px;

  max-width: 340px;

  color: #98a2b3;

  font-size: 11px;
  line-height: 1.5;
}

/* =========================
   DARK
========================= */

.mapa-card--dark {
  border-color: #2b2f36;
  background: #16191f;
}

.mapa-card--dark
.mapa-titulo {
  color: #f9fafb;
}

.mapa-card--dark
.mapa-subtitulo,
.mapa-card--dark
.localizacao-endereco {
  color: #98a2b3;
}

.mapa-card--dark
.localizacao-nome {
  color: #f2f4f7;
}

.mapa-card--dark
.mapa {
  background: #1b1f25;
}

.mapa-card--dark
.sem-localizacao {
  background: #1b1f25;
}

.mapa-card--dark
.sem-localizacao-titulo {
  color: #f2f4f7;
}

/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .mapa {
    height: 220px;
    min-height: 220px;
  }
}

/* =========================
   CELULAR
========================= */

@media (max-width: 600px) {
  .mapa-card {
    padding: 14px;
    border-radius: 16px;
  }

  .mapa {
    height: 200px;
    min-height: 200px;
  }

  .mapa-titulo {
    font-size: 13px;
  }
}
</style>