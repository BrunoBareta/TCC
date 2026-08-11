const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    `SELECT
      c.*,

      p.nome_propriedade,
      p.endereco AS endereco_propriedade,
      p.cidade AS cidade_propriedade,
      p.estado AS estado_propriedade,
      p.cep AS cep_propriedade,
      p.latitude AS latitude_propriedade,
      p.longitude AS longitude_propriedade,
      p.cultura_principal,

      up.nome_unidade,
      up.tipo_unidade,
      up.descricao AS descricao_unidade,
      up.referencia AS referencia_unidade

    FROM chamados c

    LEFT JOIN propriedades p
      ON p.id_propriedade = c.id_propriedade

    LEFT JOIN unidades_propriedade up
      ON up.id_unidade = c.id_unidade

    ORDER BY c.id_chamado ASC`
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT
      c.*,

      p.nome_propriedade,
      p.endereco AS endereco_propriedade,
      p.cidade AS cidade_propriedade,
      p.estado AS estado_propriedade,
      p.cep AS cep_propriedade,
      p.latitude AS latitude_propriedade,
      p.longitude AS longitude_propriedade,
      p.cultura_principal,

      up.nome_unidade,
      up.tipo_unidade,
      up.descricao AS descricao_unidade,
      up.referencia AS referencia_unidade

    FROM chamados c

    LEFT JOIN propriedades p
      ON p.id_propriedade = c.id_propriedade

    LEFT JOIN unidades_propriedade up
      ON up.id_unidade = c.id_unidade

    WHERE c.id_chamado = $1`,
    [id]
  )

  return resultado.rows[0]
}

/*
  BUSCA A PROPRIEDADE.

  Usado para confirmar se a propriedade
  realmente existe antes de abrir chamado.
*/
const buscarPropriedade = async (
  idPropriedade
) => {
  const resultado = await db.query(
    `SELECT
      id_propriedade,
      id_usuario,
      nome_propriedade,
      cultura_principal,
      endereco,
      cidade,
      estado,
      cep,
      latitude,
      longitude,
      ativo

    FROM propriedades

    WHERE id_propriedade = $1
      AND ativo = TRUE`,
    [idPropriedade]
  )

  return resultado.rows[0]
}

/*
  Continua existindo para manter
  compatibilidade com chamados antigos
  que possuem unidade/Aviário.
*/
const validarUnidade = async (
  idPropriedade,
  idUnidade
) => {
  const resultado = await db.query(
    `SELECT
      id_unidade,
      id_propriedade,
      nome_unidade,
      tipo_unidade,
      descricao,
      referencia,
      ativo

    FROM unidades_propriedade

    WHERE id_unidade = $1
      AND id_propriedade = $2
      AND ativo = TRUE`,
    [
      idUnidade,
      idPropriedade
    ]
  )

  return resultado.rows[0]
}

const criar = async (dados) => {
  const {
    id_usuario,
    id_propriedade,
    id_unidade = null,
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
      id_unidade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia,
      status,
      data_abertura
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
      'PENDENTE',
      NOW()
    )
    RETURNING *`,
    [
      id_usuario,
      id_propriedade,
      id_unidade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia
    ]
  )

  return resultado.rows[0]
}

const atualizar = async (
  id,
  dados
) => {
  const {
    id_propriedade,
    id_unidade,
    tipo_cultura,
    tipo_chamado,
    problema,
    descricao,
    urgencia,
    status,
    resposta_tecnico
  } = dados

  const resultado = await db.query(
    `UPDATE chamados

     SET
       id_propriedade = $1,
       id_unidade = $2,
       tipo_cultura = $3,
       tipo_chamado = $4,
       problema = $5,
       descricao = $6,
       urgencia = $7,

       status =
         COALESCE(
           $8,
           status
         ),

       resposta_tecnico =
         COALESCE(
           $9,
           resposta_tecnico
         )

     WHERE id_chamado = $10

     RETURNING *`,
    [
      id_propriedade,
      id_unidade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia,
      status || null,
      resposta_tecnico || null,
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
         WHEN
           $2::varchar = 'FINALIZADO'
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
  buscarPropriedade,
  validarUnidade,
  criar,
  atualizar,
  atualizarStatus,
  deletar
}