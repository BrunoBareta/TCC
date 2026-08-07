<template>
  <q-page class="meus-chamados-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Meus chamados
        </div>

        <div class="pagina-subtitulo">
          Acompanhe os chamados vinculados ao seu atendimento.
        </div>
      </div>
    </div>

    <TabelaMeusChamados />
  </q-page>
</template>

<script setup>
import TabelaMeusChamados from 'src/components/tecnico/chamados/meus/TabelaMeusChamados.vue'
</script>

<style scoped>
.meus-chamados-page {
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
  .meus-chamados-page {
    padding: 22px 16px 40px;
  }

  .pagina-titulo {
    font-size: 25px;
  }
}
</style>