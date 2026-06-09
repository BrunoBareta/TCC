const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(`
    SELECT *
    FROM historico_chamado
    ORDER BY data_alteracao DESC
  `)

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT *
     FROM historico_chamado
     WHERE id_historico = $1`,
    [id]
  )

  return resultado.rows[0]
}

const buscarPorChamado = async (idChamado) => {
  const resultado = await db.query(
    `SELECT *
     FROM historico_chamado
     WHERE id_chamado = $1
     ORDER BY data_alteracao DESC`,
    [idChamado]
  )

  return resultado.rows
}

const criar = async (dados) => {
  const {
    id_chamado,
    status_anterior,
    status_novo,
    observacao,
    id_usuario_responsavel
  } = dados

  const resultado = await db.query(
    `INSERT INTO historico_chamado
    (
      id_chamado,
      status_anterior,
      status_novo,
      observacao,
      id_usuario_responsavel,
      data_alteracao
    )
    VALUES
    ($1,$2,$3,$4,$5,NOW())
    RETURNING *`,
    [
      id_chamado,
      status_anterior,
      status_novo,
      observacao,
      id_usuario_responsavel
    ]
  )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorChamado,
  criar
}