<template>
  <q-page class="atendimento-page">
    <div class="pagina-cabecalho">
      <div>
        <div class="pagina-titulo">
          Atendimento técnico
        </div>

        <div class="pagina-subtitulo">
          Acompanhe e atualize o andamento da assistência.
        </div>
      </div>

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Voltar"
        color="grey-7"
        @click="voltar"
      />
    </div>

    <div v-if="carregando" class="estado-central">
      <q-spinner color="orange" size="48px" />

      <div class="text-grey-7 q-mt-md">
        Carregando atendimento...
      </div>
    </div>

    <q-banner
      v-else-if="erro"
      rounded
      class="bg-red-1 text-negative"
    >
      {{ erro }}

      <template #action>
        <q-btn
          flat
          color="negative"
          label="Tentar novamente"
          @click="carregarChamado"
        />
      </template>
    </q-banner>

    <div
      v-else-if="chamado"
      class="atendimento-grid"
    >
      <div class="coluna-principal">
        <div class="card">
          <div class="card-topo">
            <div>
              <div class="chamado-numero">
                Chamado #{{ chamado.id_chamado }}
              </div>

              <div class="chamado-problema">
                {{ chamado.problema }}
              </div>
            </div>

            <q-badge
              rounded
              :class="classeStatus(chamado.status)"
            >
              {{ formatarTexto(chamado.status) }}
            </q-badge>
          </div>

          <q-separator class="q-my-lg" />

          <div class="informacoes-grid">
            <div class="informacao">
              <div class="informacao-label">
                Cultura
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.tipo_cultura) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Urgência
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.urgencia) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Data de abertura
              </div>

              <div class="informacao-valor">
                {{ formatarData(chamado.data_abertura) }}
              </div>
            </div>

            <div class="informacao">
              <div class="informacao-label">
                Tipo do chamado
              </div>

              <div class="informacao-valor">
                {{ formatarTexto(chamado.tipo_chamado) }}
              </div>
            </div>

            <div
              v-if="chamado.data_fechamento"
              class="informacao"
            >
              <div class="informacao-label">
                Data de fechamento
              </div>

              <div class="informacao-valor">
                {{ formatarData(chamado.data_fechamento) }}
              </div>
            </div>
          </div>
        </div>

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Descrição do problema
          </div>

          <div class="descricao">
            {{
              chamado.descricao ||
              'Nenhuma descrição informada.'
            }}
          </div>
        </div>

        <div class="q-mt-lg">
          <MateriaisAtendimento
            :id-chamado="chamado.id_chamado"
            :somente-leitura="atendimentoFinalizado"
          />
        </div>

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Observações do atendimento
          </div>

          <q-input
            v-model="observacao"
            type="textarea"
            outlined
            autogrow
            label="Digite as observações do atendimento"
            :disable="atendimentoFinalizado"
            maxlength="1000"
            counter
          />

          <div
            v-if="
              atendimentoFinalizado &&
              chamado.resposta_tecnico
            "
            class="observacao-finalizada"
          >
            <div class="observacao-finalizada-label">
              Resposta registrada
            </div>

            <div class="observacao-finalizada-texto">
              {{ chamado.resposta_tecnico }}
            </div>
          </div>
        </div>
      </div>

      <div class="coluna-lateral">
        <DeslocamentoAtendimento
          :chamado="chamado"
          :observacao="observacao"
          @chamado-atualizado="atualizarChamadoLocal"
        />

        <div class="card q-mt-lg">
          <div class="card-titulo">
            Equipe vinculada
          </div>

          <div
            v-if="equipe.length === 0"
            class="text-grey-6"
          >
            Nenhum funcionário vinculado.
          </div>

          <div
            v-for="funcionario in equipe"
            :key="funcionario.id_chamado_funcionario"
            class="funcionario-item"
          >
            <q-avatar
              color="grey-3"
              text-color="dark"
              size="38px"
            >
              {{ iniciais(funcionario.nome) }}
            </q-avatar>

            <div>
              <div class="funcionario-nome">
                {{ funcionario.nome }}
              </div>

              <div class="funcionario-funcao">
                {{
                  formatarTexto(
                    funcionario.funcao_atendimento
                  )
                }}
              </div>
            </div>
          </div>

          <div
            v-if="equipe.length > 0"
            class="total-equipe"
          >
            Total de funcionários:
            <strong>{{ equipe.length }}</strong>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'
import chamadoService from 'src/services/chamadoService'
import chamadoFuncionarioService from 'src/services/chamadoFuncionarioService'
import MateriaisAtendimento from 'src/components/tecnico/materiais/MateriaisAtendimento.vue'
import DeslocamentoAtendimento from 'src/components/tecnico/atendimento/DeslocamentoAtendimento.vue'

const route = useRoute()
const router = useRouter()

const chamado = ref(null)
const equipe = ref([])
const observacao = ref('')
const carregando = ref(false)
const erro = ref('')

const statusAtual = computed(() =>
  String(chamado.value?.status || '').toUpperCase()
)

const atendimentoFinalizado = computed(() =>
  ['FINALIZADO', 'CONCLUIDO'].includes(
    statusAtual.value
  )
)

async function carregarChamado() {
  carregando.value = true
  erro.value = ''

  try {
    const idChamado = Number(route.params.id)

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      throw new Error('ID do chamado inválido.')
    }

    chamado.value =
      await chamadoService.buscarPorId(idChamado)

    observacao.value =
      chamado.value?.resposta_tecnico || ''

    const respostaEquipe =
      await chamadoFuncionarioService.listarPorChamado(
        idChamado
      )

    equipe.value = Array.isArray(respostaEquipe)
      ? respostaEquipe
      : respostaEquipe?.data || []
  } catch (error) {
    console.error(
      'Erro ao carregar atendimento:',
      error
    )

    erro.value =
      error.response?.data?.message ||
      error.response?.data?.erro ||
      error.message ||
      'Não foi possível carregar o atendimento.'
  } finally {
    carregando.value = false
  }
}

function voltar() {
  const rotaAnterior =
    window.history.state?.back

  if (rotaAnterior) {
    router.back()
    return
  }

  router.push({
    name: 'tecnico-meus-chamados'
  })
}

function atualizarChamadoLocal(
  chamadoAtualizado
) {
  chamado.value = chamadoAtualizado

  if (
    ['FINALIZADO', 'CONCLUIDO'].includes(
      String(
        chamadoAtualizado?.status || ''
      ).toUpperCase()
    )
  ) {
    observacao.value =
      chamadoAtualizado.resposta_tecnico ||
      observacao.value
  }
}

function formatarTexto(valor) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /^\w/,
      (letra) => letra.toUpperCase()
    )
}

function formatarData(valor) {
  if (!valor) {
    return 'Não informada'
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return valor
  }

  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function classeStatus(status) {
  const valor = String(
    status || ''
  ).toUpperCase()

  if (valor === 'ACEITO') {
    return 'status-aceito'
  }

  if (valor === 'EM_ROTA') {
    return 'status-rota'
  }

  if (valor === 'EM_ATENDIMENTO') {
    return 'status-atendimento'
  }

  if (
    ['FINALIZADO', 'CONCLUIDO'].includes(valor)
  ) {
    return 'status-finalizado'
  }

  return 'status-pendente'
}

function iniciais(nome) {
  return String(nome || '?')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase()
}

onMounted(carregarChamado)
</script>

<style scoped>
.atendimento-page {
  min-height: 100%;
  padding: 28px 32px 48px;
  background: #f7f8fa;
}

.pagina-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
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

.estado-central {
  padding: 48px;
  text-align: center;
}

.atendimento-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(320px, 1fr);
  gap: 24px;
}

.card {
  padding: 26px;
  border: 1px solid #eaecf0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 3px 10px rgba(16, 24, 40, 0.05);
}

.card-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.chamado-numero {
  color: #f97316;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.chamado-problema {
  margin-top: 6px;
  color: #101828;
  font-size: 25px;
  font-weight: 800;
}

.card-titulo {
  margin-bottom: 18px;
  color: #101828;
  font-size: 19px;
  font-weight: 800;
}

.informacoes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.informacao-label {
  color: #98a2b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.informacao-valor {
  margin-top: 4px;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.descricao {
  color: #475467;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
}

.funcionario-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f7;
}

.funcionario-item:last-of-type {
  border-bottom: 0;
}

.funcionario-nome {
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.funcionario-funcao {
  margin-top: 2px;
  color: #98a2b3;
  font-size: 12px;
}

.total-equipe {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #eaecf0;
  color: #667085;
  font-size: 13px;
}

.observacao-finalizada {
  margin-top: 18px;
  padding: 16px;
  border-radius: 14px;
  background: #ecfdf3;
}

.observacao-finalizada-label {
  color: #027a48;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.observacao-finalizada-texto {
  margin-top: 7px;
  color: #344054;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

.status-pendente,
.status-aceito,
.status-rota,
.status-atendimento,
.status-finalizado {
  padding: 7px 12px;
}

.status-pendente {
  color: #f97316;
  background: #fff1df;
}

.status-aceito {
  color: #2563eb;
  background: #dbeafe;
}

.status-rota {
  color: #7c3aed;
  background: #ede9fe;
}

.status-atendimento {
  color: #d97706;
  background: #fef3c7;
}

.status-finalizado {
  color: #059669;
  background: #d1fae5;
}

@media (max-width: 1100px) {
  .atendimento-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .atendimento-page {
    padding: 22px 16px 40px;
  }

  .pagina-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .informacoes-grid {
    grid-template-columns: 1fr;
  }

  .pagina-titulo {
    font-size: 25px;
  }

  .card {
    padding: 20px;
  }

  .card-topo {
    flex-direction: column;
  }
}
</style>