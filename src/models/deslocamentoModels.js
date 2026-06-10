const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    'SELECT * FROM deslocamentos ORDER BY id_deslocamento ASC'
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    'SELECT * FROM deslocamentos WHERE id_deslocamento = $1',
    [id]
  )

  return resultado.rows[0]
}

const criar = async (dados) => {
  const {
    id_chamado,
    id_funcionario,
    km_saida,
    km_retorno
  } = dados

  const km_total = km_retorno ? Number(km_retorno) - Number(km_saida) : null

  const resultado = await db.query(
    `INSERT INTO deslocamentos
    (
      id_chamado,
      id_funcionario,
      km_saida,
      km_retorno,
      km_total,
      data_saida,
      data_retorno
    )
    VALUES ($1,$2,$3,$4,$5,NOW(),$6)
    RETURNING *`,
    [
      id_chamado,
      id_funcionario,
      km_saida,
      km_retorno || null,
      km_total,
      km_retorno ? new Date() : null
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (id, dados) => {
  const {
    id_chamado,
    id_funcionario,
    km_saida,
    km_retorno
  } = dados

  const km_total = km_retorno ? Number(km_retorno) - Number(km_saida) : null

  const resultado = await db.query(
    `UPDATE deslocamentos SET
      id_chamado = $1,
      id_funcionario = $2,
      km_saida = $3,
      km_retorno = $4,
      km_total = $5,
      data_retorno = $6
    WHERE id_deslocamento = $7
    RETURNING *`,
    [
      id_chamado,
      id_funcionario,
      km_saida,
      km_retorno || null,
      km_total,
      km_retorno ? new Date() : null,
      id
    ]
  )

  return resultado.rows[0]
}

const deletar = async (id) => {
  const resultado = await db.query(
    `DELETE FROM deslocamentos
     WHERE id_deslocamento = $1
     RETURNING *`,
    [id]
  )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar
}