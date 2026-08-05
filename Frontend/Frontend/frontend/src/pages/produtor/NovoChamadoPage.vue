<template>
  <q-page class="novo-chamado-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Abrir novo chamado
        </div>

        <div class="pagina-subtitulo">
          Solicite uma nova assistência técnica para sua propriedade.
        </div>
      </div>

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Voltar"
        color="grey-7"
        :to="{ name: 'produtor-chamados' }"
      />
    </div>

    <FormularioChamado />
  </q-page>
</template>

<script setup>
import FormularioChamado from 'src/components/produtor/novoChamado/FormularioChamado.vue'
</script>

<style scoped>
.novo-chamado-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 32px 48px;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
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
  .novo-chamado-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagina-titulo {
    font-size: 25px;
  }
}
</style>