const historicoModel = require('../models/historicoModels')

const listar = async (req, res) => {
  try {
    const historicos = await historicoModel.listar()
    res.json(historicos)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const historico = await historicoModel.buscarPorId(req.params.id)

    if (!historico) {
      return res.status(404).json({
        mensagem: 'Histórico não encontrado'
      })
    }

    res.json(historico)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorChamado = async (req, res) => {
  try {
    const historicos = await historicoModel.buscarPorChamado(
      req.params.idChamado
    )

    res.json(historicos)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const historico = await historicoModel.criar(req.body)

    res.status(201).json(historico)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorChamado,
  criar
}