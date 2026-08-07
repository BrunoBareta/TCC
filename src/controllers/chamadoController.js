const chamadoModel = require(
  '../models/chamadoModels'
)

const historicoModel = require(
  '../models/historicoModels'
)

const listar = async (req, res) => {
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

const buscarPorId = async (req, res) => {
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

const criar = async (req, res) => {
  try {
    const idUsuario = Number(
      req.body.id_usuario
    )

    const idPropriedade = Number(
      req.body.id_propriedade
    )

    const idUnidade = Number(
      req.body.id_unidade
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
      !Number.isInteger(idPropriedade) ||
      idPropriedade <= 0
    ) {
      return res.status(400).json({
        message:
          'Propriedade inválida.'
      })
    }

    if (
      !Number.isInteger(idUnidade) ||
      idUnidade <= 0
    ) {
      return res.status(400).json({
        message:
          'Selecione o local do atendimento.'
      })
    }

    if (
      !req.body.problema ||
      !String(req.body.problema).trim()
    ) {
      return res.status(400).json({
        message:
          'Informe o problema.'
      })
    }

    if (
      !req.body.descricao ||
      !String(req.body.descricao).trim()
    ) {
      return res.status(400).json({
        message:
          'Informe a descrição do problema.'
      })
    }

    /*
      Confere se o local realmente pertence
      à propriedade selecionada.
    */
    const unidade =
      await chamadoModel.validarUnidade(
        idPropriedade,
        idUnidade
      )

    if (!unidade) {
      return res.status(400).json({
        message:
          'O local selecionado não pertence à propriedade informada ou está desativado.'
      })
    }

    const chamado =
      await chamadoModel.criar({
        ...req.body,

        id_usuario:
          idUsuario,

        id_propriedade:
          idPropriedade,

        id_unidade:
          idUnidade,

        problema:
          String(
            req.body.problema
          ).trim(),

        descricao:
          String(
            req.body.descricao
          ).trim()
      })

    await historicoModel.criar({
      id_chamado:
        chamado.id_chamado,

      status_anterior:
        null,

      status_novo:
        'PENDENTE',

      observacao:
        `Chamado aberto pelo produtor para atendimento em ${unidade.nome_unidade}.`,

      id_usuario_responsavel:
        chamado.id_usuario
    })

    const chamadoCompleto =
      await chamadoModel.buscarPorId(
        chamado.id_chamado
      )

    res.status(201).json({
      message:
        'Chamado aberto com sucesso.',

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

const atualizar = async (req, res) => {
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
      ).toUpperCase() !== 'PENDENTE'
    ) {
      return res.status(409).json({
        message:
          'Este chamado não pode mais ser editado porque já foi aceito para atendimento.'
      })
    }

    const idPropriedade = Number(
      req.body.id_propriedade ||
      chamadoAnterior.id_propriedade
    )

    const idUnidade = Number(
      req.body.id_unidade ||
      chamadoAnterior.id_unidade
    )

    if (
      !Number.isInteger(idPropriedade) ||
      idPropriedade <= 0
    ) {
      return res.status(400).json({
        message:
          'Propriedade inválida.'
      })
    }

    if (
      !Number.isInteger(idUnidade) ||
      idUnidade <= 0
    ) {
      return res.status(400).json({
        message:
          'Selecione o local do atendimento.'
      })
    }

    const unidade =
      await chamadoModel.validarUnidade(
        idPropriedade,
        idUnidade
      )

    if (!unidade) {
      return res.status(400).json({
        message:
          'O local informado não pertence à propriedade selecionada ou está desativado.'
      })
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

          status:
            chamadoAnterior.status,

          resposta_tecnico:
            chamadoAnterior.resposta_tecnico
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

const atualizarStatus = async (
  req,
  res
) => {
  try {
    const idChamado = Number(
      req.params.id
    )

    const novoStatus = String(
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
      !Number.isInteger(idChamado) ||
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
      await chamadoModel.atualizarStatus(
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

const deletar = async (req, res) => {
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
      ).toUpperCase() !== 'PENDENTE'
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