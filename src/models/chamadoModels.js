const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    'SELECT * FROM chamados ORDER BY id_chamado ASC'
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT *
     FROM chamados
     WHERE id_chamado = $1`,
    [id]
  )

  return resultado.rows[0]
}

const criar = async (dados) => {
  const {
    id_usuario,
    id_propriedade,
    tipo_cultura,
    tipo_chamado,
    problema,
    descricao,
    urgencia
  } = dados

  const resultado = await db.query(
    `INSERT INTO chamados
    (
      id_usuario,
      id_propriedade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia,
      status,
      data_abertura
    )
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, 'PENDENTE', NOW())
    RETURNING *`,
    [
      id_usuario,
      id_propriedade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (id, dados) => {
  const {
    tipo_cultura,
    tipo_chamado,
    problema,
    descricao,
    urgencia,
    status,
    resposta_tecnico
  } = dados

  const resultado = await db.query(
    `UPDATE chamados SET
      tipo_cultura = $1,
      tipo_chamado = $2,
      problema = $3,
      descricao = $4,
      urgencia = $5,
      status = $6,
      resposta_tecnico = $7
    WHERE id_chamado = $8
    RETURNING *`,
    [
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia,
      status,
      resposta_tecnico,
      id
    ]
  )

  return resultado.rows[0]
}

const atualizarStatus = async (
  id,
  novoStatus,
  respostaTecnico = null
) => {
  const resultado = await db.query(
    `UPDATE chamados
     SET
       status = $2::varchar,

       resposta_tecnico = CASE
         WHEN $2::varchar = 'FINALIZADO'
              AND $3::text IS NOT NULL
           THEN $3::text
         ELSE resposta_tecnico
       END,

       data_finalizacao = CASE
         WHEN $2::varchar = 'FINALIZADO'
           THEN NOW()
         ELSE data_finalizacao
       END,

       data_fechamento = CASE
         WHEN $2::varchar = 'FINALIZADO'
           THEN NOW()
         ELSE data_fechamento
       END

     WHERE id_chamado = $1::bigint
     RETURNING *`,
    [
      id,
      novoStatus,
      respostaTecnico
    ]
  )

  return resultado.rows[0]
}

const deletar = async (id) => {
  const resultado = await db.query(
    `UPDATE chamados
     SET status = 'CANCELADO'
     WHERE id_chamado = $1
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
  atualizarStatus,
  deletar
}