<template>
  <div
    class="mapa-card"
    :class="{
      'mapa-card--dark': $q.dark.isActive
    }"
  >
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

    <!-- SEM LOCALIZAÇÃO -->
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
        Defina a localização da propriedade para ela aparecer no mapa.
      </div>
    </div>

    <!-- MAPA -->
    <div
      v-else
      ref="mapaElemento"
      class="mapa"
    />

    <!-- INFORMAÇÕES -->
    <div
      v-if="coordenadasValidas"
      class="localizacao-info"
    >
      <div>
        <div class="localizacao-label">
          Propriedade
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
    default:
      'Localização cadastrada para esta propriedade.'
  },

  nomeLocal: {
    type: String,
    default: 'Propriedade'
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

const $q = useQuasar()

const mapaElemento = ref(null)

let mapa = null

/* =========================
   CONVERTER COORDENADAS
========================= */

function converterCoordenada(valor) {
  /*
    IMPORTANTE:

    Number(null) = 0
    Number('') = 0

    Então primeiro conferimos
    se realmente existe um valor.
  */

  if (
    valor === null ||
    valor === undefined ||
    String(valor).trim() === ''
  ) {
    return null
  }

  /*
    Permite coordenada salva
    com vírgula ou ponto.
  */
  const numero = Number(
    String(valor)
      .trim()
      .replace(',', '.')
  )

  if (!Number.isFinite(numero)) {
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
      0,0 normalmente significa
      localização não configurada
      no nosso sistema.
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

  if (!mapaElemento.value) {
    return
  }

  destruirMapa()

  const coordenadas = [
    latitudeNumero.value,
    longitudeNumero.value
  ]

  mapa = L.map(
    mapaElemento.value
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

  const marcador =
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

  if (props.nomeLocal) {
    marcador.bindPopup(
      `<strong>${props.nomeLocal}</strong>`
    )
  }

  setTimeout(() => {
    mapa?.invalidateSize()
  }, 100)
}

function centralizarMapa() {
  if (
    !mapa ||
    !coordenadasValidas.value
  ) {
    return
  }

  mapa.setView(
    [
      latitudeNumero.value,
      longitudeNumero.value
    ],
    props.zoom
  )
}

function destruirMapa() {
  if (!mapa) {
    return
  }

  mapa.remove()

  mapa = null
}

watch(
  () => [
    props.latitude,
    props.longitude
  ],
  iniciarMapa
)

onMounted(
  iniciarMapa
)

onBeforeUnmount(
  destruirMapa
)
</script>

<style scoped>
.mapa-card {
  width: 100%;
  padding: 18px;

  border:
    1px solid #eaecf0;

  border-radius: 18px;

  background: #ffffff;
}

.mapa-cabecalho {
  display: flex;

  align-items: flex-start;

  justify-content:
    space-between;

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
}

.mapa {
  width: 100%;

  height: 210px;

  overflow: hidden;

  border-radius: 14px;

  background: #f2f4f7;

  z-index: 1;
}

/* INFORMAÇÕES */

.localizacao-info {
  margin-top: 12px;
}

.localizacao-label {
  color: #98a2b3;

  font-size: 10px;

  font-weight: 700;

  text-transform:
    uppercase;
}

.localizacao-nome {
  margin-top: 2px;

  color: #344054;

  font-size: 13px;

  font-weight: 800;
}

.localizacao-endereco {
  margin-top: 3px;

  color: #667085;

  font-size: 11px;
}

/* SEM LOCALIZAÇÃO */

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

/* DARK */

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
.sem-localizacao {
  background: #1b1f25;
}

.mapa-card--dark
.sem-localizacao-titulo {
  color: #f2f4f7;
}

/* TABLET */

@media (max-width: 900px) {
  .mapa {
    height: 200px;
  }
}

/* CELULAR */

@media (max-width: 600px) {
  .mapa-card {
    padding: 14px;

    border-radius: 16px;
  }

  .mapa {
    height: 190px;
  }

  .mapa-titulo {
    font-size: 13px;
  }
}
</style>