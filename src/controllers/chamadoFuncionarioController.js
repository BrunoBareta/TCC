const chamadoFuncionarioModel = require(
  '../models/chamadoFuncionarioModels'
)

const aceitarChamado = async (req, res) => {
  try {
    const idChamado = Number(req.params.idChamado)
    const idFuncionario = Number(req.body.id_funcionario)

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    if (
      !Number.isInteger(idFuncionario) ||
      idFuncionario <= 0
    ) {
      return res.status(400).json({
        message: 'ID do funcionário é obrigatório.'
      })
    }

    const resultado =
      await chamadoFuncionarioModel.aceitarChamado(
        idChamado,
        idFuncionario
      )

    res.json({
      message: 'Chamado aceito com sucesso.',
      ...resultado
    })
  } catch (error) {
    const errosConflito = [
      'CHAMADO_NAO_PENDENTE',
      'VINCULO_EXISTENTE'
    ]

    if (
      error.codigo ===
      'CHAMADO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (
      error.codigo ===
      'FUNCIONARIO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (errosConflito.includes(error.codigo)) {
      return res.status(409).json({
        message: error.message
      })
    }

    if (error.codigo === 'PERFIL_INVALIDO') {
      return res.status(403).json({
        message: error.message
      })
    }

    console.error(
      'Erro ao aceitar chamado:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const desistirChamado = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    const idFuncionario = Number(
      req.params.idFuncionario
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    if (
      !Number.isInteger(idFuncionario) ||
      idFuncionario <= 0
    ) {
      return res.status(400).json({
        message: 'ID do funcionário inválido.'
      })
    }

    const resultado =
      await chamadoFuncionarioModel.desistirChamado(
        idChamado,
        idFuncionario
      )

    res.json({
      message: resultado.voltou_para_fila
        ? 'Você desistiu do chamado. Ele voltou para a fila de pendentes.'
        : 'Você foi removido da equipe deste chamado.',
      ...resultado
    })
  } catch (error) {
    if (
      error.codigo ===
      'CHAMADO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (
      error.codigo ===
      'FUNCIONARIO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (
      error.codigo ===
      'VINCULO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (
      error.codigo ===
      'DESISTENCIA_NAO_PERMITIDA'
    ) {
      return res.status(409).json({
        message: error.message
      })
    }

    console.error(
      'Erro ao desistir do chamado:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const adicionarFuncionario = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    const idFuncionario = Number(
      req.body.id_funcionario
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    if (
      !Number.isInteger(idFuncionario) ||
      idFuncionario <= 0
    ) {
      return res.status(400).json({
        message: 'ID do funcionário é obrigatório.'
      })
    }

    const vinculo =
      await chamadoFuncionarioModel.adicionarFuncionario({
        id_chamado: idChamado,
        id_funcionario: idFuncionario,
        funcao_atendimento:
          req.body.funcao_atendimento ||
          'FUNCIONARIO',
        observacao_aceite:
          req.body.observacao_aceite ||
          'Funcionário vinculado ao atendimento.'
      })

    res.status(201).json({
      message:
        'Funcionário vinculado com sucesso.',
      vinculo
    })
  } catch (error) {
    console.error(
      'Erro ao adicionar funcionário:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const listarPorChamado = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    const funcionarios =
      await chamadoFuncionarioModel.listarPorChamado(
        idChamado
      )

    res.json(funcionarios)
  } catch (error) {
    console.error(
      'Erro ao listar funcionários do chamado:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const listarPorFuncionario = async (req, res) => {
  try {
    const idFuncionario = Number(
      req.params.idFuncionario
    )

    if (
      !Number.isInteger(idFuncionario) ||
      idFuncionario <= 0
    ) {
      return res.status(400).json({
        message: 'ID do funcionário inválido.'
      })
    }

    const chamados =
      await chamadoFuncionarioModel.listarPorFuncionario(
        idFuncionario
      )

    res.json(chamados)
  } catch (error) {
    console.error(
      'Erro ao listar chamados do funcionário:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const contarPorChamado = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    const total =
      await chamadoFuncionarioModel.contarPorChamado(
        idChamado
      )

    res.json(total)
  } catch (error) {
    console.error(
      'Erro ao contar funcionários do chamado:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

module.exports = {
  aceitarChamado,
  desistirChamado,
  adicionarFuncionario,
  listarPorChamado,
  listarPorFuncionario,
  contarPorChamado
}