<template>
  <div
    class="seletor"
    :class="{
      'seletor--dark':
        $q.dark.isActive
    }"
  >
    <div class="seletor-topo">
      <div>
        <div class="seletor-titulo">
          <q-icon
            name="location_on"
            color="orange"
            size="20px"
          />

          Localização da propriedade
        </div>

        <div class="seletor-subtitulo">
          Use sua localização ou clique no mapa para marcar a propriedade.
        </div>
      </div>

      <q-btn
        outline
        no-caps
        color="orange"
        icon="my_location"
        label="Usar minha localização"
        :loading="buscandoLocalizacao"
        @click="usarMinhaLocalizacao"
      />
    </div>

    <div
      ref="mapaElemento"
      class="mapa"
    />

    <div class="mapa-ajuda">
      <q-icon
        name="touch_app"
        size="17px"
      />

      <span>
        Clique no mapa para ajustar o ponto exato da propriedade.
      </span>
    </div>

    <div
      v-if="possuiCoordenadas"
      class="coordenadas"
    >
      <div>
        <span>Latitude</span>
        <strong>
          {{ latitudeNumero.toFixed(6) }}
        </strong>
      </div>

      <div>
        <span>Longitude</span>
        <strong>
          {{ longitudeNumero.toFixed(6) }}
        </strong>
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
  }
})

const emit = defineEmits([
  'update:latitude',
  'update:longitude'
])

const $q =
  useQuasar()

const mapaElemento =
  ref(null)

const buscandoLocalizacao =
  ref(false)

let mapa = null
let marcador = null

function converter(
  valor
) {
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
        .replace(',', '.')
    )

  return Number.isFinite(numero)
    ? numero
    : null
}

const latitudeNumero =
  computed(() =>
    converter(
      props.latitude
    )
  )

const longitudeNumero =
  computed(() =>
    converter(
      props.longitude
    )
  )

const possuiCoordenadas =
  computed(() => {
    if (
      latitudeNumero.value === null ||
      longitudeNumero.value === null
    ) {
      return false
    }

    if (
      latitudeNumero.value === 0 &&
      longitudeNumero.value === 0
    ) {
      return false
    }

    return true
  })

async function iniciarMapa() {
  await nextTick()

  if (!mapaElemento.value) {
    return
  }

  if (mapa) {
    mapa.remove()
  }

  /*
    Se já existir localização,
    abre nela.

    Caso contrário, começa mostrando
    o Brasil.
  */
  const centro =
    possuiCoordenadas.value
      ? [
          latitudeNumero.value,
          longitudeNumero.value
        ]
      : [
          -14.235,
          -51.9253
        ]

  const zoom =
    possuiCoordenadas.value
      ? 16
      : 4

  mapa =
    L.map(
      mapaElemento.value
    )
      .setView(
        centro,
        zoom
      )

  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,

      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(mapa)

  mapa.on(
    'click',
    (evento) => {
      definirLocalizacao(
        evento.latlng.lat,
        evento.latlng.lng,
        false
      )
    }
  )

  if (
    possuiCoordenadas.value
  ) {
    colocarMarcador(
      latitudeNumero.value,
      longitudeNumero.value
    )
  }

  setTimeout(() => {
    mapa?.invalidateSize()
  }, 250)
}

function colocarMarcador(
  latitude,
  longitude
) {
  if (!mapa) {
    return
  }

  if (marcador) {
    marcador.remove()
  }

  marcador =
    L.circleMarker(
      [
        latitude,
        longitude
      ],
      {
        radius: 10,
        color: '#ffffff',
        weight: 3,
        fillColor: '#f97316',
        fillOpacity: 1
      }
    )

  marcador.addTo(
    mapa
  )
}

function definirLocalizacao(
  latitude,
  longitude,
  centralizar = true
) {
  emit(
    'update:latitude',
    Number(latitude)
  )

  emit(
    'update:longitude',
    Number(longitude)
  )

  colocarMarcador(
    latitude,
    longitude
  )

  if (
    centralizar &&
    mapa
  ) {
    mapa.setView(
      [
        latitude,
        longitude
      ],
      17
    )
  }
}

function usarMinhaLocalizacao() {
  if (
    !navigator.geolocation
  ) {
    $q.notify({
      type: 'negative',

      message:
        'Seu navegador não oferece suporte à localização.'
    })

    return
  }

  buscandoLocalizacao.value =
    true

  navigator.geolocation
    .getCurrentPosition(
      (posicao) => {
        buscandoLocalizacao.value =
          false

        definirLocalizacao(
          posicao.coords.latitude,
          posicao.coords.longitude,
          true
        )

        $q.notify({
          type: 'positive',

          message:
            'Localização encontrada.'
        })
      },

      (erro) => {
        buscandoLocalizacao.value =
          false

        console.error(
          'Erro de geolocalização:',
          erro
        )

        let mensagem =
          'Não foi possível obter sua localização.'

        if (
          erro.code === 1
        ) {
          mensagem =
            'A permissão de localização foi negada pelo navegador.'
        }

        $q.notify({
          type: 'warning',
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
          0
      }
    )
}

watch(
  () => [
    props.latitude,
    props.longitude
  ],
  () => {
    if (
      mapa &&
      possuiCoordenadas.value
    ) {
      colocarMarcador(
        latitudeNumero.value,
        longitudeNumero.value
      )
    }
  }
)

onMounted(
  iniciarMapa
)

onBeforeUnmount(() => {
  if (mapa) {
    mapa.remove()
    mapa = null
  }
})
</script>

<style scoped>
.seletor {
  padding: 15px;

  border:
    1px solid #eaecf0;

  border-radius: 16px;

  background: #ffffff;
}

.seletor-topo {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 13px;
}

.seletor-titulo {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #101828;

  font-size: 14px;

  font-weight: 800;
}

.seletor-subtitulo {
  margin-top: 4px;

  color: #667085;

  font-size: 11px;
}

.mapa {
  width: 100%;

  height: 280px;

  overflow: hidden;

  border-radius: 13px;

  background: #f2f4f7;

  z-index: 1;
}

.mapa-ajuda {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 10px;

  color: #667085;

  font-size: 11px;
}

.coordenadas {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin-top: 12px;
}

.coordenadas > div {
  padding: 9px 11px;

  border-radius: 10px;

  background: #f9fafb;
}

.coordenadas span {
  display: block;

  color: #98a2b3;

  font-size: 9px;

  text-transform:
    uppercase;
}

.coordenadas strong {
  display: block;

  margin-top: 2px;

  color: #344054;

  font-size: 11px;
}

/* DARK */

.seletor--dark {
  border-color: #2b2f36;

  background: #16191f;
}

.seletor--dark
.seletor-titulo {
  color: #f9fafb;
}

.seletor--dark
.seletor-subtitulo,
.seletor--dark
.mapa-ajuda {
  color: #98a2b3;
}

.seletor--dark
.coordenadas > div {
  background: #1b1f25;
}

.seletor--dark
.coordenadas strong {
  color: #f2f4f7;
}

/* MOBILE */

@media (max-width: 650px) {
  .seletor-topo {
    flex-direction:
      column;
  }

  .seletor-topo .q-btn {
    width: 100%;
  }

  .mapa {
    height: 230px;
  }

  .coordenadas {
    grid-template-columns:
      1fr;
  }
}
</style>