const db = require('../database/db')

const listarPorChamado = async (idChamado) => {
  const resultado = await db.query(
    `SELECT
      id_anexo,
      id_chamado,
      nome_arquivo,
      caminho_arquivo,
      tipo_arquivo,
      data_upload
    FROM anexos_chamado
    WHERE id_chamado = $1
    ORDER BY data_upload ASC`,
    [idChamado]
  )

  return resultado.rows
}

const buscarPorId = async (idAnexo) => {
  const resultado = await db.query(
    `SELECT
      id_anexo,
      id_chamado,
      nome_arquivo,
      caminho_arquivo,
      tipo_arquivo,
      data_upload
    FROM anexos_chamado
    WHERE id_anexo = $1`,
    [idAnexo]
  )

  return resultado.rows[0]
}

const verificarChamado = async (idChamado) => {
  const resultado = await db.query(
    `SELECT id_chamado
     FROM chamados
     WHERE id_chamado = $1`,
    [idChamado]
  )

  return Boolean(resultado.rows[0])
}

const criar = async ({
  id_chamado,
  nome_arquivo,
  caminho_arquivo,
  tipo_arquivo
}) => {
  const resultado = await db.query(
    `INSERT INTO anexos_chamado
    (
      id_chamado,
      nome_arquivo,
      caminho_arquivo,
      tipo_arquivo,
      data_upload
    )
    VALUES
    ($1, $2, $3, $4, NOW())
    RETURNING *`,
    [
      id_chamado,
      nome_arquivo,
      caminho_arquivo,
      tipo_arquivo
    ]
  )

  return resultado.rows[0]
}

const deletar = async (idAnexo) => {
  const resultado = await db.query(
    `DELETE FROM anexos_chamado
     WHERE id_anexo = $1
     RETURNING *`,
    [idAnexo]
  )

  return resultado.rows[0]
}

module.exports = {
  listarPorChamado,
  buscarPorId,
  verificarChamado,
  criar,
  deletar
}