const chamadoModel = require('../models/chamadoModels')
const historicoModel = require('../models/historicoModels')

const listar = async (req, res) => {
  try {
    const chamados = await chamadoModel.listar()
    res.json(chamados)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const chamado = await chamadoModel.buscarPorId(req.params.id)

    if (!chamado) {
      return res.status(404).json({ message: 'Chamado não encontrado' })
    }

    res.json(chamado)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const chamado = await chamadoModel.criar(req.body)

    await historicoModel.criar({
      id_chamado: chamado.id_chamado,
      status_anterior: null,
      status_novo: 'PENDENTE',
      observacao: 'Chamado aberto pelo produtor.',
      id_usuario_responsavel: chamado.id_usuario
    })

    res.status(201).json(chamado)

  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const atualizar = async (req, res) => {
  try {
    const chamado = await chamadoModel.atualizar(req.params.id, req.body)

    if (!chamado) {
      return res.status(404).json({ message: 'Chamado não encontrado' })
    }

    res.json(chamado)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const deletar = async (req, res) => {
  try {
    const chamado = await chamadoModel.deletar(req.params.id)

    if (!chamado) {
      return res.status(404).json({ message: 'Chamado não encontrado' })
    }

    res.json({
      message: 'Chamado cancelado com sucesso',
      chamado
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