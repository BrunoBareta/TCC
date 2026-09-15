<template>

  <q-page class="perfil-page">

    <div class="perfil-grid">

      <!-- PERFIL LATERAL -->

      <div class="perfil-card">

        <div class="avatar-container">

          <q-avatar

            size="96px"

            color="orange-1"

            text-color="orange"

            class="avatar-principal"

          >

            {{ iniciais }}

          </q-avatar>

          <q-btn

            round

            unelevated

            color="orange"

            icon="photo_camera"

            size="sm"

            class="avatar-editar"

          >

            <q-tooltip>

              Alterar foto

            </q-tooltip>

          </q-btn>

        </div>

        <div class="perfil-nome">

          {{ nomeUsuario }}

        </div>

        <div class="perfil-tipo">

          TÉCNICO

        </div>

        <div class="perfil-status">

          <span class="status-ponto"></span>

          Funcionário ativo

        </div>

      </div>

      <!-- CONTEÚDO -->

      <div class="perfil-conteudo">

        <!-- DADOS PESSOAIS -->

        <div class="conteudo-card">

          <div class="card-cabecalho">

            <div>

              <div class="card-titulo">

                Informações pessoais

              </div>

              <div class="card-subtitulo">

                Dados utilizados para identificação

                e contato durante os atendimentos.

              </div>

            </div>

            <q-btn

              v-if="!editando"

              outline

              no-caps

              color="orange"

              icon="edit"

              label="Editar"

              @click="iniciarEdicao"

            />

          </div>

          <div class="form-grid">

            <q-input

              v-model="form.nome"

              outlined

              label="Nome completo"

              :readonly="!editando"

            >

              <template #prepend>

                <q-icon name="person" />

              </template>

            </q-input>

            <q-input

              v-model="form.email"

              outlined

              label="E-mail"

              type="email"

              :readonly="!editando"

            >

              <template #prepend>

                <q-icon name="mail" />

              </template>

            </q-input>

            <q-input

              v-model="form.telefone"

              outlined

              label="Telefone"

              mask="(##) #####-####"

              :readonly="!editando"

            >

              <template #prepend>

                <q-icon name="phone" />

              </template>

            </q-input>

            <q-input

              v-model="form.tipo"

              outlined

              readonly

              label="Função"

            >

              <template #prepend>

                <q-icon name="engineering" />

              </template>

            </q-input>

          </div>

          <div

            v-if="editando"

            class="acoes-edicao"

          >

            <q-btn

              flat

              no-caps

              color="grey-7"

              label="Cancelar"

              @click="cancelarEdicao"

            />

            <q-btn

              unelevated

              no-caps

              color="orange"

              icon="save"

              label="Salvar alterações"

              :loading="salvando"

              @click="salvarDados"

            />

          </div>

        </div>

        <!-- INFORMAÇÕES PROFISSIONAIS -->

        <div class="conteudo-card">

          <div class="card-cabecalho">

            <div>

              <div class="card-titulo">

                Informações profissionais

              </div>

              <div class="card-subtitulo">

                Informações vinculadas ao seu perfil

                de atendimento.

              </div>

            </div>

            <q-icon

              name="engineering"

              size="30px"

              color="orange"

            />

          </div>

          <div class="profissional-grid">

            <div class="profissional-item">
              <div class="profissional-icone">
                <q-icon
                  name="badge"
                  size="22px"
                />
              </div>

              <div>
                <div class="profissional-label">
                  Perfil
                </div>

                <div class="profissional-valor">
                  Técnico
                </div>
              </div>
            </div>

            <div class="profissional-item">
              <div class="profissional-icone">
                <q-icon
                  name="verified"
                  size="22px"
                />
              </div>

              <div>
                <div class="profissional-label">
                  Situação
                </div>

                <div class="profissional-valor">
                  Ativo
                </div>
              </div>
            </div>

            <div class="profissional-item">
              <div class="profissional-icone">
                <q-icon
                  name="alternate_email"
                  size="22px"
                />
              </div>

              <div class="profissional-dados">
                <div class="profissional-label">
                  E-mail de acesso
                </div>

                <div class="profissional-valor profissional-valor--quebra">
                  {{ form.email || 'Não informado' }}
                </div>
              </div>
            </div>

            <div class="profissional-item">
              <div class="profissional-icone">
                <q-icon
                  name="phone"
                  size="22px"
                />
              </div>

              <div class="profissional-dados">
                <div class="profissional-label">
                  Telefone
                </div>

                <div class="profissional-valor">
                  {{ form.telefone || 'Não informado' }}
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- ACESSOS DO TÉCNICO -->

        <div class="conteudo-card acessos-card">

          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Acessos do técnico
              </div>

              <div class="card-subtitulo">
                Recursos disponíveis para este perfil no sistema.
              </div>
            </div>

            <div class="acessos-icone-principal">
              <q-icon
                name="verified_user"
                size="22px"
              />
            </div>
          </div>

          <div class="acessos-grid">
            <div class="acesso-item">
              <div class="acesso-icone">
                <q-icon
                  name="pending_actions"
                  size="20px"
                />
              </div>

              <div>
                <div class="acesso-titulo">
                  Chamados pendentes
                </div>

                <div class="acesso-texto">
                  Visualizar e aceitar novas solicitações.
                </div>
              </div>
            </div>

            <div class="acesso-item">
              <div class="acesso-icone">
                <q-icon
                  name="assignment_ind"
                  size="20px"
                />
              </div>

              <div>
                <div class="acesso-titulo">
                  Meus chamados
                </div>

                <div class="acesso-texto">
                  Acompanhar os chamados vinculados ao técnico.
                </div>
              </div>
            </div>

            <div class="acesso-item">
              <div class="acesso-icone">
                <q-icon
                  name="engineering"
                  size="20px"
                />
              </div>

              <div>
                <div class="acesso-titulo">
                  Atendimento
                </div>

                <div class="acesso-texto">
                  Registrar deslocamento, serviço e finalização.
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- SEGURANÇA -->

        <div class="conteudo-card seguranca-card">

          <div class="seguranca-linha">

            <div>

              <div class="card-titulo">

                Segurança

              </div>

              <div class="card-subtitulo">

                Gerencie a senha de acesso da sua conta.

              </div>

            </div>

            <q-btn

              outline

              no-caps

              color="orange"

              icon="key"

              label="Alterar senha"

              @click="abrirAlteracaoSenha"

            />

          </div>

        </div>

      </div>

    </div>

    <!-- ALTERAR SENHA -->

    <q-dialog v-model="dialogSenha">

      <q-card class="senha-dialog">

        <q-card-section class="dialog-header">

          <div>

            <div class="dialog-titulo">

              Alterar senha

            </div>

            <div class="dialog-subtitulo">

              Informe sua senha atual e escolha uma nova senha.

            </div>

          </div>

          <q-btn

            flat

            round

            dense

            icon="close"

            v-close-popup

          />

        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">

          <q-input

            v-model="senhaAtual"

            outlined

            label="Senha atual"

            :type="

              mostrarSenhaAtual

                ? 'text'

                : 'password'

            "

          >

            <template #prepend>

              <q-icon name="lock" />

            </template>

            <template #append>

              <q-icon

                :name="

                  mostrarSenhaAtual

                    ? 'visibility_off'

                    : 'visibility'

                "

                class="cursor-pointer"

                @click="

                  mostrarSenhaAtual =

                    !mostrarSenhaAtual

                "

              />

            </template>

          </q-input>

          <q-input

            v-model="novaSenha"

            outlined

            label="Nova senha"

            class="q-mt-md"

            :type="

              mostrarNovaSenha

                ? 'text'

                : 'password'

            "

          >

            <template #prepend>

              <q-icon name="key" />

            </template>

            <template #append>

              <q-icon

                :name="

                  mostrarNovaSenha

                    ? 'visibility_off'

                    : 'visibility'

                "

                class="cursor-pointer"

                @click="

                  mostrarNovaSenha =

                    !mostrarNovaSenha

                "

              />

            </template>

          </q-input>

          <q-input

            v-model="confirmarSenha"

            outlined

            label="Confirmar nova senha"

            type="password"

            class="q-mt-md"

          >

            <template #prepend>

              <q-icon name="verified_user" />

            </template>

          </q-input>

        </q-card-section>

        <q-card-actions

          align="right"

          class="q-pa-lg q-pt-none"

        >

          <q-btn

            flat

            no-caps

            color="grey-7"

            label="Cancelar"

            v-close-popup

          />

          <q-btn

            unelevated

            no-caps

            color="orange"

            icon="save"

            label="Salvar nova senha"

            @click="salvarSenha"

          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>

</template>

<script setup>

import {

  computed,

  reactive,

  ref

} from 'vue'

import { useQuasar } from 'quasar'

import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()

const authStore = useAuthStore()

const editando = ref(false)

const salvando = ref(false)

const dialogSenha = ref(false)

const senhaAtual = ref('')

const novaSenha = ref('')

const confirmarSenha = ref('')

const mostrarSenhaAtual = ref(false)

const mostrarNovaSenha = ref(false)

const nomeUsuario = computed(() => {

  return (

    authStore.usuario?.nome ||

    'Técnico'

  )

})

const iniciais = computed(() => {

  return nomeUsuario.value

    .trim()

    .split(' ')

    .filter(Boolean)

    .slice(0, 2)

    .map(

      (parte) =>

        parte.charAt(0)

    )

    .join('')

    .toUpperCase()

})

const form = reactive({

  nome:

    authStore.usuario?.nome ||

    '',

  email:

    authStore.usuario?.email ||

    '',

  telefone:

    authStore.usuario?.telefone ||

    '',

  tipo: 'Técnico'

})

const dadosOriginais = reactive({

  ...form

})

function iniciarEdicao() {

  Object.assign(

    dadosOriginais,

    form

  )

  editando.value = true

}

function cancelarEdicao() {

  Object.assign(

    form,

    dadosOriginais

  )

  editando.value = false

}

async function salvarDados() {

  if (!form.nome.trim()) {

    $q.notify({

      type: 'warning',

      message:

        'Informe o nome do técnico.'

    })

    return

  }

  salvando.value = true

  try {

    /*

      Depois ligamos esta ação

      ao endpoint de atualização do usuário.

    */

    await new Promise(

      (resolve) =>

        setTimeout(resolve, 400)

    )

    Object.assign(

      dadosOriginais,

      form

    )

    editando.value = false

    $q.notify({

      type: 'positive',

      message:

        'Dados atualizados com sucesso.'

    })

  } finally {

    salvando.value = false

  }

}

function abrirAlteracaoSenha() {

  senhaAtual.value = ''

  novaSenha.value = ''

  confirmarSenha.value = ''

  dialogSenha.value = true

}

function salvarSenha() {

  if (

    !senhaAtual.value ||

    !novaSenha.value ||

    !confirmarSenha.value

  ) {

    $q.notify({

      type: 'warning',

      message:

        'Preencha todos os campos.'

    })

    return

  }

  if (

    novaSenha.value !==

    confirmarSenha.value

  ) {

    $q.notify({

      type: 'negative',

      message:

        'As novas senhas não coincidem.'

    })

    return

  }

  if (novaSenha.value.length < 6) {

    $q.notify({

      type: 'warning',

      message:

        'A nova senha deve possuir pelo menos 6 caracteres.'

    })

    return

  }

  dialogSenha.value = false

  $q.notify({

    type: 'positive',

    message:

      'Senha alterada com sucesso.'

  })

}

</script>

<style scoped>

.perfil-page {

  min-height: 100%;

  padding: 32px;

  background: #f7f8fa;

}

.pagina-cabecalho {

  margin-bottom: 28px;

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

.perfil-grid {

  display: grid;

  grid-template-columns:

    280px minmax(0, 1fr);

  align-items: start;

  gap: 24px;

}

.perfil-card,

.conteudo-card {

  border: 1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:

    0 3px 10px rgba(16, 24, 40, 0.05);

}

.perfil-card {

  padding: 34px 24px;

  text-align: center;

}

.avatar-container {

  position: relative;

  display: inline-block;

}

.avatar-principal {

  font-size: 30px;

  font-weight: 800;

}

.avatar-editar {

  position: absolute;

  right: -3px;

  bottom: 0;

  border: 3px solid #ffffff;

}

.perfil-nome {

  margin-top: 18px;

  color: #101828;

  font-size: 20px;

  font-weight: 800;

}

.perfil-tipo {

  margin-top: 4px;

  color: #f97316;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1px;

}

.perfil-status {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 17px;

  color: #667085;

  font-size: 12px;

}

.status-ponto {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #12b76a;

}

.perfil-conteudo {

  display: flex;

  flex-direction: column;

  gap: 22px;

}

.conteudo-card {

  padding: 26px;

}

.card-cabecalho,

.seguranca-linha {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

}

.card-cabecalho {

  margin-bottom: 24px;

}

.card-titulo {

  color: #101828;

  font-size: 18px;

  font-weight: 800;

}

.card-subtitulo {

  margin-top: 4px;

  color: #667085;

  font-size: 12px;

  line-height: 1.5;

}

.form-grid {

  display: grid;

  grid-template-columns:

    repeat(2, minmax(0, 1fr));

  gap: 16px;

}

.acoes-edicao {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 22px;

}

.profissional-grid {

  display: grid;

  grid-template-columns:

    repeat(2, minmax(0, 1fr));

  gap: 16px;

}

.profissional-item {

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 16px;

  border: 1px solid #eaecf0;

  border-radius: 14px;

}

.profissional-icone {

  width: 44px;

  height: 44px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  color: #f97316;

  background: #fff1e6;

}

.profissional-label {

  color: #98a2b3;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

}

.profissional-valor {

  margin-top: 3px;

  color: #344054;

  font-size: 14px;

  font-weight: 700;

}

.senha-dialog {

  width: 520px;

  max-width: 92vw;

  border-radius: 20px;

}

.dialog-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  padding: 22px 24px;

}

.dialog-titulo {

  color: #101828;

  font-size: 19px;

  font-weight: 800;

}

.dialog-subtitulo {

  margin-top: 4px;

  color: #667085;

  font-size: 12px;

}

/* DARK MODE */

.body--dark .perfil-page {

  background: #0d0f12;

}

.body--dark .perfil-card,

.body--dark .conteudo-card {

  border-color: #2b2f36;

  background: #16191f;

}

.body--dark .pagina-titulo,

.body--dark .perfil-nome,

.body--dark .card-titulo,

.body--dark .profissional-valor,

.body--dark .dialog-titulo {

  color: #f9fafb;

}

.body--dark .pagina-subtitulo,

.body--dark .card-subtitulo,

.body--dark .perfil-status {

  color: #98a2b3;

}

.body--dark .avatar-editar {

  border-color: #16191f;

}

.body--dark .profissional-item {

  border-color: #2b2f36;

  background: #1b1f25;

}

@media (max-width: 1000px) {

  .perfil-grid {

    grid-template-columns: 1fr;

  }

}

@media (max-width: 700px) {

  .perfil-page {

    padding: 22px 16px 40px;

  }

  .pagina-titulo {

    font-size: 25px;

  }

  .form-grid,

  .profissional-grid {

    grid-template-columns: 1fr;

  }

  .seguranca-linha {

    align-items: stretch;

    flex-direction: column;

  }

  .seguranca-linha .q-btn {

    width: 100%;

  }

}


/* =========================================================
   AJUSTE FINAL - PERFIL DO TÉCNICO
   O HeaderTecnico já exibe "Meu perfil".
========================================================= */

.perfil-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

/*
  Layout em 3 colunas:
  - resumo do técnico;
  - área principal;
  - área auxiliar.
  Isso elimina o corredor branco que existia na esquerda.
*/
.perfil-grid {
  display: grid;
  grid-template-columns:
    230px
    minmax(0, 1fr)
    300px;
  gap: 12px;
  align-items: stretch;
}

/* Faz os cards internos entrarem diretamente no grid externo */
.perfil-conteudo {
  display: contents;
}

/* Resumo do técnico */
.perfil-card {
  grid-column: 1;
  grid-row: 1;

  min-height: 225px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 18px 16px;

  border-radius: 16px;
}

/* Informações pessoais */
.perfil-conteudo > .conteudo-card:nth-child(1) {
  grid-column: 2 / 4;
  grid-row: 1;
}

/* Informações profissionais */
.perfil-conteudo > .conteudo-card:nth-child(2) {
  grid-column: 1 / 3;
  grid-row: 2;
}

/* Segurança */
.perfil-conteudo > .conteudo-card:nth-child(3) {
  grid-column: 3;
  grid-row: 2;

  display: flex;
  align-items: center;
}

.conteudo-card {
  min-width: 0;

  padding: 17px;

  border-radius: 16px;
}

/* =========================================================
   CARD DO TÉCNICO
========================================================= */

.avatar-principal {
  width: 74px !important;
  height: 74px !important;

  font-size: 24px;
}

.avatar-editar {
  right: -2px;
  bottom: -1px;
}

.perfil-nome {
  margin-top: 12px;

  font-size: 15px;
}

.perfil-tipo {
  margin-top: 3px;

  font-size: 8px;
}

.perfil-status {
  margin-top: 11px;

  font-size: 9px;
}

/* =========================================================
   INFORMAÇÕES PESSOAIS
========================================================= */

.card-cabecalho {
  align-items: center;

  margin-bottom: 13px;
}

.card-titulo {
  font-size: 13px;
}

.card-subtitulo {
  margin-top: 2px;

  font-size: 8px;
}

.card-cabecalho .q-btn,
.seguranca-linha .q-btn {
  min-height: 36px;

  border-radius: 9px;

  font-size: 9px;
  font-weight: 800;
}

.form-grid {
  gap: 9px;
}

.form-grid :deep(.q-field__control) {
  min-height: 48px;
}

.form-grid :deep(.q-field__native),
.form-grid :deep(.q-field__input),
.form-grid :deep(.q-field__label) {
  font-size: 10px;
}

/* =========================================================
   INFORMAÇÕES PROFISSIONAIS
========================================================= */

.profissional-grid {
  gap: 9px;
}

.profissional-item {
  min-height: 64px;

  gap: 9px;

  padding: 10px 12px;

  border-radius: 11px;
}

.profissional-icone {
  width: 36px;
  height: 36px;

  border-radius: 10px;
}

.profissional-label {
  font-size: 7px;
}

.profissional-valor {
  margin-top: 2px;

  font-size: 10px;
}

/* =========================================================
   SEGURANÇA
========================================================= */

.seguranca-linha {
  width: 100%;

  display: flex;
  flex-direction: column;

  align-items: stretch;
  justify-content: center;

  gap: 11px;
}

.seguranca-linha .q-btn {
  width: 100%;
}

/* =========================================================
   DARK
========================================================= */

.body--dark .perfil-page {
  background: #0d0f12;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1200px) {
  .perfil-grid {
    grid-template-columns:
      210px
      minmax(0, 1fr);
  }

  .perfil-card {
    grid-column: 1;
    grid-row: 1;
  }

  .perfil-conteudo > .conteudo-card:nth-child(1) {
    grid-column: 2;
    grid-row: 1;
  }

  .perfil-conteudo > .conteudo-card:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .perfil-conteudo > .conteudo-card:nth-child(3) {
    grid-column: 1 / -1;
    grid-row: 3;
  }

  .seguranca-linha {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .seguranca-linha .q-btn {
    width: auto;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 780px) {
  .perfil-page {
    padding: 12px 12px 28px;
  }

  .perfil-grid {
    grid-template-columns: 1fr;
  }

  .perfil-card,
  .perfil-conteudo > .conteudo-card:nth-child(1),
  .perfil-conteudo > .conteudo-card:nth-child(2),
  .perfil-conteudo > .conteudo-card:nth-child(3) {
    grid-column: 1;
    grid-row: auto;
  }

  .perfil-card {
    min-height: auto;

    display: grid;
    grid-template-columns:
      64px
      minmax(0, 1fr);

    column-gap: 12px;

    align-items: center;

    padding: 13px;

    text-align: left;
  }

  .avatar-container {
    grid-row: 1 / 4;
  }

  .avatar-principal {
    width: 60px !important;
    height: 60px !important;

    font-size: 20px;
  }

  .perfil-nome,
  .perfil-tipo,
  .perfil-status {
    justify-content: flex-start;

    margin-top: 0;
  }

  .form-grid,
  .profissional-grid {
    grid-template-columns: 1fr;
  }

  .conteudo-card {
    padding: 14px;
  }

  .card-cabecalho,
  .seguranca-linha {
    align-items: stretch;
    flex-direction: column;
  }

  .card-cabecalho .q-btn,
  .seguranca-linha .q-btn {
    width: 100%;
  }
}


/* =========================================================
   PERFIL DO TÉCNICO - V2
   Melhor aproveitamento da área útil.
========================================================= */

.perfil-page {
  padding: 14px 20px 28px;
}

.perfil-grid {
  display: grid;

  grid-template-columns:
    230px
    minmax(0, 1fr)
    330px;

  gap: 12px;

  align-items: stretch;
}

.perfil-conteudo {
  display: contents;
}

/* PRIMEIRA LINHA */
.perfil-card {
  grid-column: 1;
  grid-row: 1;

  height: 100%;
  min-height: 230px;
}

.perfil-conteudo
> .conteudo-card:nth-child(1) {
  grid-column: 2 / 4;
  grid-row: 1;
}

/* SEGUNDA LINHA - largura total */
.perfil-conteudo
> .conteudo-card:nth-child(2) {
  grid-column: 1 / 4;
  grid-row: 2;
}

/* TERCEIRA LINHA */
.perfil-conteudo
> .conteudo-card:nth-child(3) {
  grid-column: 1 / 3;
  grid-row: 3;
}

.perfil-conteudo
> .conteudo-card:nth-child(4) {
  grid-column: 3 / 4;
  grid-row: 3;
}

/* =========================================================
   PROFISSIONAL
========================================================= */

.profissional-grid {
  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 9px;
}

.profissional-item {
  min-width: 0;
  min-height: 68px;

  padding: 10px 11px;
}

.profissional-dados {
  min-width: 0;
}

.profissional-valor--quebra {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   ACESSOS
========================================================= */

.acessos-card {
  display: flex;
  flex-direction: column;
}

.acessos-icone-principal {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;
  background: #fff1e6;
}

.acessos-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 9px;
}

.acesso-item {
  min-width: 0;
  min-height: 76px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 11px 12px;

  border: 1px solid #eaecf0;
  border-radius: 11px;

  background: #ffffff;
}

.acesso-icone {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;
  background: #fff1e6;
}

.acesso-titulo {
  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.acesso-texto {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 7px;
  line-height: 1.4;
}

/* =========================================================
   SEGURANÇA
========================================================= */

.seguranca-card {
  display: flex;
  align-items: center;
}

.seguranca-card .seguranca-linha {
  width: 100%;
}

.seguranca-linha {
  gap: 12px;
}

.seguranca-linha .q-btn {
  min-height: 38px;
}

/* =========================================================
   DARK
========================================================= */

.body--dark .acesso-item {
  border-color: #2b2f36;
  background: #1b1f25;
}

.body--dark .acesso-titulo {
  color: #f2f4f7;
}

.body--dark .acessos-icone-principal,
.body--dark .acesso-icone {
  color: #fb923c;
  background: #292018;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1300px) {
  .perfil-grid {
    grid-template-columns:
      210px
      minmax(0, 1fr);
  }

  .perfil-card {
    grid-column: 1;
    grid-row: 1;
  }

  .perfil-conteudo
  > .conteudo-card:nth-child(1) {
    grid-column: 2;
    grid-row: 1;
  }

  .perfil-conteudo
  > .conteudo-card:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .perfil-conteudo
  > .conteudo-card:nth-child(3) {
    grid-column: 1 / -1;
    grid-row: 3;
  }

  .perfil-conteudo
  > .conteudo-card:nth-child(4) {
    grid-column: 1 / -1;
    grid-row: 4;
  }

  .profissional-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .seguranca-linha {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .seguranca-linha .q-btn {
    width: auto;
  }
}

@media (max-width: 850px) {
  .perfil-grid {
    grid-template-columns: 1fr;
  }

  .perfil-card,
  .perfil-conteudo
  > .conteudo-card:nth-child(1),
  .perfil-conteudo
  > .conteudo-card:nth-child(2),
  .perfil-conteudo
  > .conteudo-card:nth-child(3),
  .perfil-conteudo
  > .conteudo-card:nth-child(4) {
    grid-column: 1;
    grid-row: auto;
  }

  .acessos-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .profissional-grid {
    grid-template-columns: 1fr;
  }
}

</style>