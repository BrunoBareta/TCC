const crypto = require(
  'crypto'
)

const redefinicaoModel = require(
  '../models/redefinicaoSenhaModels'
)

const emailService = require(
  '../services/emailService'
)

/* =========================
   AUXILIARES
========================= */

function gerarCodigo() {
  return String(
    crypto.randomInt(
      100000,
      1000000
    )
  )
}

function gerarHash(
  codigo
) {
  return crypto
    .createHash('sha256')
    .update(
      String(codigo)
    )
    .digest('hex')
}

/* =========================
   SOLICITAR CÓDIGO
========================= */

const solicitarCodigo =
  async (
    req,
    res
  ) => {
    try {
      const email =
        String(
          req.body.email || ''
        )
          .trim()
          .toLowerCase()

      if (!email) {
        return res
          .status(400)
          .json({
            message:
              'Informe o e-mail.'
          })
      }

      const usuario =
        await redefinicaoModel
          .buscarUsuarioPorEmail(
            email
          )

      /*
        Não informamos se o
        e-mail existe ou não.

        Isso evita expor quais
        e-mails possuem conta.
      */
      if (!usuario) {
        return res.json({
          message:
            'Se o e-mail estiver cadastrado, você receberá um código de recuperação.'
        })
      }

      await redefinicaoModel
        .invalidarCodigos(
          usuario.id_usuario
        )

      const codigo =
        gerarCodigo()

      const codigoHash =
        gerarHash(
          codigo
        )

      await redefinicaoModel
        .criarCodigo(
          usuario.id_usuario,
          codigoHash
        )

      await emailService
        .enviarCodigoRedefinicao(
          usuario.email,
          codigo,
          usuario.nome
        )

      res.json({
        message:
          'Se o e-mail estiver cadastrado, você receberá um código de recuperação.'
      })
    } catch (error) {
      console.error(
        'Erro ao solicitar redefinição:',
        error
      )

      res.status(500).json({
        message:
          'Não foi possível enviar o código de recuperação.'
      })
    }
  }

/* =========================
   VERIFICAR CÓDIGO
========================= */

const verificarCodigo =
  async (
    req,
    res
  ) => {
    try {
      const email =
        String(
          req.body.email || ''
        )
          .trim()
          .toLowerCase()

      const codigo =
        String(
          req.body.codigo || ''
        )
          .replace(
            /\D/g,
            ''
          )

      if (
        !email ||
        codigo.length !== 6
      ) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido.'
          })
      }

      const usuario =
        await redefinicaoModel
          .buscarUsuarioPorEmail(
            email
          )

      if (!usuario) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido ou expirado.'
          })
      }

      const codigoHash =
        gerarHash(
          codigo
        )

      const redefinicao =
        await redefinicaoModel
          .buscarCodigoValido(
            usuario.id_usuario,
            codigoHash
          )

      if (!redefinicao) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido ou expirado.'
          })
      }

      res.json({
        valido: true,

        message:
          'Código confirmado.'
      })
    } catch (error) {
      console.error(
        'Erro ao verificar código:',
        error
      )

      res.status(500).json({
        message:
          'Não foi possível verificar o código.'
      })
    }
  }

/* =========================
   REDEFINIR SENHA
========================= */

const redefinirSenha =
  async (
    req,
    res
  ) => {
    try {
      const email =
        String(
          req.body.email || ''
        )
          .trim()
          .toLowerCase()

      const codigo =
        String(
          req.body.codigo || ''
        )
          .replace(
            /\D/g,
            ''
          )

      const novaSenha =
        String(
          req.body.nova_senha ||
          ''
        )

      if (
        codigo.length !== 6
      ) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido.'
          })
      }

      if (
        novaSenha.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              'A nova senha deve possuir pelo menos 6 caracteres.'
          })
      }

      const usuario =
        await redefinicaoModel
          .buscarUsuarioPorEmail(
            email
          )

      if (!usuario) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido ou expirado.'
          })
      }

      const codigoHash =
        gerarHash(
          codigo
        )

      const redefinicao =
        await redefinicaoModel
          .buscarCodigoValido(
            usuario.id_usuario,
            codigoHash
          )

      if (!redefinicao) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido ou expirado.'
          })
      }

      const atualizado =
        await redefinicaoModel
          .consumirCodigoEAtualizarSenha(
            redefinicao
              .id_redefinicao,

            novaSenha
          )

      if (!atualizado) {
        return res
          .status(400)
          .json({
            message:
              'Código inválido ou expirado.'
          })
      }

      res.json({
        message:
          'Senha redefinida com sucesso.'
      })
    } catch (error) {
      console.error(
        'Erro ao redefinir senha:',
        error
      )

      res.status(500).json({
        message:
          'Não foi possível redefinir sua senha.'
      })
    }
  }

module.exports = {
  solicitarCodigo,
  verificarCodigo,
  redefinirSenha
}