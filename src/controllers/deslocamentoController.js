const deslocamentoModel = require(
  '../models/deslocamentoModels'
)

const listar = async (req, res) => {
  try {
    const deslocamentos =
      await deslocamentoModel.listar()

    res.json(deslocamentos)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const deslocamento =
      await deslocamentoModel.buscarPorId(
        req.params.id
      )

    if (!deslocamento) {
      return res.status(404).json({
        message: 'Deslocamento não encontrado'
      })
    }

    res.json(deslocamento)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const buscarPorChamado = async (req, res) => {
  try {
    const deslocamento =
      await deslocamentoModel.buscarPorChamado(
        req.params.idChamado
      )

    res.json(deslocamento || null)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const criar = async (req, res) => {
  try {
    const idChamado = Number(
      req.body.id_chamado
    )

    const idFuncionario = Number(
      req.body.id_funcionario
    )

    const kmSaida = Number(
      req.body.km_saida
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
        message: 'Funcionário não identificado.'
      })
    }

    if (
      !Number.isFinite(kmSaida) ||
      kmSaida < 0
    ) {
      return res.status(400).json({
        message: 'Informe um KM de saída válido.'
      })
    }

    const existente =
      await deslocamentoModel.buscarPorChamado(
        idChamado
      )

    if (existente) {
      return res.status(409).json({
        message:
          'Já existe um deslocamento para este chamado.'
      })
    }

    const deslocamento =
      await deslocamentoModel.criar({
        id_chamado: idChamado,
        id_funcionario: idFuncionario,
        km_saida: kmSaida
      })

    res.status(201).json({
      message: 'Deslocamento iniciado com sucesso.',
      deslocamento
    })
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const finalizar = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    const kmRetorno = Number(
      req.body.km_retorno
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
      !Number.isFinite(kmRetorno) ||
      kmRetorno < 0
    ) {
      return res.status(400).json({
        message: 'Informe um KM de retorno válido.'
      })
    }

    const deslocamento =
      await deslocamentoModel.finalizar(
        idChamado,
        kmRetorno
      )

    res.json({
      message: 'Deslocamento finalizado com sucesso.',
      deslocamento
    })
  } catch (error) {
    if (
      error.codigo ===
      'DESLOCAMENTO_NAO_ENCONTRADO'
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    if (
      error.codigo ===
      'KM_RETORNO_INVALIDO'
    ) {
      return res.status(400).json({
        message: error.message
      })
    }

    res.status(500).json({
      erro: error.message
    })
  }
}

const atualizar = async (req, res) => {
  try {
    const deslocamento =
      await deslocamentoModel.atualizar(
        req.params.id,
        req.body
      )

    if (!deslocamento) {
      return res.status(404).json({
        message: 'Deslocamento não encontrado'
      })
    }

    res.json(deslocamento)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const deletar = async (req, res) => {
  try {
    const deslocamento =
      await deslocamentoModel.deletar(
        req.params.id
      )

    if (!deslocamento) {
      return res.status(404).json({
        message: 'Deslocamento não encontrado'
      })
    }

    res.json({
      message: 'Deslocamento removido com sucesso',
      deslocamento
    })
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorChamado,
  criar,
  finalizar,
  atualizar,
  deletar
}