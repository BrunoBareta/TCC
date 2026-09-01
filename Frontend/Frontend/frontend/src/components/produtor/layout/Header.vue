<template>
  <div class="header-produtor">
    <!-- ==================================================
         IDENTIDADE
    =================================================== -->

    <div class="header-identidade">
      <img
        :src="logoAvicola"
        alt="Avícola Pinhal"
        class="logo-avicola"
      />

      <div class="header-boas-vindas">
        Bem-vindo, {{ primeiroNome }}
      </div>

      <div class="header-subtitulo">
        Portal do Produtor
      </div>
    </div>

    <!-- ==================================================
         AÇÕES
    =================================================== -->

    <div class="header-acoes">
      <q-btn
        outline
        no-caps
        :color="
          modoEscuro
            ? 'orange'
            : 'dark'
        "
        icon="assessment"
        label="Relatórios"
        :to="{
          name:
            'produtor-relatorios'
        }"
      />

      <!-- TEMA -->

      <q-btn
        flat
        round
        :icon="iconeTema"
        :color="
          modoEscuro
            ? 'orange'
            : 'dark'
        "
        @click="alternarTema"
      >
        <q-tooltip>
          {{ textoTema }}
        </q-tooltip>
      </q-btn>

      <!-- NOTIFICAÇÕES -->

      <q-btn
        flat
        round
        icon="notifications_none"
        :color="
          modoEscuro
            ? 'orange'
            : 'dark'
        "
      />

      <!-- ==================================================
           PROPRIEDADE DO PRODUTOR LOGADO
      =================================================== -->

      <div
        class="propriedade-dados"
      >
        <template v-if="carregandoPropriedade">
          <q-skeleton
            type="text"
            width="130px"
          />

          <q-skeleton
            type="text"
            width="90px"
            class="q-ml-auto"
          />
        </template>

        <template
          v-else-if="propriedade"
        >
          <div class="propriedade-nome">
            {{
              propriedade.nome_propriedade
            }}
          </div>

          <div class="propriedade-local">
            {{ localPropriedade }}
          </div>
        </template>

        <template v-else>
          <div class="propriedade-nome">
            Sem propriedade
          </div>

          <div class="propriedade-local">
            Nenhuma propriedade cadastrada
          </div>
        </template>
      </div>

      <!-- ==================================================
           PERFIL
      =================================================== -->

      <q-btn
        flat
        round
        class="q-pa-none"
      >
        <q-avatar
          :color="
            modoEscuro
              ? 'grey-9'
              : 'grey-3'
          "
          :text-color="
            modoEscuro
              ? 'orange'
              : 'dark'
          "
        >
          {{ iniciais }}
        </q-avatar>

        <q-menu>
          <q-list
            style="
              min-width: 220px
            "
          >
            <q-item>
              <q-item-section>
                <div
                  class="
                    text-weight-bold
                  "
                >
                  {{
                    auth.nomeUsuario
                  }}
                </div>

                <div
                  class="
                    text-caption
                    text-grey
                  "
                >
                  {{
                    auth.tipoUsuario
                  }}
                </div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item
              clickable
              v-close-popup
              :to="{
                name:
                  'produtor-perfil'
              }"
            >
              <q-item-section avatar>
                <q-icon
                  name="person"
                />
              </q-item-section>

              <q-item-section>
                Perfil
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="alternarTema"
            >
              <q-item-section avatar>
                <q-icon
                  :name="iconeTema"
                  color="orange"
                />
              </q-item-section>

              <q-item-section>
                {{ textoTema }}
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item
              clickable
              v-close-popup
              @click="sair"
            >
              <q-item-section avatar>
                <q-icon
                  name="logout"
                  color="negative"
                />
              </q-item-section>

              <q-item-section
                class="text-negative"
              >
                Sair
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  useAuthStore
} from 'src/stores/auth'

import {
  useTheme
} from 'src/composables/useTheme'

import propriedadeService from
  'src/services/propriedadeService'

import logoAvicola from
  'src/assets/logo/logo-avicola-pinhal.png'

const router =
  useRouter()

const auth =
  useAuthStore()

const {
  modoEscuro,
  iconeTema,
  textoTema,
  alternarTema
} = useTheme()

/* ==================================================
   PROPRIEDADE
=================================================== */

const propriedade =
  ref(null)

const carregandoPropriedade =
  ref(false)

/* ==================================================
   USUÁRIO LOGADO
=================================================== */

function obterUsuarioLocal() {
  const chaves = [
    'usuario',
    'user',
    'authUser'
  ]

  for (
    const chave of chaves
  ) {
    try {
      const valor =
        localStorage.getItem(
          chave
        )

      if (!valor) {
        continue
      }

      const usuario =
        JSON.parse(valor)

      if (usuario) {
        return usuario
      }
    } catch {
      // Continua procurando
    }
  }

  return {}
}

const idUsuario =
  computed(() => {
    const usuarioLocal =
      obterUsuarioLocal()

    const id =
      auth.usuario?.id_usuario ||
      auth.idUsuario ||
      usuarioLocal.id_usuario ||
      usuarioLocal.idUsuario ||
      usuarioLocal.id

    const numero =
      Number(id)

    if (
      !Number.isInteger(numero) ||
      numero <= 0
    ) {
      return null
    }

    return numero
  })

/* ==================================================
   PRIMEIRO NOME
=================================================== */

const primeiroNome =
  computed(() => {
    if (
      !auth.nomeUsuario
    ) {
      const usuarioLocal =
        obterUsuarioLocal()

      const nome =
        usuarioLocal.nome ||
        usuarioLocal.nome_usuario ||
        usuarioLocal.name ||
        'Produtor'

      return nome
        .trim()
        .split(/\s+/)[0]
    }

    return auth.nomeUsuario
      .trim()
      .split(/\s+/)[0]
  })

/* ==================================================
   INICIAIS
=================================================== */

const iniciais =
  computed(() => {
    let nome =
      auth.nomeUsuario

    if (!nome) {
      const usuarioLocal =
        obterUsuarioLocal()

      nome =
        usuarioLocal.nome ||
        usuarioLocal.nome_usuario ||
        usuarioLocal.name ||
        ''
    }

    if (!nome) {
      return '?'
    }

    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        parte =>
          parte[0]
      )
      .join('')
      .toUpperCase()
  })

/* ==================================================
   LOCAL
=================================================== */

const localPropriedade =
  computed(() => {
    if (
      !propriedade.value
    ) {
      return ''
    }

    const cidade =
      propriedade.value.cidade ||
      ''

    const estado =
      propriedade.value.estado ||
      ''

    if (
      cidade &&
      estado
    ) {
      return `${cidade} - ${estado}`
    }

    return (
      cidade ||
      estado ||
      'Local não informado'
    )
  })

/* ==================================================
   CARREGAR PROPRIEDADE
=================================================== */

async function carregarPropriedade() {
  if (!idUsuario.value) {
    propriedade.value =
      null

    return
  }

  carregandoPropriedade.value =
    true

  try {
    const dados =
      await propriedadeService
        .buscarPorUsuario(
          idUsuario.value
        )

    propriedade.value =
      dados || null
  } catch (error) {
    console.error(
      'Erro ao buscar propriedade do produtor:',
      error
    )

    propriedade.value =
      null
  } finally {
    carregandoPropriedade.value =
      false
  }
}

onMounted(
  carregarPropriedade
)

watch(
  idUsuario,
  carregarPropriedade
)

/* ==================================================
   SAIR
=================================================== */

async function sair() {
  auth.logout()

  await router.replace('/')
}
</script>

<style scoped>
.header-produtor {
  min-height: 112px;

  padding:
    12px
    32px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 30px;

  border-bottom:
    1px solid #eaecf0;

  background: #ffffff;

  transition:
    background 0.25s,
    border-color 0.25s;
}

/* ==================================================
   IDENTIDADE
=================================================== */

.header-identidade {
  width: 250px;

  flex-shrink: 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.logo-avicola {
  display: block;

  width: 230px;

  max-width: 100%;

  height: auto;

  margin-bottom: 3px;

  object-fit: contain;
}

.header-boas-vindas {
  width: 100%;

  color: #101828;

  font-size: 17px;

  font-weight: 800;

  line-height: 1.2;

  text-align: center;
}

.header-subtitulo {
  width: 100%;

  margin-top: 2px;

  color: #98a2b3;

  font-size: 11px;

  font-weight: 500;

  text-align: center;
}

/* ==================================================
   AÇÕES
=================================================== */

.header-acoes {
  display: flex;

  align-items: center;

  gap: 14px;
}

/* ==================================================
   PROPRIEDADE
=================================================== */

.propriedade-dados {
  min-width: 150px;

  text-align: right;
}

.propriedade-nome {
  max-width: 210px;

  overflow: hidden;

  color: #101828;

  font-size: 14px;

  font-weight: 700;

  text-overflow:
    ellipsis;

  white-space: nowrap;
}

.propriedade-local {
  max-width: 210px;

  margin-top: 2px;

  overflow: hidden;

  color: #98a2b3;

  font-size: 12px;

  text-overflow:
    ellipsis;

  white-space: nowrap;
}

/* ==================================================
   DARK
=================================================== */

.body--dark
.header-produtor {
  border-bottom-color:
    #2b2f36;

  background: #16191f;
}

.body--dark
.header-boas-vindas,

.body--dark
.propriedade-nome {
  color: #f9fafb;
}

.body--dark
.header-subtitulo,

.body--dark
.propriedade-local {
  color: #98a2b3;
}

/* ==================================================
   RESPONSIVO
=================================================== */

@media (
  max-width: 1200px
) {
  .header-produtor {
    padding:
      12px
      22px;
  }

  .header-identidade {
    width: 220px;
  }

  .logo-avicola {
    width: 205px;
  }

  .header-acoes {
    gap: 9px;
  }
}

@media (
  max-width: 1023px
) {
  .header-acoes {
    display: none;
  }
}
</style>