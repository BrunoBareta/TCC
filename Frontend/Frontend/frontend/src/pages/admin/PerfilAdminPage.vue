<template>
  <q-page
    class="perfil-admin-page"
    :class="{
      'perfil-admin-page--dark': $q.dark.isActive
    }"
  >
    <!-- =========================
         CABEÇALHO
    ========================== -->

    <div class="pagina-topo">
      <div>
        <h1>
          Meu Perfil
        </h1>

        <p>
          Gerencie suas informações de acesso ao sistema.
        </p>
      </div>
    </div>

    <!-- =========================
         PERFIL PRINCIPAL
    ========================== -->

    <div class="perfil-grid">

      <!-- =========================
           CARD USUÁRIO
      ========================== -->

      <div class="perfil-resumo-card">

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

        <div class="perfil-divisor"></div>

        <div class="perfil-meta">
          <div class="perfil-meta-item">
            <q-icon
              name="badge"
              size="20px"
            />

            <div>
              <span>
                ID do usuário
              </span>

              <strong>
                #{{ authStore.usuario?.id_usuario || '-' }}
              </strong>
            </div>
          </div>

          <div class="perfil-meta-item">
            <q-icon
              name="verified_user"
              size="20px"
            />

            <div>
              <span>
                Tipo de usuário
              </span>

              <strong>
                ADMINISTRADOR
              </strong>
            </div>
          </div>

          <div class="perfil-meta-item">
            <q-icon
              name="toggle_on"
              size="20px"
            />

            <div>
              <span>
                Situação
              </span>

              <strong>
                {{
                  authStore.usuario?.ativo === false
                    ? 'Inativo'
                    : 'Ativo'
                }}
              </strong>
            </div>
          </div>
        </div>

      </div>

      <!-- =========================
           LADO DIREITO
      ========================== -->

      <div class="perfil-conteudo">

        <!-- =========================
             INFORMAÇÕES PESSOAIS
        ========================== -->

        <div class="perfil-card">

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
              flat
              no-caps
              color="orange"
              icon="edit"
              label="Editar"
              @click="iniciarEdicao"
            />
          </div>

          <q-separator />

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

              <div>
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

              <div>
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

              <div>
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

              <div>
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
            <!-- NOME -->

            <div class="campo">
              <label>
                Nome completo
              </label>

              <q-input
                v-model="form.nome"
                outlined
                :disable="salvando"
                placeholder="Nome do administrador"
                :rules="[
                  valorObrigatorio(
                    'Informe o nome.'
                  )
                ]"
              >
                <template #prepend>
                  <q-icon
                    name="person_outline"
                  />
                </template>
              </q-input>
            </div>

            <!-- E-MAIL -->

            <div class="campo">
              <label>
                E-mail
              </label>

              <q-input
                v-model="form.email"
                outlined
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
                  <q-icon
                    name="mail_outline"
                  />
                </template>
              </q-input>
            </div>

            <!-- TELEFONE -->

            <div class="campo">
              <label>
                Telefone
              </label>

              <q-input
                v-model="form.telefone"
                outlined
                :disable="salvando"
                mask="(##) #####-####"
                placeholder="(49) 99999-9999"
              >
                <template #prepend>
                  <q-icon
                    name="phone"
                  />
                </template>
              </q-input>
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

        </div>

        <!-- =========================
             SEGURANÇA
        ========================== -->

        <div class="perfil-card seguranca-card">

          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Segurança
              </div>

              <div class="card-subtitulo">
                Gerencie a senha utilizada para acessar sua conta.
              </div>
            </div>

            <div class="seguranca-icone">
              <q-icon
                name="security"
                size="22px"
              />
            </div>
          </div>

          <q-separator />

          <div class="seguranca-conteudo">
            <div class="senha-info">
              <div class="senha-icone">
                <q-icon
                  name="lock_outline"
                  size="21px"
                />
              </div>

              <div>
                <strong>
                  Senha da conta
                </strong>

                <span>
                  Para alterar sua senha, enviaremos um código de verificação para o seu e-mail.
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

        </div>

        <!-- =========================
             ACESSO ADMINISTRATIVO
        ========================== -->

        <div class="perfil-card acesso-card">

          <div class="acesso-icone">
            <q-icon
              name="admin_panel_settings"
              size="26px"
            />
          </div>

          <div class="acesso-texto">
            <strong>
              Acesso administrativo
            </strong>

            <span>
              Sua conta possui permissão para gerenciar técnicos,
              produtores e acompanhar todos os chamados do sistema.
            </span>
          </div>

        </div>

      </div>

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

const $q =
  useQuasar()

const router =
  useRouter()

const authStore =
  useAuthStore()

const editando =
  ref(false)

const salvando =
  ref(false)

const formPerfil =
  ref(null)

const form =
  reactive({
    nome: '',
    email: '',
    telefone: ''
  })

/* =========================
   INICIAIS
========================= */

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

/* =========================
   EDIÇÃO
========================= */

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

  editando.value =
    true
}

function cancelarEdicao() {
  if (
    salvando.value
  ) {
    return
  }

  editando.value =
    false
}

/* =========================
   SALVAR PERFIL
========================= */

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

  salvando.value =
    true

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

    /*
      Atualiza imediatamente
      o Pinia e o localStorage.

      Assim o nome também muda
      no cabeçalho e menu lateral.
    */

    authStore.usuario =
      usuarioAtualizado

    localStorage.setItem(
      'usuario',
      JSON.stringify(
        usuarioAtualizado
      )
    )

    editando.value =
      false

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
    salvando.value =
      false
  }
}

/* =========================
   ALTERAR SENHA
========================= */

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

/* =========================
   VALIDAÇÕES
========================= */

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

/* =========================
   FORMATAÇÕES
========================= */

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
/* =========================
   PÁGINA
========================= */

.perfil-admin-page {
  min-height: 100%;

  padding: 30px;

  background: #f5f6f8;
}

/* =========================
   CABEÇALHO
========================= */

.pagina-topo {
  margin-bottom: 25px;
}

.pagina-topo h1 {
  margin: 0;

  color: #101828;

  font-size: 26px;

  font-weight: 900;
}

.pagina-topo p {
  margin:
    5px 0 0;

  color: #667085;

  font-size: 12px;
}

/* =========================
   GRID
========================= */

.perfil-grid {
  display: grid;

  grid-template-columns:
    300px
    minmax(
      0,
      1fr
    );

  gap: 18px;

  align-items: start;
}

/* =========================
   RESUMO
========================= */

.perfil-resumo-card {
  padding: 27px 22px;

  border:
    1px solid #eaecf0;

  border-radius: 17px;

  background: #ffffff;

  text-align: center;

  box-shadow:
    0 3px 12px
    rgba(
      16,
      24,
      40,
      0.035
    );
}

.avatar-grande {
  width: 82px;

  height: 82px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin:
    0 auto;

  border-radius: 50%;

  color: #f97316;

  background: #fff1e6;

  font-size: 24px;

  font-weight: 900;
}

.perfil-nome {
  margin-top: 17px;

  color: #101828;

  font-size: 17px;

  font-weight: 900;
}

.perfil-email {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 9px;

  word-break: break-all;
}

.perfil-badge {
  width: max-content;

  display: flex;

  align-items: center;

  gap: 5px;

  margin:
    15px auto 0;

  padding:
    7px 11px;

  border-radius: 20px;

  color: #f97316;

  background: #fff1e6;

  font-size: 9px;

  font-weight: 800;
}

.perfil-divisor {
  height: 1px;

  margin:
    24px 0;

  background: #eaecf0;
}

.perfil-meta {
  display: flex;

  flex-direction: column;

  gap: 14px;

  text-align: left;
}

.perfil-meta-item {
  display: flex;

  align-items: center;

  gap: 10px;
}

.perfil-meta-item
> .q-icon {
  color: #f97316;
}

.perfil-meta-item span {
  display: block;

  color: #98a2b3;

  font-size: 8px;
}

.perfil-meta-item strong {
  display: block;

  margin-top: 1px;

  color: #344054;

  font-size: 10px;
}

/* =========================
   CONTEÚDO
========================= */

.perfil-conteudo {
  display: flex;

  flex-direction: column;

  gap: 17px;
}

.perfil-card {
  border:
    1px solid #eaecf0;

  border-radius: 17px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(
      16,
      24,
      40,
      0.035
    );
}

.card-cabecalho {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 21px 22px;
}

.card-titulo {
  color: #101828;

  font-size: 15px;

  font-weight: 900;
}

.card-subtitulo {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 9px;
}

/* =========================
   DADOS
========================= */

.dados-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(
        0,
        1fr
      )
    );

  gap: 12px;

  padding: 22px;
}

.dado-item {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 14px;

  border-radius: 11px;

  background: #f9fafb;
}

.dado-icone {
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

.dado-item span {
  display: block;

  color: #98a2b3;

  font-size: 8px;
}

.dado-item strong {
  display: block;

  margin-top: 2px;

  color: #344054;

  font-size: 10px;

  word-break: break-word;
}

/* =========================
   FORM
========================= */

.form-edicao {
  padding: 22px;
}

.campo {
  margin-bottom: 14px;
}

.campo label {
  display: block;

  margin-bottom: 6px;

  color: #344054;

  font-size: 10px;

  font-weight: 700;
}

.form-acoes {
  display: flex;

  justify-content: flex-end;

  gap: 8px;

  margin-top: 8px;
}

/* =========================
   SEGURANÇA
========================= */

.seguranca-icone {
  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  color: #f97316;

  background: #fff1e6;
}

.seguranca-conteudo {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 22px;
}

.senha-info {
  display: flex;

  align-items: center;

  gap: 12px;
}

.senha-icone {
  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  color: #f97316;

  background: #fff1e6;
}

.senha-info strong {
  display: block;

  color: #344054;

  font-size: 11px;
}

.senha-info span {
  display: block;

  max-width: 440px;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 9px;

  line-height: 1.5;
}

.alterar-senha-btn {
  flex-shrink: 0;
}

/* =========================
   ACESSO
========================= */

.acesso-card {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 20px 22px;
}

.acesso-icone {
  width: 47px;

  height: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 13px;

  color: #f97316;

  background: #fff1e6;
}

.acesso-texto strong {
  display: block;

  color: #344054;

  font-size: 11px;
}

.acesso-texto span {
  display: block;

  max-width: 650px;

  margin-top: 3px;

  color: #98a2b3;

  font-size: 9px;

  line-height: 1.5;
}

/* =========================
   DARK
========================= */

.perfil-admin-page--dark {
  background: #0d0f12;
}

.perfil-admin-page--dark
.pagina-topo h1,
.perfil-admin-page--dark
.perfil-nome,
.perfil-admin-page--dark
.card-titulo {
  color: #f9fafb;
}

.perfil-admin-page--dark
.perfil-resumo-card,
.perfil-admin-page--dark
.perfil-card {
  border-color: #292d33;

  background: #15181d;
}

.perfil-admin-page--dark
.perfil-divisor {
  background: #292d33;
}

.perfil-admin-page--dark
.perfil-meta-item strong,
.perfil-admin-page--dark
.dado-item strong,
.perfil-admin-page--dark
.campo label,
.perfil-admin-page--dark
.senha-info strong,
.perfil-admin-page--dark
.acesso-texto strong {
  color: #f2f4f7;
}

.perfil-admin-page--dark
.dado-item {
  background: #1b1e24;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 950px) {
  .perfil-grid {
    grid-template-columns:
      1fr;
  }

  .perfil-resumo-card {
    max-width: none;
  }
}

@media (max-width: 700px) {
  .perfil-admin-page {
    padding: 22px;
  }

  .dados-grid {
    grid-template-columns:
      1fr;
  }

  .seguranca-conteudo {
    align-items: stretch;

    flex-direction: column;
  }

  .alterar-senha-btn {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .perfil-admin-page {
    padding:
      18px 14px;
  }

  .pagina-topo h1 {
    font-size: 22px;
  }

  .card-cabecalho {
    align-items: flex-start;
  }

  .form-acoes {
    flex-direction: column-reverse;
  }

  .form-acoes
  .q-btn {
    width: 100%;
  }

  .acesso-card {
    align-items: flex-start;
  }
}
</style>