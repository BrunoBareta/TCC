<template>
  <q-page class="pendentes-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Chamados pendentes
        </div>

        <div class="pagina-subtitulo">
          Veja as solicitações disponíveis para atendimento.
        </div>
      </div>
    </div>

    <TabelaChamadosPendentes />
  </q-page>
</template>

<script setup>
import TabelaChamadosPendentes from 'src/components/tecnico/chamados/pendentes/TabelaChamadosPendentes.vue'
</script>

<style scoped>
.pendentes-page {
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  margin-bottom: 24px;
}

.pagina-titulo {
  color: #101828;
  font-size: 30px;
  font-weight: 800;
}

.pagina-subtitulo {
  margin-top: 5px;
  color: #667085;
  font-size: 14px;
}

@media (max-width: 700px) {
  .pendentes-page {
    padding: 22px 16px 40px;
  }

  .pagina-titulo {
    font-size: 25px;
  }
}
</style>