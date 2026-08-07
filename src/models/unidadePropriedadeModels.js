const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    `SELECT
      up.*,
      p.nome_propriedade
    FROM unidades_propriedade up
    INNER JOIN propriedades p
      ON p.id_propriedade = up.id_propriedade
    ORDER BY p.nome_propriedade, up.nome_unidade`
  )

  return resultado.rows
}

const buscarPorId = async (idUnidade) => {
  const resultado = await db.query(
    `SELECT
      up.*,
      p.nome_propriedade,
      p.endereco,
      p.cidade,
      p.estado
    FROM unidades_propriedade up
    INNER JOIN propriedades p
      ON p.id_propriedade = up.id_propriedade
    WHERE up.id_unidade = $1`,
    [idUnidade]
  )

  return resultado.rows[0]
}

const listarPorPropriedade = async (idPropriedade) => {
  const resultado = await db.query(
    `SELECT *
     FROM unidades_propriedade
     WHERE id_propriedade = $1
       AND ativo = TRUE
     ORDER BY nome_unidade`,
    [idPropriedade]
  )

  return resultado.rows
}

const criar = async (dados) => {
  const {
    id_propriedade,
    nome_unidade,
    tipo_unidade,
    descricao = null,
    referencia = null
  } = dados

  const resultado = await db.query(
    `INSERT INTO unidades_propriedade
    (
      id_propriedade,
      nome_unidade,
      tipo_unidade,
      descricao,
      referencia
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      id_propriedade,
      nome_unidade,
      tipo_unidade,
      descricao,
      referencia
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (idUnidade, dados) => {
  const {
    nome_unidade,
    tipo_unidade,
    descricao = null,
    referencia = null,
    ativo = true
  } = dados

  const resultado = await db.query(
    `UPDATE unidades_propriedade
     SET
       nome_unidade = $1,
       tipo_unidade = $2,
       descricao = $3,
       referencia = $4,
       ativo = $5
     WHERE id_unidade = $6
     RETURNING *`,
    [
      nome_unidade,
      tipo_unidade,
      descricao,
      referencia,
      ativo,
      idUnidade
    ]
  )

  return resultado.rows[0]
}

const desativar = async (idUnidade) => {
  const resultado = await db.query(
    `UPDATE unidades_propriedade
     SET ativo = FALSE
     WHERE id_unidade = $1
     RETURNING *`,
    [idUnidade]
  )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  listarPorPropriedade,
  criar,
  atualizar,
  desativar
}