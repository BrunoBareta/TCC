const chamadoModel = require(
  '../models/chamadoModels'
)

const historicoModel = require(
  '../models/historicoModels'
)

/* =========================
   LISTAR
========================= */

const listar = async (
  req,
  res
) => {
  try {
    const chamados =
      await chamadoModel.listar()

    res.json(chamados)
  } catch (error) {
    console.error(
      'Erro ao listar chamados:',
      error
    )

    res.status(500).json({
      erro: error.message
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
      erro: error.message
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
    const idUsuario =
      Number(
        req.body.id_usuario
      )

    const idPropriedade =
      Number(
        req.body.id_propriedade
      )

    if (
      !Number.isInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      return res.status(400).json({
        message:
          'Produtor não identificado.'
      })
    }

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

    /*
      CONFERE A PROPRIEDADE
    */
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
      AGORA A UNIDADE É OPCIONAL
    */
    let idUnidade = null

    if (
      req.body.id_unidade !== null &&
      req.body.id_unidade !== undefined &&
      req.body.id_unidade !== ''
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

    const problema =
      String(
        req.body.problema || ''
      ).trim()

    const descricao =
      String(
        req.body.descricao || ''
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

    /*
      CULTURA AUTOMÁTICA.

      Primeiro tenta usar a enviada
      pelo frontend.

      Se não vier, usa a cultura
      principal da propriedade.

      Caso a propriedade antiga ainda
      não tenha cultura, mantém AVES
      como fallback temporário.
    */
    const tipoCultura =
      String(
        req.body.tipo_cultura ||
        propriedade.cultura_principal ||
        'AVES'
      ).toUpperCase()

    const tipoChamado =
      String(
        req.body.tipo_chamado ||
        'ASSISTENCIA'
      ).toUpperCase()

    const urgencia =
      String(
        req.body.urgencia ||
        'MEDIA'
      ).toUpperCase()

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

        urgencia
      })

    const observacaoHistorico =
      tipoChamado === 'VENDEDOR'
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

    const chamadoCompleto =
      await chamadoModel.buscarPorId(
        chamado.id_chamado
      )

    res.status(201).json({
      message:
        tipoChamado === 'VENDEDOR'
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
      erro: error.message
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
      await chamadoModel.buscarPorId(
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
        chamadoAnterior.status || ''
      ).toUpperCase() !==
      'PENDENTE'
    ) {
      return res.status(409).json({
        message:
          'Este chamado não pode mais ser editado porque já foi aceito para atendimento.'
      })
    }

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
      Se id_unidade não vier na requisição,
      mantém a unidade anterior.

      Se vier null, remove a unidade.
    */
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
        req.body.id_unidade === null ||
        req.body.id_unidade === ''
      ) {
        idUnidade = null
      } else {
        idUnidade =
          Number(
            req.body.id_unidade
          )
      }
    }

    if (idUnidade) {
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
            chamadoAnterior.tipo_cultura ||
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
      await chamadoModel.buscarPorId(
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
      erro: error.message
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
        req.body.status || ''
      ).toUpperCase()

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
      await chamadoModel.buscarPorId(
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
      await chamadoModel.buscarPorId(
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
      erro: error.message
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
      await chamadoModel.buscarPorId(
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
        chamadoAnterior.status || ''
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
      erro: error.message
    })
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  atualizarStatus,
  deletar
}