<template>
  <q-page
    class="perfil-admin-page"
    :class="{
      'perfil-admin-page--dark': $q.dark.isActive
    }"
  >
    <!-- O AdminLayout já exibe "Meu perfil" no cabeçalho. -->

    <div class="perfil-grid">
      <!-- ==================================================
           RESUMO DO ADMINISTRADOR
      =================================================== -->

      <section class="perfil-card resumo-card">
        <div class="avatar-grande">
          {{ iniciaisUsuario }}
        </div>

        <div class="perfil-nome">
          {{ authStore.usuario?.nome || 'Administrador' }}
        </div>

        <div class="perfil-email">
          {{ authStore.usuario?.email || '-' }}
        </div>

        <div class="perfil-badge">
          <q-icon
            name="admin_panel_settings"
            size="16px"
          />

          Administrador
        </div>
      </section>

      <!-- ==================================================
           INFORMAÇÕES PESSOAIS
      =================================================== -->

      <section class="perfil-card informacoes-card">
        <div class="card-cabecalho">
          <div>
            <div class="card-titulo">
              Informações pessoais
            </div>

            <div class="card-subtitulo">
              Dados utilizados na identificação do administrador.
            </div>
          </div>

          <q-btn
            v-if="!editando"
            outline
            no-caps
            color="orange"
            icon="edit"
            label="Editar"
            class="botao-card"
            @click="iniciarEdicao"
          />
        </div>

        <!-- VISUALIZAÇÃO -->

        <div
          v-if="!editando"
          class="dados-grid"
        >
          <div class="dado-item">
            <div class="dado-icone">
              <q-icon
                name="person_outline"
                size="20px"
              />
            </div>

            <div class="dado-conteudo">
              <span>
                Nome completo
              </span>

              <strong>
                {{
                  authStore.usuario?.nome ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <div class="dado-item">
            <div class="dado-icone">
              <q-icon
                name="mail_outline"
                size="20px"
              />
            </div>

            <div class="dado-conteudo">
              <span>
                E-mail
              </span>

              <strong>
                {{
                  authStore.usuario?.email ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <div class="dado-item">
            <div class="dado-icone">
              <q-icon
                name="phone"
                size="20px"
              />
            </div>

            <div class="dado-conteudo">
              <span>
                Telefone
              </span>

              <strong>
                {{
                  authStore.usuario?.telefone ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <div class="dado-item">
            <div class="dado-icone">
              <q-icon
                name="event"
                size="20px"
              />
            </div>

            <div class="dado-conteudo">
              <span>
                Cadastrado em
              </span>

              <strong>
                {{
                  formatarData(
                    authStore.usuario?.data_cadastro
                  )
                }}
              </strong>
            </div>
          </div>
        </div>

        <!-- EDIÇÃO -->

        <q-form
          v-else
          ref="formPerfil"
          class="form-edicao"
          @submit.prevent="salvarPerfil"
        >
          <div class="form-grid">
            <div class="campo">
              <label>
                Nome completo
              </label>

              <q-input
                v-model="form.nome"
                outlined
                dense
                :disable="salvando"
                placeholder="Nome do administrador"
                :rules="[
                  valorObrigatorio(
                    'Informe o nome.'
                  )
                ]"
              >
                <template #prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>
            </div>

            <div class="campo">
              <label>
                E-mail
              </label>

              <q-input
                v-model="form.email"
                outlined
                dense
                type="email"
                :disable="salvando"
                placeholder="admin@avioeste.com"
                :rules="[
                  valorObrigatorio(
                    'Informe o e-mail.'
                  ),
                  validarEmail
                ]"
              >
                <template #prepend>
                  <q-icon name="mail_outline" />
                </template>
              </q-input>
            </div>

            <div class="campo">
              <label>
                Telefone
              </label>

              <q-input
                v-model="form.telefone"
                outlined
                dense
                :disable="salvando"
                mask="(##) #####-####"
                placeholder="(49) 99999-9999"
              >
                <template #prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="form-acoes">
            <q-btn
              flat
              no-caps
              label="Cancelar"
              :disable="salvando"
              @click="cancelarEdicao"
            />

            <q-btn
              unelevated
              no-caps
              color="orange"
              icon="save"
              label="Salvar alterações"
              :loading="salvando"
              type="submit"
            />
          </div>
        </q-form>
      </section>

      <!-- ==================================================
           INFORMAÇÕES DA CONTA
      =================================================== -->

      <section class="perfil-card conta-card">
        <div class="card-cabecalho card-cabecalho--compacto">
          <div>
            <div class="card-titulo">
              Informações da conta
            </div>

            <div class="card-subtitulo">
              Identificação e situação do seu acesso.
            </div>
          </div>

          <div class="card-icone">
            <q-icon
              name="manage_accounts"
              size="21px"
            />
          </div>
        </div>

        <div class="conta-grid">
          <div class="conta-item">
            <div class="conta-icone">
              <q-icon
                name="badge"
                size="19px"
              />
            </div>

            <div>
              <span>
                ID do usuário
              </span>

              <strong>
                #{{ authStore.usuario?.id_usuario || '-' }}
              </strong>
            </div>
          </div>

          <div class="conta-item">
            <div class="conta-icone">
              <q-icon
                name="verified_user"
                size="19px"
              />
            </div>

            <div>
              <span>
                Tipo de usuário
              </span>

              <strong>
                ADMINISTRADOR
              </strong>
            </div>
          </div>

          <div class="conta-item">
            <div class="conta-icone">
              <q-icon
                name="toggle_on"
                size="20px"
              />
            </div>

            <div>
              <span>
                Situação
              </span>

              <strong
                :class="{
                  'texto-ativo':
                    authStore.usuario?.ativo !== false,
                  'texto-inativo':
                    authStore.usuario?.ativo === false
                }"
              >
                {{
                  authStore.usuario?.ativo === false
                    ? 'Inativo'
                    : 'Ativo'
                }}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================================================
           SEGURANÇA
      =================================================== -->

      <section class="perfil-card seguranca-card">
        <div class="card-cabecalho card-cabecalho--compacto">
          <div>
            <div class="card-titulo">
              Segurança
            </div>

            <div class="card-subtitulo">
              Gerencie a senha de acesso da sua conta.
            </div>
          </div>

          <div class="card-icone">
            <q-icon
              name="security"
              size="21px"
            />
          </div>
        </div>

        <div class="seguranca-conteudo">
          <div class="senha-info">
            <div class="senha-icone">
              <q-icon
                name="lock_outline"
                size="20px"
              />
            </div>

            <div>
              <strong>
                Senha da conta
              </strong>

              <span>
                A alteração utiliza um código enviado ao seu e-mail.
              </span>
            </div>
          </div>

          <q-btn
            outline
            no-caps
            color="orange"
            icon="lock_reset"
            label="Alterar senha"
            class="alterar-senha-btn"
            @click="alterarSenha"
          />
        </div>
      </section>

      <!-- ==================================================
           ACESSO ADMINISTRATIVO
      =================================================== -->

      <section class="perfil-card acesso-card">
        <div class="acesso-icone">
          <q-icon
            name="admin_panel_settings"
            size="24px"
          />
        </div>

        <div class="acesso-texto">
          <strong>
            Acesso administrativo
          </strong>

          <span>
            Sua conta possui permissão para gerenciar técnicos,
            produtores, chamados e relatórios do sistema.
          </span>
        </div>

        <div class="acesso-recursos">
          <span>
            <q-icon name="engineering" size="15px" />
            Técnicos
          </span>

          <span>
            <q-icon name="agriculture" size="15px" />
            Produtores
          </span>

          <span>
            <q-icon name="confirmation_number" size="15px" />
            Chamados
          </span>

          <span>
            <q-icon name="assessment" size="15px" />
            Relatórios
          </span>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import {
  computed,
  reactive,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  useAuthStore
} from 'src/stores/auth'

import usuarioService from
  'src/services/usuarioService'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const editando = ref(false)
const salvando = ref(false)
const formPerfil = ref(null)

const form = reactive({
  nome: '',
  email: '',
  telefone: ''
})

/* =========================================================
   INICIAIS
========================================================= */

const iniciaisUsuario =
  computed(() => {
    const nome =
      String(
        authStore.usuario?.nome ||
        ''
      )
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (
      nome.length === 0
    ) {
      return 'AD'
    }

    if (
      nome.length === 1
    ) {
      return nome[0]
        .substring(
          0,
          2
        )
        .toUpperCase()
    }

    return (
      nome[0][0] +
      nome[
        nome.length - 1
      ][0]
    ).toUpperCase()
  })

/* =========================================================
   EDIÇÃO
========================================================= */

function iniciarEdicao() {
  form.nome =
    authStore.usuario?.nome ||
    ''

  form.email =
    authStore.usuario?.email ||
    ''

  form.telefone =
    authStore.usuario?.telefone ||
    ''

  editando.value = true
}

function cancelarEdicao() {
  if (
    salvando.value
  ) {
    return
  }

  editando.value = false
}

/* =========================================================
   SALVAR PERFIL
========================================================= */

async function salvarPerfil() {
  const valido =
    await formPerfil.value
      ?.validate()

  if (!valido) {
    return
  }

  const idUsuario =
    authStore.usuario
      ?.id_usuario

  if (!idUsuario) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível identificar o usuário logado.'
    })

    return
  }

  salvando.value = true

  try {
    const usuarioAtualizado =
      await usuarioService
        .atualizar(
          idUsuario,
          {
            nome:
              form.nome.trim(),

            email:
              form.email
                .trim()
                .toLowerCase(),

            telefone:
              form.telefone
                .trim() ||
              null
          }
        )

    authStore.usuario =
      usuarioAtualizado

    localStorage.setItem(
      'usuario',
      JSON.stringify(
        usuarioAtualizado
      )
    )

    editando.value = false

    $q.notify({
      type: 'positive',
      message:
        'Perfil atualizado com sucesso.'
    })
  } catch (error) {
    console.error(
      'Erro ao atualizar perfil:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível atualizar o perfil.'
    })
  } finally {
    salvando.value = false
  }
}

/* =========================================================
   ALTERAR SENHA
========================================================= */

function alterarSenha() {
  router.push({
    name:
      'recuperar-senha',

    query: {
      email:
        authStore.usuario?.email ||
        ''
    }
  })
}

/* =========================================================
   VALIDAÇÕES
========================================================= */

function valorObrigatorio(
  mensagem
) {
  return (valor) =>
    !!String(
      valor || ''
    ).trim() ||
    mensagem
}

function validarEmail(
  valor
) {
  if (!valor) {
    return true
  }

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return (
    regex.test(valor) ||
    'Informe um e-mail válido.'
  )
}

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatarData(
  data
) {
  if (!data) {
    return '-'
  }

  const objeto =
    new Date(data)

  if (
    Number.isNaN(
      objeto.getTime()
    )
  ) {
    return '-'
  }

  return new Intl
    .DateTimeFormat(
      'pt-BR',
      {
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric'
      }
    )
    .format(
      objeto
    )
}
</script>

<style scoped>
/* =========================================================
   PÁGINA
========================================================= */

.perfil-admin-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

/* =========================================================
   GRID PRINCIPAL
========================================================= */

.perfil-grid {
  display: grid;

  grid-template-columns:
    235px
    minmax(0, 1fr)
    330px;

  gap: 12px;

  align-items: stretch;
}

/* =========================================================
   CARDS
========================================================= */

.perfil-card {
  min-width: 0;

  border: 1px solid #eaecf0;
  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

/* =========================================================
   RESUMO
========================================================= */

.resumo-card {
  grid-column: 1;
  grid-row: 1;

  min-height: 226px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 18px 15px;

  text-align: center;
}

.avatar-grande {
  width: 70px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #f97316;
  background: #fff1e6;

  font-size: 22px;
  font-weight: 900;
}

.perfil-nome {
  margin-top: 12px;

  color: #101828;

  font-size: 14px;
  font-weight: 900;

  line-height: 1.25;
}

.perfil-email {
  margin-top: 4px;

  color: #98a2b3;

  font-size: 8px;

  word-break: break-word;
}

.perfil-badge {
  display: flex;
  align-items: center;

  gap: 5px;

  margin-top: 11px;
  padding: 6px 10px;

  border-radius: 999px;

  color: #f97316;
  background: #fff1e6;

  font-size: 8px;
  font-weight: 800;
}

/* =========================================================
   INFORMAÇÕES PESSOAIS
========================================================= */

.informacoes-card {
  grid-column: 2 / 4;
  grid-row: 1;

  overflow: hidden;
}

.card-cabecalho {
  min-height: 68px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 14px 16px;

  border-bottom: 1px solid #eaecf0;
}

.card-cabecalho--compacto {
  min-height: 62px;
}

.card-titulo {
  color: #101828;

  font-size: 13px;
  font-weight: 900;
}

.card-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
}

.botao-card {
  min-height: 36px;

  border-radius: 9px;

  font-size: 9px;
  font-weight: 800;
}

.dados-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 9px;

  padding: 14px 16px 16px;
}

.dado-item {
  min-width: 0;
  min-height: 58px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 10px 11px;

  border-radius: 11px;

  background: #f8fafc;
}

.dado-icone {
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

.dado-conteudo {
  min-width: 0;
}

.dado-item span {
  display: block;

  color: #98a2b3;

  font-size: 7px;
}

.dado-item strong {
  display: block;

  overflow: hidden;

  margin-top: 2px;

  color: #344054;

  font-size: 10px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   FORMULÁRIO
========================================================= */

.form-edicao {
  padding: 14px 16px 16px;
}

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 10px;
}

.campo label {
  display: block;

  margin-bottom: 5px;

  color: #344054;

  font-size: 9px;
  font-weight: 700;
}

.campo :deep(.q-field__control) {
  min-height: 40px;
}

.campo :deep(.q-field__native),
.campo :deep(.q-field__input) {
  font-size: 10px;
}

.form-acoes {
  display: flex;
  justify-content: flex-end;

  gap: 8px;

  margin-top: 9px;
}

/* =========================================================
   INFORMAÇÕES DA CONTA
========================================================= */

.conta-card {
  grid-column: 1 / 3;
  grid-row: 2;

  overflow: hidden;
}

.card-icone {
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

.conta-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 9px;

  padding: 13px 16px 15px;
}

.conta-item {
  min-width: 0;
  min-height: 64px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px 11px;

  border: 1px solid #eaecf0;
  border-radius: 11px;
}

.conta-icone {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  color: #f97316;
  background: #fff1e6;
}

.conta-item span {
  display: block;

  color: #98a2b3;

  font-size: 7px;
}

.conta-item strong {
  display: block;

  margin-top: 2px;

  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.texto-ativo {
  color: #16a34a !important;
}

.texto-inativo {
  color: #dc2626 !important;
}

/* =========================================================
   SEGURANÇA
========================================================= */

.seguranca-card {
  grid-column: 3;
  grid-row: 2;

  overflow: hidden;
}

.seguranca-conteudo {
  display: flex;
  flex-direction: column;

  gap: 10px;

  padding: 13px 16px 15px;
}

.senha-info {
  display: flex;
  align-items: center;

  gap: 9px;
}

.senha-icone {
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

.senha-info strong {
  display: block;

  color: #344054;

  font-size: 10px;
  font-weight: 800;
}

.senha-info span {
  display: block;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 7px;
  line-height: 1.4;
}

.alterar-senha-btn {
  width: 100%;
  min-height: 35px;

  border-radius: 9px;

  font-size: 9px;
  font-weight: 800;
}

/* =========================================================
   ACESSO ADMINISTRATIVO
========================================================= */

.acesso-card {
  grid-column: 1 / 4;
  grid-row: 3;

  display: grid;

  grid-template-columns:
    42px
    minmax(240px, 1fr)
    auto;

  align-items: center;

  gap: 12px;

  padding: 13px 16px;
}

.acesso-icone {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  color: #f97316;
  background: #fff1e6;
}

.acesso-texto strong {
  display: block;

  color: #344054;

  font-size: 11px;
  font-weight: 900;
}

.acesso-texto span {
  display: block;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 8px;
  line-height: 1.45;
}

.acesso-recursos {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  flex-wrap: wrap;

  gap: 6px;
}

.acesso-recursos span {
  display: inline-flex;
  align-items: center;

  gap: 4px;

  padding: 6px 8px;

  border-radius: 8px;

  color: #667085;
  background: #f8fafc;

  font-size: 8px;
  font-weight: 700;
}

/* =========================================================
   DARK
========================================================= */

.perfil-admin-page--dark {
  background: #0d0f12;
}

.perfil-admin-page--dark
.perfil-card {
  border-color: #292d33;
  background: #15181d;
}

.perfil-admin-page--dark
.card-cabecalho {
  border-color: #292d33;
}

.perfil-admin-page--dark
.perfil-nome,
.perfil-admin-page--dark
.card-titulo {
  color: #f9fafb;
}

.perfil-admin-page--dark
.dado-item,
.perfil-admin-page--dark
.acesso-recursos span {
  background: #1b1e24;
}

.perfil-admin-page--dark
.dado-item strong,
.perfil-admin-page--dark
.conta-item strong,
.perfil-admin-page--dark
.senha-info strong,
.perfil-admin-page--dark
.acesso-texto strong,
.perfil-admin-page--dark
.campo label {
  color: #f2f4f7;
}

.perfil-admin-page--dark
.conta-item {
  border-color: #292d33;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1200px) {
  .perfil-grid {
    grid-template-columns:
      220px
      minmax(0, 1fr);
  }

  .resumo-card {
    grid-column: 1;
    grid-row: 1;
  }

  .informacoes-card {
    grid-column: 2;
    grid-row: 1;
  }

  .conta-card {
    grid-column: 1 / 3;
    grid-row: 2;
  }

  .seguranca-card {
    grid-column: 1 / 3;
    grid-row: 3;
  }

  .seguranca-conteudo {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .alterar-senha-btn {
    width: auto;
    flex-shrink: 0;
  }

  .acesso-card {
    grid-column: 1 / 3;
    grid-row: 4;
  }
}

@media (max-width: 780px) {
  .perfil-admin-page {
    padding: 12px 12px 28px;
  }

  .perfil-grid {
    grid-template-columns: 1fr;
  }

  .resumo-card,
  .informacoes-card,
  .conta-card,
  .seguranca-card,
  .acesso-card {
    grid-column: 1;
    grid-row: auto;
  }

  .resumo-card {
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

  .avatar-grande {
    grid-row: 1 / 4;

    width: 58px;
    height: 58px;

    font-size: 18px;
  }

  .perfil-nome,
  .perfil-email,
  .perfil-badge {
    margin-top: 0;
  }

  .perfil-badge {
    width: max-content;
  }

  .dados-grid,
  .conta-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .seguranca-conteudo {
    align-items: stretch;
    flex-direction: column;
  }

  .alterar-senha-btn {
    width: 100%;
  }

  .acesso-card {
    grid-template-columns:
      42px
      minmax(0, 1fr);
  }

  .acesso-recursos {
    grid-column: 1 / 3;

    justify-content: flex-start;
  }
}

@media (max-width: 520px) {
  .card-cabecalho {
    align-items: flex-start;
  }

  .form-acoes {
    flex-direction: column-reverse;
  }

  .form-acoes .q-btn {
    width: 100%;
  }
}

/* =========================================================
   AJUSTE DE LEGIBILIDADE - PERFIL ADMIN
   Aumenta as fontes sem perder o layout compacto.
========================================================= */

.perfil-nome {
  font-size: 18px;
}

.perfil-email {
  font-size: 11px;
}

.perfil-badge {
  font-size: 10px;
}

.card-titulo {
  font-size: 16px;
}

.card-subtitulo {
  font-size: 10px;
}

.botao-card {
  font-size: 11px;
}

.dado-item span {
  font-size: 9px;
}

.dado-item strong {
  font-size: 13px;
}

.campo label {
  font-size: 10px;
}

.campo :deep(.q-field__native),
.campo :deep(.q-field__input) {
  font-size: 12px;
}

.conta-item span {
  font-size: 9px;
}

.conta-item strong {
  font-size: 12px;
}

.senha-info strong {
  font-size: 12px;
}

.senha-info span {
  font-size: 9px;
}

.alterar-senha-btn {
  font-size: 10px;
}

.acesso-texto strong {
  font-size: 13px;
}

.acesso-texto span {
  font-size: 10px;
}

.acesso-recursos span {
  font-size: 10px;
}

.resumo-card .avatar-grande {
  font-size: 24px;
}


/* =========================================================
   LEGIBILIDADE FORTE - PERFIL ADMIN
   Aumento visível das fontes em toda a tela.
========================================================= */

.perfil-nome {
  font-size: 21px !important;
  line-height: 1.2 !important;
}

.perfil-email {
  font-size: 13px !important;
}

.perfil-badge {
  font-size: 12px !important;
  padding: 7px 12px !important;
}

/* Títulos dos cards */
.card-titulo {
  font-size: 19px !important;
  line-height: 1.2 !important;
}

.card-subtitulo {
  margin-top: 4px !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
}

/* Botão editar */
.botao-card {
  min-height: 40px !important;
  font-size: 12px !important;
}

/* Informações pessoais */
.dado-item {
  min-height: 70px !important;
  padding: 12px 14px !important;
}

.dado-item span {
  font-size: 11px !important;
}

.dado-item strong {
  margin-top: 4px !important;
  font-size: 15px !important;
  line-height: 1.3 !important;
}

.dado-icone {
  width: 40px !important;
  height: 40px !important;
}

/* Informações da conta */
.conta-item {
  min-height: 74px !important;
  padding: 12px 14px !important;
}

.conta-item span {
  font-size: 11px !important;
}

.conta-item strong {
  margin-top: 4px !important;
  font-size: 14px !important;
  line-height: 1.3 !important;
}

.conta-icone {
  width: 39px !important;
  height: 39px !important;
}

/* Segurança */
.senha-info strong {
  font-size: 14px !important;
}

.senha-info span {
  margin-top: 4px !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
}

.alterar-senha-btn {
  min-height: 40px !important;
  font-size: 12px !important;
}

/* Acesso administrativo */
.acesso-texto strong {
  font-size: 15px !important;
}

.acesso-texto span {
  margin-top: 4px !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
}

.acesso-recursos span {
  padding: 7px 10px !important;
  font-size: 11px !important;
}

/* Formulário em edição */
.campo label {
  font-size: 12px !important;
}

.campo :deep(.q-field__native),
.campo :deep(.q-field__input),
.campo :deep(.q-field__label) {
  font-size: 13px !important;
}

/* Ajusta alturas para o texto maior não ficar apertado */
.card-cabecalho {
  min-height: 76px !important;
}

.card-cabecalho--compacto {
  min-height: 70px !important;
}

.resumo-card {
  min-height: 270px !important;
}

.avatar-grande {
  width: 78px !important;
  height: 78px !important;
  font-size: 27px !important;
}

</style>
