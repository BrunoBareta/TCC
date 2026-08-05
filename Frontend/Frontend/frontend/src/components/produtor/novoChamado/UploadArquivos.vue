<template>
  <div class="upload-area">
    <q-icon
      name="add_a_photo_outlined"
      size="34px"
      color="grey-6"
    />

    <div class="upload-titulo">
      Anexar fotos ou vídeos
    </div>

    <div class="upload-descricao">
      O envio de anexos será habilitado após a criação
      da rota de upload no backend.
    </div>

    <q-btn
      outline
      no-caps
      color="orange"
      icon="attach_file"
      label="Selecionar arquivos"
      disable
      class="q-mt-md"
    />
  </div>
</template>

<style scoped>
.upload-area {
  padding: 32px;
  border: 2px dashed #eaecf0;
  border-radius: 18px;
  background: #fafafa;
  text-align: center;
}

.upload-titulo {
  margin-top: 12px;
  color: #344054;
  font-size: 15px;
  font-weight: 700;
}

.upload-descricao {
  max-width: 440px;
  margin: 7px auto 0;
  color: #98a2b3;
  font-size: 13px;
}
</style>