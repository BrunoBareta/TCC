const chamadoModel = require(
  '../models/chamadoModels'
)

const historicoModel = require(
  '../models/historicoModels'
)

/* =====================================================
   FUNÇÕES AUXILIARES - LOCALIZAÇÃO
===================================================== */

function converterCoordenada(
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
        .replace(',', '.')
    )

  if (
    !Number.isFinite(
      numero
    )
  ) {
    return null
  }

  return numero
}

function latitudeValida(
  valor
) {
  return (
    Number.isFinite(valor) &&
    valor >= -90 &&
    valor <= 90
  )
}

function longitudeValida(
  valor
) {
  return (
    Number.isFinite(valor) &&
    valor >= -180 &&
    valor <= 180
  )
}

function montarEnderecoPropriedade(
  propriedade
) {
  if (!propriedade) {
    return null
  }

  const cidadeEstado =
    [
      propriedade.cidade,
      propriedade.estado
    ]
      .filter(Boolean)
      .join(' - ')

  const endereco =
    [
      propriedade.endereco,
      cidadeEstado
    ]
      .filter(Boolean)
      .join(', ')

  return endereco || null
}

/*
  Prepara a localização que ficará
  registrada especificamente no chamado.

  CADASTRO:
    usa a localização da propriedade.

  ATUAL:
    usa a localização atual obtida
    pelo navegador.

  PESQUISA:
    usa um endereço pesquisado
    pelo produtor.
*/
function prepararLocalizacao(
  dados,
  propriedade
) {
  const origem =
    String(
      dados.origem_localizacao ||
      'CADASTRO'
    )
      .trim()
      .toUpperCase()

  const origensPermitidas = [
    'CADASTRO',
    'ATUAL',
    'PESQUISA'
  ]

  if (
    !origensPermitidas.includes(
      origem
    )
  ) {
    return {
      erro:
        'Origem da localização inválida.'
    }
  }

  /*
    LOCALIZAÇÃO DO CADASTRO
  */

  if (
    origem ===
    'CADASTRO'
  ) {
    let latitude =
      converterCoordenada(
        dados.latitude_atendimento
      )

    let longitude =
      converterCoordenada(
        dados.longitude_atendimento
      )

    /*
      Se o frontend não mandar as
      coordenadas, utiliza as coordenadas
      existentes na propriedade.
    */

    if (
      !latitudeValida(latitude)
    ) {
      latitude =
        converterCoordenada(
          propriedade.latitude
        )
    }

    if (
      !longitudeValida(longitude)
    ) {
      longitude =
        converterCoordenada(
          propriedade.longitude
        )
    }

    /*
      A propriedade pode ter endereço
      escrito, mas ainda não possuir
      latitude e longitude.

      Nesse caso o chamado continua
      podendo ser aberto.
    */

    if (
      !latitudeValida(latitude)
    ) {
      latitude = null
    }

    if (
      !longitudeValida(longitude)
    ) {
      longitude = null
    }

    const enderecoEnviado =
      String(
        dados.endereco_atendimento ||
        ''
      ).trim()

    return {
      latitude_atendimento:
        latitude,

      longitude_atendimento:
        longitude,

      endereco_atendimento:
        enderecoEnviado ||
        montarEnderecoPropriedade(
          propriedade
        ),

      origem_localizacao:
        'CADASTRO'
    }
  }

  /*
    LOCALIZAÇÃO ATUAL OU PESQUISADA

    Aqui precisamos obrigatoriamente
    ter coordenadas válidas.
  */

  const latitude =
    converterCoordenada(
      dados.latitude_atendimento
    )

  const longitude =
    converterCoordenada(
      dados.longitude_atendimento
    )

  if (
    !latitudeValida(latitude) ||
    !longitudeValida(longitude)
  ) {
    return {
      erro:
        'A localização selecionada não possui coordenadas válidas.'
    }
  }

  const endereco =
    String(
      dados.endereco_atendimento ||
      ''
    ).trim()

  return {
    latitude_atendimento:
      latitude,

    longitude_atendimento:
      longitude,

    endereco_atendimento:
      endereco ||
      'Localização selecionada pelo produtor.',

    origem_localizacao:
      origem
  }
}

/* =========================
   LISTAR
========================= */

const listar = async (
  req,
  res
) => {
  try {
    let idUsuario = null

    /*
      Quando o produtor solicitar
      seus chamados, o frontend envia:

      /chamados?id_usuario=6
    */

    if (
      req.query.id_usuario !==
        undefined &&
      req.query.id_usuario !==
        null &&
      req.query.id_usuario !==
        ''
    ) {
      idUsuario =
        Number(
          req.query.id_usuario
        )

      if (
        !Number.isInteger(
          idUsuario
        ) ||
        idUsuario <= 0
      ) {
        return res.status(400).json({
          message:
            'Produtor inválido.'
        })
      }
    }

    const chamados =
      await chamadoModel.listar(
        idUsuario
      )

    res.json(chamados)
  } catch (error) {
    console.error(
      'Erro ao listar chamados:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   BUSCAR POR ID
========================= */

const buscarPorId = async (
  req,
  res
) => {
  try {
    const chamado =
      await chamadoModel.buscarPorId(
        req.params.id
      )

    if (!chamado) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    res.json(chamado)
  } catch (error) {
    console.error(
      'Erro ao buscar chamado:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   CRIAR
========================= */

const criar = async (
  req,
  res
) => {
  try {
    /* =========================
       PRODUTOR
    ========================= */

    const idUsuario =
      Number(
        req.body.id_usuario
      )

    if (
      !Number.isInteger(
        idUsuario
      ) ||
      idUsuario <= 0
    ) {
      return res.status(400).json({
        message:
          'Produtor não identificado.'
      })
    }

    /* =========================
       PROPRIEDADE
    ========================= */

    const idPropriedade =
      Number(
        req.body.id_propriedade
      )

    if (
      !Number.isInteger(
        idPropriedade
      ) ||
      idPropriedade <= 0
    ) {
      return res.status(400).json({
        message:
          'Propriedade inválida.'
      })
    }

    const propriedade =
      await chamadoModel
        .buscarPropriedade(
          idPropriedade
        )

    if (!propriedade) {
      return res.status(404).json({
        message:
          'Propriedade não encontrada.'
      })
    }

    /*
      CONFERE SE A PROPRIEDADE
      REALMENTE PERTENCE AO PRODUTOR.
    */

    if (
      Number(
        propriedade.id_usuario
      ) !==
      idUsuario
    ) {
      return res.status(403).json({
        message:
          'A propriedade informada não pertence ao produtor.'
      })
    }

    /* =========================
       UNIDADE ANTIGA
    ========================= */

    let idUnidade =
      null

    if (
      req.body.id_unidade !==
        null &&
      req.body.id_unidade !==
        undefined &&
      req.body.id_unidade !==
        ''
    ) {
      idUnidade =
        Number(
          req.body.id_unidade
        )

      if (
        !Number.isInteger(
          idUnidade
        ) ||
        idUnidade <= 0
      ) {
        return res.status(400).json({
          message:
            'Local de atendimento inválido.'
        })
      }

      const unidade =
        await chamadoModel
          .validarUnidade(
            idPropriedade,
            idUnidade
          )

      if (!unidade) {
        return res.status(400).json({
          message:
            'O local informado não pertence à propriedade.'
        })
      }
    }

    /* =========================
       SOLICITAÇÃO
    ========================= */

    const problema =
      String(
        req.body.problema ||
        ''
      ).trim()

    const descricao =
      String(
        req.body.descricao ||
        ''
      ).trim()

    if (!problema) {
      return res.status(400).json({
        message:
          'Informe o que está acontecendo.'
      })
    }

    if (!descricao) {
      return res.status(400).json({
        message:
          'Informe o que está acontecendo.'
      })
    }

    /* =========================
       CULTURA
    ========================= */

    const tipoCultura =
      String(
        req.body.tipo_cultura ||
        propriedade.cultura_principal ||
        'AVES'
      )
        .trim()
        .toUpperCase()

    /* =========================
       TIPO DE CHAMADO
    ========================= */

    const tipoChamado =
      String(
        req.body.tipo_chamado ||
        'ASSISTENCIA'
      )
        .trim()
        .toUpperCase()

    if (
      ![
        'ASSISTENCIA',
        'VENDEDOR'
      ].includes(
        tipoChamado
      )
    ) {
      return res.status(400).json({
        message:
          'Tipo de solicitação inválido.'
      })
    }

    /* =========================
       URGÊNCIA
    ========================= */

    const urgencia =
      String(
        req.body.urgencia ||
        'MEDIA'
      )
        .trim()
        .toUpperCase()

    if (
      ![
        'BAIXA',
        'MEDIA',
        'ALTA'
      ].includes(
        urgencia
      )
    ) {
      return res.status(400).json({
        message:
          'Urgência inválida.'
      })
    }

    /* =========================
       LOCALIZAÇÃO
    ========================= */

    const localizacao =
      prepararLocalizacao(
        req.body,
        propriedade
      )

    if (
      localizacao.erro
    ) {
      return res.status(400).json({
        message:
          localizacao.erro
      })
    }

    /* =========================
       CRIA CHAMADO
    ========================= */

    const chamado =
      await chamadoModel.criar({
        id_usuario:
          idUsuario,

        id_propriedade:
          idPropriedade,

        id_unidade:
          idUnidade,

        tipo_cultura:
          tipoCultura,

        tipo_chamado:
          tipoChamado,

        problema,

        descricao,

        urgencia,

        latitude_atendimento:
          localizacao
            .latitude_atendimento,

        longitude_atendimento:
          localizacao
            .longitude_atendimento,

        endereco_atendimento:
          localizacao
            .endereco_atendimento,

        origem_localizacao:
          localizacao
            .origem_localizacao
      })

    /* =========================
       HISTÓRICO
    ========================= */

    const observacaoHistorico =
      tipoChamado ===
      'VENDEDOR'
        ? `Solicitação de orçamento aberta pelo produtor para ${propriedade.nome_propriedade}.`
        : `Chamado aberto pelo produtor para atendimento em ${propriedade.nome_propriedade}.`

    await historicoModel.criar({
      id_chamado:
        chamado.id_chamado,

      status_anterior:
        null,

      status_novo:
        'PENDENTE',

      observacao:
        observacaoHistorico,

      id_usuario_responsavel:
        chamado.id_usuario
    })

    /* =========================
       RETORNO COMPLETO
    ========================= */

    const chamadoCompleto =
      await chamadoModel
        .buscarPorId(
          chamado.id_chamado
        )

    res.status(201).json({
      message:
        tipoChamado ===
        'VENDEDOR'
          ? 'Solicitação enviada com sucesso.'
          : 'Chamado aberto com sucesso.',

      chamado:
        chamadoCompleto
    })
  } catch (error) {
    console.error(
      'Erro ao criar chamado:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   ATUALIZAR
========================= */

const atualizar = async (
  req,
  res
) => {
  try {
    const chamadoAnterior =
      await chamadoModel
        .buscarPorId(
          req.params.id
        )

    if (!chamadoAnterior) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    if (
      String(
        chamadoAnterior.status ||
        ''
      ).toUpperCase() !==
      'PENDENTE'
    ) {
      return res.status(409).json({
        message:
          'Este chamado não pode mais ser editado porque já foi aceito para atendimento.'
      })
    }

    /* =========================
       PROPRIEDADE
    ========================= */

    const idPropriedade =
      Number(
        req.body.id_propriedade ||
        chamadoAnterior
          .id_propriedade
      )

    if (
      !Number.isInteger(
        idPropriedade
      ) ||
      idPropriedade <= 0
    ) {
      return res.status(400).json({
        message:
          'Propriedade inválida.'
      })
    }

    const propriedade =
      await chamadoModel
        .buscarPropriedade(
          idPropriedade
        )

    if (!propriedade) {
      return res.status(404).json({
        message:
          'Propriedade não encontrada.'
      })
    }

    /*
      O chamado não pode ser alterado
      para uma propriedade pertencente
      a outro produtor.
    */

    if (
      Number(
        propriedade.id_usuario
      ) !==
      Number(
        chamadoAnterior.id_usuario
      )
    ) {
      return res.status(403).json({
        message:
          'A propriedade informada não pertence ao produtor deste chamado.'
      })
    }

    /* =========================
       UNIDADE ANTIGA
    ========================= */

    let idUnidade =
      chamadoAnterior.id_unidade
        ? Number(
            chamadoAnterior.id_unidade
          )
        : null

    if (
      Object.prototype
        .hasOwnProperty.call(
          req.body,
          'id_unidade'
        )
    ) {
      if (
        req.body.id_unidade ===
          null ||
        req.body.id_unidade ===
          ''
      ) {
        idUnidade =
          null
      } else {
        idUnidade =
          Number(
            req.body.id_unidade
          )
      }
    }

    if (idUnidade) {
      if (
        !Number.isInteger(
          idUnidade
        ) ||
        idUnidade <= 0
      ) {
        return res.status(400).json({
          message:
            'Local de atendimento inválido.'
        })
      }

      const unidade =
        await chamadoModel
          .validarUnidade(
            idPropriedade,
            idUnidade
          )

      if (!unidade) {
        return res.status(400).json({
          message:
            'O local informado não pertence à propriedade selecionada.'
        })
      }
    }

    /* =========================
       LOCALIZAÇÃO
    ========================= */

    const alterouLocalizacao =
      [
        'latitude_atendimento',
        'longitude_atendimento',
        'endereco_atendimento',
        'origem_localizacao'
      ].some(
        campo =>
          Object.prototype
            .hasOwnProperty.call(
              req.body,
              campo
            )
      )

    let localizacao = {
      latitude_atendimento:
        chamadoAnterior
          .latitude_atendimento,

      longitude_atendimento:
        chamadoAnterior
          .longitude_atendimento,

      endereco_atendimento:
        chamadoAnterior
          .endereco_atendimento,

      origem_localizacao:
        chamadoAnterior
          .origem_localizacao ||
        'CADASTRO'
    }

    /*
      Só recalcula a localização
      se algum campo relacionado
      tiver sido enviado.
    */

    if (
      alterouLocalizacao
    ) {
      const dadosLocalizacao = {
        latitude_atendimento:
          Object.prototype
            .hasOwnProperty.call(
              req.body,
              'latitude_atendimento'
            )
            ? req.body
                .latitude_atendimento
            : chamadoAnterior
                .latitude_atendimento,

        longitude_atendimento:
          Object.prototype
            .hasOwnProperty.call(
              req.body,
              'longitude_atendimento'
            )
            ? req.body
                .longitude_atendimento
            : chamadoAnterior
                .longitude_atendimento,

        endereco_atendimento:
          Object.prototype
            .hasOwnProperty.call(
              req.body,
              'endereco_atendimento'
            )
            ? req.body
                .endereco_atendimento
            : chamadoAnterior
                .endereco_atendimento,

        origem_localizacao:
          Object.prototype
            .hasOwnProperty.call(
              req.body,
              'origem_localizacao'
            )
            ? req.body
                .origem_localizacao
            : chamadoAnterior
                .origem_localizacao
      }

      localizacao =
        prepararLocalizacao(
          dadosLocalizacao,
          propriedade
        )

      if (
        localizacao.erro
      ) {
        return res.status(400).json({
          message:
            localizacao.erro
        })
      }
    }

    /* =========================
       ATUALIZA
    ========================= */

    const chamado =
      await chamadoModel.atualizar(
        req.params.id,
        {
          ...req.body,

          id_propriedade:
            idPropriedade,

          id_unidade:
            idUnidade,

          tipo_cultura:
            req.body.tipo_cultura ||
            chamadoAnterior
              .tipo_cultura ||
            propriedade
              .cultura_principal ||
            'AVES',

          tipo_chamado:
            req.body.tipo_chamado ||
            chamadoAnterior
              .tipo_chamado,

          problema:
            req.body.problema ||
            chamadoAnterior.problema,

          descricao:
            req.body.descricao ||
            chamadoAnterior.descricao,

          urgencia:
            req.body.urgencia ||
            chamadoAnterior.urgencia,

          latitude_atendimento:
            localizacao
              .latitude_atendimento,

          longitude_atendimento:
            localizacao
              .longitude_atendimento,

          endereco_atendimento:
            localizacao
              .endereco_atendimento,

          origem_localizacao:
            localizacao
              .origem_localizacao,

          status:
            chamadoAnterior.status,

          resposta_tecnico:
            chamadoAnterior
              .resposta_tecnico
        }
      )

    if (!chamado) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    const chamadoCompleto =
      await chamadoModel
        .buscarPorId(
          chamado.id_chamado
        )

    res.json({
      message:
        'Chamado atualizado com sucesso.',

      chamado:
        chamadoCompleto
    })
  } catch (error) {
    console.error(
      'Erro ao atualizar chamado:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   STATUS
========================= */

const atualizarStatus = async (
  req,
  res
) => {
  try {
    const idChamado =
      Number(
        req.params.id
      )

    const novoStatus =
      String(
        req.body.status ||
        ''
      )
        .trim()
        .toUpperCase()

    const idUsuarioResponsavel =
      Number(
        req.body
          .id_usuario_responsavel
      )

    const observacao =
      req.body.observacao ||
      null

    const respostaTecnico =
      req.body.resposta_tecnico ||
      null

    if (
      !Number.isInteger(
        idChamado
      ) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message:
          'ID do chamado inválido.'
      })
    }

    if (!novoStatus) {
      return res.status(400).json({
        message:
          'Informe o novo status.'
      })
    }

    if (
      !Number.isInteger(
        idUsuarioResponsavel
      ) ||
      idUsuarioResponsavel <= 0
    ) {
      return res.status(400).json({
        message:
          'Usuário responsável não identificado.'
      })
    }

    const chamadoAnterior =
      await chamadoModel
        .buscarPorId(
          idChamado
        )

    if (!chamadoAnterior) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    const chamado =
      await chamadoModel
        .atualizarStatus(
          idChamado,
          novoStatus,
          respostaTecnico
        )

    if (!chamado) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    await historicoModel.criar({
      id_chamado:
        idChamado,

      status_anterior:
        chamadoAnterior.status,

      status_novo:
        novoStatus,

      observacao,

      id_usuario_responsavel:
        idUsuarioResponsavel
    })

    const chamadoCompleto =
      await chamadoModel
        .buscarPorId(
          idChamado
        )

    res.json({
      message:
        'Status atualizado com sucesso.',

      chamado:
        chamadoCompleto
    })
  } catch (error) {
    console.error(
      'Erro ao atualizar status:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   CANCELAR
========================= */

const deletar = async (
  req,
  res
) => {
  try {
    const chamadoAnterior =
      await chamadoModel
        .buscarPorId(
          req.params.id
        )

    if (!chamadoAnterior) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    if (
      String(
        chamadoAnterior.status ||
        ''
      ).toUpperCase() !==
      'PENDENTE'
    ) {
      return res.status(409).json({
        message:
          'Este chamado não pode mais ser cancelado porque já foi aceito para atendimento.'
      })
    }

    const chamado =
      await chamadoModel.deletar(
        req.params.id
      )

    if (!chamado) {
      return res.status(404).json({
        message:
          'Chamado não encontrado.'
      })
    }

    await historicoModel.criar({
      id_chamado:
        chamado.id_chamado,

      status_anterior:
        chamadoAnterior.status,

      status_novo:
        'CANCELADO',

      observacao:
        'Chamado cancelado pelo produtor.',

      id_usuario_responsavel:
        chamadoAnterior.id_usuario
    })

    res.json({
      message:
        'Chamado cancelado com sucesso.',

      chamado
    })
  } catch (error) {
    console.error(
      'Erro ao cancelar chamado:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   EXPORTAÇÕES
========================= */

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  atualizarStatus,
  deletar
}