<template>
  <q-page class="novo-chamado-page">
    <div class="pagina-container">
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
    </div>
  </q-page>
</template>

<script setup>
import FormularioChamado from
  'src/components/produtor/chamados/FormularioChamado.vue'
</script>

<style scoped>
.novo-chamado-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-container {
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
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

/* DARK */

.body--dark .novo-chamado-page {
  background: #0d0f12;
}

.body--dark .pagina-titulo {
  color: #f9fafb;
}

.body--dark .pagina-subtitulo {
  color: #98a2b3;
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