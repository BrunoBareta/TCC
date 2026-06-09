const usuarioModel = require('../models/usuarioModels')

const listar = async (req, res) => {
  try {
    const usuarios = await usuarioModel.listar()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const usuario = await usuarioModel.buscarPorId(req.params.id)

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const usuario = await usuarioModel.criar(req.body)
    res.status(201).json(usuario)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const atualizar = async (req, res) => {
  try {
    const usuario = await usuarioModel.atualizar(req.params.id, req.body)

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const deletar = async (req, res) => {
  try {
    const usuario = await usuarioModel.deletar(req.params.id)

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    res.json({
      message: 'Usuário desativado com sucesso',
      usuario
    })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await usuarioModel.login(email, senha)

    if (!usuario) {
      return res.status(401).json({
        message: 'Email ou senha inválidos'
      })
    }

    res.json({
      message: 'Login realizado com sucesso',
      usuario
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
  deletar,
  login
}