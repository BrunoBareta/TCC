const db = require(
  '../database/db'
)

const buscarUsuarioPorEmail =
  async (email) => {
    const resultado =
      await db.query(
        `SELECT
          id_usuario,
          nome,
          email
         FROM usuarios
         WHERE LOWER(email) =
               LOWER($1)
           AND ativo = TRUE
         LIMIT 1`,
        [email]
      )

    return resultado.rows[0]
  }

const invalidarCodigos =
  async (idUsuario) => {
    await db.query(
      `UPDATE redefinicao_senha_codigo

       SET utilizado = TRUE

       WHERE id_usuario = $1
         AND utilizado = FALSE`,
      [idUsuario]
    )
  }

const criarCodigo =
  async (
    idUsuario,
    codigoHash
  ) => {
    const resultado =
      await db.query(
        `INSERT INTO
          redefinicao_senha_codigo
        (
          id_usuario,
          codigo_hash,
          expira_em,
          utilizado,
          criado_em
        )
        VALUES
        (
          $1,
          $2,
          NOW() + INTERVAL '10 minutes',
          FALSE,
          NOW()
        )

        RETURNING *`,
        [
          idUsuario,
          codigoHash
        ]
      )

    return resultado.rows[0]
  }

const buscarCodigoValido =
  async (
    idUsuario,
    codigoHash
  ) => {
    const resultado =
      await db.query(
        `SELECT *

         FROM
           redefinicao_senha_codigo

         WHERE id_usuario = $1
           AND codigo_hash = $2
           AND utilizado = FALSE
           AND expira_em > NOW()

         ORDER BY criado_em DESC

         LIMIT 1`,
        [
          idUsuario,
          codigoHash
        ]
      )

    return resultado.rows[0]
  }

const consumirCodigoEAtualizarSenha =
  async (
    idRedefinicao,
    novaSenha
  ) => {
    const resultado =
      await db.query(
        `WITH codigo_usado AS
        (
          UPDATE
            redefinicao_senha_codigo

          SET utilizado = TRUE

          WHERE id_redefinicao = $1
            AND utilizado = FALSE
            AND expira_em > NOW()

          RETURNING id_usuario
        )

        UPDATE usuarios u

        SET senha = $2

        FROM codigo_usado c

        WHERE
          u.id_usuario =
          c.id_usuario

        RETURNING
          u.id_usuario,
          u.email`,
        [
          idRedefinicao,
          novaSenha
        ]
      )

    return resultado.rows[0]
  }

module.exports = {
  buscarUsuarioPorEmail,
  invalidarCodigos,
  criarCodigo,
  buscarCodigoValido,
  consumirCodigoEAtualizarSenha
}