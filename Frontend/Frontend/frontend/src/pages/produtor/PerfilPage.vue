<template>
  <q-page
    class="perfil-page"
    :class="{
      'perfil-page--dark':
        $q.dark.isActive
    }"
  >
    <!-- CABEÇALHO -->
    <div class="pagina-cabecalho">
      <div class="pagina-titulo">
        Meu Perfil
      </div>

      <div class="pagina-subtitulo">
        Gerencie suas informações e os dados da sua propriedade.
      </div>
    </div>

    <div class="perfil-grid">
      <!-- =====================================
           LATERAL
      ====================================== -->

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
              {{
                propriedade
                  ? propriedade.nome_propriedade
                  : 'Sem propriedade'
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- =====================================
           CONTEÚDO
      ====================================== -->

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

        <!-- =====================================
             MINHA PROPRIEDADE
        ====================================== -->

        <div class="conteudo-card">
          <div class="card-cabecalho propriedade-topo">
            <div>
              <div class="card-titulo">
                Minha propriedade
              </div>

              <div class="card-subtitulo">
                Estes dados serão utilizados automaticamente nos seus chamados.
              </div>
            </div>

            <q-btn
              v-if="propriedade"
              outline
              no-caps
              color="orange"
              icon="edit"
              label="Editar propriedade"
              @click="abrirEditarPropriedade"
            />
          </div>

          <!-- CARREGANDO -->
          <div
            v-if="carregandoPropriedade"
            class="estado-central"
          >
            <q-spinner
              color="orange"
              size="38px"
            />

            <div class="estado-texto">
              Carregando propriedade...
            </div>
          </div>

          <!-- PROPRIEDADE EXISTE -->
          <template
            v-else-if="propriedade"
          >
            <div class="propriedade-resumo">
              <div class="propriedade-icone">
                <q-icon
                  name="agriculture"
                  size="27px"
                />
              </div>

              <div class="propriedade-dados">
                <div class="propriedade-nome">
                  {{
                    propriedade.nome_propriedade
                  }}
                </div>

                <div
                  v-if="localizacaoTexto"
                  class="propriedade-local"
                >
                  <q-icon
                    name="location_on"
                    size="16px"
                  />

                  {{ localizacaoTexto }}
                </div>

                <div
                  v-if="propriedade.cep"
                  class="propriedade-cep"
                >
                  CEP:
                  {{ propriedade.cep }}
                </div>
              </div>
            </div>

            <div class="mapa-perfil">
              <MapaLocalizacao
                :latitude="
                  propriedade.latitude
                "
                :longitude="
                  propriedade.longitude
                "
                :nome-local="
                  propriedade.nome_propriedade
                "
                :endereco="
                  enderecoMapa
                "
                titulo="Localização da propriedade"
                subtitulo="Esta localização será enviada automaticamente para o técnico."
              />
            </div>
          </template>

          <!-- SEM PROPRIEDADE -->
          <div
            v-else
            class="sem-propriedade"
          >
            <div class="sem-propriedade-icone">
              <q-icon
                name="add_location_alt"
                size="34px"
              />
            </div>

            <div class="sem-propriedade-titulo">
              Nenhuma propriedade cadastrada
            </div>

            <div class="sem-propriedade-texto">
              Cadastre sua propriedade uma única vez.
              Depois, a localização será utilizada automaticamente nos chamados.
            </div>

            <q-btn
              unelevated
              no-caps
              color="orange"
              icon="add"
              label="Cadastrar propriedade"
              class="q-mt-lg"
              @click="abrirCadastrarPropriedade"
            />
          </div>
        </div>

        <!-- =====================================
             SEGURANÇA
        ====================================== -->

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

    <!-- =====================================
         CADASTRAR / EDITAR PROPRIEDADE
    ====================================== -->

    <q-dialog
      v-model="dialogPropriedade"
      persistent
    >
      <q-card class="propriedade-dialog">
        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-titulo">
              {{
                editandoPropriedade
                  ? 'Editar propriedade'
                  : 'Cadastrar propriedade'
              }}
            </div>

            <div class="dialog-subtitulo">
              {{
                editandoPropriedade
                  ? 'Atualize os dados e a localização da propriedade.'
                  : 'Cadastre sua propriedade e marque sua localização no mapa.'
              }}
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            :disable="salvandoPropriedade"
            @click="
              dialogPropriedade = false
            "
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-conteudo">
          <div class="propriedade-form-grid">
            <q-input
              v-model="
                formPropriedade.nome_propriedade
              "
              outlined
              label="Nome da propriedade"
              placeholder="Ex.: Fazenda Boa Vista"
              class="campo-largo"
            >
              <template #prepend>
                <q-icon name="agriculture" />
              </template>
            </q-input>

            <q-input
              v-model="
                formPropriedade.cidade
              "
              outlined
              label="Cidade"
              placeholder="Ex.: Chapecó"
            >
              <template #prepend>
                <q-icon name="location_city" />
              </template>
            </q-input>

            <q-input
              v-model="
                formPropriedade.estado
              "
              outlined
              label="UF"
              maxlength="2"
              placeholder="SC"
              @update:model-value="
                formPropriedade.estado =
                  String(
                    formPropriedade.estado || ''
                  ).toUpperCase()
              "
            />

            <q-input
              v-model="
                formPropriedade.endereco
              "
              outlined
              label="Endereço / Linha"
              placeholder="Ex.: Linha Água Amarela, s/n"
              class="campo-largo"
            >
              <template #prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <q-input
              v-model="
                formPropriedade.cep
              "
              outlined
              label="CEP"
              mask="#####-###"
            >
              <template #prepend>
                <q-icon name="markunread_mailbox" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-lg">
            <MapaSeletorLocalizacao
              v-model:latitude="
                formPropriedade.latitude
              "
              v-model:longitude="
                formPropriedade.longitude
              "
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="right"
          class="dialog-acoes"
        >
          <q-btn
            flat
            no-caps
            color="grey-7"
            label="Cancelar"
            :disable="salvandoPropriedade"
            @click="
              dialogPropriedade = false
            "
          />

          <q-btn
            unelevated
            no-caps
            color="orange"
            icon="save"
            :label="
              editandoPropriedade
                ? 'Salvar alterações'
                : 'Cadastrar propriedade'
            "
            :loading="salvandoPropriedade"
            @click="salvarPropriedade"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =====================================
         ALTERAR SENHA
    ====================================== -->

    <q-dialog
      v-model="dialogSenha"
    >
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

import {
  useQuasar
} from 'quasar'

import {
  useAuthStore
} from 'src/stores/auth'

import propriedadeService from
  'src/services/propriedadeService'

import MapaLocalizacao from
  'src/components/shared/MapaLocalizacao.vue'

import MapaSeletorLocalizacao from
  'src/components/shared/MapaSeletorLocalizacao.vue'

const $q =
  useQuasar()

const auth =
  useAuthStore()

/* =========================
   USUÁRIO
========================= */

const editando =
  ref(false)

const salvando =
  ref(false)

const nomeUsuario =
  computed(() => {
    return (
      auth.usuario?.nome ||
      auth.nomeUsuario ||
      'Produtor'
    )
  })

const iniciais =
  computed(() => {
    return nomeUsuario.value
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        nome =>
          nome.charAt(0)
      )
      .join('')
      .toUpperCase()
  })

const form =
  reactive({
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

const dadosOriginais =
  reactive({
    ...form
  })

function iniciarEdicao() {
  Object.assign(
    dadosOriginais,
    form
  )

  editando.value =
    true
}

function cancelarEdicao() {
  Object.assign(
    form,
    dadosOriginais
  )

  editando.value =
    false
}

/*
  Mantive essa parte do jeito
  que já estava.

  Depois ligamos com o backend
  de usuário.
*/
async function salvarDados() {
  if (
    !form.nome.trim()
  ) {
    $q.notify({
      type: 'warning',
      message:
        'Informe o nome do produtor.'
    })

    return
  }

  salvando.value =
    true

  try {
    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          400
        )
    )

    Object.assign(
      dadosOriginais,
      form
    )

    editando.value =
      false

    $q.notify({
      type: 'positive',

      message:
        'Dados atualizados com sucesso.'
    })
  } finally {
    salvando.value =
      false
  }
}

/* =========================
   PROPRIEDADE
========================= */

const propriedade =
  ref(null)

const carregandoPropriedade =
  ref(false)

const dialogPropriedade =
  ref(false)

const editandoPropriedade =
  ref(false)

const salvandoPropriedade =
  ref(false)

const formPropriedade =
  reactive({
    nome_propriedade: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    latitude: null,
    longitude: null,

    cultura_principal:
      'AVES',

    quantidade_galpoes:
      0
  })

const localizacaoTexto =
  computed(() => {
    if (!propriedade.value) {
      return ''
    }

    return [
      propriedade.value
        .endereco,

      propriedade.value
        .cidade,

      propriedade.value
        .estado
    ]
      .filter(Boolean)
      .join(' • ')
  })

const enderecoMapa =
  computed(() => {
    if (!propriedade.value) {
      return ''
    }

    return [
      propriedade.value
        .endereco,

      propriedade.value
        .cidade,

      propriedade.value
        .estado
    ]
      .filter(Boolean)
      .join(' - ')
  })

async function carregarPropriedade() {
  const idUsuario =
    Number(
      auth.usuario
        ?.id_usuario
    )

  if (
    !Number.isInteger(
      idUsuario
    ) ||
    idUsuario <= 0
  ) {
    console.error(
      'Usuário logado sem id_usuario.'
    )

    return
  }

  carregandoPropriedade.value =
    true

  try {
    propriedade.value =
      await propriedadeService
        .buscarPorUsuario(
          idUsuario
        )
  } catch (error) {
    console.error(
      'Erro ao carregar propriedade:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível carregar a propriedade.'
    })
  } finally {
    carregandoPropriedade.value =
      false
  }
}

function limparFormPropriedade() {
  formPropriedade
    .nome_propriedade = ''

  formPropriedade
    .endereco = ''

  formPropriedade
    .cidade = ''

  formPropriedade
    .estado = ''

  formPropriedade
    .cep = ''

  formPropriedade
    .latitude = null

  formPropriedade
    .longitude = null

  formPropriedade
    .cultura_principal =
      'AVES'

  formPropriedade
    .quantidade_galpoes =
      0
}

function abrirCadastrarPropriedade() {
  editandoPropriedade.value =
    false

  limparFormPropriedade()

  dialogPropriedade.value =
    true
}

function abrirEditarPropriedade() {
  if (!propriedade.value) {
    return
  }

  editandoPropriedade.value =
    true

  formPropriedade
    .nome_propriedade =
      propriedade.value
        .nome_propriedade ||
      ''

  formPropriedade
    .endereco =
      propriedade.value
        .endereco ||
      ''

  formPropriedade
    .cidade =
      propriedade.value
        .cidade ||
      ''

  formPropriedade
    .estado =
      propriedade.value
        .estado ||
      ''

  formPropriedade
    .cep =
      propriedade.value
        .cep ||
      ''

  formPropriedade
    .latitude =
      propriedade.value
        .latitude ??
      null

  formPropriedade
    .longitude =
      propriedade.value
        .longitude ??
      null

  formPropriedade
    .cultura_principal =
      propriedade.value
        .cultura_principal ||
      'AVES'

  formPropriedade
    .quantidade_galpoes =
      Number(
        propriedade.value
          .quantidade_galpoes ||
        0
      )

  dialogPropriedade.value =
    true
}

function coordenadasFormularioValidas() {
  const latitude =
    Number(
      formPropriedade.latitude
    )

  const longitude =
    Number(
      formPropriedade.longitude
    )

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(
      latitude === 0 &&
      longitude === 0
    )
  )
}

function validarPropriedade() {
  if (
    !formPropriedade
      .nome_propriedade
      .trim()
  ) {
    $q.notify({
      type: 'warning',

      message:
        'Informe o nome da propriedade.'
    })

    return false
  }

  if (
    !formPropriedade
      .cidade
      .trim()
  ) {
    $q.notify({
      type: 'warning',

      message:
        'Informe a cidade.'
    })

    return false
  }

  if (
    !formPropriedade
      .estado
      .trim()
  ) {
    $q.notify({
      type: 'warning',

      message:
        'Informe o estado.'
    })

    return false
  }

  if (
    !coordenadasFormularioValidas()
  ) {
    $q.notify({
      type: 'warning',

      timeout: 4500,

      message:
        'Marque a localização da propriedade no mapa.'
    })

    return false
  }

  return true
}

async function salvarPropriedade() {
  if (
    !validarPropriedade()
  ) {
    return
  }

  const idUsuario =
    Number(
      auth.usuario
        ?.id_usuario
    )

  if (
    !Number.isInteger(
      idUsuario
    ) ||
    idUsuario <= 0
  ) {
    $q.notify({
      type: 'negative',

      message:
        'Não foi possível identificar o produtor logado.'
    })

    return
  }

  salvandoPropriedade.value =
    true

  try {
    const dados = {
      id_usuario:
        idUsuario,

      nome_propriedade:
        formPropriedade
          .nome_propriedade
          .trim(),

      endereco:
        formPropriedade
          .endereco
          .trim() ||
        null,

      cidade:
        formPropriedade
          .cidade
          .trim(),

      estado:
        formPropriedade
          .estado
          .trim()
          .toUpperCase(),

      cep:
        formPropriedade
          .cep
          .trim() ||
        null,

      latitude:
        Number(
          formPropriedade.latitude
        ),

      longitude:
        Number(
          formPropriedade.longitude
        ),

      cultura_principal:
        formPropriedade
          .cultura_principal ||
        'AVES',

      quantidade_galpoes:
        Number(
          formPropriedade
            .quantidade_galpoes ||
          0
        ),

      ativo:
        true
    }

    if (
      editandoPropriedade.value
    ) {
      propriedade.value =
        await propriedadeService
          .atualizar(
            propriedade.value
              .id_propriedade,

            dados
          )

      $q.notify({
        type: 'positive',

        message:
          'Propriedade atualizada com sucesso.'
      })
    } else {
      propriedade.value =
        await propriedadeService
          .criar(
            dados
          )

      $q.notify({
        type: 'positive',

        message:
          'Propriedade cadastrada com sucesso.'
      })
    }

    dialogPropriedade.value =
      false

    await carregarPropriedade()
  } catch (error) {
    console.error(
      'Erro ao salvar propriedade:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível salvar a propriedade.'
    })
  } finally {
    salvandoPropriedade.value =
      false
  }
}

/* =========================
   SENHA
========================= */

const dialogSenha =
  ref(false)

const senhaAtual =
  ref('')

const novaSenha =
  ref('')

const confirmarSenha =
  ref('')

const mostrarSenhaAtual =
  ref(false)

const mostrarNovaSenha =
  ref(false)

function abrirAlteracaoSenha() {
  senhaAtual.value = ''
  novaSenha.value = ''
  confirmarSenha.value = ''

  dialogSenha.value =
    true
}

/*
  Mantive a lógica atual.
  Depois conectamos com backend.
*/
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

  if (
    novaSenha.value.length <
    6
  ) {
    $q.notify({
      type: 'warning',

      message:
        'A nova senha deve possuir pelo menos 6 caracteres.'
    })

    return
  }

  dialogSenha.value =
    false

  $q.notify({
    type: 'positive',

    message:
      'Senha alterada com sucesso.'
  })
}

onMounted(() => {
  carregarPropriedade()
})
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
  border:
    1px solid #eaecf0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 3px 10px
    rgba(
      16,
      24,
      40,
      0.05
    );
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

  border:
    3px solid #ffffff;
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

.card-cabecalho {
  display: flex;

  align-items: flex-start;

  justify-content:
    space-between;

  gap: 20px;

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
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 16px;
}

.acoes-edicao {
  display: flex;

  justify-content:
    flex-end;

  gap: 10px;

  margin-top: 22px;
}

/* =========================
   PROPRIEDADE
========================= */

.propriedade-resumo {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 4px 0 20px;
}

.propriedade-icone {
  width: 55px;

  height: 55px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 15px;

  color: #f97316;

  background: #fff1e6;
}

.propriedade-dados {
  min-width: 0;
}

.propriedade-nome {
  color: #101828;

  font-size: 17px;

  font-weight: 800;
}

.propriedade-local {
  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 5px;

  color: #667085;

  font-size: 12px;
}

.propriedade-cep {
  margin-top: 3px;

  color: #98a2b3;

  font-size: 10px;
}

.mapa-perfil {
  margin-top: 2px;
}

/* SEM PROPRIEDADE */

.sem-propriedade {
  padding: 42px 20px;

  text-align: center;
}

.sem-propriedade-icone {
  width: 65px;

  height: 65px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto;

  border-radius: 18px;

  color: #f97316;

  background: #fff1e6;
}

.sem-propriedade-titulo {
  margin-top: 15px;

  color: #344054;

  font-size: 16px;

  font-weight: 800;
}

.sem-propriedade-texto {
  max-width: 470px;

  margin:
    7px auto 0;

  color: #667085;

  font-size: 12px;

  line-height: 1.6;
}

.estado-central {
  padding: 45px 20px;

  text-align: center;
}

.estado-texto {
  margin-top: 9px;

  color: #98a2b3;

  font-size: 12px;
}

/* =========================
   DIALOG
========================= */

.propriedade-dialog {
  width: 820px;

  max-width: 94vw;

  border-radius: 20px;
}

.senha-dialog {
  width: 540px;

  max-width: 92vw;

  border-radius: 20px;
}

.dialog-header {
  display: flex;

  align-items: flex-start;

  justify-content:
    space-between;

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

.dialog-conteudo {
  max-height: 72vh;

  overflow-y: auto;

  padding: 22px 24px;
}

.dialog-acoes {
  padding:
    16px 24px 20px;
}

.propriedade-form-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    130px;

  gap: 15px;
}

.campo-largo {
  grid-column:
    1 / -1;
}

/* =========================
   DARK
========================= */

.perfil-page--dark {
  background: #0d0f12;
}

.perfil-page--dark
.perfil-card,
.perfil-page--dark
.conteudo-card {
  border-color: #2b2f36;

  background: #16191f;
}

.perfil-page--dark
.pagina-titulo,
.perfil-page--dark
.perfil-nome,
.perfil-page--dark
.card-titulo,
.perfil-page--dark
.propriedade-nome,
.perfil-page--dark
.sem-propriedade-titulo {
  color: #f9fafb;
}

.perfil-page--dark
.pagina-subtitulo,
.perfil-page--dark
.card-subtitulo,
.perfil-page--dark
.perfil-propriedade,
.perfil-page--dark
.propriedade-local,
.perfil-page--dark
.sem-propriedade-texto {
  color: #98a2b3;
}

.perfil-page--dark
.avatar-editar {
  border-color: #16191f;
}

.perfil-page--dark
.propriedade-icone,
.perfil-page--dark
.sem-propriedade-icone {
  color: #fb923c;

  background: #292018;
}

/* =====================================
   TABLET
===================================== */

@media (
  max-width: 1000px
) {
  .perfil-grid {
    grid-template-columns:
      1fr;
  }
}

/* =====================================
   MOBILE
===================================== */

@media (
  max-width: 700px
) {
  .perfil-page {
    padding:
      22px 16px 40px;
  }

  .pagina-titulo {
    font-size: 25px;
  }

  .form-grid {
    grid-template-columns:
      1fr;
  }

  .card-cabecalho,
  .seguranca-cabecalho,
  .propriedade-topo {
    align-items: stretch;

    flex-direction: column;
  }

  .card-cabecalho
  .q-btn,
  .seguranca-cabecalho
  .q-btn,
  .propriedade-topo
  .q-btn {
    width: 100%;
  }

  .propriedade-form-grid {
    grid-template-columns:
      1fr;
  }

  .campo-largo {
    grid-column:
      auto;
  }

  .conteudo-card {
    padding: 20px;
  }

  .propriedade-dialog {
    width: 96vw;

    max-width: 96vw;
  }
}
</style>