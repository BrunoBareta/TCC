<template>
  <q-page
    class="cadastro-page"
    :class="{
      'cadastro-page--dark':
        $q.dark.isActive
    }"
  >
    <div class="cadastro-container">
      <!-- CABEÇALHO -->
      <div class="cadastro-topo">
        <button
          type="button"
          class="voltar-btn"
          @click="voltarLogin"
        >
          <q-icon
            name="arrow_back"
            size="20px"
          />

          Voltar para o login
        </button>

        <div class="marca">
          <div class="marca-icone">
            <q-icon
              name="agriculture"
              size="27px"
            />
          </div>

          <div>
            <div class="marca-nome">
              Avioeste
            </div>

            <div class="marca-subtitulo">
              Portal de Atendimento
            </div>
          </div>
        </div>
      </div>

      <!-- CONTEÚDO -->
      <div class="cadastro-box">
        <div class="cadastro-cabecalho">
          <div class="cadastro-titulo">
            Criar minha conta
          </div>

          <div class="cadastro-descricao">
            Cadastre seus dados e sua propriedade
            para começar a utilizar o portal.
          </div>
        </div>

        <!-- PROGRESSO -->
        <div class="etapas">
          <div
            class="etapa"
            :class="{
              ativa:
                etapaAtual === 1,

              concluida:
                etapaAtual > 1
            }"
          >
            <div class="etapa-numero">
              <q-icon
                v-if="etapaAtual > 1"
                name="check"
                size="17px"
              />

              <span v-else>
                1
              </span>
            </div>

            <div>
              <strong>
                Seus dados
              </strong>

              <span>
                Informações pessoais
              </span>
            </div>
          </div>

          <div class="etapa-linha" />

          <div
            class="etapa"
            :class="{
              ativa:
                etapaAtual === 2
            }"
          >
            <div class="etapa-numero">
              2
            </div>

            <div>
              <strong>
                Propriedade
              </strong>

              <span>
                Dados e localização
              </span>
            </div>
          </div>
        </div>

        <!-- =================================
             ETAPA 1
        ================================== -->

        <div
          v-if="etapaAtual === 1"
          class="etapa-conteudo"
        >
          <div class="secao-titulo">
            Dados pessoais
          </div>

          <div class="secao-subtitulo">
            Informe os dados que serão utilizados
            para acessar sua conta.
          </div>

          <div class="form-grid">
            <q-input
              v-model="formUsuario.nome"
              outlined
              label="Nome completo"
              class="campo-largo"
              maxlength="150"
            >
              <template #prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <q-input
              v-model="formUsuario.email"
              outlined
              label="E-mail"
              type="email"
              class="campo-largo"
            >
              <template #prepend>
                <q-icon name="mail_outline" />
              </template>
            </q-input>

            <q-input
              v-model="formUsuario.telefone"
              outlined
              label="Telefone"
              mask="(##) #####-####"
            >
              <template #prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <q-input
              v-model="formUsuario.cpf_cnpj"
              outlined
              label="CPF / CNPJ"
            >
              <template #prepend>
                <q-icon name="badge" />
              </template>
            </q-input>

            <q-input
              v-model="formUsuario.senha"
              outlined
              label="Senha"
              :type="
                mostrarSenha
                  ? 'text'
                  : 'password'
              "
            >
              <template #prepend>
                <q-icon name="lock_outline" />
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

            <q-input
              v-model="confirmarSenha"
              outlined
              label="Confirmar senha"
              :type="
                mostrarConfirmacao
                  ? 'text'
                  : 'password'
              "
            >
              <template #prepend>
                <q-icon name="verified_user" />
              </template>

              <template #append>
                <q-icon
                  :name="
                    mostrarConfirmacao
                      ? 'visibility_off'
                      : 'visibility'
                  "
                  class="cursor-pointer"
                  @click="
                    mostrarConfirmacao =
                      !mostrarConfirmacao
                  "
                />
              </template>
            </q-input>
          </div>

          <div class="senha-ajuda">
            <q-icon
              name="info_outline"
              size="16px"
            />

            A senha deve possuir pelo menos 6 caracteres.
          </div>

          <div class="acoes">
            <q-btn
              unelevated
              no-caps
              color="orange"
              icon-right="arrow_forward"
              label="Continuar"
              @click="avancar"
            />
          </div>
        </div>

        <!-- =================================
             ETAPA 2
        ================================== -->

        <div
          v-else
          class="etapa-conteudo"
        >
          <div class="secao-titulo">
            Sua propriedade
          </div>

          <div class="secao-subtitulo">
            Essas informações serão utilizadas automaticamente
            quando você abrir um chamado.
          </div>

          <div class="form-grid propriedade-grid">
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
              v-model="formPropriedade.endereco"
              outlined
              label="Endereço / Linha"
              placeholder="Ex.: Linha São José, s/n"
              class="campo-largo"
            >
              <template #prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <q-input
              v-model="formPropriedade.cidade"
              outlined
              label="Cidade"
            >
              <template #prepend>
                <q-icon name="location_city" />
              </template>
            </q-input>

            <q-input
              v-model="formPropriedade.estado"
              outlined
              label="UF"
              maxlength="2"
              @update:model-value="
                normalizarEstado
              "
            />

            <q-input
              v-model="formPropriedade.cep"
              outlined
              label="CEP"
              mask="#####-###"
            >
              <template #prepend>
                <q-icon name="markunread_mailbox" />
              </template>
            </q-input>
          </div>

          <!-- MAPA -->
          <div class="mapa-container">
            <MapaSeletorLocalizacao
              v-model:latitude="
                formPropriedade.latitude
              "
              v-model:longitude="
                formPropriedade.longitude
              "
            />
          </div>

          <div class="acoes acoes-duplas">
            <q-btn
              flat
              no-caps
              color="grey-7"
              icon="arrow_back"
              label="Voltar"
              :disable="salvando"
              @click="
                etapaAtual = 1
              "
            />

            <q-btn
              unelevated
              no-caps
              color="orange"
              icon="check"
              label="Criar minha conta"
              :loading="salvando"
              @click="finalizarCadastro"
            />
          </div>
        </div>
      </div>

      <div class="ja-possui">
        Já possui uma conta?

        <button
          type="button"
          @click="voltarLogin"
        >
          Entrar
        </button>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {
  reactive,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import usuarioService from
  'src/services/usuarioService'

import propriedadeService from
  'src/services/propriedadeService'

import MapaSeletorLocalizacao from
  'src/components/shared/MapaSeletorLocalizacao.vue'

const router =
  useRouter()

const $q =
  useQuasar()

const etapaAtual =
  ref(1)

const salvando =
  ref(false)

const mostrarSenha =
  ref(false)

const mostrarConfirmacao =
  ref(false)

const confirmarSenha =
  ref('')

const formUsuario =
  reactive({
    nome: '',
    telefone: '',
    email: '',
    cpf_cnpj: '',
    senha: ''
  })

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

/* =========================
   ETAPA 1
========================= */

function validarUsuario() {
  if (
    !formUsuario.nome.trim()
  ) {
    aviso(
      'Informe seu nome.'
    )

    return false
  }

  if (
    !formUsuario.email.trim()
  ) {
    aviso(
      'Informe seu e-mail.'
    )

    return false
  }

  /*
    Validação simples de e-mail
  */
  const regexEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (
    !regexEmail.test(
      formUsuario.email.trim()
    )
  ) {
    aviso(
      'Informe um e-mail válido.'
    )

    return false
  }

  if (
    !formUsuario.telefone.trim()
  ) {
    aviso(
      'Informe seu telefone.'
    )

    return false
  }

  if (
    !formUsuario.senha
  ) {
    aviso(
      'Informe uma senha.'
    )

    return false
  }

  if (
    formUsuario.senha.length <
    6
  ) {
    aviso(
      'A senha deve possuir pelo menos 6 caracteres.'
    )

    return false
  }

  if (
    formUsuario.senha !==
    confirmarSenha.value
  ) {
    aviso(
      'As senhas não coincidem.'
    )

    return false
  }

  return true
}

function avancar() {
  if (
    !validarUsuario()
  ) {
    return
  }

  etapaAtual.value =
    2
}

/* =========================
   PROPRIEDADE
========================= */

function coordenadasValidas() {
  if (
    formPropriedade.latitude === null ||
    formPropriedade.longitude === null
  ) {
    return false
  }

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
    aviso(
      'Informe o nome da propriedade.'
    )

    return false
  }

  if (
    !formPropriedade.cidade.trim()
  ) {
    aviso(
      'Informe a cidade da propriedade.'
    )

    return false
  }

  if (
    !formPropriedade.estado.trim()
  ) {
    aviso(
      'Informe o estado.'
    )

    return false
  }

  if (
    formPropriedade
      .estado
      .trim()
      .length !== 2
  ) {
    aviso(
      'Informe a UF com 2 letras.'
    )

    return false
  }

  if (
    !coordenadasValidas()
  ) {
    aviso(
      'Use sua localização ou marque a propriedade no mapa.'
    )

    return false
  }

  return true
}

/* =========================
   CADASTRO
========================= */

async function finalizarCadastro() {
  if (
    !validarUsuario() ||
    !validarPropriedade()
  ) {
    return
  }

  salvando.value =
    true

  let idUsuarioCriado =
    null

  try {
    /*
      1. CRIA O PRODUTOR
    */
    const usuario =
      await usuarioService.criar({
        nome:
          formUsuario.nome.trim(),

        telefone:
          formUsuario.telefone.trim(),

        email:
          formUsuario.email
            .trim()
            .toLowerCase(),

        cpf_cnpj:
          formUsuario.cpf_cnpj
            .trim() ||
          null,

        senha:
          formUsuario.senha,

        /*
          O backend força PRODUTOR,
          mas também deixamos explícito.
        */
        tipo_usuario:
          'PRODUTOR',

        foto_perfil:
          null
      })

    idUsuarioCriado =
      Number(
        usuario?.id_usuario
      )

    if (
      !Number.isInteger(
        idUsuarioCriado
      ) ||
      idUsuarioCriado <= 0
    ) {
      throw new Error(
        'Usuário criado sem identificação.'
      )
    }

    /*
      2. CRIA A PROPRIEDADE
    */
    await propriedadeService.criar({
      id_usuario:
        idUsuarioCriado,

      nome_propriedade:
        formPropriedade
          .nome_propriedade
          .trim(),

      cultura_principal:
        'AVES',

      quantidade_galpoes:
        0,

      endereco:
        formPropriedade.endereco
          .trim() ||
        null,

      cidade:
        formPropriedade.cidade
          .trim(),

      estado:
        formPropriedade.estado
          .trim()
          .toUpperCase(),

      cep:
        formPropriedade.cep
          .trim() ||
        null,

      latitude:
        Number(
          formPropriedade.latitude
        ),

      longitude:
        Number(
          formPropriedade.longitude
        )
    })

    $q.notify({
      type: 'positive',

      timeout: 4000,

      message:
        'Conta criada com sucesso! Agora você já pode entrar.'
    })

    await router.replace({
      name: 'login'
    })
  } catch (error) {
    console.error(
      'Erro ao finalizar cadastro:',
      error
    )

    /*
      Se o usuário foi criado e a
      propriedade falhou, desativamos
      esse usuário para não deixar um
      cadastro incompleto ativo.
    */
    if (
      idUsuarioCriado
    ) {
      try {
        await usuarioService.desativar(
          idUsuarioCriado
        )
      } catch (
        erroRollback
      ) {
        console.error(
          'Erro ao reverter cadastro:',
          erroRollback
        )
      }
    }

    $q.notify({
      type: 'negative',

      timeout: 5000,

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível criar sua conta.'
    })
  } finally {
    salvando.value =
      false
  }
}

/* =========================
   OUTROS
========================= */

function normalizarEstado(
  valor
) {
  formPropriedade.estado =
    String(valor || '')
      .toUpperCase()
}

function aviso(
  mensagem
) {
  $q.notify({
    type: 'warning',
    message:
      mensagem
  })
}

function voltarLogin() {
  router.push({
    name: 'login'
  })
}
</script>

<style scoped>
.cadastro-page {
  min-height: 100vh;

  padding:
    35px 20px 60px;

  background: #f5f6f8;
}

.cadastro-container {
  width: 100%;

  max-width: 900px;

  margin: 0 auto;
}

/* TOPO */

.cadastro-topo {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;
}

.voltar-btn {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 0;

  border: none;

  color: #667085;

  background: transparent;

  cursor: pointer;

  font-family: inherit;

  font-size: 12px;

  font-weight: 700;
}

.voltar-btn:hover {
  color: #f97316;
}

.marca {
  display: flex;

  align-items: center;

  gap: 10px;
}

.marca-icone {
  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  color: #ffffff;

  background: #f97316;
}

.marca-nome {
  color: #101828;

  font-size: 16px;

  font-weight: 900;
}

.marca-subtitulo {
  color: #98a2b3;

  font-size: 9px;
}

/* CARD */

.cadastro-box {
  padding: 30px;

  border:
    1px solid #eaecf0;

  border-radius: 24px;

  background: #ffffff;

  box-shadow:
    0 8px 28px
    rgba(
      16,
      24,
      40,
      0.07
    );
}

.cadastro-cabecalho {
  text-align: center;
}

.cadastro-titulo {
  color: #101828;

  font-size: 27px;

  font-weight: 900;
}

.cadastro-descricao {
  max-width: 500px;

  margin:
    7px auto 0;

  color: #667085;

  font-size: 12px;

  line-height: 1.5;
}

/* ETAPAS */

.etapas {
  max-width: 580px;

  display: flex;

  align-items: center;

  margin:
    32px auto 38px;
}

.etapa {
  display: flex;

  align-items: center;

  gap: 9px;

  color: #98a2b3;
}

.etapa-numero {
  width: 34px;

  height: 34px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border:
    2px solid #d0d5dd;

  border-radius: 50%;

  font-size: 12px;

  font-weight: 800;
}

.etapa strong {
  display: block;

  font-size: 11px;
}

.etapa span {
  display: block;

  margin-top: 1px;

  font-size: 9px;
}

.etapa.ativa {
  color: #f97316;
}

.etapa.ativa
.etapa-numero {
  border-color: #f97316;

  color: #ffffff;

  background: #f97316;
}

.etapa.concluida
.etapa-numero {
  border-color: #12b76a;

  color: #ffffff;

  background: #12b76a;
}

.etapa-linha {
  height: 2px;

  flex: 1;

  margin: 0 18px;

  background: #eaecf0;
}

/* CONTEÚDO */

.etapa-conteudo {
  max-width: 740px;

  margin: 0 auto;
}

.secao-titulo {
  color: #101828;

  font-size: 18px;

  font-weight: 800;
}

.secao-subtitulo {
  margin-top: 4px;

  color: #667085;

  font-size: 11px;
}

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 15px;

  margin-top: 22px;
}

.campo-largo {
  grid-column:
    1 / -1;
}

.senha-ajuda {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 10px;

  color: #98a2b3;

  font-size: 10px;
}

.mapa-container {
  margin-top: 22px;
}

/* AÇÕES */

.acoes {
  display: flex;

  justify-content: flex-end;

  margin-top: 27px;
}

.acoes-duplas {
  justify-content:
    space-between;
}

/* LOGIN */

.ja-possui {
  margin-top: 18px;

  color: #667085;

  font-size: 11px;

  text-align: center;
}

.ja-possui button {
  padding: 0;

  border: none;

  color: #f97316;

  background: transparent;

  cursor: pointer;

  font-family: inherit;

  font-weight: 800;
}

/* DARK */

.cadastro-page--dark {
  background: #0d0f12;
}

.cadastro-page--dark
.cadastro-box {
  border-color: #2b2f36;

  background: #16191f;
}

.cadastro-page--dark
.cadastro-titulo,
.cadastro-page--dark
.secao-titulo,
.cadastro-page--dark
.marca-nome {
  color: #f9fafb;
}

.cadastro-page--dark
.cadastro-descricao,
.cadastro-page--dark
.secao-subtitulo {
  color: #98a2b3;
}

.cadastro-page--dark
.etapa-linha {
  background: #2b2f36;
}

/* TABLET */

@media (
  max-width: 750px
) {
  .cadastro-page {
    padding:
      25px 15px 45px;
  }

  .cadastro-box {
    padding: 24px;
  }
}

/* MOBILE */

@media (
  max-width: 600px
) {
  .cadastro-topo {
    align-items: flex-start;

    flex-direction: column-reverse;
  }

  .cadastro-box {
    padding: 20px 16px;

    border-radius: 19px;
  }

  .cadastro-titulo {
    font-size: 23px;
  }

  .etapas {
    margin:
      27px 0 32px;
  }

  .etapa span {
    display: none;
  }

  .etapa-linha {
    margin: 0 9px;
  }

  .form-grid {
    grid-template-columns:
      1fr;
  }

  .campo-largo {
    grid-column: auto;
  }

  .acoes,
  .acoes-duplas {
    align-items: stretch;

    flex-direction:
      column-reverse;

    gap: 10px;
  }

  .acoes .q-btn {
    width: 100%;
  }
}
</style>