<template>
  <q-page class="perfil-page">
    <!-- CABEÇALHO -->
    <div class="pagina-cabecalho">
      <div class="pagina-titulo">
        Meu Perfil
      </div>

      <div class="pagina-subtitulo">
        Gerencie suas informações, propriedade e locais de atendimento.
      </div>
    </div>

    <div class="perfil-grid">
      <!-- ===================================== -->
      <!-- PERFIL -->
      <!-- ===================================== -->

      <div class="perfil-lateral">
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
            PRODUTOR
          </div>

          <div class="perfil-propriedade">
            <q-icon
              name="agriculture"
              size="19px"
            />

            <span>
              {{ propriedade.nome }}
            </span>
          </div>
        </div>
      </div>

      <!-- ===================================== -->
      <!-- CONTEÚDO -->
      <!-- ===================================== -->

      <div class="perfil-conteudo">
        <!-- INFORMAÇÕES PESSOAIS -->
        <div class="conteudo-card">
          <div class="card-cabecalho">
            <div>
              <div class="card-titulo">
                Informações pessoais
              </div>

              <div class="card-subtitulo">
                Dados utilizados para identificação e contato.
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
              v-model="form.documento"
              outlined
              label="CPF / Documento"
              :readonly="!editando"
            >
              <template #prepend>
                <q-icon name="badge" />
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

        <!-- ===================================== -->
        <!-- PROPRIEDADE + LOCAIS -->
        <!-- ===================================== -->

        <div class="conteudo-card">
          <div class="propriedade-cabecalho">
            <div class="propriedade-info">
              <div class="propriedade-icone">
                <q-icon
                  name="agriculture"
                  size="26px"
                />
              </div>

              <div>
                <div class="card-titulo">
                  {{ propriedade.nome }}
                </div>

                <div class="propriedade-localizacao">
                  <q-icon
                    name="location_on"
                    size="16px"
                  />

                  {{ propriedade.cidade }}
                  -
                  {{ propriedade.estado }}

                  <span v-if="propriedade.endereco">
                    • {{ propriedade.endereco }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <div class="locais-cabecalho">
            <div>
              <div class="locais-titulo">
                Locais de atendimento
              </div>

              <div class="card-subtitulo">
                Aviários, granjas, galpões e outros locais
                onde o técnico poderá realizar o atendimento.
              </div>
            </div>

            <q-btn
              unelevated
              no-caps
              color="orange"
              icon="add"
              label="Adicionar local"
              @click="abrirNovoLocal"
            />
          </div>

          <!-- CARREGANDO -->
          <div
            v-if="carregandoUnidades"
            class="estado-central"
          >
            <q-spinner
              color="orange"
              size="38px"
            />

            <div class="estado-texto">
              Carregando locais...
            </div>
          </div>

          <!-- SEM LOCAIS -->
          <div
            v-else-if="unidades.length === 0"
            class="estado-vazio"
          >
            <q-icon
              name="home_work"
              size="40px"
              color="grey-5"
            />

            <div class="estado-vazio-titulo">
              Nenhum local cadastrado
            </div>

            <div class="estado-vazio-texto">
              Cadastre o primeiro local da propriedade.
            </div>

            <q-btn
              outline
              no-caps
              color="orange"
              icon="add"
              label="Adicionar local"
              class="q-mt-md"
              @click="abrirNovoLocal"
            />
          </div>

          <!-- LISTA -->
          <div
            v-else
            class="unidades-lista"
          >
            <div
              v-for="unidade in unidades"
              :key="unidade.id_unidade"
              class="unidade-item"
            >
              <div class="unidade-principal">
                <div class="unidade-icone">
                  <q-icon
                    :name="iconeTipoUnidade(unidade.tipo_unidade)"
                    size="24px"
                  />
                </div>

                <div class="unidade-conteudo">
                  <div class="unidade-topo">
                    <div>
                      <div class="unidade-nome">
                        {{ unidade.nome_unidade }}
                      </div>

                      <div class="unidade-tipo">
                        {{ formatarTipoUnidade(unidade.tipo_unidade) }}
                      </div>
                    </div>

                    <q-btn
                      flat
                      round
                      dense
                      icon="more_vert"
                      color="grey-7"
                    >
                      <q-menu
                        anchor="bottom right"
                        self="top right"
                      >
                        <q-list style="min-width: 170px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="abrirEditarLocal(unidade)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                name="edit"
                                color="primary"
                              />
                            </q-item-section>

                            <q-item-section>
                              Editar
                            </q-item-section>
                          </q-item>

                          <q-item
                            clickable
                            v-close-popup
                            @click="confirmarDesativacao(unidade)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                name="block"
                                color="negative"
                              />
                            </q-item-section>

                            <q-item-section class="text-negative">
                              Desativar
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>

                  <div
                    v-if="unidade.descricao"
                    class="unidade-descricao"
                  >
                    {{ unidade.descricao }}
                  </div>

                  <div
                    v-if="unidade.referencia"
                    class="unidade-referencia"
                  >
                    <q-icon
                      name="near_me"
                      size="16px"
                    />

                    <span>
                      {{ unidade.referencia }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================== -->
        <!-- SEGURANÇA -->
        <!-- ===================================== -->

        <div class="conteudo-card">
          <div class="card-cabecalho seguranca-cabecalho">
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

    <!-- ===================================== -->
    <!-- DIALOG LOCAL -->
    <!-- ===================================== -->

    <q-dialog v-model="dialogLocal">
      <q-card class="local-dialog">
        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-titulo">
              {{
                editandoUnidade
                  ? 'Editar local'
                  : 'Adicionar local'
              }}
            </div>

            <div class="dialog-subtitulo">
              {{
                editandoUnidade
                  ? 'Atualize as informações do local.'
                  : 'Cadastre um novo local dentro da propriedade.'
              }}
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
          <q-select
            v-model="formUnidade.tipo_unidade"
            outlined
            emit-value
            map-options
            label="Tipo do local"
            :options="tiposUnidade"
          >
            <template #prepend>
              <q-icon name="category" />
            </template>
          </q-select>

          <q-input
            v-model="formUnidade.nome_unidade"
            outlined
            class="q-mt-md"
            label="Nome do local"
            placeholder="Ex.: Aviário 1"
            maxlength="100"
          >
            <template #prepend>
              <q-icon name="home_work" />
            </template>
          </q-input>

          <q-input
            v-model="formUnidade.descricao"
            outlined
            class="q-mt-md"
            label="Descrição"
            placeholder="Ex.: Aviário principal"
            maxlength="255"
          >
            <template #prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <q-input
            v-model="formUnidade.referencia"
            outlined
            class="q-mt-md"
            label="Referência para o técnico"
            placeholder="Ex.: Primeiro galpão após a entrada"
            maxlength="255"
          >
            <template #prepend>
              <q-icon name="location_on" />
            </template>
          </q-input>

          <div class="dica-local">
            <q-icon
              name="info"
              size="19px"
            />

            A referência ajudará o técnico a encontrar
            o local correto dentro da propriedade.
          </div>
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
            :label="
              editandoUnidade
                ? 'Salvar alterações'
                : 'Adicionar local'
            "
            :loading="salvandoUnidade"
            @click="salvarUnidade"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===================================== -->
    <!-- DESATIVAR -->
    <!-- ===================================== -->

    <q-dialog v-model="dialogDesativar">
      <q-card class="confirmacao-dialog">
        <q-card-section class="confirmacao-conteudo">
          <div class="confirmacao-icone">
            <q-icon
              name="block"
              size="32px"
            />
          </div>

          <div class="confirmacao-titulo">
            Desativar local?
          </div>

          <div class="confirmacao-texto">
            <strong>
              {{ unidadeSelecionada?.nome_unidade }}
            </strong>
            deixará de aparecer na criação de novos chamados.
          </div>
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
            color="negative"
            icon="block"
            label="Desativar"
            :loading="desativandoUnidade"
            @click="desativarUnidade"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===================================== -->
    <!-- ALTERAR SENHA -->
    <!-- ===================================== -->

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
            :type="mostrarSenhaAtual ? 'text' : 'password'"
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
                  mostrarSenhaAtual = !mostrarSenhaAtual
                "
              />
            </template>
          </q-input>

          <q-input
            v-model="novaSenha"
            outlined
            label="Nova senha"
            class="q-mt-md"
            :type="mostrarNovaSenha ? 'text' : 'password'"
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
                  mostrarNovaSenha = !mostrarNovaSenha
                "
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmarSenha"
            outlined
            label="Confirmar nova senha"
            class="q-mt-md"
            type="password"
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
  onMounted,
  reactive,
  ref
} from 'vue'

import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

import unidadePropriedadeService from
  'src/services/unidadePropriedadeService'

const $q = useQuasar()
const auth = useAuthStore()

/*
  Temporário.
  Depois vamos buscar automaticamente a propriedade
  vinculada ao produtor logado.
*/
const ID_PROPRIEDADE = 1

const editando = ref(false)
const salvando = ref(false)

const unidades = ref([])
const carregandoUnidades = ref(false)

const dialogLocal = ref(false)
const dialogDesativar = ref(false)
const dialogSenha = ref(false)

const editandoUnidade = ref(false)
const unidadeSelecionada = ref(null)

const salvandoUnidade = ref(false)
const desativandoUnidade = ref(false)

const senhaAtual = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')

const mostrarSenhaAtual = ref(false)
const mostrarNovaSenha = ref(false)

const tiposUnidade = [
  {
    label: 'Aviário',
    value: 'AVIARIO'
  },
  {
    label: 'Granja',
    value: 'GRANJA'
  },
  {
    label: 'Chiqueiro',
    value: 'CHIQUEIRO'
  },
  {
    label: 'Galpão',
    value: 'GALPAO'
  },
  {
    label: 'Silo',
    value: 'SILO'
  },
  {
    label: 'Depósito',
    value: 'DEPOSITO'
  },
  {
    label: 'Outro',
    value: 'OUTRO'
  }
]

const nomeUsuario = computed(() => {
  return (
    auth.usuario?.nome ||
    auth.nomeUsuario ||
    'Produtor'
  )
})

const iniciais = computed(() => {
  return nomeUsuario.value
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (nome) => nome.charAt(0)
    )
    .join('')
    .toUpperCase()
})

const form = reactive({
  nome:
    auth.usuario?.nome ||
    auth.nomeUsuario ||
    '',

  email:
    auth.usuario?.email ||
    '',

  telefone:
    auth.usuario?.telefone ||
    '',

  documento:
    auth.usuario?.cpf ||
    auth.usuario?.documento ||
    ''
})

const dadosOriginais = reactive({
  ...form
})

const propriedade = reactive({
  id_propriedade: ID_PROPRIEDADE,
  nome: 'Fazenda Boa Vista',
  cidade: 'Chapecó',
  estado: 'SC',
  endereco: 'Zona Rural'
})

const formUnidade = reactive({
  nome_unidade: '',
  tipo_unidade: 'AVIARIO',
  descricao: '',
  referencia: ''
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
      message: 'Informe o nome do produtor.'
    })

    return
  }

  salvando.value = true

  try {
    await new Promise(
      (resolve) => setTimeout(resolve, 400)
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

/* ========================================
   UNIDADES
======================================== */

async function carregarUnidades() {
  carregandoUnidades.value = true

  try {
    const resposta =
      await unidadePropriedadeService
        .listarPorPropriedade(
          propriedade.id_propriedade
        )

    unidades.value =
      Array.isArray(resposta)
        ? resposta
        : resposta?.data || []
  } catch (error) {
    console.error(
      'Erro ao carregar locais:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar os locais.'
    })
  } finally {
    carregandoUnidades.value = false
  }
}

function limparFormUnidade() {
  formUnidade.nome_unidade = ''
  formUnidade.tipo_unidade = 'AVIARIO'
  formUnidade.descricao = ''
  formUnidade.referencia = ''
}

function abrirNovoLocal() {
  editandoUnidade.value = false
  unidadeSelecionada.value = null

  limparFormUnidade()

  dialogLocal.value = true
}

function abrirEditarLocal(unidade) {
  editandoUnidade.value = true
  unidadeSelecionada.value = unidade

  formUnidade.nome_unidade =
    unidade.nome_unidade || ''

  formUnidade.tipo_unidade =
    unidade.tipo_unidade || 'OUTRO'

  formUnidade.descricao =
    unidade.descricao || ''

  formUnidade.referencia =
    unidade.referencia || ''

  dialogLocal.value = true
}

async function salvarUnidade() {
  if (!formUnidade.nome_unidade.trim()) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o nome do local.'
    })

    return
  }

  if (!formUnidade.tipo_unidade) {
    $q.notify({
      type: 'warning',
      message:
        'Selecione o tipo do local.'
    })

    return
  }

  salvandoUnidade.value = true

  try {
    const dados = {
      id_propriedade:
        propriedade.id_propriedade,

      nome_unidade:
        formUnidade.nome_unidade.trim(),

      tipo_unidade:
        formUnidade.tipo_unidade,

      descricao:
        formUnidade.descricao?.trim() || null,

      referencia:
        formUnidade.referencia?.trim() || null
    }

    if (editandoUnidade.value) {
      await unidadePropriedadeService.atualizar(
        unidadeSelecionada.value.id_unidade,
        {
          ...dados,
          ativo: true
        }
      )

      $q.notify({
        type: 'positive',
        message:
          'Local atualizado com sucesso.'
      })
    } else {
      await unidadePropriedadeService.criar(
        dados
      )

      $q.notify({
        type: 'positive',
        message:
          'Local adicionado com sucesso.'
      })
    }

    dialogLocal.value = false

    await carregarUnidades()
  } catch (error) {
    console.error(
      'Erro ao salvar local:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível salvar o local.'
    })
  } finally {
    salvandoUnidade.value = false
  }
}

function confirmarDesativacao(unidade) {
  unidadeSelecionada.value = unidade
  dialogDesativar.value = true
}

async function desativarUnidade() {
  if (!unidadeSelecionada.value) {
    return
  }

  desativandoUnidade.value = true

  try {
    await unidadePropriedadeService.desativar(
      unidadeSelecionada.value.id_unidade
    )

    dialogDesativar.value = false

    $q.notify({
      type: 'positive',
      message:
        'Local desativado com sucesso.'
    })

    await carregarUnidades()
  } catch (error) {
    console.error(
      'Erro ao desativar local:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível desativar o local.'
    })
  } finally {
    desativandoUnidade.value = false
  }
}

function formatarTipoUnidade(tipo) {
  const tipos = {
    AVIARIO: 'Aviário',
    GRANJA: 'Granja',
    CHIQUEIRO: 'Chiqueiro',
    GALPAO: 'Galpão',
    SILO: 'Silo',
    DEPOSITO: 'Depósito',
    OUTRO: 'Outro'
  }

  return tipos[tipo] || tipo
}

function iconeTipoUnidade(tipo) {
  const icones = {
    AVIARIO: 'egg_alt',
    GRANJA: 'agriculture',
    CHIQUEIRO: 'pets',
    GALPAO: 'warehouse',
    SILO: 'storage',
    DEPOSITO: 'inventory_2',
    OUTRO: 'home_work'
  }

  return icones[tipo] || 'home_work'
}

/* ========================================
   SENHA
======================================== */

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

onMounted(carregarUnidades)
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

.perfil-propriedade {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 16px;
  color: #667085;
  font-size: 13px;
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
.locais-cabecalho,
.propriedade-cabecalho {
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

/* PROPRIEDADE */

.propriedade-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.propriedade-icone {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 15px;
  color: #f97316;
  background: #fff1e6;
}

.propriedade-localizacao {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: #667085;
  font-size: 12px;
}

.locais-cabecalho {
  align-items: center;
  margin-bottom: 18px;
}

.locais-titulo {
  color: #344054;
  font-size: 15px;
  font-weight: 800;
}

/* LOCAIS */

.unidades-lista {
  display: flex;
  flex-direction: column;
}

.unidade-item {
  padding: 18px 0;
  border-top: 1px solid #eaecf0;
}

.unidade-item:first-child {
  border-top: none;
}

.unidade-principal {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.unidade-icone {
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

.unidade-conteudo {
  min-width: 0;
  flex: 1;
}

.unidade-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.unidade-nome {
  color: #101828;
  font-size: 15px;
  font-weight: 800;
}

.unidade-tipo {
  margin-top: 2px;
  color: #f97316;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
}

.unidade-descricao {
  margin-top: 7px;
  color: #667085;
  font-size: 12px;
}

.unidade-referencia {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #98a2b3;
  font-size: 11px;
}

/* ESTADOS */

.estado-central,
.estado-vazio {
  padding: 34px 18px;
  text-align: center;
}

.estado-texto,
.estado-vazio-texto {
  margin-top: 9px;
  color: #98a2b3;
  font-size: 12px;
}

.estado-vazio-titulo {
  margin-top: 10px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

/* DIALOG */

.local-dialog,
.senha-dialog {
  width: 540px;
  max-width: 92vw;
  border-radius: 20px;
}

.confirmacao-dialog {
  width: 430px;
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

.dica-local {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  color: #9a3412;
  background: #fff7ed;
  font-size: 11px;
}

.confirmacao-conteudo {
  padding: 28px 28px 18px;
  text-align: center;
}

.confirmacao-icone {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 17px;
  color: #dc2626;
  background: #fee2e2;
}

.confirmacao-titulo {
  margin-top: 15px;
  color: #101828;
  font-size: 18px;
  font-weight: 800;
}

.confirmacao-texto {
  margin-top: 8px;
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
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
.body--dark .locais-titulo,
.body--dark .unidade-nome,
.body--dark .estado-vazio-titulo,
.body--dark .dialog-titulo,
.body--dark .confirmacao-titulo {
  color: #f9fafb;
}

.body--dark .pagina-subtitulo,
.body--dark .card-subtitulo,
.body--dark .perfil-propriedade,
.body--dark .propriedade-localizacao,
.body--dark .unidade-descricao {
  color: #98a2b3;
}

.body--dark .avatar-editar {
  border-color: #16191f;
}

.body--dark .unidade-item {
  border-color: #2b2f36;
}

.body--dark .dica-local {
  color: #fdba74;
  background: #292018;
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .locais-cabecalho {
    align-items: stretch;
    flex-direction: column;
  }

  .locais-cabecalho .q-btn {
    width: 100%;
  }

  .seguranca-cabecalho {
    align-items: stretch;
    flex-direction: column;
  }

  .seguranca-cabecalho .q-btn {
    width: 100%;
  }
}
</style>