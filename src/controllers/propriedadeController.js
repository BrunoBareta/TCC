const propriedadeModel = require('../models/propriedadeModel')

const listar = async (req, res) => {
  try {
    const propriedades = await propriedadeModel.listar()
    res.json(propriedades)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const propriedade = await propriedadeModel.buscarPorId(req.params.id)

    if (!propriedade) {
      return res.status(404).json({
        message: 'Propriedade não encontrada'
      })
    }

    res.json(propriedade)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const criar = async (req, res) => {
  try {
    const propriedade = await propriedadeModel.criar(req.body)

    res.status(201).json(propriedade)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const atualizar = async (req, res) => {
  try {
    const propriedade = await propriedadeModel.atualizar(
      req.params.id,
      req.body
    )

    res.json(propriedade)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const deletar = async (req, res) => {
  try {
    const propriedade = await propriedadeModel.deletar(req.params.id)

    res.json({
      message: 'Propriedade desativada com sucesso',
      propriedade
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
  criar,
  atualizar,
  deletar
}