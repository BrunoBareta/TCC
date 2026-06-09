const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    'SELECT * FROM materiais_utilizados ORDER BY id_material ASC'
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    'SELECT * FROM materiais_utilizados WHERE id_material = $1',
    [id]
  )

  return resultado.rows[0]
}

const listarPorChamado = async (id_chamado) => {
  const resultado = await db.query(
    'SELECT * FROM materiais_utilizados WHERE id_chamado = $1 ORDER BY id_material ASC',
    [id_chamado]
  )

  return resultado.rows
}

const criar = async (dados) => {
  const {
    id_chamado,
    descricao_material,
    quantidade,
    valor_unitario
  } = dados

  const valor_total = Number(quantidade) * Number(valor_unitario)

  const resultado = await db.query(
    `INSERT INTO materiais_utilizados
    (
      id_chamado,
      descricao_material,
      quantidade,
      valor_unitario,
      valor_total
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [
      id_chamado,
      descricao_material,
      quantidade,
      valor_unitario,
      valor_total
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (id, dados) => {
  const {
    id_chamado,
    descricao_material,
    quantidade,
    valor_unitario
  } = dados

  const valor_total = Number(quantidade) * Number(valor_unitario)

  const resultado = await db.query(
    `UPDATE materiais_utilizados SET
      id_chamado = $1,
      descricao_material = $2,
      quantidade = $3,
      valor_unitario = $4,
      valor_total = $5
    WHERE id_material = $6
    RETURNING *`,
    [
      id_chamado,
      descricao_material,
      quantidade,
      valor_unitario,
      valor_total,
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