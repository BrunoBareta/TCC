<template>
  <q-page
    class="chamados-admin-page"
    :class="{
      'chamados-admin-page--dark': $q.dark.isActive
    }"
  >
    <!-- =====================================================
         CABEÇALHO DA PÁGINA
    ====================================================== -->

    <div class="pagina-topo">
      <div>
        <h1>
          Chamados
        </h1>

        <p>
          Acompanhe todos os atendimentos registrados no sistema.
        </p>
      </div>

      <q-btn
        flat
        round
        icon="refresh"
        :loading="carregando"
        @click="carregarChamados"
      >
        <q-tooltip>
          Atualizar
        </q-tooltip>
      </q-btn>
    </div>

    <!-- =====================================================
         RESUMO
    ====================================================== -->

    <div class="resumo-grid">
      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--laranja">
          <q-icon
            name="confirmation_number"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ chamados.length }}
          </div>

          <div class="resumo-label">
            Total de chamados
          </div>
        </div>
      </div>

      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--amarelo">
          <q-icon
            name="schedule"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ totalPendentes }}
          </div>

          <div class="resumo-label">
            Pendentes
          </div>
        </div>
      </div>

      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--azul">
          <q-icon
            name="engineering"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ totalAndamento }}
          </div>

          <div class="resumo-label">
            Em andamento
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
            {{ totalFinalizados }}
          </div>

          <div class="resumo-label">
            Finalizados
          </div>
        </div>
      </div>

      <div class="resumo-card">
        <div class="resumo-icone resumo-icone--vermelho">
          <q-icon
            name="cancel"
            size="25px"
          />
        </div>

        <div>
          <div class="resumo-numero">
            {{ totalCancelados }}
          </div>

          <div class="resumo-label">
            Cancelados
          </div>
        </div>
      </div>
    </div>

    <!-- =====================================================
         LISTA
    ====================================================== -->

    <div class="lista-card">
      <div class="lista-cabecalho">
        <div>
          <div class="lista-titulo">
            Todos os chamados
          </div>

          <div class="lista-subtitulo">
            Consulte e filtre os atendimentos da Avioeste.
          </div>
        </div>

        <div class="filtros">
          <q-input
            v-model="pesquisa"
            outlined
            dense
            clearable
            placeholder="Buscar chamado..."
            class="pesquisa-input"
          >
            <template #prepend>
              <q-icon
                name="search"
                size="19px"
              />
            </template>
          </q-input>

          <q-select
            v-model="filtroStatus"
            outlined
            dense
            emit-value
            map-options
            :options="opcoesStatus"
            label="Status"
            class="filtro-select"
          />

          <q-select
            v-model="filtroUrgencia"
            outlined
            dense
            emit-value
            map-options
            :options="opcoesUrgencia"
            label="Urgência"
            class="filtro-select"
          />
        </div>
      </div>

      <div class="resultado-info">
        {{ chamadosFiltrados.length }}

        {{
          chamadosFiltrados.length === 1
            ? 'chamado encontrado'
            : 'chamados encontrados'
        }}

        <button
          v-if="
            filtroStatus ||
            filtroUrgencia ||
            pesquisa
          "
          type="button"
          class="limpar-filtros"
          @click="limparFiltros"
        >
          Limpar filtros
        </button>
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
          Carregando chamados...
        </span>
      </div>

      <!-- VAZIO -->

      <div
        v-else-if="chamadosFiltrados.length === 0"
        class="vazio"
      >
        <div class="vazio-icone">
          <q-icon
            name="confirmation_number"
            size="32px"
          />
        </div>

        <strong>
          Nenhum chamado encontrado
        </strong>

        <span>
          Tente alterar os filtros utilizados.
        </span>
      </div>

      <!-- TABELA -->

      <div
        v-else
        class="tabela-container"
      >
        <table class="chamados-tabela">
          <colgroup>
            <col class="col-chamado" />
            <col class="col-solicitacao" />
            <col class="col-produtor" />
            <col class="col-propriedade" />
            <col class="col-tecnico" />
            <col class="col-urgencia" />
            <col class="col-status" />
            <col class="col-data" />
            <col class="col-acoes" />
          </colgroup>

          <thead>
            <tr>
              <th>Chamado</th>
              <th>Solicitação</th>
              <th>Produtor</th>
              <th>Propriedade</th>
              <th>Técnico</th>
              <th>Urgência</th>
              <th>Status</th>
              <th>Data</th>
              <th class="acao-coluna">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="chamado in chamadosFiltrados"
              :key="chamado.id_chamado"
            >
              <td>
                <strong class="chamado-id">
                  #{{ chamado.id_chamado }}
                </strong>
              </td>

              <td>
                <div class="solicitacao-info">
                  <strong>
                    {{ tituloChamado(chamado) }}
                  </strong>

                  <span>
                    {{ descricaoCurta(chamado) }}
                  </span>
                </div>
              </td>

              <td>
                <div class="pessoa-info">
                  <q-icon
                    name="person_outline"
                    size="17px"
                  />

                  {{ nomeProdutor(chamado) }}
                </div>
              </td>

              <td>
                {{ nomePropriedade(chamado) }}
              </td>

              <td>
                <div
                  class="tecnico-info"
                  :class="{
                    'tecnico-info--vazio':
                      !possuiTecnico(chamado)
                  }"
                >
                  <q-icon
                    :name="
                      possuiTecnico(chamado)
                        ? 'engineering'
                        : 'person_off'
                    "
                    size="17px"
                  />

                  {{ nomeTecnico(chamado) }}
                </div>
              </td>

              <td>
                <q-badge
                  rounded
                  :color="corUrgencia(chamado.urgencia)"
                  :label="formatarUrgencia(chamado.urgencia)"
                />
              </td>

              <td>
                <q-badge
                  rounded
                  :color="corStatus(chamado.status)"
                  :label="formatarStatus(chamado.status)"
                />
              </td>

              <td>
                {{ formatarData(dataChamado(chamado)) }}
              </td>

              <td class="acao-coluna">
                <q-btn
                  outline
                  no-caps
                  color="orange"
                  size="sm"
                  icon="visibility"
                  label="Ver"
                  class="acao-btn"
                  @click="abrirDetalhes(chamado)"
                >
                  <q-tooltip>
                    Acompanhar atendimento
                  </q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =====================================================
         ACOMPANHAMENTO
    ====================================================== -->

    <q-dialog
      v-model="dialogDetalhes"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        class="acompanhamento-dialog"
        :class="{
          'acompanhamento-dialog--dark':
            $q.dark.isActive
        }"
      >
        <!-- CABEÇALHO -->

        <div class="acompanhamento-header">
          <div class="acompanhamento-header-esquerda">
            <q-btn
              flat
              round
              dense
              icon="arrow_back"
              @click="dialogDetalhes = false"
            >
              <q-tooltip>
                Voltar para chamados
              </q-tooltip>
            </q-btn>

            <div class="header-chamado">
              <div class="acompanhamento-superior">
                ACOMPANHAMENTO DO ATENDIMENTO
              </div>

              <div
                v-if="chamadoSelecionado"
                class="acompanhamento-titulo"
              >
                Chamado #{{ chamadoSelecionado.id_chamado }}
                •
                {{ tituloChamado(chamadoSelecionado) }}
              </div>

              <div class="acompanhamento-subtitulo">
                Acompanhamento administrativo em tempo real.
              </div>
            </div>
          </div>

          <div class="acompanhamento-header-acoes">
            <div class="atualizacao-automatica">
              <span class="status-online"></span>
              Atualização automática
            </div>

            <q-btn
              outline
              no-caps
              color="orange"
              icon="refresh"
              label="Atualizar agora"
              :loading="atualizandoDetalhes"
              @click="atualizarDetalhesChamado(true)"
            />

            <q-btn
              flat
              round
              icon="close"
              @click="dialogDetalhes = false"
            />
          </div>
        </div>

        <q-separator />

        <!-- CARREGAMENTO -->

        <div
          v-if="carregandoDetalhes"
          class="detalhes-carregando"
        >
          <q-spinner
            color="orange"
            size="48px"
          />

          <span>
            Carregando atendimento...
          </span>
        </div>

        <!-- CONTEÚDO -->

        <div
          v-else-if="chamadoSelecionado"
          class="acompanhamento-conteudo"
        >
          <!-- ===============================================
               RESUMO PRINCIPAL
          ================================================ -->

          <div class="resumo-atendimento-grid">
            <!-- STATUS -->

            <div class="resumo-atendimento-item">
              <div class="resumo-atendimento-icone status">
                <q-icon
                  :name="iconeStatus(chamadoSelecionado.status)"
                  size="24px"
                />
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {{ formatarStatus(chamadoSelecionado.status) }}
                </strong>
              </div>
            </div>

            <!-- TÉCNICO -->

            <div class="resumo-atendimento-item">
              <div class="resumo-atendimento-icone tecnico">
                <q-icon
                  name="engineering"
                  size="24px"
                />
              </div>

              <div>
                <span>
                  Técnico responsável
                </span>

                <strong>
                  {{ nomeTecnico(chamadoSelecionado) }}
                </strong>
              </div>
            </div>

            <!-- PROPRIEDADE -->

            <div class="resumo-atendimento-item">
              <div class="resumo-atendimento-icone propriedade">
                <q-icon
                  name="agriculture"
                  size="24px"
                />
              </div>

              <div>
                <span>
                  Propriedade
                </span>

                <strong>
                  {{ nomePropriedade(chamadoSelecionado) }}
                </strong>
              </div>
            </div>

            <!-- KM -->

            <div class="resumo-atendimento-item resumo-atendimento-item--km">
              <div class="resumo-atendimento-icone km">
                <q-icon
                  name="route"
                  size="24px"
                />
              </div>

              <div>
                <span>
                  Distância percorrida
                </span>

                <strong>
                  {{ distanciaTotalTexto }}
                </strong>
              </div>
            </div>
          </div>

          <!-- CANCELADO -->

          <q-banner
            v-if="
              statusNormalizado(
                chamadoSelecionado.status
              ) === 'CANCELADO'
            "
            rounded
            class="cancelado-banner"
          >
            <div class="cancelado-conteudo">
              <q-icon
                name="cancel"
                size="25px"
              />

              <div>
                <strong>
                  Chamado cancelado
                </strong>

                <span>
                  Este chamado não seguirá para atendimento técnico.
                </span>
              </div>
            </div>
          </q-banner>

          <!-- ===============================================
               LINHA DO TEMPO
          ================================================ -->

          <div
            v-else
            class="painel-card andamento-card"
          >
            <div class="painel-card-cabecalho">
              <div>
                <div class="painel-card-titulo">
                  Andamento do atendimento
                </div>

                <div class="painel-card-subtitulo">
                  Acompanhe a evolução do serviço.
                </div>
              </div>

              <q-badge
                rounded
                :color="corStatus(chamadoSelecionado.status)"
                :label="formatarStatus(chamadoSelecionado.status)"
              />
            </div>

            <div class="etapas-admin">
              <div
                v-for="(etapa, index) in etapasAdmin"
                :key="etapa.status"
                class="etapa-admin"
              >
                <div class="etapa-admin-superior">
                  <div
                    class="etapa-admin-circulo"
                    :class="{
                      'etapa-admin--concluida':
                        indiceEtapaAdmin >= index,

                      'etapa-admin--atual':
                        indiceEtapaAdmin === index
                    }"
                  >
                    <q-icon
                      :name="
                        indiceEtapaAdmin > index
                          ? 'check'
                          : etapa.icone
                      "
                      size="17px"
                    />
                  </div>

                  <div
                    v-if="
                      index <
                      etapasAdmin.length - 1
                    "
                    class="etapa-admin-linha"
                    :class="{
                      'etapa-admin-linha--concluida':
                        indiceEtapaAdmin > index
                    }"
                  ></div>
                </div>

                <div
                  class="etapa-admin-label"
                  :class="{
                    'etapa-admin-label--ativa':
                      indiceEtapaAdmin >= index
                  }"
                >
                  {{ etapa.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- ===============================================
               ÁREA PRINCIPAL
          ================================================ -->

          <div class="conteudo-principal-grid">
            <!-- =================================================
                 COLUNA PRINCIPAL
            ================================================== -->

            <div class="coluna-servico">
              <!-- RESUMO DO SERVIÇO -->

              <div class="painel-card">
                <div class="painel-card-cabecalho">
                  <div>
                    <div class="painel-card-titulo">
                      Resumo do atendimento
                    </div>

                    <div class="painel-card-subtitulo">
                      Deslocamento e informações registradas pelo técnico.
                    </div>
                  </div>

                  <div class="painel-card-icone">
                    <q-icon
                      name="fact_check"
                      size="21px"
                    />
                  </div>
                </div>

                <!-- KM -->

                <div class="secao-interna">
                  <div class="secao-interna-titulo">
                    <q-icon
                      name="route"
                      size="19px"
                    />

                    Deslocamento
                  </div>

                  <div
                    v-if="deslocamentoDetalhes"
                    class="km-grid"
                  >
                    <div class="km-item">
                      <span>
                        KM de saída
                      </span>

                      <strong>
                        {{
                          formatarKm(
                            deslocamentoDetalhes.km_saida
                          )
                        }}
                      </strong>
                    </div>

                    <div class="km-item">
                      <span>
                        KM de retorno
                      </span>

                      <strong>
                        {{
                          formatarKm(
                            deslocamentoDetalhes.km_retorno
                          )
                        }}
                      </strong>
                    </div>

                    <div class="km-item km-item--destaque">
                      <span>
                        Distância total
                      </span>

                      <strong>
                        {{ distanciaTotalTexto }}
                      </strong>
                    </div>
                  </div>

                  <div
                    v-else
                    class="informacao-vazia"
                  >
                    Nenhum deslocamento foi registrado neste chamado.
                  </div>
                </div>

                <q-separator class="separador-interno" />

                <!-- OBSERVAÇÃO -->

                <div class="secao-interna">
                  <div class="secao-interna-titulo">
                    <q-icon
                      name="notes"
                      size="19px"
                    />

                    Relato do técnico
                  </div>

                  <div
                    v-if="
                      respostaTecnico(
                        chamadoSelecionado
                      )
                    "
                    class="observacao-admin"
                  >
                    {{
                      respostaTecnico(
                        chamadoSelecionado
                      )
                    }}
                  </div>

                  <div
                    v-else
                    class="informacao-vazia"
                  >
                    Nenhuma observação registrada até o momento.
                  </div>
                </div>
              </div>

              <!-- MATERIAIS -->

              <div class="q-mt-lg">
                <MateriaisAtendimento
                  :key="`materiais-${chaveAtualizacao}`"
                  :id-chamado="chamadoSelecionado.id_chamado"
                  :somente-leitura="true"
                />
              </div>

              <!-- FOTOS E VÍDEOS -->

              <div class="complementares complementares--coluna q-mt-lg">
                <q-expansion-item
                  icon="photo_library"
                  label="Fotos e vídeos"
                  caption="Arquivos enviados com a solicitação"
                  header-class="expansao-header"
                  expand-icon-class="text-orange"
                >
                  <div class="expansao-conteudo">
                    <AnexosChamado
                      :key="`anexos-${chaveAtualizacao}`"
                      :id-chamado="chamadoSelecionado.id_chamado"
                    />
                  </div>
                </q-expansion-item>
              </div>
            </div>

            <!-- =================================================
                 COLUNA LATERAL
            ================================================== -->

            <div class="coluna-dados">
              <!-- DADOS DO CHAMADO -->

              <div class="painel-card">
                <div class="painel-card-cabecalho">
                  <div>
                    <div class="painel-card-titulo">
                      Dados do chamado
                    </div>

                    <div class="painel-card-subtitulo">
                      Informações da solicitação e do atendimento.
                    </div>
                  </div>

                  <div class="painel-card-icone">
                    <q-icon
                      name="description"
                      size="21px"
                    />
                  </div>
                </div>

                <div class="problema-admin">
                  <span>
                    Solicitação
                  </span>

                  <strong>
                    {{ tituloChamado(chamadoSelecionado) }}
                  </strong>

                  <p>
                    {{ descricaoCompleta(chamadoSelecionado) }}
                  </p>
                </div>

                <div class="dados-chamado-grid">
                  <div>
                    <span>
                      Produtor
                    </span>

                    <strong>
                      {{ nomeProdutor(chamadoSelecionado) }}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Propriedade
                    </span>

                    <strong>
                      {{ nomePropriedade(chamadoSelecionado) }}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Urgência
                    </span>

                    <strong>
                      {{ formatarUrgencia(chamadoSelecionado.urgencia) }}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Tipo do chamado
                    </span>

                    <strong>
                      {{
                        formatarTipoChamado(
                          chamadoSelecionado.tipo_chamado
                        )
                      }}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Aberto em
                    </span>

                    <strong>
                      {{
                        formatarDataHora(
                          dataChamado(
                            chamadoSelecionado
                          )
                        )
                      }}
                    </strong>
                  </div>

                  <div
                    v-if="
                      chamadoSelecionado.data_finalizacao ||
                      chamadoSelecionado.data_fechamento
                    "
                  >
                    <span>
                      Finalizado em
                    </span>

                    <strong>
                      {{
                        formatarDataHora(
                          chamadoSelecionado.data_finalizacao ||
                          chamadoSelecionado.data_fechamento
                        )
                      }}
                    </strong>
                  </div>

                </div>
              </div>

              <!-- LOCAL DO ATENDIMENTO -->

              <div class="painel-card q-mt-lg local-admin-card">
                <div class="painel-card-cabecalho painel-card-cabecalho--compacto">
                  <div>
                    <div class="painel-card-titulo">
                      Local do atendimento
                    </div>

                    <div class="painel-card-subtitulo">
                      {{ textoOrigemLocalizacaoAdmin }}
                    </div>
                  </div>

                  <div class="painel-card-icone">
                    <q-icon
                      name="location_on"
                      size="21px"
                    />
                  </div>
                </div>

                <div class="local-admin-endereco">
                  <q-icon
                    name="place"
                    color="orange"
                    size="18px"
                  />

                  <div>
                    <span>
                      Endereço
                    </span>

                    <strong>
                      {{ enderecoAtendimentoAdmin }}
                    </strong>
                  </div>
                </div>

                <div
                  v-if="possuiCoordenadasAtendimentoAdmin"
                  class="local-admin-acoes"
                >
                  <q-btn
                    outline
                    no-caps
                    color="orange"
                    icon="map"
                    :label="
                      mostrarMapaAdmin
                        ? 'Ocultar mapa'
                        : 'Ver mapa'
                    "
                    @click="mostrarMapaAdmin = !mostrarMapaAdmin"
                  />

                  <q-btn
                    unelevated
                    no-caps
                    color="orange"
                    icon="near_me"
                    label="Abrir rota"
                    @click="abrirRotaAdmin"
                  />
                </div>

                <q-slide-transition>
                  <div
                    v-show="
                      mostrarMapaAdmin &&
                      possuiCoordenadasAtendimentoAdmin
                    "
                    class="local-admin-mapa"
                  >
                    <MapaLocalizacao
                      class="mapa-admin-compacto"
                      :key="`admin-local-${chamadoSelecionado.id_chamado}-${latitudeAtendimentoAdmin}-${longitudeAtendimentoAdmin}`"
                      :latitude="latitudeAtendimentoAdmin"
                      :longitude="longitudeAtendimentoAdmin"
                      titulo="Localização do atendimento"
                      :subtitulo="textoOrigemLocalizacaoAdmin"
                      nome-local="Local do atendimento"
                      :endereco="enderecoAtendimentoAdmin"
                    />
                  </div>
                </q-slide-transition>

                <div
                  v-if="!possuiCoordenadasAtendimentoAdmin"
                  class="local-admin-sem-coordenadas"
                >
                  <q-icon
                    name="location_off"
                    size="18px"
                  />

                  <span>
                    Este chamado possui somente o endereço escrito.
                  </span>
                </div>
              </div>

              <!-- EQUIPE -->

              <div class="painel-card q-mt-lg">
                <div class="painel-card-cabecalho painel-card-cabecalho--compacto">
                  <div>
                    <div class="painel-card-titulo">
                      Equipe responsável
                    </div>
                  </div>

                  <div class="painel-card-icone">
                    <q-icon
                      name="groups"
                      size="21px"
                    />
                  </div>
                </div>

                <div
                  v-if="equipeDetalhes.length === 0"
                  class="informacao-vazia"
                >
                  Nenhum técnico vinculado.
                </div>

                <div
                  v-else
                  class="equipe-lista"
                >
                  <div
                    v-for="funcionario in equipeDetalhes"
                    :key="funcionario.id_chamado_funcionario"
                    class="funcionario-item"
                  >
                    <q-avatar
                      size="39px"
                      class="funcionario-avatar"
                    >
                      {{ iniciais(funcionario.nome) }}
                    </q-avatar>

                    <div>
                      <strong>
                        {{ funcionario.nome }}
                      </strong>

                      <span>
                        {{
                          formatarTextoGeral(
                            funcionario.funcao_atendimento
                          )
                        }}
                      </span>

                      <small v-if="funcionario.data_aceite">
                        Aceitou em
                        {{ formatarDataHora(funcionario.data_aceite) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===============================================
               HISTÓRICO COMPLETO
          ================================================ -->

          <div class="complementares">
            <!-- HISTÓRICO -->

            <q-expansion-item
              icon="history"
              label="Histórico completo"
              caption="Veja todas as alterações realizadas no chamado"
              header-class="expansao-header"
              expand-icon-class="text-orange"
            >
              <div class="expansao-conteudo">
                <HistoricoChamado
                  :chamado="chamadoSelecionado"
                  :historicos="historicosDetalhes"
                  :carregando="carregandoHistorico"
                />
              </div>
            </q-expansion-item>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  useRoute
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import chamadoService from
  'src/services/chamadoService'

import chamadoFuncionarioService from
  'src/services/chamadoFuncionarioService'

import historicoService from
  'src/services/historicoService'

import deslocamentoService from
  'src/services/deslocamentoService'

import MateriaisAtendimento from
  'src/components/tecnico/materiais/MateriaisAtendimento.vue'

import AnexosChamado from
  'src/components/shared/AnexosChamado.vue'

import HistoricoChamado from
  'src/components/produtor/chamados/detalhes/HistoricoChamado.vue'

import MapaLocalizacao from
  'src/components/shared/MapaLocalizacao.vue'

const $q =
  useQuasar()

const route =
  useRoute()

const carregando =
  ref(false)

const carregadoUmaVez =
  ref(false)

const carregandoDetalhes =
  ref(false)

const atualizandoDetalhes =
  ref(false)

const carregandoHistorico =
  ref(false)

const chamados =
  ref([])

const pesquisa =
  ref('')

const filtroStatus =
  ref(null)

const filtroUrgencia =
  ref(null)

const dialogDetalhes =
  ref(false)

const chamadoSelecionado =
  ref(null)

const equipeDetalhes =
  ref([])

const historicosDetalhes =
  ref([])

const deslocamentoDetalhes =
  ref(null)

const chaveAtualizacao =
  ref(0)

const mostrarMapaAdmin =
  ref(false)

let intervaloAtualizacao =
  null

/* =====================================================
   ETAPAS
===================================================== */

const etapasAdmin = [
  {
    status:
      'PENDENTE',

    label:
      'Pendente',

    icone:
      'schedule'
  },

  {
    status:
      'ACEITO',

    label:
      'Aceito',

    icone:
      'thumb_up'
  },

  {
    status:
      'EM_ROTA',

    label:
      'Em deslocamento',

    icone:
      'local_shipping'
  },

  {
    status:
      'EM_ATENDIMENTO',

    label:
      'Em atendimento',

    icone:
      'engineering'
  },

  {
    status:
      'FINALIZADO',

    label:
      'Finalizado',

    icone:
      'check_circle'
  }
]

const indiceEtapaAdmin =
  computed(() => {
    const status =
      statusNormalizado(
        chamadoSelecionado.value
          ?.status
      )

    const mapa = {
      PENDENTE:
        0,

      ACEITO:
        1,

      EM_ROTA:
        2,

      EM_ATENDIMENTO:
        3,

      FINALIZADO:
        4,

      CONCLUIDO:
        4
    }

    return (
      mapa[status] ??
      -1
    )
  })

/* =====================================================
   DESLOCAMENTO
===================================================== */

const distanciaTotal =
  computed(() => {
    if (
      !deslocamentoDetalhes.value
    ) {
      return null
    }

    const total =
      converterNumero(
        deslocamentoDetalhes.value
          .km_total
      )

    if (
      Number.isFinite(total)
    ) {
      return total
    }

    const saida =
      converterNumero(
        deslocamentoDetalhes.value
          .km_saida
      )

    const retorno =
      converterNumero(
        deslocamentoDetalhes.value
          .km_retorno
      )

    if (
      Number.isFinite(saida) &&
      Number.isFinite(retorno) &&
      retorno >= saida
    ) {
      return (
        retorno -
        saida
      )
    }

    return null
  })

const distanciaTotalTexto =
  computed(() => {
    if (
      !Number.isFinite(
        distanciaTotal.value
      )
    ) {
      return 'Não registrada'
    }

    return formatarKm(
      distanciaTotal.value
    )
  })

/* =====================================================
   OPÇÕES DOS FILTROS
===================================================== */

const opcoesStatus = [
  {
    label:
      'Todos os status',

    value:
      null
  },

  {
    label:
      'Pendente',

    value:
      'PENDENTE'
  },

  {
    label:
      'Em andamento',

    value:
      'ANDAMENTO'
  },

  {
    label:
      'Aceito',

    value:
      'ACEITO'
  },

  {
    label:
      'Em rota',

    value:
      'EM_ROTA'
  },

  {
    label:
      'Em atendimento',

    value:
      'EM_ATENDIMENTO'
  },

  {
    label:
      'Finalizado',

    value:
      'FINALIZADO'
  },

  {
    label:
      'Cancelado',

    value:
      'CANCELADO'
  }
]

const opcoesUrgencia = [
  {
    label:
      'Todas as urgências',

    value:
      null
  },

  {
    label:
      'Baixa',

    value:
      'BAIXA'
  },

  {
    label:
      'Média',

    value:
      'MEDIA'
  },

  {
    label:
      'Alta',

    value:
      'ALTA'
  }
]

/* =====================================================
   CONTADORES
===================================================== */

const totalPendentes =
  computed(() => {
    return chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'PENDENTE'
    ).length
  })

const totalAndamento =
  computed(() => {
    const andamento = [
      'ACEITO',
      'EM_ROTA',
      'EM_ATENDIMENTO'
    ]

    return chamados.value.filter(
      chamado =>
        andamento.includes(
          statusNormalizado(
            chamado.status
          )
        )
    ).length
  })

const totalFinalizados =
  computed(() => {
    return chamados.value.filter(
      chamado =>
        [
          'FINALIZADO',
          'CONCLUIDO'
        ].includes(
          statusNormalizado(
            chamado.status
          )
        )
    ).length
  })

const totalCancelados =
  computed(() => {
    return chamados.value.filter(
      chamado =>
        statusNormalizado(
          chamado.status
        ) === 'CANCELADO'
    ).length
  })

/* =====================================================
   FILTRAGEM
===================================================== */

const chamadosFiltrados =
  computed(() => {
    let lista =
      [...chamados.value]

    if (
      filtroStatus.value
    ) {
      if (
        filtroStatus.value ===
        'ANDAMENTO'
      ) {
        const andamento = [
          'ACEITO',
          'EM_ROTA',
          'EM_ATENDIMENTO'
        ]

        lista =
          lista.filter(
            chamado =>
              andamento.includes(
                statusNormalizado(
                  chamado.status
                )
              )
          )
      } else {
        lista =
          lista.filter(
            chamado =>
              statusNormalizado(
                chamado.status
              ) ===
              filtroStatus.value
          )
      }
    }

    if (
      filtroUrgencia.value
    ) {
      lista =
        lista.filter(
          chamado =>
            urgenciaNormalizada(
              chamado.urgencia
            ) ===
            filtroUrgencia.value
        )
    }

    const termo =
      String(
        pesquisa.value ||
        ''
      )
        .trim()
        .toLowerCase()

    if (termo) {
      lista =
        lista.filter(
          chamado => {
            const texto =
              [
                chamado.id_chamado,
                tituloChamado(chamado),
                descricaoCompleta(chamado),
                nomeProdutor(chamado),
                nomePropriedade(chamado),
                nomeTecnico(chamado),
                formatarStatus(chamado.status)
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return texto.includes(
              termo
            )
          }
        )
    }

    return lista.sort(
      (a, b) => {
        return (
          new Date(
            dataChamado(b) ||
            0
          ).getTime() -
          new Date(
            dataChamado(a) ||
            0
          ).getTime()
        )
      }
    )
  })

/* =====================================================
   FILTRO RECEBIDO DO DASHBOARD
===================================================== */

function aplicarFiltroDaRota() {
  const status =
    String(
      route.query.status ||
      ''
    )
      .trim()
      .toUpperCase()

  const permitidos = [
    'PENDENTE',
    'ANDAMENTO',
    'ACEITO',
    'EM_ROTA',
    'EM_ATENDIMENTO',
    'FINALIZADO',
    'CANCELADO'
  ]

  filtroStatus.value =
    permitidos.includes(
      status
    )
      ? status
      : null
}

/* =====================================================
   CARREGAR CHAMADOS
===================================================== */

async function carregarChamados() {
  carregando.value =
    true

  try {
    const resposta =
      await chamadoService
        .listar()

    chamados.value =
      Array.isArray(
        resposta
      )
        ? resposta
        : []

    carregadoUmaVez.value =
      true

    const idQuery =
      Number(
        route.query.chamado
      )

    if (
      idQuery &&
      Number.isFinite(
        idQuery
      )
    ) {
      const encontrado =
        chamados.value.find(
          chamado =>
            Number(
              chamado.id_chamado
            ) ===
            idQuery
        )

      if (encontrado) {
        await abrirDetalhes(
          encontrado
        )
      }
    }
  } catch (error) {
    console.error(
      'Erro ao carregar chamados:',
      error
    )

    $q.notify({
      type:
        'negative',

      message:
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Não foi possível carregar os chamados.'
    })
  } finally {
    carregando.value =
      false
  }
}

/* =====================================================
   ABRIR ACOMPANHAMENTO
===================================================== */

async function abrirDetalhes(
  chamado
) {
  dialogDetalhes.value =
    true

  carregandoDetalhes.value =
    true

  chamadoSelecionado.value =
    chamado

  equipeDetalhes.value =
    []

  historicosDetalhes.value =
    []

  deslocamentoDetalhes.value =
    null

  mostrarMapaAdmin.value =
    false

  try {
    await atualizarDetalhesChamado(
      false
    )
  } finally {
    carregandoDetalhes.value =
      false
  }
}

/* =====================================================
   ATUALIZAR ACOMPANHAMENTO
===================================================== */

async function atualizarDetalhesChamado(
  mostrarAviso = false
) {
  const idChamado =
    Number(
      chamadoSelecionado.value
        ?.id_chamado
    )

  if (
    !Number.isInteger(
      idChamado
    ) ||
    idChamado <= 0
  ) {
    return
  }

  atualizandoDetalhes.value =
    true

  carregandoHistorico.value =
    true

  try {
    const [
      detalhes,
      equipe,
      historico,
      deslocamento
    ] =
      await Promise.allSettled([
        chamadoService
          .buscarPorId(
            idChamado
          ),

        chamadoFuncionarioService
          .listarPorChamado(
            idChamado
          ),

        historicoService
          .listarPorChamado(
            idChamado
          ),

        deslocamentoService
          .buscarPorChamado(
            idChamado
          )
      ])

    if (
      detalhes.status ===
      'fulfilled'
    ) {
      chamadoSelecionado.value =
        detalhes.value?.chamado ||
        detalhes.value
    }

    if (
      equipe.status ===
      'fulfilled'
    ) {
      equipeDetalhes.value =
        Array.isArray(
          equipe.value
        )
          ? equipe.value
          : equipe.value?.data ||
            []
    }

    if (
      historico.status ===
      'fulfilled'
    ) {
      historicosDetalhes.value =
        Array.isArray(
          historico.value
        )
          ? historico.value
          : historico.value?.data ||
            []
    }

    if (
      deslocamento.status ===
      'fulfilled'
    ) {
      deslocamentoDetalhes.value =
        deslocamento.value
          ?.deslocamento ||
        deslocamento.value ||
        null
    } else {
      deslocamentoDetalhes.value =
        null
    }

    chaveAtualizacao.value +=
      1

    if (
      mostrarAviso
    ) {
      $q.notify({
        type:
          'positive',

        message:
          'Acompanhamento atualizado.'
      })
    }
  } catch (error) {
    console.error(
      'Erro ao atualizar acompanhamento:',
      error
    )

    if (
      mostrarAviso
    ) {
      $q.notify({
        type:
          'negative',

        message:
          'Não foi possível atualizar o acompanhamento.'
      })
    }
  } finally {
    atualizandoDetalhes.value =
      false

    carregandoHistorico.value =
      false
  }
}

/* =====================================================
   ATUALIZAÇÃO AUTOMÁTICA
===================================================== */

function iniciarAtualizacaoAutomatica() {
  pararAtualizacaoAutomatica()

  intervaloAtualizacao =
    window.setInterval(
      () => {
        if (
          dialogDetalhes.value &&
          chamadoSelecionado.value
            ?.id_chamado
        ) {
          atualizarDetalhesChamado(
            false
          )
        }
      },
      30000
    )
}

function pararAtualizacaoAutomatica() {
  if (
    intervaloAtualizacao
  ) {
    window.clearInterval(
      intervaloAtualizacao
    )

    intervaloAtualizacao =
      null
  }
}

/* =====================================================
   FILTROS
===================================================== */

function limparFiltros() {
  pesquisa.value =
    ''

  filtroStatus.value =
    null

  filtroUrgencia.value =
    null
}

/* =====================================================
   STATUS
===================================================== */

function statusNormalizado(
  status
) {
  return String(
    status ||
    ''
  )
    .trim()
    .toUpperCase()
}

function formatarStatus(
  status
) {
  const nomes = {
    PENDENTE:
      'Pendente',

    ACEITO:
      'Aceito',

    EM_ROTA:
      'Em rota',

    EM_ATENDIMENTO:
      'Em atendimento',

    FINALIZADO:
      'Finalizado',

    CONCLUIDO:
      'Finalizado',

    CANCELADO:
      'Cancelado'
  }

  const valor =
    statusNormalizado(
      status
    )

  return (
    nomes[valor] ||
    valor ||
    'Não informado'
  )
}

function corStatus(
  status
) {
  const cores = {
    PENDENTE:
      'orange',

    ACEITO:
      'blue',

    EM_ROTA:
      'purple',

    EM_ATENDIMENTO:
      'primary',

    FINALIZADO:
      'positive',

    CONCLUIDO:
      'positive',

    CANCELADO:
      'negative'
  }

  return (
    cores[
      statusNormalizado(
        status
      )
    ] ||
    'grey'
  )
}

function iconeStatus(
  status
) {
  const icones = {
    PENDENTE:
      'schedule',

    ACEITO:
      'thumb_up',

    EM_ROTA:
      'local_shipping',

    EM_ATENDIMENTO:
      'engineering',

    FINALIZADO:
      'check_circle',

    CONCLUIDO:
      'check_circle',

    CANCELADO:
      'cancel'
  }

  return (
    icones[
      statusNormalizado(
        status
      )
    ] ||
    'help_outline'
  )
}

/* =====================================================
   URGÊNCIA
===================================================== */

function urgenciaNormalizada(
  urgencia
) {
  return String(
    urgencia ||
    ''
  )
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function formatarUrgencia(
  urgencia
) {
  const nomes = {
    BAIXA:
      'Baixa',

    MEDIA:
      'Média',

    ALTA:
      'Alta'
  }

  return (
    nomes[
      urgenciaNormalizada(
        urgencia
      )
    ] ||
    'Não informada'
  )
}

function corUrgencia(
  urgencia
) {
  const cores = {
    BAIXA:
      'green',

    MEDIA:
      'orange',

    ALTA:
      'red'
  }

  return (
    cores[
      urgenciaNormalizada(
        urgencia
      )
    ] ||
    'grey'
  )
}

/* =====================================================
   CHAMADO
===================================================== */

function tituloChamado(
  chamado
) {
  return (
    chamado.problema ||
    chamado.solicitacao ||
    chamado.titulo ||
    'Solicitação de atendimento'
  )
}

function descricaoCompleta(
  chamado
) {
  return (
    chamado.descricao ||
    chamado.solicitacao ||
    chamado.problema ||
    'Nenhuma descrição informada.'
  )
}

function descricaoCurta(
  chamado
) {
  const descricao =
    descricaoCompleta(
      chamado
    )

  return (
    descricao.length <= 65
      ? descricao
      : `${descricao.substring(
          0,
          65
        )}...`
  )
}

function nomeProdutor(
  chamado
) {
  return (
    chamado.nome_produtor ||
    chamado.produtor_nome ||
    chamado.nome_usuario ||
    chamado.usuario_nome ||
    chamado.nome_solicitante ||
    'Não informado'
  )
}

function nomePropriedade(
  chamado
) {
  return (
    chamado.nome_propriedade ||
    chamado.propriedade_nome ||
    chamado.propriedade ||
    'Não informada'
  )
}

function nomeTecnico(
  chamado
) {
  return (
    chamado.nome_funcionario ||
    chamado.nome_tecnico ||
    chamado.funcionario_nome ||
    chamado.tecnico_nome ||
    chamado.responsavel ||
    'Não atribuído'
  )
}

function possuiTecnico(
  chamado
) {
  return (
    nomeTecnico(
      chamado
    ) !==
    'Não atribuído'
  )
}

function respostaTecnico(
  chamado
) {
  return (
    chamado.resposta_tecnico ||
    chamado.observacao ||
    chamado.observacoes ||
    chamado.observacao_final ||
    null
  )
}

/* =====================================================
   LOCALIZAÇÃO
===================================================== */

function converterCoordenadaLocalizacao(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return null
  }

  const numero =
    Number(
      String(valor)
        .trim()
        .replace(',', '.')
    )

  return Number.isFinite(numero)
    ? numero
    : null
}

const latitudeAtendimentoAdmin =
  computed(() => {
    const chamado =
      chamadoSelecionado.value

    const latitudeChamado =
      converterCoordenadaLocalizacao(
        chamado?.latitude_atendimento
      )

    if (
      latitudeChamado !== null
    ) {
      return latitudeChamado
    }

    return converterCoordenadaLocalizacao(
      chamado?.latitude_propriedade
    )
  })

const longitudeAtendimentoAdmin =
  computed(() => {
    const chamado =
      chamadoSelecionado.value

    const longitudeChamado =
      converterCoordenadaLocalizacao(
        chamado?.longitude_atendimento
      )

    if (
      longitudeChamado !== null
    ) {
      return longitudeChamado
    }

    return converterCoordenadaLocalizacao(
      chamado?.longitude_propriedade
    )
  })

const possuiCoordenadasAtendimentoAdmin =
  computed(() => {
    const latitude =
      latitudeAtendimentoAdmin.value

    const longitude =
      longitudeAtendimentoAdmin.value

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      !(latitude === 0 && longitude === 0) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    )
  })

const enderecoAtendimentoAdmin =
  computed(() => {
    const chamado =
      chamadoSelecionado.value

    if (!chamado) {
      return 'Não informado'
    }

    const enderecoEspecifico =
      String(
        chamado.endereco_atendimento ||
        ''
      ).trim()

    if (enderecoEspecifico) {
      return enderecoEspecifico
    }

    const endereco =
      String(
        chamado.endereco_propriedade ||
        chamado.endereco ||
        ''
      ).trim()

    const cidade =
      String(
        chamado.cidade_propriedade ||
        chamado.cidade ||
        ''
      ).trim()

    const estado =
      String(
        chamado.estado_propriedade ||
        chamado.estado ||
        ''
      ).trim()

    const cidadeEstado =
      [
        cidade,
        estado
      ]
        .filter(Boolean)
        .join(' - ')

    return (
      [
        endereco,
        cidadeEstado
      ]
        .filter(Boolean)
        .join(', ') ||
      'Não informado'
    )
  })

const textoOrigemLocalizacaoAdmin =
  computed(() => {
    const origem =
      String(
        chamadoSelecionado.value
          ?.origem_localizacao ||
        ''
      )
        .trim()
        .toUpperCase()

    if (origem === 'ATUAL') {
      return 'Localização informada pelo produtor neste chamado.'
    }

    if (origem === 'PESQUISA') {
      return 'Endereço escolhido pelo produtor neste chamado.'
    }

    return 'Localização cadastrada da propriedade.'
  })

function abrirRotaAdmin() {
  if (
    !possuiCoordenadasAtendimentoAdmin.value
  ) {
    return
  }

  const latitude =
    latitudeAtendimentoAdmin.value

  const longitude =
    longitudeAtendimentoAdmin.value

  const url =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

  window.open(
    url,
    '_blank',
    'noopener,noreferrer'
  )
}

function enderecoChamado(
  chamado
) {
  return (
    chamado.endereco_atendimento ||
    chamado.endereco ||
    chamado.endereco_propriedade ||
    null
  )
}

function cidadeChamado(
  chamado
) {
  const cidade =
    chamado.cidade ||
    chamado.cidade_propriedade ||
    ''

  const estado =
    chamado.estado ||
    chamado.estado_propriedade ||
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
    null
  )
}

/* =====================================================
   TIPO
===================================================== */

function formatarTipoChamado(
  tipo
) {
  const valor =
    String(
      tipo ||
      ''
    )
      .trim()
      .toUpperCase()

  const nomes = {
    ASSISTENCIA:
      'Assistência técnica',

    VENDEDOR:
      'Solicitação de vendedor'
  }

  return (
    nomes[valor] ||
    valor ||
    'Não informado'
  )
}

/* =====================================================
   DATA
===================================================== */

function dataChamado(
  chamado
) {
  return (
    chamado.data_abertura ||
    chamado.data_cadastro ||
    chamado.data_criacao ||
    chamado.criado_em ||
    null
  )
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
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric'
      }
    )
    .format(objeto)
}

function formatarDataHora(
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
          'numeric',

        hour:
          '2-digit',

        minute:
          '2-digit'
      }
    )
    .format(objeto)
}

/* =====================================================
   KM
===================================================== */

function converterNumero(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return NaN
  }

  return Number(
    String(valor)
      .replace(
        ',',
        '.'
      )
  )
}

function formatarKm(
  valor
) {
  const numero =
    converterNumero(
      valor
    )

  if (
    !Number.isFinite(
      numero
    )
  ) {
    return 'Não informado'
  }

  return `${numero.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits:
        2
    }
  )} km`
}

/* =====================================================
   TEXTO
===================================================== */

function formatarTextoGeral(
  valor
) {
  if (!valor) {
    return 'Não informado'
  }

  return String(valor)
    .replaceAll(
      '_',
      ' '
    )
    .toLowerCase()
    .replace(
      /^\w/,
      letra =>
        letra.toUpperCase()
    )
}

function iniciais(
  nome
) {
  return String(
    nome ||
    '?'
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(
      0,
      2
    )
    .map(
      parte =>
        parte.charAt(0)
    )
    .join('')
    .toUpperCase()
}

/* =====================================================
   WATCHERS
===================================================== */

watch(
  dialogDetalhes,
  aberto => {
    if (aberto) {
      iniciarAtualizacaoAutomatica()
    } else {
      pararAtualizacaoAutomatica()
    }
  }
)

watch(
  () =>
    route.query.status,

  () => {
    aplicarFiltroDaRota()
  }
)

onBeforeUnmount(
  () => {
    pararAtualizacaoAutomatica()
  }
)

onMounted(
  () => {
    aplicarFiltroDaRota()
    carregarChamados()
  }
)
</script>

<style scoped>
/* =====================================================
   PÁGINA
===================================================== */

.chamados-admin-page {
  min-height: 100%;
  padding: 30px;
  background: #f5f6f8;
}

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

/* =====================================================
   RESUMO DA LISTA
===================================================== */

.resumo-grid {
  display: grid;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
  gap: 15px;
  margin-bottom: 17px;
}

.resumo-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 19px;
  border: 1px solid #eaecf0;
  border-radius: 15px;
  background: #ffffff;
}

.resumo-icone {
  width: 46px;
  height: 46px;
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

.resumo-icone--amarelo {
  color: #d97706;
  background: #fffbeb;
}

.resumo-icone--azul {
  color: #2563eb;
  background: #eff6ff;
}

.resumo-icone--verde {
  color: #16a34a;
  background: #f0fdf4;
}

.resumo-icone--vermelho {
  color: #dc2626;
  background: #fef2f2;
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

/* =====================================================
   LISTAGEM
===================================================== */

.lista-card {
  padding: 22px;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.lista-cabecalho {
  display: flex;
  align-items: flex-start;
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
  gap: 8px;
}

.pesquisa-input {
  width: 260px;
}

.filtro-select {
  width: 155px;
}

.resultado-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding-bottom: 13px;
  border-bottom: 1px solid #eaecf0;
  color: #98a2b3;
  font-size: 9px;
}

.limpar-filtros {
  padding: 0;
  border: none;
  color: #f97316;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
}

/* =====================================================
   TABELA
===================================================== */

.tabela-container {
  width: 100%;
  overflow-x: hidden;
}

.chamados-tabela {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.chamados-tabela .col-chamado {
  width: 7%;
}

.chamados-tabela .col-solicitacao {
  width: 23%;
}

.chamados-tabela .col-produtor {
  width: 12%;
}

.chamados-tabela .col-propriedade {
  width: 12%;
}

.chamados-tabela .col-tecnico {
  width: 13%;
}

.chamados-tabela .col-urgencia {
  width: 8%;
}

.chamados-tabela .col-status {
  width: 10%;
}

.chamados-tabela .col-data {
  width: 8%;
}

.chamados-tabela .col-acoes {
  width: 7%;
}

.chamados-tabela th {
  padding: 12px 6px;
  border-bottom: 1px solid #eaecf0;
  color: #98a2b3;
  font-size: 7.5px;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.chamados-tabela td {
  min-width: 0;
  padding: 14px 6px;
  border-bottom: 1px solid #f2f4f7;
  color: #475467;
  font-size: 8.5px;
  vertical-align: middle;
  overflow: hidden;
}

.chamados-tabela tbody tr:hover {
  background: #fafafa;
}

.chamado-id {
  color: #f97316;
  font-size: 10px;
}

.solicitacao-info {
  min-width: 0;
}

.solicitacao-info strong {
  display: block;
  overflow: hidden;
  color: #344054;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.solicitacao-info span {
  display: block;
  overflow: hidden;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pessoa-info,
.tecnico-info {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  white-space: nowrap;
}

.pessoa-info .q-icon,
.tecnico-info .q-icon {
  flex-shrink: 0;
  color: #667085;
}

.tecnico-info--vazio {
  color: #98a2b3;
  font-style: italic;
}

.acao-coluna {
  text-align: center !important;
}

.acao-btn {
  min-width: 58px;
}

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

.vazio-icone {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: #f97316;
  background: #fff1e6;
}

/* =====================================================
   DIALOG
===================================================== */

.acompanhamento-dialog {
  min-height: 100vh;
  background: #f5f6f8;
}

.acompanhamento-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 17px 26px;
  background: #ffffff;
}

.acompanhamento-header-esquerda {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
}

.header-chamado {
  min-width: 0;
}

.acompanhamento-superior {
  color: #f97316;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.7px;
}

.acompanhamento-titulo {
  margin-top: 2px;
  overflow: hidden;
  color: #101828;
  font-size: 18px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.acompanhamento-subtitulo {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 9px;
}

.acompanhamento-header-acoes {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.atualizacao-automatica {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 20px;
  color: #027a48;
  background: #ecfdf3;
  font-size: 8px;
  font-weight: 800;
}

.status-online {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #12b76a;
  box-shadow:
    0 0 0 4px
    rgba(18, 183, 106, 0.12);
}

.detalhes-carregando {
  min-height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #98a2b3;
}

.acompanhamento-conteudo {
  max-width: 1600px;
  margin: 0 auto;
  padding: 22px 28px 40px;
}

/* =====================================================
   RESUMO PRINCIPAL
===================================================== */

.resumo-atendimento-grid {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap: 12px;
  margin-bottom: 14px;
}

.resumo-atendimento-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px;
  border: 1px solid #eaecf0;
  border-radius: 14px;
  background: #ffffff;
}

.resumo-atendimento-icone {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 11px;
}

.resumo-atendimento-icone.status {
  color: #2563eb;
  background: #eff6ff;
}

.resumo-atendimento-icone.tecnico {
  color: #f97316;
  background: #fff1e6;
}

.resumo-atendimento-icone.propriedade {
  color: #16a34a;
  background: #f0fdf4;
}

.resumo-atendimento-icone.km {
  color: #7c3aed;
  background: #f5f3ff;
}

.resumo-atendimento-item span {
  display: block;
  color: #98a2b3;
  font-size: 8px;
}

.resumo-atendimento-item strong {
  display: block;
  margin-top: 2px;
  color: #344054;
  font-size: 10px;
}

.resumo-atendimento-item--km strong {
  color: #7c3aed;
  font-size: 13px;
}

/* =====================================================
   CARDS
===================================================== */

.painel-card {
  padding: 19px;
  border: 1px solid #eaecf0;
  border-radius: 15px;
  background: #ffffff;
  box-shadow:
    0 3px 12px
    rgba(16, 24, 40, 0.035);
}

.painel-card-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 16px;
}

.painel-card-cabecalho--compacto {
  margin-bottom: 10px;
}

.painel-card-titulo {
  color: #101828;
  font-size: 14px;
  font-weight: 900;
}

.painel-card-subtitulo {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 8px;
}

.painel-card-icone {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  color: #f97316;
  background: #fff1e6;
}

/* =====================================================
   ETAPAS
===================================================== */

.andamento-card {
  margin-bottom: 14px;
}

.etapas-admin {
  display: grid;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.etapa-admin-superior {
  display: flex;
  align-items: center;
}

.etapa-admin-circulo {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #eaecf0;
  border-radius: 50%;
  color: #98a2b3;
  background: #ffffff;
}

.etapa-admin--concluida {
  border-color: #f97316;
  color: #f97316;
  background: #fff7ed;
}

.etapa-admin--atual {
  color: #ffffff;
  background: #f97316;
}

.etapa-admin-linha {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  background: #eaecf0;
}

.etapa-admin-linha--concluida {
  background: #f97316;
}

.etapa-admin-label {
  margin-top: 7px;
  color: #98a2b3;
  font-size: 8px;
  font-weight: 800;
}

.etapa-admin-label--ativa {
  color: #344054;
}

/* =====================================================
   GRID PRINCIPAL
===================================================== */

.conteudo-principal-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1.25fr)
    minmax(420px, 0.85fr);
  gap: 14px;
  align-items: start;
}

/* =====================================================
   RESUMO DO SERVIÇO
===================================================== */

.secao-interna {
  padding: 2px 0;
}

.secao-interna-titulo {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 11px;
  color: #344054;
  font-size: 10px;
  font-weight: 800;
}

.secao-interna-titulo .q-icon {
  color: #f97316;
}

.separador-interno {
  margin: 18px 0;
}

.km-grid {
  display: grid;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  gap: 10px;
}

.km-item {
  padding: 13px;
  border-radius: 11px;
  background: #f9fafb;
}

.km-item--destaque {
  background: #f5f3ff;
}

.km-item span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  text-transform: uppercase;
}

.km-item strong {
  display: block;
  margin-top: 4px;
  color: #344054;
  font-size: 13px;
}

.km-item--destaque strong {
  color: #7c3aed;
}

.observacao-admin {
  padding: 14px;
  border: 1px solid #abefc6;
  border-radius: 11px;
  color: #344054;
  background: #ecfdf3;
  font-size: 10px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.informacao-vazia {
  padding: 14px;
  border-radius: 10px;
  color: #98a2b3;
  background: #f9fafb;
  font-size: 9px;
  text-align: center;
}

/* =====================================================
   DADOS DO CHAMADO
===================================================== */

.problema-admin {
  padding-bottom: 14px;
  border-bottom: 1px solid #eaecf0;
}

.problema-admin > span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  text-transform: uppercase;
}

.problema-admin > strong {
  display: block;
  margin-top: 4px;
  color: #344054;
  font-size: 14px;
  font-weight: 800;
}

.problema-admin p {
  margin: 7px 0 0;
  color: #667085;
  font-size: 10px;
  line-height: 1.6;
}

.dados-chamado-grid {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  gap: 8px;
  margin-top: 13px;
}

.dados-chamado-grid > div {
  padding: 10px;
  border-radius: 9px;
  background: #f9fafb;
}

.dados-chamado-grid span {
  display: block;
  color: #98a2b3;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
}

.dados-chamado-grid strong {
  display: block;
  margin-top: 4px;
  color: #344054;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
}

/* =====================================================
   LOCAL DO ATENDIMENTO
===================================================== */

.local-admin-card {
  overflow: hidden;
}

.local-admin-endereco {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 11px;
  border-radius: 10px;
  background: #f9fafb;
}

.local-admin-endereco > .q-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.local-admin-endereco span {
  display: block;
  color: #98a2b3;
  font-size: 7px;
  font-weight: 700;
  text-transform: uppercase;
}

.local-admin-endereco strong {
  display: block;
  margin-top: 3px;
  color: #344054;
  font-size: 9px;
  line-height: 1.45;
}

.local-admin-acoes {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  gap: 8px;
  margin-top: 10px;
}

.local-admin-mapa {
  margin-top: 12px;
}

/* Mapa mais compacto no acompanhamento administrativo.
   O card externo já possui título, origem e endereço, então
   escondemos as informações repetidas do componente interno. */
.mapa-admin-compacto :deep(.mapa-cabecalho),
.mapa-admin-compacto :deep(.localizacao-info) {
  display: none;
}

.mapa-admin-compacto :deep(.mapa-card) {
  padding: 0;
  border: 0;
  background: transparent;
}

.mapa-admin-compacto :deep(.mapa) {
  height: 175px;
  min-height: 175px;
  border-radius: 11px;
}

.local-admin-sem-coordenadas {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 9px;
  color: #667085;
  background: #f9fafb;
  font-size: 8px;
}

/* =====================================================
   EQUIPE
===================================================== */

.equipe-lista {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.funcionario-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border-radius: 10px;
  background: #f9fafb;
}

.funcionario-avatar {
  color: #f97316;
  background: #fff1e6;
  font-size: 10px;
  font-weight: 900;
}

.funcionario-item strong {
  display: block;
  color: #344054;
  font-size: 9px;
}

.funcionario-item span {
  display: block;
  margin-top: 1px;
  color: #98a2b3;
  font-size: 7px;
}

.funcionario-item small {
  display: block;
  margin-top: 3px;
  color: #667085;
  font-size: 7px;
}

/* =====================================================
   COMPLEMENTARES
===================================================== */

.complementares {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid #eaecf0;
  border-radius: 15px;
  background: #ffffff;
}

.complementares--coluna {
  margin-top: 18px;
}

.expansao-header {
  min-height: 66px;
}

.expansao-conteudo {
  padding:
    0 18px 18px;
}

/* =====================================================
   CANCELADO
===================================================== */

.cancelado-banner {
  margin-bottom: 14px;
  color: #b42318;
  background: #fef3f2;
}

.cancelado-conteudo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cancelado-conteudo strong,
.cancelado-conteudo span {
  display: block;
}

.cancelado-conteudo span {
  margin-top: 2px;
  font-size: 9px;
}

/* =====================================================
   DARK MODE
===================================================== */

.chamados-admin-page--dark {
  background: #0d0f12;
}

.chamados-admin-page--dark
.pagina-topo h1,
.chamados-admin-page--dark
.resumo-numero,
.chamados-admin-page--dark
.lista-titulo {
  color: #f9fafb;
}

.chamados-admin-page--dark
.resumo-card,
.chamados-admin-page--dark
.lista-card {
  border-color: #292d33;
  background: #15181d;
}

.chamados-admin-page--dark
.chamados-tabela th,
.chamados-admin-page--dark
.chamados-tabela td {
  border-color: #292d33;
}

.chamados-admin-page--dark
.chamados-tabela td {
  color: #d0d5dd;
}

.chamados-admin-page--dark
.chamados-tabela tbody tr:hover {
  background: #1b1e24;
}

.acompanhamento-dialog--dark {
  background: #0d0f12;
}

.acompanhamento-dialog--dark
.acompanhamento-header,
.acompanhamento-dialog--dark
.resumo-atendimento-item,
.acompanhamento-dialog--dark
.painel-card,
.acompanhamento-dialog--dark
.complementares {
  border-color: #292d33;
  background: #15181d;
}

.acompanhamento-dialog--dark
.acompanhamento-titulo,
.acompanhamento-dialog--dark
.resumo-atendimento-item strong,
.acompanhamento-dialog--dark
.painel-card-titulo,
.acompanhamento-dialog--dark
.problema-admin > strong,
.acompanhamento-dialog--dark
.dados-chamado-grid strong,
.acompanhamento-dialog--dark
.funcionario-item strong,
.acompanhamento-dialog--dark
.secao-interna-titulo {
  color: #f2f4f7;
}

.acompanhamento-dialog--dark
.km-item,
.acompanhamento-dialog--dark
.dados-chamado-grid > div,
.acompanhamento-dialog--dark
.funcionario-item,
.acompanhamento-dialog--dark
.informacao-vazia {
  background: #1b1e24;
}

.acompanhamento-dialog--dark
.km-item--destaque {
  background: #211b33;
}

.acompanhamento-dialog--dark
.problema-admin {
  border-color: #292d33;
}

.acompanhamento-dialog--dark
.etapa-admin-circulo {
  border-color: #3a3f47;
  background: #15181d;
}

.acompanhamento-dialog--dark
.etapa-admin--concluida {
  border-color: #f97316;
  color: #f97316;
  background: #292018;
}

.acompanhamento-dialog--dark
.etapa-admin--atual {
  color: #ffffff;
  background: #f97316;
}

.acompanhamento-dialog--dark
.etapa-admin-linha {
  background: #3a3f47;
}

.acompanhamento-dialog--dark
.etapa-admin-linha--concluida {
  background: #f97316;
}

.acompanhamento-dialog--dark
.local-admin-endereco,
.acompanhamento-dialog--dark
.local-admin-sem-coordenadas {
  background: #1b1e24;
}

.acompanhamento-dialog--dark
.local-admin-endereco strong {
  color: #f2f4f7;
}

/* =====================================================
   RESPONSIVO
===================================================== */

@media (max-width: 1200px) {
  .resumo-grid {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .lista-cabecalho {
    flex-direction: column;
  }

  .filtros {
    width: 100%;
  }

  .pesquisa-input {
    flex: 1;
    width: auto;
  }

  .resumo-atendimento-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .conteudo-principal-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1000px) {
  .tabela-container {
    overflow-x: auto;
  }

  .chamados-tabela {
    min-width: 980px;
  }
}

@media (max-width: 800px) {
  .chamados-admin-page {
    padding: 22px;
  }

  .resumo-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .pesquisa-input,
  .filtro-select {
    width: 100%;
  }

  .acompanhamento-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .acompanhamento-header-acoes {
    width: 100%;
    flex-wrap: wrap;
  }

  .atualizacao-automatica {
    flex: 1;
  }

  .etapas-admin {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .etapa-admin-linha {
    display: none;
  }

  .km-grid,
  .dados-chamado-grid,
  .local-admin-acoes {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .chamados-admin-page {
    padding:
      18px 14px;
  }

  .pagina-topo h1 {
    font-size: 22px;
  }

  .resumo-grid,
  .resumo-atendimento-grid {
    grid-template-columns: 1fr;
  }

  .acompanhamento-conteudo {
    padding:
      16px 12px 30px;
  }

  .acompanhamento-header {
    padding:
      15px 12px;
  }

  .acompanhamento-titulo {
    font-size: 15px;
  }

  .acompanhamento-subtitulo {
    display: none;
  }
}
</style>