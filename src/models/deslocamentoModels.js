const db = require('../database/db')

const listar = async () => {
  const resultado = await db.query(
    `SELECT *
     FROM deslocamentos
     ORDER BY id_deslocamento ASC`
  )

  return resultado.rows
}

const buscarPorId = async (id) => {
  const resultado = await db.query(
    `SELECT *
     FROM deslocamentos
     WHERE id_deslocamento = $1`,
    [id]
  )

  return resultado.rows[0]
}

const buscarPorChamado = async (idChamado) => {
  const resultado = await db.query(
    `SELECT *
     FROM deslocamentos
     WHERE id_chamado = $1
     ORDER BY id_deslocamento DESC
     LIMIT 1`,
    [idChamado]
  )

  return resultado.rows[0]
}

const criar = async (dados) => {
  const {
    id_chamado,
    id_funcionario,
    km_saida
  } = dados

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
    VALUES
    ($1, $2, $3, NULL, NULL, NOW(), NULL)
    RETURNING *`,
    [
      id_chamado,
      id_funcionario,
      km_saida
    ]
  )

  return resultado.rows[0]
}

const finalizar = async (idChamado, kmRetorno) => {
  const deslocamentoAtual = await buscarPorChamado(idChamado)

  if (!deslocamentoAtual) {
    const error = new Error(
      'Nenhum deslocamento foi iniciado para este chamado.'
    )

    error.codigo = 'DESLOCAMENTO_NAO_ENCONTRADO'
    throw error
  }

  const kmSaida = Number(deslocamentoAtual.km_saida)
  const retorno = Number(kmRetorno)

  if (retorno < kmSaida) {
    const error = new Error(
      'O KM de retorno não pode ser menor que o KM de saída.'
    )

    error.codigo = 'KM_RETORNO_INVALIDO'
    throw error
  }

  const kmTotal = retorno - kmSaida

  const resultado = await db.query(
    `UPDATE deslocamentos
     SET
       km_retorno = $1,
       km_total = $2,
       data_retorno = NOW()
     WHERE id_deslocamento = $3
     RETURNING *`,
    [
      retorno,
      kmTotal,
      deslocamentoAtual.id_deslocamento
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

  const kmTotal =
    km_retorno !== null &&
    km_retorno !== undefined &&
    km_retorno !== ''
      ? Number(km_retorno) - Number(km_saida)
      : null

  const resultado = await db.query(
    `UPDATE deslocamentos SET
      id_chamado = $1,
      id_funcionario = $2,
      km_saida = $3,
      km_retorno = $4,
      km_total = $5,
      data_retorno = CASE
        WHEN $4::numeric IS NOT NULL
          THEN NOW()
        ELSE data_retorno
      END
    WHERE id_deslocamento = $6
    RETURNING *`,
    [
      id_chamado,
      id_funcionario,
      km_saida,
      km_retorno || null,
      kmTotal,
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
  buscarPorChamado,
  criar,
  finalizar,
  atualizar,
  deletar
}