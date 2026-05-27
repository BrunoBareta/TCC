const express = require('express')
const router = express.Router()
const db = require('../database/db')

// listar todos
router.get('/usuarios', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM usuarios ORDER BY id_usuario ASC')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message })
  }
})

// buscar por id
router.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params

    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE id_usuario = $1',
      [id]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message })
  }
})

// cadastrar
router.post('/usuarios', async (req, res) => {
  try {
    const { nome, telefone, email, cpf_cnpj, senha, tipo_usuario, foto_perfil } = req.body

    const resultado = await db.query(
      `INSERT INTO usuarios 
      (nome, telefone, email, cpf_cnpj, senha, tipo_usuario, foto_perfil, ativo, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
      RETURNING *`,
      [nome, telefone, email, cpf_cnpj, senha, tipo_usuario, foto_perfil || null]
    )

    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message })
  }
})

// atualizar
router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, telefone, email, cpf_cnpj, senha, tipo_usuario, foto_perfil, ativo } = req.body

    const resultado = await db.query(
      `UPDATE usuarios SET
        nome = $1,
        telefone = $2,
        email = $3,
        cpf_cnpj = $4,
        senha = $5,
        tipo_usuario = $6,
        foto_perfil = $7,
        ativo = $8
      WHERE id_usuario = $9
      RETURNING *`,
      [nome, telefone, email, cpf_cnpj, senha, tipo_usuario, foto_perfil || null, ativo, id]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message })
  }
})

// excluir lógico
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params

    const resultado = await db.query(
      'UPDATE usuarios SET ativo = false WHERE id_usuario = $1 RETURNING *',
      [id]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json({ message: 'Usuário desativado com sucesso', usuario: resultado.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message })
  }
})

module.exports = router