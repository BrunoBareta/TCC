const db = require('../database/db')

const listar = async () => {
  const resultado =
    await db.query(
      `SELECT *
       FROM propriedades
       ORDER BY id_propriedade ASC`
    )

  return resultado.rows
}

const buscarPorId = async (
  id
) => {
  const resultado =
    await db.query(
      `SELECT *
       FROM propriedades
       WHERE id_propriedade = $1`,
      [id]
    )

  return resultado.rows[0]
}

/*
  BUSCA A PROPRIEDADE ATIVA
  DO PRODUTOR LOGADO
*/
const buscarPorUsuario = async (
  idUsuario
) => {
  const resultado =
    await db.query(
      `SELECT *
       FROM propriedades
       WHERE id_usuario = $1
         AND ativo = TRUE
       ORDER BY id_propriedade DESC
       LIMIT 1`,
      [idUsuario]
    )

  return resultado.rows[0]
}

const criar = async (
  dados
) => {
  const {
    id_usuario,
    nome_propriedade,
    cultura_principal,
    quantidade_galpoes,
    endereco,
    cidade,
    estado,
    cep,
    latitude,
    longitude
  } = dados

  const resultado =
    await db.query(
      `INSERT INTO propriedades
      (
        id_usuario,
        nome_propriedade,
        cultura_principal,
        quantidade_galpoes,
        endereco,
        cidade,
        estado,
        cep,
        latitude,
        longitude,
        ativo,
        data_cadastro
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        TRUE,
        NOW()
      )
      RETURNING *`,
      [
        id_usuario,
        nome_propriedade,
        cultura_principal,
        quantidade_galpoes,
        endereco,
        cidade,
        estado,
        cep,
        latitude,
        longitude
      ]
    )

  return resultado.rows[0]
}

const atualizar = async (
  id,
  dados
) => {
  const {
    nome_propriedade,
    cultura_principal,
    quantidade_galpoes,
    endereco,
    cidade,
    estado,
    cep,
    latitude,
    longitude,
    ativo
  } = dados

  const resultado =
    await db.query(
      `UPDATE propriedades
       SET
         nome_propriedade = $1,
         cultura_principal = $2,
         quantidade_galpoes = $3,
         endereco = $4,
         cidade = $5,
         estado = $6,
         cep = $7,
         latitude = $8,
         longitude = $9,
         ativo = $10

       WHERE id_propriedade = $11

       RETURNING *`,
      [
        nome_propriedade,
        cultura_principal,
        quantidade_galpoes,
        endereco,
        cidade,
        estado,
        cep,
        latitude,
        longitude,
        ativo,
        id
      ]
    )

  return resultado.rows[0]
}

const deletar = async (
  id
) => {
  const resultado =
    await db.query(
      `UPDATE propriedades
       SET ativo = FALSE
       WHERE id_propriedade = $1
       RETURNING *`,
      [id]
    )

  return resultado.rows[0]
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorUsuario,
  criar,
  atualizar,
  deletar
}