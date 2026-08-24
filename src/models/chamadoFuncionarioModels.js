const db = require('../database/db')

const aceitarChamado = async (idChamado, idFuncionario) => {
  const cliente = await db.connect()

  try {
    await cliente.query('BEGIN')

    const chamadoResultado = await cliente.query(
      `SELECT *
       FROM chamados
       WHERE id_chamado = $1
       FOR UPDATE`,
      [idChamado]
    )

    const chamadoAtual = chamadoResultado.rows[0]

    if (!chamadoAtual) {
      const erro = new Error('Chamado não encontrado')
      erro.codigo = 'CHAMADO_NAO_ENCONTRADO'
      throw erro
    }

    if (chamadoAtual.status !== 'PENDENTE') {
      const erro = new Error(
        'Este chamado já foi aceito ou não está mais pendente.'
      )

      erro.codigo = 'CHAMADO_NAO_PENDENTE'
      throw erro
    }

    const funcionarioResultado = await cliente.query(
      `SELECT
        id_usuario,
        nome,
        tipo_usuario
       FROM usuarios
       WHERE id_usuario = $1`,
      [idFuncionario]
    )

    const funcionario = funcionarioResultado.rows[0]

    if (!funcionario) {
      const erro = new Error('Funcionário não encontrado')
      erro.codigo = 'FUNCIONARIO_NAO_ENCONTRADO'
      throw erro
    }

    if (
      ![
        'FUNCIONARIO',
        'TECNICO'
      ].includes(funcionario.tipo_usuario)
    ) {
      const erro = new Error(
        'O usuário informado não possui perfil de técnico.'
      )

      erro.codigo = 'PERFIL_INVALIDO'
      throw erro
    }

    const vinculoExistente = await cliente.query(
      `SELECT *
       FROM chamado_funcionario
       WHERE id_chamado = $1
         AND id_funcionario = $2`,
      [
        idChamado,
        idFuncionario
      ]
    )

    if (vinculoExistente.rows.length > 0) {
      const erro = new Error(
        'Este funcionário já está vinculado ao chamado.'
      )

      erro.codigo = 'VINCULO_EXISTENTE'
      throw erro
    }

    const vinculoResultado = await cliente.query(
      `INSERT INTO chamado_funcionario
      (
        id_chamado,
        id_funcionario,
        funcao_atendimento,
        status_aceite,
        data_aceite,
        observacao_aceite
      )
      VALUES
      (
        $1,
        $2,
        'FUNCIONARIO',
        'ACEITO',
        NOW(),
        $3
      )
      RETURNING *`,
      [
        idChamado,
        idFuncionario,
        `Chamado aceito por ${funcionario.nome}.`
      ]
    )

    const chamadoAtualizadoResultado = await cliente.query(
      `UPDATE chamados
       SET status = 'ACEITO'
       WHERE id_chamado = $1
       RETURNING *`,
      [idChamado]
    )

    const historicoResultado = await cliente.query(
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
      (
        $1,
        'PENDENTE',
        'ACEITO',
        $2,
        $3,
        NOW()
      )
      RETURNING *`,
      [
        idChamado,
        `Chamado aceito pelo técnico ${funcionario.nome}.`,
        idFuncionario
      ]
    )

    await cliente.query('COMMIT')

    return {
      chamado: chamadoAtualizadoResultado.rows[0],
      vinculo: vinculoResultado.rows[0],
      historico: historicoResultado.rows[0],
      funcionario
    }
  } catch (error) {
    await cliente.query('ROLLBACK')
    throw error
  } finally {
    cliente.release()
  }
}

const desistirChamado = async (
  idChamado,
  idFuncionario
) => {
  const cliente = await db.connect()

  try {
    await cliente.query('BEGIN')

    const chamadoResultado = await cliente.query(
      `SELECT *
       FROM chamados
       WHERE id_chamado = $1
       FOR UPDATE`,
      [idChamado]
    )

    const chamado = chamadoResultado.rows[0]

    if (!chamado) {
      const erro = new Error(
        'Chamado não encontrado.'
      )

      erro.codigo = 'CHAMADO_NAO_ENCONTRADO'
      throw erro
    }

    if (chamado.status !== 'ACEITO') {
      const erro = new Error(
        'Só é possível desistir antes do deslocamento.'
      )

      erro.codigo = 'DESISTENCIA_NAO_PERMITIDA'
      throw erro
    }

    const funcionarioResultado = await cliente.query(
      `SELECT
        id_usuario,
        nome
       FROM usuarios
       WHERE id_usuario = $1`,
      [idFuncionario]
    )

    const funcionario = funcionarioResultado.rows[0]

    if (!funcionario) {
      const erro = new Error(
        'Funcionário não encontrado.'
      )

      erro.codigo = 'FUNCIONARIO_NAO_ENCONTRADO'
      throw erro
    }

    const vinculoResultado = await cliente.query(
      `DELETE FROM chamado_funcionario
       WHERE id_chamado = $1
         AND id_funcionario = $2
         AND status_aceite = 'ACEITO'
       RETURNING *`,
      [
        idChamado,
        idFuncionario
      ]
    )

    if (vinculoResultado.rows.length === 0) {
      const erro = new Error(
        'Este funcionário não está vinculado ao chamado.'
      )

      erro.codigo = 'VINCULO_NAO_ENCONTRADO'
      throw erro
    }

    const totalResultado = await cliente.query(
      `SELECT
        COUNT(*)::integer AS total
       FROM chamado_funcionario
       WHERE id_chamado = $1
         AND status_aceite = 'ACEITO'`,
      [idChamado]
    )

    const totalFuncionarios =
      totalResultado.rows[0].total

    let chamadoAtualizado = chamado
    let historico = null

    if (totalFuncionarios === 0) {
      const chamadoResultado = await cliente.query(
        `UPDATE chamados
         SET status = 'PENDENTE'
         WHERE id_chamado = $1
         RETURNING *`,
        [idChamado]
      )

      chamadoAtualizado =
        chamadoResultado.rows[0]

      const historicoResultado = await cliente.query(
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
        (
          $1,
          'ACEITO',
          'PENDENTE',
          $2,
          $3,
          NOW()
        )
        RETURNING *`,
        [
          idChamado,
          `O técnico ${funcionario.nome} desistiu do chamado.`,
          idFuncionario
        ]
      )

      historico =
        historicoResultado.rows[0]
    }

    await cliente.query('COMMIT')

    return {
      chamado: chamadoAtualizado,

      vinculo_removido:
        vinculoResultado.rows[0],

      historico,

      voltou_para_fila:
        totalFuncionarios === 0
    }
  } catch (error) {
    await cliente.query('ROLLBACK')
    throw error
  } finally {
    cliente.release()
  }
}

const adicionarFuncionario = async (
  dados
) => {
  const {
    id_chamado,
    id_funcionario,
    funcao_atendimento = 'FUNCIONARIO',
    observacao_aceite = null
  } = dados

  const existente = await db.query(
    `SELECT *
     FROM chamado_funcionario
     WHERE id_chamado = $1
       AND id_funcionario = $2`,
    [
      id_chamado,
      id_funcionario
    ]
  )

  if (existente.rows.length > 0) {
    return existente.rows[0]
  }

  const resultado = await db.query(
    `INSERT INTO chamado_funcionario
    (
      id_chamado,
      id_funcionario,
      funcao_atendimento,
      status_aceite,
      data_aceite,
      observacao_aceite
    )
    VALUES
    (
      $1,
      $2,
      $3,
      'ACEITO',
      NOW(),
      $4
    )
    RETURNING *`,
    [
      id_chamado,
      id_funcionario,
      funcao_atendimento,
      observacao_aceite
    ]
  )

  return resultado.rows[0]
}

const listarPorChamado = async (
  idChamado
) => {
  const resultado = await db.query(
    `SELECT
      cf.id_chamado_funcionario,
      cf.id_chamado,
      cf.id_funcionario,
      cf.funcao_atendimento,
      cf.status_aceite,
      cf.data_aceite,
      cf.observacao_aceite,

      u.nome,
      u.email,
      u.telefone

    FROM chamado_funcionario cf

    INNER JOIN usuarios u
      ON u.id_usuario = cf.id_funcionario

    WHERE cf.id_chamado = $1

    ORDER BY cf.data_aceite ASC`,
    [idChamado]
  )

  return resultado.rows
}

/*
  LISTA OS CHAMADOS DO TÉCNICO

  Agora também busca:
  - produtor
  - propriedade
  - endereço
  - cidade
  - estado
  - CEP
  - latitude
  - longitude
  - cultura principal
  - unidade antiga, quando existir
*/

const listarPorFuncionario = async (
  idFuncionario
) => {
  const resultado = await db.query(
    `SELECT
      c.*,

      /* =========================
         VÍNCULO DO TÉCNICO
      ========================= */

      cf.id_chamado_funcionario,
      cf.id_funcionario,
      cf.funcao_atendimento,
      cf.status_aceite,
      cf.data_aceite,
      cf.observacao_aceite,

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
         UNIDADE / AVIÁRIO ANTIGO
      ========================= */

      up.nome_unidade,

      up.tipo_unidade,

      up.descricao AS descricao_unidade,

      up.referencia AS referencia_unidade

    FROM chamado_funcionario cf

    INNER JOIN chamados c
      ON c.id_chamado = cf.id_chamado

    LEFT JOIN usuarios produtor
      ON produtor.id_usuario = c.id_usuario

    LEFT JOIN propriedades p
      ON p.id_propriedade = c.id_propriedade

    LEFT JOIN unidades_propriedade up
      ON up.id_unidade = c.id_unidade

    WHERE cf.id_funcionario = $1

      AND cf.status_aceite = 'ACEITO'

    ORDER BY c.data_abertura DESC`,
    [idFuncionario]
  )

  return resultado.rows
}

const contarPorChamado = async (
  idChamado
) => {
  const resultado = await db.query(
    `SELECT
      COUNT(*)::integer AS total_funcionarios

     FROM chamado_funcionario

     WHERE id_chamado = $1
       AND status_aceite = 'ACEITO'`,
    [idChamado]
  )

  return resultado.rows[0]
}

module.exports = {
  aceitarChamado,
  desistirChamado,
  adicionarFuncionario,
  listarPorChamado,
  listarPorFuncionario,
  contarPorChamado
}