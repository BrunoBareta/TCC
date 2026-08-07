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
    const idChamado = Number(req.body.id_chamado)

    const descricaoMaterial = String(
      req.body.descricao_material || ''
    ).trim()

    const quantidade = Number(
      req.body.quantidade
    )

    if (!Number.isInteger(idChamado) || idChamado <= 0) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    if (!descricaoMaterial) {
      return res.status(400).json({
        message: 'Informe a descrição do material.'
      })
    }

    if (
      !Number.isFinite(quantidade) ||
      quantidade <= 0
    ) {
      return res.status(400).json({
        message: 'Informe uma quantidade válida.'
      })
    }

    const material = await materialModel.criar({
      id_chamado: idChamado,
      descricao_material: descricaoMaterial,
      quantidade
    })

    res.status(201).json({
      message: 'Material adicionado com sucesso.',
      material
    })
  } catch (error) {
    console.error('Erro ao adicionar material:', error)

    res.status(500).json({
      erro: error.message
    })
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