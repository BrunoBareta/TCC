const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    `SELECT *
     FROM materiais_utilizados
     ORDER BY id_material ASC`
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT *
     FROM materiais_utilizados
     WHERE id_material = $1`,
    [id]
  )

  return resultado.rows[0]
}

const listarPorChamado = async (idChamado) => {
  const resultado = await db.query(
    `SELECT *
     FROM materiais_utilizados
     WHERE id_chamado = $1
     ORDER BY id_material ASC`,
    [idChamado]
  )

  return resultado.rows
}

const criar = async (dados) => {
  const {
    id_chamado,
    descricao_material,
    quantidade
  } = dados

  const resultado = await db.query(
    `INSERT INTO materiais_utilizados
    (
      id_chamado,
      descricao_material,
      quantidade,
      valor_unitario,
      valor_total
    )
    VALUES ($1, $2, $3, NULL, NULL)
    RETURNING *`,
    [
      id_chamado,
      descricao_material,
      quantidade
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (id, dados) => {
  const {
    descricao_material,
    quantidade
  } = dados

  const resultado = await db.query(
    `UPDATE materiais_utilizados
     SET
       descricao_material = $1,
       quantidade = $2
     WHERE id_material = $3
     RETURNING *`,
    [
      descricao_material,
      quantidade,
      id
    ]
  )

  return resultado.rows[0]
}

const deletar = async (id) => {
  const resultado = await db.query(
    `DELETE FROM materiais_utilizados
     WHERE id_material = $1
     RETURNING *`,
    [id]
  )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  listarPorChamado,
  criar,
  atualizar,
  deletar
}