const deslocamentoModel = require('../models/deslocamentoModels')

const listar = async (req, res) => {
  try {
    const deslocamentos = await deslocamentoModel.listar()
    res.json(deslocamentos)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const deslocamento = await deslocamentoModel.buscarPorId(req.params.id)

    if (!deslocamento) {
      return res.status(404).json({
        message: 'Deslocamento não encontrado'
      })
    }

    res.json(deslocamento)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const deslocamento = await deslocamentoModel.criar(req.body)
    res.status(201).json(deslocamento)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const atualizar = async (req, res) => {
  try {
    const deslocamento = await deslocamentoModel.atualizar(req.params.id, req.body)

    if (!deslocamento) {
      return res.status(404).json({
        message: 'Deslocamento não encontrado'
      })
    }

    res.json(deslocamento)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const deletar = async (req, res) => {
  try {
    const deslocamento = await deslocamentoModel.deletar(req.params.id)

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
    res.status(500).json({ erro: error.message })
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar
}