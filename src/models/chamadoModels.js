const db = require('../database/db')

/* =========================
   LISTAR CHAMADOS
========================= */

const listar = async () => {
  const resultado = await db.query(
    `SELECT
      c.*,

      /* =========================
         PRODUTOR
      ========================= */

      produtor.nome AS nome_produtor,
      produtor.email AS email_produtor,
      produtor.telefone AS telefone_produtor,

      /* =========================
         PROPRIEDADE
      ========================= */

      p.nome_propriedade,
      p.endereco AS endereco_propriedade,
      p.cidade AS cidade_propriedade,
      p.estado AS estado_propriedade,
      p.cep AS cep_propriedade,
      p.latitude AS latitude_propriedade,
      p.longitude AS longitude_propriedade,
      p.cultura_principal,

      /* =========================
         UNIDADE ANTIGA
      ========================= */

      up.nome_unidade,
      up.tipo_unidade,
      up.descricao AS descricao_unidade,
      up.referencia AS referencia_unidade,

      /* =========================
         TÉCNICO
      ========================= */

      tecnico.nome_tecnico,
      tecnico.email_tecnico,
      tecnico.telefone_tecnico

    FROM chamados c

    /* =========================
       USUÁRIO QUE ABRIU
       O CHAMADO
    ========================= */

    LEFT JOIN usuarios produtor
      ON produtor.id_usuario = c.id_usuario

    /* =========================
       PROPRIEDADE
    ========================= */

    LEFT JOIN propriedades p
      ON p.id_propriedade = c.id_propriedade

    /* =========================
       UNIDADE / AVIÁRIO ANTIGO
    ========================= */

    LEFT JOIN unidades_propriedade up
      ON up.id_unidade = c.id_unidade

    /* =========================
       TÉCNICO(S) VINCULADO(S)
    ========================= */

    LEFT JOIN LATERAL (
      SELECT
        STRING_AGG(
          u.nome,
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS nome_tecnico,

        STRING_AGG(
          u.email,
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS email_tecnico,

        STRING_AGG(
          COALESCE(
            u.telefone,
            ''
          ),
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS telefone_tecnico

      FROM chamado_funcionario cf

      INNER JOIN usuarios u
        ON u.id_usuario = cf.id_funcionario

      WHERE cf.id_chamado = c.id_chamado
        AND cf.status_aceite = 'ACEITO'
    ) tecnico
      ON TRUE

    ORDER BY c.id_chamado DESC`
  )

  return resultado.rows
}

/* =========================
   BUSCAR CHAMADO POR ID
========================= */

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT
      c.*,

      /* =========================
         PRODUTOR
      ========================= */

      produtor.nome AS nome_produtor,
      produtor.email AS email_produtor,
      produtor.telefone AS telefone_produtor,

      /* =========================
         PROPRIEDADE
      ========================= */

      p.nome_propriedade,
      p.endereco AS endereco_propriedade,
      p.cidade AS cidade_propriedade,
      p.estado AS estado_propriedade,
      p.cep AS cep_propriedade,
      p.latitude AS latitude_propriedade,
      p.longitude AS longitude_propriedade,
      p.cultura_principal,

      /* =========================
         UNIDADE ANTIGA
      ========================= */

      up.nome_unidade,
      up.tipo_unidade,
      up.descricao AS descricao_unidade,
      up.referencia AS referencia_unidade,

      /* =========================
         TÉCNICO
      ========================= */

      tecnico.nome_tecnico,
      tecnico.email_tecnico,
      tecnico.telefone_tecnico

    FROM chamados c

    LEFT JOIN usuarios produtor
      ON produtor.id_usuario = c.id_usuario

    LEFT JOIN propriedades p
      ON p.id_propriedade = c.id_propriedade

    LEFT JOIN unidades_propriedade up
      ON up.id_unidade = c.id_unidade

    LEFT JOIN LATERAL (
      SELECT
        STRING_AGG(
          u.nome,
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS nome_tecnico,

        STRING_AGG(
          u.email,
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS email_tecnico,

        STRING_AGG(
          COALESCE(
            u.telefone,
            ''
          ),
          ', '
          ORDER BY cf.data_aceite ASC
        ) AS telefone_tecnico

      FROM chamado_funcionario cf

      INNER JOIN usuarios u
        ON u.id_usuario = cf.id_funcionario

      WHERE cf.id_chamado = c.id_chamado
        AND cf.status_aceite = 'ACEITO'
    ) tecnico
      ON TRUE

    WHERE c.id_chamado = $1`,
    [id]
  )

  return resultado.rows[0]
}

/* =========================
   BUSCAR PROPRIEDADE
========================= */

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

/* =========================
   VALIDAR UNIDADE ANTIGA
========================= */

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

/* =========================
   CRIAR CHAMADO
========================= */

const criar = async (dados) => {
  const {
    id_usuario,
    id_propriedade,
    id_unidade = null,
    tipo_cultura,
    tipo_chamado,
    problema,
    descricao,
    urgencia,

    /* =========================
       LOCAL DO ATENDIMENTO
    ========================= */

    latitude_atendimento = null,
    longitude_atendimento = null,
    endereco_atendimento = null,
    origem_localizacao = 'CADASTRO'
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

      latitude_atendimento,
      longitude_atendimento,
      endereco_atendimento,
      origem_localizacao,

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

      $9,
      $10,
      $11,
      $12,

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
      urgencia,

      latitude_atendimento,
      longitude_atendimento,
      endereco_atendimento,
      origem_localizacao
    ]
  )

  return resultado.rows[0]
}

/* =========================
   ATUALIZAR CHAMADO
========================= */

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
    resposta_tecnico,

    /* =========================
       LOCAL DO ATENDIMENTO
    ========================= */

    latitude_atendimento,
    longitude_atendimento,
    endereco_atendimento,
    origem_localizacao
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

       latitude_atendimento =
         COALESCE(
           $8,
           latitude_atendimento
         ),

       longitude_atendimento =
         COALESCE(
           $9,
           longitude_atendimento
         ),

       endereco_atendimento =
         COALESCE(
           $10,
           endereco_atendimento
         ),

       origem_localizacao =
         COALESCE(
           $11,
           origem_localizacao
         ),

       status =
         COALESCE(
           $12,
           status
         ),

       resposta_tecnico =
         COALESCE(
           $13,
           resposta_tecnico
         )

     WHERE id_chamado = $14

     RETURNING *`,
    [
      id_propriedade,
      id_unidade,
      tipo_cultura,
      tipo_chamado,
      problema,
      descricao,
      urgencia,

      latitude_atendimento ?? null,
      longitude_atendimento ?? null,
      endereco_atendimento ?? null,
      origem_localizacao ?? null,

      status || null,
      resposta_tecnico || null,

      id
    ]
  )

  return resultado.rows[0]
}

/* =========================
   ATUALIZAR STATUS
========================= */

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

/* =========================
   CANCELAR CHAMADO
========================= */

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

/* =========================
   EXPORTAÇÕES
========================= */

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