<template>
  <q-page
    class="tecnicos-page"
    :class="{
      'tecnicos-page--dark': $q.dark.isActive
    }"
  >
    <!-- =========================
         CABEÇALHO
    ========================== -->

    <div class="pagina-topo">
      <div>
        <h1>
          Técnicos
        </h1>

        <p>
          Gerencie os técnicos responsáveis pelos atendimentos.
        </p>
      </div>

      <q-btn
        unelevated
        no-caps
        color="orange"
        icon="person_add"
        label="Cadastrar técnico"
        class="novo-btn"
        @click="abrirCadastro"
      />
    </div>

    <!-- =========================
         RESUMO
    ========================== -->

    <div class="resumo-grid">
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--laranja">
          <q-icon
            name="engineering"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ tecnicos.length }}
          </div>

          <div class="resumo-label">
            Técnicos cadastrados
          </div>
        </div>
      </div>

      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--verde">
          <q-icon
            name="check_circle"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ totalAtivos }}
          </div>

          <div class="resumo-label">
            Técnicos ativos
          </div>
        </div>
      </div>

      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--cinza">
          <q-icon
            name="person_off"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ totalInativos }}
          </div>

          <div class="resumo-label">
            Técnicos inativos
          </div>
        </div>
      </div>
    </div>

    <!-- =========================
         LISTAGEM
    ========================== -->

    <div class="lista-card">
      <div class="lista-cabecalho">
        <div>
          <div class="lista-titulo">
            Equipe técnica
          </div>

          <div class="lista-subtitulo">
            Consulte os funcionários cadastrados no sistema.
          </div>
        </div>

        <div class="filtros">
          <q-input
            v-model="pesquisa"
            outlined
            dense
            clearable
            placeholder="Buscar técnico..."
            class="pesquisa-input"
          >
            <template #prepend>
              <q-icon
                name="search"
                size="19px"
              />
            </template>
          </q-input>

          <q-btn
            flat
            round
            icon="refresh"
            :loading="carregando"
            @click="carregarTecnicos"
          >
            <q-tooltip>
              Atualizar
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- CARREGANDO -->

      <div
        v-if="carregando && !carregadoUmaVez"
        class="carregando"
      >
        <q-spinner
          color="orange"
          size="42px"
        />

        <span>
          Carregando técnicos...
        </span>
      </div>

      <!-- SEM TÉCNICOS -->

      <div
        v-else-if="tecnicosFiltrados.length === 0"
        class="vazio"
      >
        <div class="vazio-icone">
          <q-icon
            name="engineering"
            size="32px"
          />
        </div>

        <strong>
          Nenhum técnico encontrado
        </strong>

        <span v-if="pesquisa">
          Nenhum técnico corresponde à sua busca.
        </span>

        <span v-else>
          Cadastre o primeiro técnico da equipe.
        </span>

        <q-btn
          v-if="!pesquisa"
          unelevated
          no-caps
          color="orange"
          icon="person_add"
          label="Cadastrar técnico"
          class="q-mt-md"
          @click="abrirCadastro"
        />
      </div>

      <!-- DESKTOP -->

      <div
        v-else
        class="tabela-container"
      >
        <table class="tecnicos-tabela">
          <thead>
            <tr>
              <th>
                Técnico
              </th>

              <th>
                E-mail
              </th>

              <th>
                Telefone
              </th>

              <th>
                Status
              </th>

              <th>
                Cadastro
              </th>

              <th class="acao-coluna">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="tecnico in tecnicosFiltrados"
              :key="tecnico.id_usuario"
            >
              <td>
                <div class="tecnico-identificacao">
                  <div class="tecnico-avatar">
                    {{ iniciais(tecnico.nome) }}
                  </div>

                  <div>
                    <strong>
                      {{ tecnico.nome }}
                    </strong>

                    <span>
                      Técnico
                    </span>
                  </div>
                </div>
              </td>

              <td>
                {{ tecnico.email || '-' }}
              </td>

              <td>
                {{ tecnico.telefone || '-' }}
              </td>

              <td>
                <q-badge
                  rounded
                  :color="
                    tecnico.ativo === false
                      ? 'grey'
                      : 'positive'
                  "
                  :label="
                    tecnico.ativo === false
                      ? 'Inativo'
                      : 'Ativo'
                  "
                />
              </td>

              <td>
                {{
                  formatarData(
                    tecnico.data_cadastro
                  )
                }}
              </td>

              <td class="acao-coluna">
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                >
                  <q-menu>
                    <q-list
                      style="min-width: 180px"
                    >
                      <q-item
                        clickable
                        v-close-popup
                        @click="visualizarTecnico(tecnico)"
                      >
                        <q-item-section avatar>
                          <q-icon
                            name="visibility"
                          />
                        </q-item-section>

                        <q-item-section>
                          Ver informações
                        </q-item-section>
                      </q-item>

                      <q-item
                        v-if="tecnico.ativo !== false"
                        clickable
                        v-close-popup
                        class="text-negative"
                        @click="confirmarDesativacao(tecnico)"
                      >
                        <q-item-section avatar>
                          <q-icon
                            name="person_off"
                          />
                        </q-item-section>

                        <q-item-section>
                          Desativar técnico
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================
         DIALOG CADASTRAR TÉCNICO
    ========================== -->

    <q-dialog
      v-model="dialogCadastro"
      persistent
    >
      <q-card
        class="cadastro-dialog"
        :class="{
          'cadastro-dialog--dark':
            $q.dark.isActive
        }"
      >
        <q-card-section class="dialog-topo">
          <div class="dialog-icone">
            <q-icon
              name="person_add"
              size="25px"
            />
          </div>

          <div>
            <div class="dialog-titulo">
              Cadastrar técnico
            </div>

            <div class="dialog-subtitulo">
              Informe os dados básicos do funcionário.
            </div>
          </div>

          <q-space />

          <q-btn
            flat
            round
            dense
            icon="close"
            :disable="salvando"
            @click="fecharCadastro"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-corpo">
          <q-form
            ref="formCadastro"
            @submit.prevent="salvarTecnico"
          >
            <!-- NOME -->

            <div class="campo">
              <label>
                Nome completo
              </label>

              <q-input
                v-model="form.nome"
                outlined
                placeholder="Nome do técnico"
                autocomplete="name"
                :disable="salvando"
                :rules="[
                  valorObrigatorio(
                    'Informe o nome do técnico.'
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

            <!-- EMAIL -->

            <div class="campo">
              <label>
                E-mail
              </label>

              <q-input
                v-model="form.email"
                outlined
                type="email"
                placeholder="tecnico@avioeste.com"
                autocomplete="email"
                :disable="salvando"
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
                placeholder="(49) 99999-9999"
                mask="(##) #####-####"
                autocomplete="tel"
                :disable="salvando"
                :rules="[
                  valorObrigatorio(
                    'Informe o telefone.'
                  )
                ]"
              >
                <template #prepend>
                  <q-icon
                    name="phone"
                  />
                </template>
              </q-input>
            </div>

            <!-- SENHA -->

            <div class="campo">
              <label>
                Senha inicial
              </label>

              <q-input
                v-model="form.senha"
                outlined
                :type="
                  mostrarSenha
                    ? 'text'
                    : 'password'
                "
                placeholder="Mínimo de 6 caracteres"
                autocomplete="new-password"
                :disable="salvando"
                :rules="[
                  valorObrigatorio(
                    'Informe a senha.'
                  ),
                  validarSenha
                ]"
              >
                <template #prepend>
                  <q-icon
                    name="lock_outline"
                  />
                </template>

                <template #append>
                  <q-icon
                    :name="
                      mostrarSenha
                        ? 'visibility_off'
                        : 'visibility'
                    "
                    class="cursor-pointer"
                    @click="
                      mostrarSenha =
                        !mostrarSenha
                    "
                  />
                </template>
              </q-input>
            </div>

            <div class="senha-aviso">
              <q-icon
                name="info"
                size="17px"
              />

              <span>
                O técnico poderá utilizar este e-mail e senha para acessar o painel técnico.
              </span>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-acoes">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            :disable="salvando"
            @click="fecharCadastro"
          />

          <q-btn
            unelevated
            no-caps
            color="orange"
            icon="person_add"
            label="Cadastrar técnico"
            :loading="salvando"
            @click="salvarTecnico"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =========================
         DETALHES DO TÉCNICO
    ========================== -->

    <q-dialog
      v-model="dialogDetalhes"
    >
      <q-card
        v-if="tecnicoSelecionado"
        class="detalhes-dialog"
        :class="{
          'cadastro-dialog--dark':
            $q.dark.isActive
        }"
      >
        <q-card-section class="dialog-topo">
          <div class="detalhes-avatar">
            {{
              iniciais(
                tecnicoSelecionado.nome
              )
            }}
          </div>

          <div>
            <div class="dialog-titulo">
              {{ tecnicoSelecionado.nome }}
            </div>

            <div class="dialog-subtitulo">
              Técnico Avioeste
            </div>
          </div>

          <q-space />

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="detalhes-corpo">
          <div class="detalhe-item">
            <q-icon
              name="mail_outline"
            />

            <div>
              <span>
                E-mail
              </span>

              <strong>
                {{
                  tecnicoSelecionado.email ||
                  '-'
                }}
              </strong>
            </div>
          </div>

          <div class="detalhe-item">
            <q-icon
              name="phone"
            />

            <div>
              <span>
                Telefone
              </span>

              <strong>
                {{
                  tecnicoSelecionado.telefone ||
                  '-'
                }}
              </strong>
            </div>
          </div>

          <div class="detalhe-item">
            <q-icon
              name="badge"
            />

            <div>
              <span>
                Perfil
              </span>

              <strong>
                FUNCIONÁRIO
              </strong>
            </div>
          </div>

          <div class="detalhe-item">
            <q-icon
              name="event"
            />

            <div>
              <span>
                Cadastrado em
              </span>

              <strong>
                {{
                  formatarData(
                    tecnicoSelecionado
                      .data_cadastro
                  )
                }}
              </strong>
            </div>
          </div>

          <div class="detalhe-item">
            <q-icon
              name="toggle_on"
            />

            <div>
              <span>
                Situação
              </span>

              <strong>
                {{
                  tecnicoSelecionado.ativo === false
                    ? 'Inativo'
                    : 'Ativo'
                }}
              </strong>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  useQuasar
} from 'quasar'

import usuarioService from
  'src/services/usuarioService'

const $q =
  useQuasar()

const carregando =
  ref(false)

const carregadoUmaVez =
  ref(false)

const salvando =
  ref(false)

const pesquisa =
  ref('')

const usuarios =
  ref([])

const dialogCadastro =
  ref(false)

const dialogDetalhes =
  ref(false)

const tecnicoSelecionado =
  ref(null)

const mostrarSenha =
  ref(false)

const formCadastro =
  ref(null)

const form =
  reactive({
    nome: '',
    email: '',
    telefone: '',
    senha: ''
  })

/* =========================
   TÉCNICOS
========================= */

const tecnicos =
  computed(() => {
    return usuarios.value.filter(
      (usuario) =>
        String(
          usuario.tipo_usuario || ''
        )
          .trim()
          .toUpperCase() ===
        'FUNCIONARIO'
    )
  })

const tecnicosFiltrados =
  computed(() => {
    const termo =
      String(
        pesquisa.value || ''
      )
        .trim()
        .toLowerCase()

    if (!termo) {
      return tecnicos.value
    }

    return tecnicos.value.filter(
      (tecnico) => {
        const texto =
          [
            tecnico.nome,
            tecnico.email,
            tecnico.telefone
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        return texto.includes(
          termo
        )
      }
    )
  })

const totalAtivos =
  computed(() => {
    return tecnicos.value.filter(
      (tecnico) =>
        tecnico.ativo !== false
    ).length
  })

const totalInativos =
  computed(() => {
    return tecnicos.value.filter(
      (tecnico) =>
        tecnico.ativo === false
    ).length
  })

/* =========================
   CARREGAR
========================= */

async function carregarTecnicos() {
  carregando.value =
    true

  try {
    const resposta =
      await usuarioService.listar()

    usuarios.value =
      Array.isArray(resposta)
        ? resposta
        : []

    carregadoUmaVez.value =
      true
  } catch (error) {
    console.error(
      'Erro ao carregar técnicos:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível carregar os técnicos.'
    })
  } finally {
    carregando.value =
      false
  }
}

/* =========================
   CADASTRO
========================= */

function abrirCadastro() {
  limparFormulario()

  dialogCadastro.value =
    true
}

function fecharCadastro() {
  if (salvando.value) {
    return
  }

  dialogCadastro.value =
    false

  limparFormulario()
}

function limparFormulario() {
  form.nome = ''
  form.email = ''
  form.telefone = ''
  form.senha = ''

  mostrarSenha.value =
    false
}

async function salvarTecnico() {
  const valido =
    await formCadastro.value
      ?.validate()

  if (!valido) {
    return
  }

  salvando.value =
    true

  try {
    const resposta =
      await usuarioService
        .criarFuncionario({
          nome:
            form.nome.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          telefone:
            form.telefone.trim(),

          senha:
            form.senha
        })

    $q.notify({
      type: 'positive',

      message:
        resposta.message ||
        'Técnico cadastrado com sucesso.'
    })

    dialogCadastro.value =
      false

    limparFormulario()

    await carregarTecnicos()
  } catch (error) {
    console.error(
      'Erro ao cadastrar técnico:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível cadastrar o técnico.'
    })
  } finally {
    salvando.value =
      false
  }
}

/* =========================
   DETALHES
========================= */

function visualizarTecnico(
  tecnico
) {
  tecnicoSelecionado.value =
    tecnico

  dialogDetalhes.value =
    true
}

/* =========================
   DESATIVAR
========================= */

function confirmarDesativacao(
  tecnico
) {
  $q.dialog({
    title:
      'Desativar técnico',

    message:
      `Deseja realmente desativar ${tecnico.nome}?`,

    cancel: {
      flat: true,
      label: 'Cancelar'
    },

    ok: {
      unelevated: true,
      color: 'negative',
      label: 'Desativar'
    },

    persistent: true
  }).onOk(
    async () => {
      await desativarTecnico(
        tecnico
      )
    }
  )
}

async function desativarTecnico(
  tecnico
) {
  try {
    await usuarioService
      .desativar(
        tecnico.id_usuario
      )

    $q.notify({
      type: 'positive',

      message:
        'Técnico desativado com sucesso.'
    })

    await carregarTecnicos()
  } catch (error) {
    console.error(
      'Erro ao desativar técnico:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível desativar o técnico.'
    })
  }
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

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return (
    emailRegex.test(valor) ||
    'Informe um e-mail válido.'
  )
}

function validarSenha(
  valor
) {
  if (!valor) {
    return true
  }

  return (
    String(valor).length >= 6 ||
    'A senha deve possuir pelo menos 6 caracteres.'
  )
}

/* =========================
   FORMATAÇÕES
========================= */

function iniciais(
  nome
) {
  const partes =
    String(
      nome || ''
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    partes.length === 0
  ) {
    return 'TC'
  }

  if (
    partes.length === 1
  ) {
    return partes[0]
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    partes[0][0] +
    partes[
      partes.length - 1
    ][0]
  ).toUpperCase()
}

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
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    )
    .format(objeto)
}

/* =========================
   INICIAR
========================= */

onMounted(() => {
  carregarTecnicos()
})
</script>

<style scoped>
.tecnicos-page {
  min-height: 100%;

  padding: 30px;

  background: #f5f6f8;
}

/* =========================
   TOPO
========================= */

.pagina-topo {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;
}

.pagina-topo h1 {
  margin: 0;

  color: #101828;

  font-size: 26px;

  font-weight: 900;
}

.pagina-topo p {
  margin: 5px 0 0;

  color: #667085;

  font-size: 12px;
}

.novo-btn {
  min-height: 43px;

  padding: 0 18px;

  border-radius: 10px;

  font-weight: 700;
}

/* =========================
   RESUMO
========================= */

.resumo-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 16px;

  margin-bottom: 17px;
}

.resumo-card {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 20px;

  border:
    1px solid #eaecf0;

  border-radius: 15px;

  background: #ffffff;
}

.resumo-icone {
  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 13px;
}

.resumo-icone--laranja {
  color: #f97316;

  background: #fff1e6;
}

.resumo-icone--verde {
  color: #16a34a;

  background: #f0fdf4;
}

.resumo-icone--cinza {
  color: #667085;

  background: #f2f4f7;
}

.resumo-numero {
  color: #101828;

  font-size: 23px;

  font-weight: 900;
}

.resumo-label {
  margin-top: 2px;

  color: #667085;

  font-size: 10px;
}

/* =========================
   LISTA
========================= */

.lista-card {
  padding: 22px;

  border:
    1px solid #eaecf0;

  border-radius: 16px;

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

.lista-cabecalho {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
}

.lista-titulo {
  color: #101828;

  font-size: 15px;

  font-weight: 900;
}

.lista-subtitulo {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 9px;
}

.filtros {
  display: flex;

  align-items: center;

  gap: 6px;
}

.pesquisa-input {
  width: 280px;
}

/* =========================
   TABELA
========================= */

.tabela-container {
  width: 100%;

  overflow-x: auto;

  margin-top: 21px;
}

.tecnicos-tabela {
  width: 100%;

  min-width: 800px;

  border-collapse: collapse;
}

.tecnicos-tabela th {
  padding: 12px 10px;

  border-bottom:
    1px solid #eaecf0;

  color: #98a2b3;

  font-size: 9px;

  font-weight: 800;

  text-align: left;

  text-transform: uppercase;

  letter-spacing: 0.4px;
}

.tecnicos-tabela td {
  padding: 14px 10px;

  border-bottom:
    1px solid #f2f4f7;

  color: #475467;

  font-size: 10px;

  vertical-align: middle;
}

.tecnicos-tabela tbody tr:hover {
  background: #fafafa;
}

.tecnico-identificacao {
  display: flex;

  align-items: center;

  gap: 10px;
}

.tecnico-avatar {
  width: 39px;

  height: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: #f97316;

  background: #fff1e6;

  font-size: 11px;

  font-weight: 900;
}

.tecnico-identificacao strong {
  display: block;

  color: #344054;

  font-size: 11px;
}

.tecnico-identificacao span {
  display: block;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 9px;
}

.acao-coluna {
  width: 75px;

  text-align: center !important;
}

/* =========================
   VAZIO / CARREGANDO
========================= */

.carregando,
.vazio {
  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #98a2b3;

  text-align: center;
}

.carregando {
  font-size: 11px;
}

.vazio-icone {
  width: 62px;

  height: 62px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 5px;

  border-radius: 18px;

  color: #f97316;

  background: #fff1e6;
}

.vazio strong {
  color: #475467;

  font-size: 12px;
}

.vazio span {
  font-size: 9px;
}

/* =========================
   DIALOG
========================= */

.cadastro-dialog,
.detalhes-dialog {
  width: 100%;

  max-width: 520px;

  border-radius: 18px;

  background: #ffffff;
}

.dialog-topo {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 22px;
}

.dialog-icone {
  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 13px;

  color: #f97316;

  background: #fff1e6;
}

.dialog-titulo {
  color: #101828;

  font-size: 16px;

  font-weight: 900;
}

.dialog-subtitulo {
  margin-top: 2px;

  color: #98a2b3;

  font-size: 9px;
}

.dialog-corpo {
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

.senha-aviso {
  display: flex;

  align-items: flex-start;

  gap: 7px;

  padding: 11px;

  border-radius: 9px;

  color: #667085;

  background: #f9fafb;

  font-size: 9px;

  line-height: 1.5;
}

.dialog-acoes {
  display: flex;

  justify-content: flex-end;

  gap: 7px;

  padding: 16px 22px;
}

/* =========================
   DETALHES
========================= */

.detalhes-avatar {
  width: 47px;

  height: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: #f97316;

  background: #fff1e6;

  font-size: 13px;

  font-weight: 900;
}

.detalhes-corpo {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 12px;

  padding: 22px;
}

.detalhe-item {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 13px;

  border-radius: 11px;

  background: #f9fafb;
}

.detalhe-item > .q-icon {
  color: #f97316;
}

.detalhe-item span {
  display: block;

  color: #98a2b3;

  font-size: 8px;
}

.detalhe-item strong {
  display: block;

  margin-top: 2px;

  overflow: hidden;

  color: #344054;

  font-size: 10px;

  text-overflow: ellipsis;
}

/* =========================
   DARK
========================= */

.tecnicos-page--dark {
  background: #0d0f12;
}

.tecnicos-page--dark
.pagina-topo h1,
.tecnicos-page--dark
.resumo-numero,
.tecnicos-page--dark
.lista-titulo {
  color: #f9fafb;
}

.tecnicos-page--dark
.resumo-card,
.tecnicos-page--dark
.lista-card,
.cadastro-dialog--dark {
  border-color: #292d33;

  background: #15181d;
}

.tecnicos-page--dark
.tecnicos-tabela th {
  border-color: #292d33;
}

.tecnicos-page--dark
.tecnicos-tabela td {
  border-color: #24282f;

  color: #d0d5dd;
}

.tecnicos-page--dark
.tecnicos-tabela tbody tr:hover {
  background: #1b1e24;
}

.tecnicos-page--dark
.tecnico-identificacao strong,
.cadastro-dialog--dark
.dialog-titulo,
.cadastro-dialog--dark
.campo label,
.cadastro-dialog--dark
.detalhe-item strong {
  color: #f2f4f7;
}

.cadastro-dialog--dark
.senha-aviso,
.cadastro-dialog--dark
.detalhe-item {
  background: #1b1e24;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 800px) {
  .tecnicos-page {
    padding: 22px;
  }

  .resumo-grid {
    grid-template-columns:
      1fr;
  }

  .lista-cabecalho {
    align-items: stretch;

    flex-direction: column;
  }

  .filtros {
    width: 100%;
  }

  .pesquisa-input {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .tecnicos-page {
    padding: 18px 14px;
  }

  .pagina-topo {
    align-items: stretch;

    flex-direction: column;
  }

  .pagina-topo h1 {
    font-size: 22px;
  }

  .novo-btn {
    width: 100%;
  }

  .lista-card {
    padding: 17px;
  }

  .cadastro-dialog,
  .detalhes-dialog {
    width: calc(
      100vw - 24px
    );
  }

  .detalhes-corpo {
    grid-template-columns:
      1fr;
  }
}
</style>