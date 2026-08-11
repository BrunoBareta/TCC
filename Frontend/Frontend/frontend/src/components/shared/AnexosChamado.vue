<template>
  <div
    class="anexos-card"
    :class="{
      'anexos-card--dark': $q.dark.isActive
    }"
  >
    <div class="anexos-cabecalho">
      <div>
        <div class="anexos-titulo">
          Fotos e vídeos
        </div>

        <div class="anexos-subtitulo">
          Arquivos enviados junto com a solicitação.
        </div>
      </div>

      <div class="anexos-icone">
        <q-icon
          name="photo_library"
          size="24px"
        />
      </div>
    </div>

    <!-- CARREGANDO -->
    <div
      v-if="carregando"
      class="estado"
    >
      <q-spinner
        color="orange"
        size="28px"
      />

      <span>
        Carregando anexos...
      </span>
    </div>

    <!-- SEM ARQUIVOS -->
    <div
      v-else-if="anexos.length === 0"
      class="estado vazio"
    >
      <q-icon
        name="image_not_supported"
        size="30px"
      />

      <span>
        Nenhuma foto ou vídeo foi enviado.
      </span>
    </div>

    <!-- ANEXOS -->
    <div
      v-else
      class="anexos-grid"
    >
      <div
        v-for="anexo in anexos"
        :key="anexo.id_anexo"
        class="anexo-item"
        @click="abrirAnexo(anexo)"
      >
        <!-- IMAGEM -->
        <div
          v-if="ehImagem(anexo)"
          class="preview"
        >
          <img
            :src="urlArquivo(anexo)"
            :alt="anexo.nome_arquivo"
          >

          <div class="preview-overlay">
            <q-icon
              name="zoom_in"
              size="32px"
            />
          </div>
        </div>

        <!-- VÍDEO -->
        <div
          v-else-if="ehVideo(anexo)"
          class="preview preview-video"
        >
          <q-icon
            name="play_circle"
            size="55px"
          />

          <span>
            Abrir vídeo
          </span>
        </div>

        <!-- OUTRO -->
        <div
          v-else
          class="preview preview-video"
        >
          <q-icon
            name="attach_file"
            size="42px"
          />
        </div>

        <div class="arquivo-info">
          <div class="arquivo-nome">
            {{ anexo.nome_arquivo }}
          </div>

          <div class="arquivo-tipo">
            {{
              ehImagem(anexo)
                ? 'Imagem'
                : ehVideo(anexo)
                  ? 'Vídeo'
                  : 'Arquivo'
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- VISUALIZADOR -->
    <q-dialog
      v-model="dialogAberto"
      maximized
    >
      <q-card class="visualizador">
        <div class="visualizador-topo">
          <div class="visualizador-nome">
            {{ anexoSelecionado?.nome_arquivo }}
          </div>

          <q-btn
            flat
            round
            icon="close"
            color="white"
            v-close-popup
          />
        </div>

        <div class="visualizador-conteudo">
          <img
            v-if="
              anexoSelecionado &&
              ehImagem(anexoSelecionado)
            "
            :src="urlArquivo(anexoSelecionado)"
            :alt="anexoSelecionado.nome_arquivo"
            class="imagem-ampliada"
          >

          <video
            v-else-if="
              anexoSelecionado &&
              ehVideo(anexoSelecionado)
            "
            :src="urlArquivo(anexoSelecionado)"
            class="video-ampliado"
            controls
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch
} from 'vue'

import {
  useQuasar
} from 'quasar'

import { api } from 'src/boot/axios'

import anexoService from
  'src/services/anexoService'

const props = defineProps({
  idChamado: {
    type: [Number, String],
    required: true
  }
})

const $q = useQuasar()

const carregando = ref(false)

const anexos = ref([])

const dialogAberto = ref(false)

const anexoSelecionado = ref(null)

/* =========================
   CARREGAR
========================= */

async function carregarAnexos() {
  const idChamado =
    Number(
      props.idChamado
    )

  if (
    !Number.isInteger(idChamado) ||
    idChamado <= 0
  ) {
    anexos.value = []

    return
  }

  carregando.value = true

  try {
    const resposta =
      await anexoService
        .listarPorChamado(
          idChamado
        )

    anexos.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.data || []
  } catch (error) {
    console.error(
      'Erro ao carregar anexos:',
      error
    )

    anexos.value = []
  } finally {
    carregando.value = false
  }
}

/* =========================
   TIPOS
========================= */

function ehImagem(anexo) {
  return String(
    anexo?.tipo_arquivo || ''
  ).startsWith(
    'image/'
  )
}

function ehVideo(anexo) {
  return String(
    anexo?.tipo_arquivo || ''
  ).startsWith(
    'video/'
  )
}

/* =========================
   URL
========================= */

function urlArquivo(anexo) {
  const caminho =
    anexo?.caminho_arquivo

  if (!caminho) {
    return ''
  }

  if (
    caminho.startsWith('http://') ||
    caminho.startsWith('https://')
  ) {
    return caminho
  }

  const baseURL =
    (
      api.defaults.baseURL ||
      'http://localhost:3000'
    ).replace(
      /\/$/,
      ''
    )

  const caminhoFinal =
    caminho.startsWith('/')
      ? caminho
      : `/${caminho}`

  return `${baseURL}${caminhoFinal}`
}

/* =========================
   ABRIR
========================= */

function abrirAnexo(anexo) {
  anexoSelecionado.value =
    anexo

  dialogAberto.value =
    true
}

watch(
  () => props.idChamado,
  carregarAnexos
)

onMounted(
  carregarAnexos
)
</script>

<style scoped>
.anexos-card {
  width: 100%;

  padding: 26px;

  border:
    1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.05);
}

.anexos-cabecalho {
  display: flex;

  align-items: flex-start;

  justify-content:
    space-between;

  gap: 20px;

  margin-bottom: 20px;
}

.anexos-titulo {
  color: #101828;

  font-size: 19px;

  font-weight: 800;
}

.anexos-subtitulo {
  margin-top: 4px;

  color: #667085;

  font-size: 12px;
}

.anexos-icone {
  width: 44px;
  height: 44px;

  display: flex;

  flex-shrink: 0;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  color: #f97316;

  background: #fff1e6;
}

/* ESTADO */

.estado {
  min-height: 110px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 20px;

  border-radius: 14px;

  color: #667085;

  background: #f9fafb;

  font-size: 13px;

  text-align: center;
}

.estado.vazio {
  flex-direction: column;
}

/* GRID */

.anexos-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(180px, 1fr)
    );

  gap: 14px;
}

.anexo-item {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid #eaecf0;

  border-radius: 14px;

  cursor: pointer;

  background: #ffffff;

  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.anexo-item:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(16, 24, 40, 0.10);
}

/* PREVIEW */

.preview {
  position: relative;

  width: 100%;

  height: 160px;

  overflow: hidden;

  background: #f2f4f7;
}

.preview img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.preview-overlay {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  opacity: 0;

  color: #ffffff;

  background:
    rgba(0, 0, 0, 0.45);

  transition:
    opacity 0.2s;
}

.anexo-item:hover
.preview-overlay {
  opacity: 1;
}

.preview-video {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 6px;

  color: #f97316;

  background: #fff7ed;
}

.preview-video span {
  color: #9a3412;

  font-size: 11px;

  font-weight: 700;
}

/* INFORMAÇÕES */

.arquivo-info {
  padding: 11px 12px;
}

.arquivo-nome {
  overflow: hidden;

  color: #344054;

  font-size: 12px;

  font-weight: 700;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.arquivo-tipo {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 10px;
}

/* VISUALIZADOR */

.visualizador {
  background:
    rgba(10, 12, 16, 0.98);
}

.visualizador-topo {
  min-height: 64px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 15px;

  padding: 0 22px;

  color: #ffffff;

  background: #101216;
}

.visualizador-nome {
  min-width: 0;

  overflow: hidden;

  font-size: 14px;

  font-weight: 700;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.visualizador-conteudo {
  height:
    calc(100vh - 64px);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 30px;
}

.imagem-ampliada,
.video-ampliado {
  max-width: 95%;

  max-height: 95%;

  object-fit: contain;
}

/* =========================
   DARK
========================= */

.anexos-card--dark {
  border-color: #2b2f36;

  background: #16191f;

  box-shadow:
    0 3px 12px
    rgba(0, 0, 0, 0.28);
}

.anexos-card--dark
.anexos-titulo {
  color: #f9fafb;
}

.anexos-card--dark
.anexos-subtitulo {
  color: #98a2b3;
}

.anexos-card--dark
.anexos-icone {
  color: #fb923c;

  background: #292018;
}

.anexos-card--dark
.estado {
  color: #98a2b3;

  background: #1b1f25;
}

.anexos-card--dark
.estado .q-icon {
  color: #98a2b3;
}

.anexos-card--dark
.anexo-item {
  border-color: #30343b;

  background: #1b1f25;
}

.anexos-card--dark
.arquivo-info {
  background: #1b1f25;
}

.anexos-card--dark
.arquivo-nome {
  color: #f2f4f7;
}

.anexos-card--dark
.arquivo-tipo {
  color: #98a2b3;
}

.anexos-card--dark
.preview {
  background: #22262d;
}

.anexos-card--dark
.preview-video {
  color: #fb923c;

  background: #292018;
}

.anexos-card--dark
.preview-video span {
  color: #fdba74;
}

/* TABLET */

@media (max-width: 900px) {
  .anexos-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

/* CELULAR */

@media (max-width: 600px) {
  .anexos-card {
    padding: 18px;

    border-radius: 18px;
  }

  .anexos-cabecalho {
    gap: 12px;
  }

  .anexos-titulo {
    font-size: 17px;
  }

  .anexos-subtitulo {
    font-size: 11px;
  }

  .anexos-grid {
    grid-template-columns: 1fr;
  }

  .preview {
    height: 210px;
  }

  .visualizador-conteudo {
    padding: 12px;
  }

  .imagem-ampliada,
  .video-ampliado {
    max-width: 100%;

    max-height: 100%;
  }
}
</style>