const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    'SELECT * FROM usuarios ORDER BY id_usuario ASC'
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    'SELECT * FROM usuarios WHERE id_usuario = $1',
    [id]
  )

  return resultado.rows[0]
}

const criar = async (dados) => {
  const {
    nome,
    telefone,
    email,
    cpf_cnpj,
    senha,
    tipo_usuario,
    foto_perfil
  } = dados

  const resultado = await db.query(
    `INSERT INTO usuarios
    (
      nome,
      telefone,
      email,
      cpf_cnpj,
      senha,
      tipo_usuario,
      foto_perfil,
      ativo,
      data_cadastro
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW())
    RETURNING *`,
    [
      nome,
      telefone,
      email,
      cpf_cnpj,
      senha,
      tipo_usuario,
      foto_perfil
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (id, dados) => {
  const {
    nome,
    telefone,
    email,
    cpf_cnpj,
    senha,
    tipo_usuario,
    foto_perfil,
    ativo
  } = dados

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
    [
      nome,
      telefone,
      email,
      cpf_cnpj,
      senha,
      tipo_usuario,
      foto_perfil,
      ativo,
      id
    ]
  )

  return resultado.rows[0]
}

const deletar = async (id) => {
  const resultado = await db.query(
    `UPDATE usuarios
     SET ativo = false
     WHERE id_usuario = $1
     RETURNING *`,
    [id]
  )

  return resultado.rows[0]
}

const login = async (email, senha) => {
  const resultado = await db.query(
    `SELECT *
     FROM usuarios
     WHERE email = $1
     AND senha = $2
     AND ativo = true`,
    [email, senha]
  )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  login
}