<template>
  <q-page class="produtores-page" :class="{ 'produtores-page--dark': $q.dark.isActive }">
    <!-- Busca e ações no início da página, tanto no desktop quanto no celular -->
    <div class="barra-pesquisa-card">
      <div class="lista-acoes">
        <q-input
          v-model="pesquisa" outlined dense clearable
          placeholder="Buscar produtor..." class="pesquisa-input"
        >
          <template #prepend><q-icon name="search" size="19px" /></template>
        </q-input>
        <q-btn flat round icon="refresh" class="botao-atualizar-lista"
          :loading="carregando" @click="carregarDados">
          <q-tooltip>Atualizar produtores</q-tooltip>
        </q-btn>

      </div>
    </div>

    <!-- Indicadores compactos -->
    <div class="resumo-grid resumo-grid--produtores">
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--laranja">
          <q-icon name="agriculture" size="25px" />
        </div>
        <div>
          <div class="resumo-numero">{{ produtores.length }}</div>
          <div class="resumo-label">Produtores cadastrados</div>
        </div>
      </div>
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--verde">
          <q-icon name="check_circle" size="25px" />
        </div>
        <div>
          <div class="resumo-numero">{{ totalAtivos }}</div>
          <div class="resumo-label">Produtores ativos</div>
        </div>
      </div>
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--azul">
          <q-icon name="location_on" size="25px" />
        </div>
        <div>
          <div class="resumo-numero">{{ totalComPropriedade }}</div>
          <div class="resumo-label">Com propriedade cadastrada</div>
        </div>
      </div>
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--cinza">
          <q-icon name="person_off" size="25px" />
        </div>
        <div>
          <div class="resumo-numero">{{ totalInativos }}</div>
          <div class="resumo-label">Produtores inativos</div>
        </div>
      </div>
    </div>

    <!-- Uma coluna com o nome e as ações: sem rolagem horizontal -->
    <div class="lista-card">
      <div class="lista-cabecalho">
        <div>
          <div class="lista-titulo">Produtores cadastrados</div>
          <div class="lista-subtitulo">Dados dos produtores e propriedades vinculadas.</div>
        </div>
      </div>

      <div v-if="carregando && !carregadoUmaVez" class="carregando">
        <q-spinner color="orange" size="42px" />
        <span>Carregando produtores...</span>
      </div>
      <div v-else-if="produtoresFiltrados.length === 0" class="vazio">
        <div class="vazio-icone"><q-icon name="agriculture" size="32px" /></div>
        <strong>Nenhum produtor encontrado</strong>
        <span v-if="pesquisa">Nenhum produtor corresponde à sua busca.</span>
        <span v-else>Ainda não existem produtores cadastrados.</span>

      </div>
      <div v-else class="usuarios-lista">
        <div v-for="produtor in produtoresFiltrados" :key="produtor.id_usuario" class="usuario-linha">
          <div class="usuario-identificacao">
            <div class="produtor-avatar">{{ iniciais(produtor.nome) }}</div>
            <span class="usuario-nome">{{ produtor.nome }}</span>
          </div>
          <q-btn flat round dense icon="more_vert" class="usuario-acao"
            aria-label="Ver informações e ações de produtor" :loading="idProdutorEmAtualizacao === produtor.id_usuario" :disable="idProdutorEmAtualizacao !== null">
            <q-tooltip>Informações e ações</q-tooltip>
            <q-menu anchor="bottom right" self="top right" :offset="[0, 6]"
              content-style="max-height: 68vh; overflow-y: auto;">
              <q-list style="width: 290px; max-width: calc(100vw - 30px)" class="q-py-xs">
                <q-item-label header class="text-weight-bold">Dados do produtor</q-item-label>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>E-mail</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ produtor.email || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>Telefone</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ produtor.telefone || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>CPF / CNPJ</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ produtor.cpf_cnpj || 'Não informado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>Propriedade</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ propriedadeDoProdutor(produtor.id_usuario)?.nome_propriedade || 'Não cadastrada' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>Cidade / Estado</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ cidadeProdutor(produtor.id_usuario) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>Situação</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ produtor.ativo === false ? 'Inativo' : 'Ativo' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="q-py-xs">
                  <q-item-section>
                    <q-item-label caption>Cadastrado em</q-item-label>
                    <q-item-label class="text-weight-medium" style="overflow-wrap: anywhere">{{ formatarData(produtor.data_cadastro) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator class="q-my-xs" />
                <q-item clickable v-close-popup @click="visualizarProdutor(produtor)">
                  <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                  <q-item-section>Ver informações</q-item-section>
                </q-item>
                <q-item v-if="propriedadeDoProdutor(produtor.id_usuario)" clickable v-close-popup @click="visualizarPropriedade(produtor)">
                  <q-item-section avatar><q-icon name="home_work" /></q-item-section>
                  <q-item-section>Ver propriedade</q-item-section>
                </q-item>
                <q-item v-if="produtor.ativo !== false" clickable v-close-popup class="text-negative" @click="confirmarDesativacao(produtor)">
                  <q-item-section avatar><q-icon name="person_off" /></q-item-section>
                  <q-item-section>Desativar produtor</q-item-section>
                </q-item>
                <q-item v-else clickable v-close-popup class="text-positive" @click="confirmarAtivacao(produtor)">
                  <q-item-section avatar><q-icon name="person_add" /></q-item-section>
                  <q-item-section>Ativar produtor</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- =========================
         DETALHES DO PRODUTOR
    ========================== -->

    <q-dialog
      v-model="dialogProdutor"
    >
      <q-card
        v-if="
          produtorSelecionado
        "
        class="detalhes-dialog"
        :class="{
          'detalhes-dialog--dark':
            $q.dark.isActive
        }"
      >
        <q-card-section
          class="dialog-topo"
        >
          <div class="detalhes-avatar">
            {{
              iniciais(
                produtorSelecionado.nome
              )
            }}
          </div>

          <div>
            <div class="dialog-titulo">
              {{
                produtorSelecionado.nome
              }}
            </div>

            <div class="dialog-subtitulo">
              Produtor
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

        <q-card-section
          class="detalhes-corpo"
        >
          <!-- EMAIL -->

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
                  produtorSelecionado.email ||
                  '-'
                }}
              </strong>
            </div>
          </div>

          <!-- TELEFONE -->

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
                  produtorSelecionado.telefone ||
                  '-'
                }}
              </strong>
            </div>
          </div>

          <!-- CPF/CNPJ -->

          <div class="detalhe-item">
            <q-icon
              name="badge"
            />

            <div>
              <span>
                CPF / CNPJ
              </span>

              <strong>
                {{
                  produtorSelecionado.cpf_cnpj ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <!-- CADASTRO -->

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
                    produtorSelecionado
                      .data_cadastro
                  )
                }}
              </strong>
            </div>
          </div>

          <!-- STATUS -->

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
                  produtorSelecionado
                    .ativo === false
                    ? 'Inativo'
                    : 'Ativo'
                }}
              </strong>
            </div>
          </div>

          <!-- PROPRIEDADE -->

          <div class="detalhe-item">
            <q-icon
              name="home_work"
            />

            <div>
              <span>
                Propriedade
              </span>

              <strong>
                {{
                  propriedadeSelecionada
                    ?.nome_propriedade ||
                  'Não cadastrada'
                }}
              </strong>
            </div>
          </div>
        </q-card-section>

        <q-card-actions
          v-if="
            propriedadeSelecionada
          "
          class="dialog-acoes"
        >
          <q-btn
            flat
            no-caps
            color="orange"
            icon="home_work"
            label="Ver propriedade"
            @click="
              abrirPropriedadeDoDialog
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =========================
         DETALHES DA PROPRIEDADE
    ========================== -->

    <q-dialog
      v-model="dialogPropriedade"
    >
      <q-card
        v-if="
          propriedadeSelecionada
        "
        class="propriedade-dialog"
        :class="{
          'detalhes-dialog--dark':
            $q.dark.isActive
        }"
      >
        <q-card-section
          class="dialog-topo"
        >
          <div class="propriedade-icone">
            <q-icon
              name="home_work"
              size="25px"
            />
          </div>

          <div>
            <div class="dialog-titulo">
              {{
                propriedadeSelecionada
                  .nome_propriedade
              }}
            </div>

            <div class="dialog-subtitulo">
              Propriedade de
              {{
                produtorSelecionado
                  ?.nome ||
                'Produtor'
              }}
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

        <q-card-section
          class="propriedade-corpo"
        >
          <!-- ENDEREÇO -->

          <div class="propriedade-linha">
            <div class="propriedade-linha-icone">
              <q-icon
                name="location_on"
              />
            </div>

            <div>
              <span>
                Endereço
              </span>

              <strong>
                {{
                  propriedadeSelecionada
                    .endereco ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <!-- CIDADE -->

          <div class="propriedade-linha">
            <div class="propriedade-linha-icone">
              <q-icon
                name="location_city"
              />
            </div>

            <div>
              <span>
                Cidade / Estado
              </span>

              <strong>
                {{
                  formatarCidadeEstado(
                    propriedadeSelecionada
                  )
                }}
              </strong>
            </div>
          </div>

          <!-- CEP -->

          <div class="propriedade-linha">
            <div class="propriedade-linha-icone">
              <q-icon
                name="markunread_mailbox"
              />
            </div>

            <div>
              <span>
                CEP
              </span>

              <strong>
                {{
                  propriedadeSelecionada
                    .cep ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <!-- CULTURA -->

          <div class="propriedade-linha">
            <div class="propriedade-linha-icone">
              <q-icon
                name="agriculture"
              />
            </div>

            <div>
              <span>
                Cultura principal
              </span>

              <strong>
                {{
                  propriedadeSelecionada
                    .cultura_principal ||
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <!-- GALPÕES -->

          <div class="propriedade-linha">
            <div class="propriedade-linha-icone">
              <q-icon
                name="warehouse"
              />
            </div>

            <div>
              <span>
                Quantidade de galpões
              </span>

              <strong>
                {{
                  propriedadeSelecionada
                    .quantidade_galpoes ??
                  'Não informado'
                }}
              </strong>
            </div>
          </div>

          <!-- LOCALIZAÇÃO -->

          <div class="localizacao-box">
            <div class="localizacao-topo">
              <q-icon
                name="map"
                size="20px"
              />

              <strong>
                Localização cadastrada
              </strong>
            </div>

            <template
              v-if="
                possuiLocalizacao(
                  propriedadeSelecionada
                )
              "
            >
              <div class="coordenadas">
                <div>
                  <span>
                    Latitude
                  </span>

                  <strong>
                    {{
                      propriedadeSelecionada
                        .latitude
                    }}
                  </strong>
                </div>

                <div>
                  <span>
                    Longitude
                  </span>

                  <strong>
                    {{
                      propriedadeSelecionada
                        .longitude
                    }}
                  </strong>
                </div>
              </div>
            </template>

            <div
              v-else
              class="sem-localizacao"
            >
              <q-icon
                name="location_off"
                size="21px"
              />

              Localização ainda não cadastrada.
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirmação sem dependência do plugin Dialog do Quasar -->
    <q-dialog v-model="dialogConfirmacaoStatus" persistent>
      <q-card
        v-if="produtorParaStatus"
        class="detalhes-dialog"
        :class="{ 'detalhes-dialog--dark': $q.dark.isActive }"
      >
        <q-card-section class="dialog-topo">
          <div class="detalhes-avatar">
            <q-icon
              :name="novoStatusProdutor ? 'person_add' : 'person_off'"
              size="24px"
            />
          </div>
          <div>
            <div class="dialog-titulo">
              {{ novoStatusProdutor ? 'Ativar produtor' : 'Desativar produtor' }}
            </div>
            <div class="dialog-subtitulo">
              Confirme a alteração do cadastro.
            </div>
          </div>
          <q-space />
          <q-btn
            flat round dense icon="close"
            :disable="idProdutorEmAtualizacao !== null"
            @click="fecharConfirmacaoStatusProdutor"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg">
          Deseja realmente
          {{ novoStatusProdutor ? 'ativar' : 'desativar' }}
          <strong>{{ produtorParaStatus.nome }}</strong>?
          <p class="q-mt-sm q-mb-none"
            :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
            {{ novoStatusProdutor
              ? 'O produtor voltará a ficar disponível para os atendimentos.'
              : 'O produtor deixará de estar disponível para novos atendimentos.' }}
            Os dados e o histórico serão preservados.
          </p>
        </q-card-section>
        <q-separator />
        <q-card-actions class="dialog-acoes">
          <q-btn
            flat no-caps label="Cancelar"
            :disable="idProdutorEmAtualizacao !== null"
            @click="fecharConfirmacaoStatusProdutor"
          />
          <q-btn
            unelevated no-caps
            :color="novoStatusProdutor ? 'positive' : 'negative'"
            :label="novoStatusProdutor ? 'Ativar' : 'Desativar'"
            :loading="idProdutorEmAtualizacao !== null"
            @click="salvarAlteracaoStatusProdutor"
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
  ref
} from 'vue'

import {
  useQuasar
} from 'quasar'

import usuarioService from
  'src/services/usuarioService'

import propriedadeService from
  'src/services/propriedadeService'

const $q =
  useQuasar()

const carregando =
  ref(false)

const carregadoUmaVez =
  ref(false)

const pesquisa =
  ref('')

const usuarios =
  ref([])

const propriedades =
  ref([])

const dialogProdutor =
  ref(false)

const dialogPropriedade =
  ref(false)

const produtorSelecionado =
  ref(null)

const propriedadeSelecionada =
  ref(null)

const idProdutorEmAtualizacao =
  ref(null)
const dialogConfirmacaoStatus = ref(false)
const produtorParaStatus = ref(null)
const novoStatusProdutor = ref(false)

/* =========================
   PRODUTORES
========================= */

const produtores =
  computed(() => {
    return usuarios.value.filter(
      (usuario) =>
        String(
          usuario.tipo_usuario || ''
        )
          .trim()
          .toUpperCase() ===
        'PRODUTOR'
    )
  })

/* =========================
   FILTRO
========================= */

const produtoresFiltrados =
  computed(() => {
    const termo =
      String(
        pesquisa.value || ''
      )
        .trim()
        .toLowerCase()

    if (!termo) {
      return produtores.value
    }

    return produtores.value.filter(
      (produtor) => {
        const propriedade =
          propriedadeDoProdutor(
            produtor.id_usuario
          )

        const texto =
          [
            produtor.nome,
            produtor.email,
            produtor.telefone,

            propriedade
              ?.nome_propriedade,

            propriedade
              ?.cidade,

            propriedade
              ?.estado
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

/* =========================
   RESUMOS
========================= */

const totalAtivos =
  computed(() => {
    return produtores.value.filter(
      (produtor) =>
        produtor.ativo !== false
    ).length
  })

const totalInativos =
  computed(() => {
    return produtores.value.filter(
      (produtor) =>
        produtor.ativo === false
    ).length
  })

const totalComPropriedade =
  computed(() => {
    return produtores.value.filter(
      (produtor) =>
        !!propriedadeDoProdutor(
          produtor.id_usuario
        )
    ).length
  })

/* =========================
   CARREGAR
========================= */

async function carregarDados() {
  carregando.value =
    true

  try {
    const [
      respostaUsuarios,
      respostaPropriedades
    ] =
      await Promise.all([
        usuarioService.listar(),
        propriedadeService.listar()
      ])

    usuarios.value =
      Array.isArray(
        respostaUsuarios
      )
        ? respostaUsuarios
        : []

    propriedades.value =
      Array.isArray(
        respostaPropriedades
      )
        ? respostaPropriedades
        : []

    carregadoUmaVez.value =
      true
  } catch (error) {
    console.error(
      'Erro ao carregar produtores:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data
          ?.message ||
        error.response?.data
          ?.erro ||
        'Não foi possível carregar os produtores.'
    })
  } finally {
    carregando.value =
      false
  }
}

/* =========================
   PROPRIEDADE DO PRODUTOR
========================= */

function propriedadeDoProdutor(
  idUsuario
) {
  return propriedades.value.find(
    (propriedade) =>
      Number(
        propriedade.id_usuario
      ) ===
      Number(idUsuario) &&
      propriedade.ativo !== false
  ) || null
}

function cidadeProdutor(
  idUsuario
) {
  const propriedade =
    propriedadeDoProdutor(
      idUsuario
    )

  if (!propriedade) {
    return '-'
  }

  return formatarCidadeEstado(
    propriedade
  )
}

/* =========================
   DETALHES
========================= */

function visualizarProdutor(
  produtor
) {
  produtorSelecionado.value =
    produtor

  propriedadeSelecionada.value =
    propriedadeDoProdutor(
      produtor.id_usuario
    )

  dialogProdutor.value =
    true
}

function visualizarPropriedade(
  produtor
) {
  produtorSelecionado.value =
    produtor

  propriedadeSelecionada.value =
    propriedadeDoProdutor(
      produtor.id_usuario
    )

  if (
    !propriedadeSelecionada.value
  ) {
    $q.notify({
      type: 'warning',

      message:
        'Este produtor ainda não possui propriedade cadastrada.'
    })

    return
  }

  dialogPropriedade.value =
    true
}

function abrirPropriedadeDoDialog() {
  dialogProdutor.value =
    false

  dialogPropriedade.value =
    true
}

/* =========================
   ATIVAR / DESATIVAR
========================= */

function confirmarDesativacao(
  produtor
) {
  confirmarAlteracaoStatus(
    produtor,
    false
  )
}

function confirmarAtivacao(
  produtor
) {
  confirmarAlteracaoStatus(
    produtor,
    true
  )
}

function confirmarAlteracaoStatus(
  produtor,
  ativar
) {
  if (idProdutorEmAtualizacao.value !== null) return
  produtorParaStatus.value = produtor
  novoStatusProdutor.value = ativar
  dialogConfirmacaoStatus.value = true
}

function fecharConfirmacaoStatusProdutor() {
  if (idProdutorEmAtualizacao.value !== null) return
  dialogConfirmacaoStatus.value = false
  produtorParaStatus.value = null
}

async function salvarAlteracaoStatusProdutor() {
  const produtor = produtorParaStatus.value
  if (!produtor) return
  const sucesso = await alterarStatusProdutor(
    produtor,
    novoStatusProdutor.value
  )
  if (sucesso) {
    dialogConfirmacaoStatus.value = false
    produtorParaStatus.value = null
  }
}

async function alterarStatusProdutor(
  produtor,
  ativar
) {
  if (idProdutorEmAtualizacao.value !== null) {
    return
  }

  idProdutorEmAtualizacao.value =
    produtor.id_usuario

  try {
    // O endpoint PUT já atualiza o campo "ativo"
    // sem excluir o produtor ou seus registros.
    const usuarioAtualizado =
      await usuarioService.atualizar(
        produtor.id_usuario,
        { ativo: ativar }
      )

    if (usuarioAtualizado?.ativo !== ativar) {
      throw new Error(
        'O servidor não confirmou a alteração do status.'
      )
    }

    await carregarDados()

    const mensagem = ativar
      ? 'Produtor ativado com sucesso.'
      : 'Produtor desativado com sucesso.'
    if (typeof $q.notify === 'function') {
      $q.notify({ type: 'positive', message: mensagem })
    } else {
      window.alert(mensagem)
    }
    return true
  } catch (error) {
    console.error(
      'Erro ao alterar status do produtor:',
      error
    )

    const mensagem =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível alterar o status do produtor.'
    if (typeof $q.notify === 'function') {
      $q.notify({ type: 'negative', message: mensagem })
    } else {
      window.alert(mensagem)
    }
    return false
  } finally {
    idProdutorEmAtualizacao.value =
      null
  }
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
    return 'PR'
  }

  if (
    partes.length === 1
  ) {
    return partes[0]
      .substring(
        0,
        2
      )
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
    .format(
      objeto
    )
}

function formatarCidadeEstado(
  propriedade
) {
  const cidade =
    String(
      propriedade?.cidade ||
      ''
    ).trim()

  const estado =
    String(
      propriedade?.estado ||
      ''
    ).trim()

  if (
    cidade &&
    estado
  ) {
    return `${cidade} - ${estado}`
  }

  return (
    cidade ||
    estado ||
    '-'
  )
}

function possuiLocalizacao(
  propriedade
) {
  if (!propriedade) {
    return false
  }

  if (
    propriedade.latitude ===
      null ||
    propriedade.latitude ===
      undefined ||
    propriedade.longitude ===
      null ||
    propriedade.longitude ===
      undefined
  ) {
    return false
  }

  const latitude =
    Number(
      propriedade.latitude
    )

  const longitude =
    Number(
      propriedade.longitude
    )

  if (
    !Number.isFinite(
      latitude
    ) ||
    !Number.isFinite(
      longitude
    )
  ) {
    return false
  }

  if (
    latitude === 0 &&
    longitude === 0
  ) {
    return false
  }

  return true
}

/* =========================
   INICIAR
========================= */

onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
/* =========================
   PÁGINA
========================= */

.produtores-page {
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

/* =========================
   RESUMO
========================= */

.resumo-grid {
  display: grid;

  grid-template-columns:
    repeat(
      4,
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

.resumo-icone--azul {
  color: #2563eb;

  background: #eff6ff;
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

  font-size: 9px;
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

.pesquisa-input {
  width: 300px;
}

/* =========================
   TABELA
========================= */

.tabela-container {
  width: 100%;

  overflow-x: auto;

  margin-top: 21px;
}

.produtores-tabela {
  width: 100%;

  min-width: 980px;

  border-collapse: collapse;
}

.produtores-tabela th {
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

.produtores-tabela td {
  padding: 14px 10px;

  border-bottom:
    1px solid #f2f4f7;

  color: #475467;

  font-size: 10px;

  vertical-align: middle;
}

.produtores-tabela
tbody
tr:hover {
  background: #fafafa;
}

.produtor-identificacao {
  display: flex;

  align-items: center;

  gap: 10px;
}

.produtor-avatar {
  width: 40px;

  height: 40px;

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

.produtor-info {
  min-width: 0;
}

.produtor-info strong {
  display: block;

  max-width: 200px;

  overflow: hidden;

  color: #344054;

  font-size: 11px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.produtor-info span {
  display: block;

  max-width: 220px;

  overflow: hidden;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 9px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.propriedade-info {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #475467;
}

.propriedade-info
.q-icon {
  color: #f97316;
}

.sem-propriedade {
  color: #98a2b3;

  font-style: italic;
}

.acao-coluna {
  width: 75px;

  text-align: center !important;
}

/* =========================
   CARREGANDO / VAZIO
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
   DIALOGS
========================= */

.detalhes-dialog,
.propriedade-dialog {
  width: 100%;

  max-width: 570px;

  border-radius: 18px;

  background: #ffffff;
}

.dialog-topo {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 22px;
}

.detalhes-avatar {
  width: 48px;

  height: 48px;

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

.propriedade-icone {
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

.detalhe-item
> .q-icon {
  color: #f97316;
}

.detalhe-item span,
.propriedade-linha span,
.coordenadas span {
  display: block;

  color: #98a2b3;

  font-size: 8px;
}

.detalhe-item strong,
.propriedade-linha strong,
.coordenadas strong {
  display: block;

  margin-top: 2px;

  color: #344054;

  font-size: 10px;

  word-break: break-word;
}

.dialog-acoes {
  display: flex;

  justify-content: flex-end;

  padding: 14px 22px;
}

/* =========================
   PROPRIEDADE
========================= */

.propriedade-corpo {
  display: flex;

  flex-direction: column;

  gap: 10px;

  padding: 22px;
}

.propriedade-linha {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 13px;

  border-radius: 11px;

  background: #f9fafb;
}

.propriedade-linha-icone {
  width: 35px;

  height: 35px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  color: #f97316;

  background: #fff1e6;
}

.localizacao-box {
  margin-top: 3px;

  padding: 15px;

  border:
    1px solid #eaecf0;

  border-radius: 12px;
}

.localizacao-topo {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #344054;

  font-size: 10px;
}

.localizacao-topo
.q-icon {
  color: #f97316;
}

.coordenadas {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin-top: 13px;
}

.coordenadas > div {
  padding: 11px;

  border-radius: 9px;

  background: #f9fafb;
}

.sem-localizacao {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 12px;

  color: #98a2b3;

  font-size: 9px;
}

/* =========================
   DARK MODE
========================= */

.produtores-page--dark {
  background: #0d0f12;
}

.produtores-page--dark
.pagina-topo h1,
.produtores-page--dark
.resumo-numero,
.produtores-page--dark
.lista-titulo {
  color: #f9fafb;
}

.produtores-page--dark
.resumo-card,
.produtores-page--dark
.lista-card,
.detalhes-dialog--dark {
  border-color: #292d33;

  background: #15181d;
}

.produtores-page--dark
.produtores-tabela th {
  border-color: #292d33;
}

.produtores-page--dark
.produtores-tabela td {
  border-color: #24282f;

  color: #d0d5dd;
}

.produtores-page--dark
.produtores-tabela
tbody
tr:hover {
  background: #1b1e24;
}

.produtores-page--dark
.produtor-info strong {
  color: #f2f4f7;
}

.detalhes-dialog--dark
.dialog-titulo,
.detalhes-dialog--dark
.detalhe-item strong,
.detalhes-dialog--dark
.propriedade-linha strong,
.detalhes-dialog--dark
.coordenadas strong,
.detalhes-dialog--dark
.localizacao-topo {
  color: #f2f4f7;
}

.detalhes-dialog--dark
.detalhe-item,
.detalhes-dialog--dark
.propriedade-linha,
.detalhes-dialog--dark
.coordenadas > div {
  background: #1b1e24;
}

.detalhes-dialog--dark
.localizacao-box {
  border-color: #292d33;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 1100px) {
  .resumo-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 800px) {
  .produtores-page {
    padding: 22px;
  }

  .lista-cabecalho {
    align-items: stretch;

    flex-direction: column;
  }

  .pesquisa-input {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .produtores-page {
    padding:
      18px 14px;
  }

  .pagina-topo {
    align-items: flex-start;
  }

  .pagina-topo h1 {
    font-size: 22px;
  }

  .resumo-grid {
    grid-template-columns:
      1fr;
  }

  .lista-card {
    padding: 17px;
  }

  .detalhes-dialog,
  .propriedade-dialog {
    width:
      calc(
        100vw - 24px
      );
  }

  .detalhes-corpo,
  .coordenadas {
    grid-template-columns:
      1fr;
  }
}

/* =========================================================
   AJUSTE FINAL - PRODUTORES ADMIN
   O AdminLayout já exibe o título principal da página.
========================================================= */

.produtores-page {
  min-height: 100%;
  padding: 14px 20px 28px;
  background: #f5f6f8;
}

.pagina-topo {
  display: none !important;
}

/* =========================================================
   INDICADORES
========================================================= */

.resumo-grid {
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.resumo-card {
  min-height: 96px;
  gap: 12px;
  padding: 14px 15px;
  border-radius: 15px;
}

.resumo-icone {
  width: 43px;
  height: 43px;
  border-radius: 12px;
}

.resumo-numero {
  font-size: 25px;
  line-height: 1;
}

.resumo-label {
  margin-top: 5px;
  color: #475467;
  font-size: 10px;
  font-weight: 700;
}

/* =========================================================
   LISTA
========================================================= */

.lista-card {
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
}

.lista-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 14px 18px 12px;

  border-bottom: 1px solid #eaecf0;
}

.lista-titulo {
  font-size: 14px;
}

.lista-subtitulo {
  margin-top: 3px;
  font-size: 9px;
}

.lista-acoes {
  display: flex;
  align-items: center;
  gap: 7px;
}

.pesquisa-input {
  width: 320px;
}

.pesquisa-input :deep(.q-field__control) {
  min-height: 40px;
  height: 40px;
  border-radius: 10px;
}

.pesquisa-input :deep(.q-field__native),
.pesquisa-input :deep(.q-field__input) {
  font-size: 11px;
}

.botao-atualizar-lista {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  color: #f97316;
}

/* =========================================================
   TABELA - LETRAS MAIORES
========================================================= */

.tabela-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 0;
}

.produtores-tabela {
  width: 100%;
  min-width: 1080px;
  table-layout: fixed;
  border-collapse: collapse;
}

.produtores-tabela th {
  padding: 11px 14px;
  border-bottom: 1px solid #eaecf0;

  color: #667085;
  font-size: 9px;
  font-weight: 900;

  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  white-space: nowrap;
}

.produtores-tabela td {
  padding: 13px 14px;
  border-bottom: 1px solid #f2f4f7;

  color: #475467;
  font-size: 11px;
  line-height: 1.35;

  vertical-align: middle;
}

.produtores-tabela tbody tr:hover {
  background: #fffaf5;
}

.produtor-identificacao {
  gap: 10px;
}

.produtor-avatar {
  width: 42px;
  height: 42px;
  font-size: 12px;
}

.produtor-info strong {
  max-width: 220px;
  color: #24324a;
  font-size: 12px;
  font-weight: 800;
}

.produtor-info span {
  max-width: 240px;
  margin-top: 3px;
  font-size: 9px;
}

.propriedade-info {
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
}

.propriedade-info .q-icon {
  font-size: 19px !important;
}

.sem-propriedade {
  font-size: 10px;
}

.produtores-tabela :deep(.q-badge) {
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 800;
}

/* Distribuição das colunas */
.produtores-tabela th:nth-child(1),
.produtores-tabela td:nth-child(1) {
  width: 25%;
}

.produtores-tabela th:nth-child(2),
.produtores-tabela td:nth-child(2) {
  width: 15%;
}

.produtores-tabela th:nth-child(3),
.produtores-tabela td:nth-child(3) {
  width: 19%;
}

.produtores-tabela th:nth-child(4),
.produtores-tabela td:nth-child(4) {
  width: 15%;
}

.produtores-tabela th:nth-child(5),
.produtores-tabela td:nth-child(5) {
  width: 10%;
}

.produtores-tabela th:nth-child(6),
.produtores-tabela td:nth-child(6) {
  width: 10%;
}

.produtores-tabela th:nth-child(7),
.produtores-tabela td:nth-child(7) {
  width: 6%;
}

.acao-coluna {
  width: auto;
}

.acao-coluna .q-btn {
  min-width: 34px;
  min-height: 34px;
}

/* =========================================================
   CARREGANDO / VAZIO
========================================================= */

.carregando,
.vazio {
  min-height: 220px;
}

/* =========================================================
   DARK
========================================================= */

.produtores-page--dark .lista-cabecalho {
  border-color: #292d33;
}

.produtores-page--dark .resumo-label {
  color: #cbd5e1;
}

.produtores-page--dark .produtor-info strong {
  color: #f2f4f7;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1100px) {
  .resumo-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .lista-cabecalho {
    align-items: stretch;
    flex-direction: column;
  }

  .lista-acoes {
    width: 100%;
  }

  .pesquisa-input {
    flex: 1;
    width: auto;
  }
}

@media (max-width: 800px) {
  .produtores-page {
    padding: 14px 14px 30px;
  }
}

@media (max-width: 600px) {
  .produtores-page {
    padding: 12px 12px 28px;
  }

  .resumo-grid {
    grid-template-columns: 1fr;
  }

  .lista-acoes {
    flex-direction: column;
  }

  .pesquisa-input,
  .botao-atualizar-lista {
    width: 100%;
  }

  .botao-atualizar-lista {
    border: 1px solid #fed7aa;
    border-radius: 10px;
  }
}


/* =========================================================
   PADRÃO COMPARTILHADO: ADMIN / TÉCNICOS E PRODUTORES
   Busca em primeiro lugar, indicadores compactos e lista sem
   rolagem horizontal em qualquer tamanho de tela.
========================================================= */
.barra-pesquisa-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 12px;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
}
.barra-pesquisa-card .filtros,
.barra-pesquisa-card .lista-acoes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
}
.barra-pesquisa-card .pesquisa-input {
  flex: 1 1 200px;
  min-width: 0;
  max-width: 520px;
  width: auto;
}
.barra-pesquisa-card .novo-btn--lista {
  margin-left: auto;
}
.barra-pesquisa-card .botao-atualizar-lista {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 1px solid #fed7aa;
  border-radius: 10px;
}
.resumo-grid {
  margin-bottom: 12px;
  gap: 10px;
}
.resumo-card {
  min-width: 0;
  min-height: 90px;
  padding: 14px;
}
.resumo-card > div:last-child {
  min-width: 0;
}
.resumo-label {
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.lista-cabecalho {
  padding: 14px 17px;
}
.usuarios-lista {
  width: 100%;
  min-width: 0;
}
.usuario-linha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px solid #eaecf0;
  min-width: 0;
}
.usuario-linha:last-child {
  border-bottom: 0;
}
.usuario-linha:hover {
  background: #fffaf5;
}
.usuario-identificacao {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.usuario-nome {
  min-width: 0;
  color: #24324a;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.usuario-acao {
  flex-shrink: 0;
  color: #475467;
}
.resumo-grid--tecnicos {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.resumo-grid--produtores {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.tecnicos-page--dark .barra-pesquisa-card,
.produtores-page--dark .barra-pesquisa-card {
  border-color: #292d33;
  background: #15181d;
}
.tecnicos-page--dark .usuario-linha,
.produtores-page--dark .usuario-linha {
  border-color: #292d33;
}
.tecnicos-page--dark .usuario-linha:hover,
.produtores-page--dark .usuario-linha:hover {
  background: #1b1e24;
}
.tecnicos-page--dark .usuario-nome,
.produtores-page--dark .usuario-nome {
  color: #f2f4f7;
}
.tecnicos-page--dark .usuario-acao,
.produtores-page--dark .usuario-acao {
  color: #d0d5dd;
}
@media (max-width: 800px) {
  .resumo-grid--tecnicos,
  .resumo-grid--produtores {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .barra-pesquisa-card {
    padding: 12px;
  }
  .barra-pesquisa-card .filtros,
  .barra-pesquisa-card .lista-acoes {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .barra-pesquisa-card .pesquisa-input {
    flex: 1 1 calc(100% - 52px);
    width: auto;
    max-width: none;
  }
  .barra-pesquisa-card .botao-atualizar-lista {
    flex: 0 0 44px;
    width: 44px;
    height: 40px;
  }
  .barra-pesquisa-card .novo-btn--lista {
    width: 100%;
    flex: 1 1 100%;
    margin-left: 0;
  }
  .resumo-grid--tecnicos,
  .resumo-grid--produtores {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .resumo-grid--tecnicos .resumo-card:last-child {
    grid-column: 1 / -1;
  }
  .resumo-card {
    min-height: 90px;
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
    padding: 12px;
  }
  .resumo-icone {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }
  .resumo-icone .q-icon {
    font-size: 20px !important;
  }
  .resumo-numero {
    font-size: 23px;
  }
  .resumo-label {
    margin-top: 2px;
    font-size: 10px;
  }
  .lista-cabecalho {
    padding: 14px;
  }
  .usuario-linha {
    padding: 12px 13px;
  }
  .usuario-identificacao {
    gap: 10px;
  }
  .usuario-nome {
    font-size: 13px;
  }
}

</style>