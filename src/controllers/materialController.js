const materialModel = require('../models/materialModels')

const listar = async (req, res) => {
  try {
    const materiais = await materialModel.listar()
    res.json(materiais)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const material = await materialModel.buscarPorId(req.params.id)

    if (!material) {
      return res.status(404).json({
        message: 'Material não encontrado'
      })
    }

    res.json(material)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const listarPorChamado = async (req, res) => {
  try {
    const materiais = await materialModel.listarPorChamado(req.params.id_chamado)
    res.json(materiais)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const material = await materialModel.criar(req.body)
    res.status(201).json(material)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const atualizar = async (req, res) => {
  try {
    const material = await materialModel.atualizar(req.params.id, req.body)

    if (!material) {
      return res.status(404).json({
        message: 'Material não encontrado'
      })
    }

    res.json(material)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const deletar = async (req, res) => {
  try {
    const material = await materialModel.deletar(req.params.id)

    if (!material) {
      return res.status(404).json({
        message: 'Material não encontrado'
      })
    }

    res.json({
      message: 'Material removido com sucesso',
      material
    })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

module.exports = {
  listar,
  buscarPorId,
  listarPorChamado,
  criar,
  atualizar,
  deletar
}