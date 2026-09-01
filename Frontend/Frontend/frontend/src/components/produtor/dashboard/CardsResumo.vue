<template>
  <div class="cards-grid">
    <!-- CHAMADOS EM ABERTO -->

    <CardResumo
      titulo="Chamados em aberto"
      :valor="chamadosEmAberto"
      status="Ativos"
      icone="assignment_turned_in"
      cor-icone="#2563eb"
      cor-fundo-icone="#eff6ff"
    />

    <!-- TÉCNICOS EM ROTA -->

    <CardResumo
      titulo="Técnicos a caminho"
      :valor="tecnicosEmRota"
      status="Em rota"
      icone="local_shipping"
      cor-icone="#f97316"
      cor-fundo-icone="#fff7ed"
    />

    <!-- PROPRIEDADE -->

    <CardResumo
      titulo="Propriedades cadastradas"
      :valor="quantidadePropriedades"
      status="Geral"
      icone="home"
      cor-icone="#10b981"
      cor-fundo-icone="#ecfdf3"
    />
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import CardResumo from
  './CardResumo.vue'

import chamadoService from
  'src/services/chamadoService'

import propriedadeService from
  'src/services/propriedadeService'

/* ==================================================
   DADOS
=================================================== */

const chamados =
  ref([])

const propriedade =
  ref(null)

/* ==================================================
   USUÁRIO LOGADO
=================================================== */

function obterUsuarioLogado() {
  const chaves = [
    'usuario',
    'user',
    'authUser'
  ]

  for (
    const chave of chaves
  ) {
    try {
      const valor =
        localStorage.getItem(
          chave
        )

      if (!valor) {
        continue
      }

      const usuario =
        JSON.parse(valor)

      if (usuario) {
        return usuario
      }
    } catch {
      // Continua procurando
    }
  }

  return {}
}

const idUsuario =
  computed(() => {
    const usuario =
      obterUsuarioLogado()

    const id =
      usuario.id_usuario ||
      usuario.idUsuario ||
      usuario.id

    const numero =
      Number(id)

    return (
      Number.isInteger(numero) &&
      numero > 0
    )
      ? numero
      : null
  })

/* ==================================================
   CONTADORES
=================================================== */

const chamadosEmAberto =
  computed(() =>
    chamados.value.filter(
      chamado =>
        ![
          'FINALIZADO',
          'CANCELADO'
        ].includes(
          String(
            chamado.status ||
            ''
          ).toUpperCase()
        )
    ).length
  )

const tecnicosEmRota =
  computed(() =>
    chamados.value.filter(
      chamado =>
        String(
          chamado.status ||
          ''
        ).toUpperCase() ===
        'EM_ROTA'
    ).length
  )

const quantidadePropriedades =
  computed(() =>
    propriedade.value
      ? 1
      : 0
  )

/* ==================================================
   CARREGAR
=================================================== */

async function carregarDados() {
  try {
    const dadosChamados =
      await chamadoService
        .listar()

    chamados.value =
      Array.isArray(
        dadosChamados
      )
        ? dadosChamados
        : []

    if (
      idUsuario.value
    ) {
      propriedade.value =
        await propriedadeService
          .buscarPorUsuario(
            idUsuario.value
          )
    } else {
      propriedade.value =
        null
    }
  } catch (error) {
    console.error(
      'Erro ao carregar resumo do produtor:',
      error
    )

    chamados.value = []
    propriedade.value = null
  }
}

onMounted(
  carregarDados
)
</script>

<style scoped>
.cards-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 24px;
}

@media (
  max-width: 900px
) {
  .cards-grid {
    grid-template-columns:
      1fr;
  }
}
</style>