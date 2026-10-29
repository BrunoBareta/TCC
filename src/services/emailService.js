const path = require('path')

// Carrega o .env da raiz do backend, independentemente da pasta
// em que o servidor foi iniciado. Variáveis já definidas são preservadas.
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
})

const nodemailer = require('nodemailer')

function validarConfiguracaoSMTP() {
  const obrigatorias = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']
  const ausentes = obrigatorias.filter((nome) =>
    !String(process.env[nome] || '').trim()
  )

  if (ausentes.length > 0) {
    throw new Error(
      `[SMTP] Variáveis não configuradas: ${ausentes.join(', ')}. ` +
      'Confira o arquivo .env na raiz do backend.'
    )
  }

  const porta = Number(process.env.SMTP_PORT || 587)

  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error(
      '[SMTP] SMTP_PORT inválida. Verifique a porta no arquivo .env.'
    )
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const enviarCodigoRedefinicao = async (email, codigo, nomeUsuario) => {
  validarConfiguracaoSMTP()

  try {
    const resultado = await transporter.sendMail({
      from: `"Avioeste" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Código para redefinir sua senha - Avioeste',
      text: `
Olá ${nomeUsuario || ''}.

Seu código para redefinir sua senha é:

${codigo}

Este código é válido por 10 minutos.

Se você não solicitou esta redefinição, ignore este e-mail.
      `.trim(),
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 520px;
            margin: auto;
            color: #101828;
          "
        >
          <div
            style="
              padding: 28px;
              border: 1px solid #eaecf0;
              border-radius: 18px;
            "
          >
            <div
              style="
                color: #f97316;
                font-size: 26px;
                font-weight: 800;
              "
            >
              Avioeste
            </div>

            <h2>
              Redefinição de senha
            </h2>

            <p>
              Olá ${nomeUsuario || ''},
            </p>

            <p>
              Use o código abaixo para criar uma nova senha:
            </p>

            <div
              style="
                margin: 24px 0;
                padding: 20px;
                border-radius: 12px;
                background: #fff7ed;
                color: #f97316;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: 8px;
                text-align: center;
              "
            >
              ${codigo}
            </div>

            <p
              style="
                color: #667085;
                font-size: 13px;
              "
            >
              Este código é válido por 10 minutos.
            </p>

            <p
              style="
                color: #98a2b3;
                font-size: 12px;
              "
            >
              Se você não solicitou esta alteração,
              basta ignorar este e-mail.
            </p>
          </div>
        </div>
      `
    })

    const aceitos = Array.isArray(resultado.accepted)
      ? resultado.accepted.length
      : 0
    const rejeitados = Array.isArray(resultado.rejected)
      ? resultado.rejected.length
      : 0

    console.info(
      `[SMTP] Envio processado pelo servidor. ` +
      `Destinatários aceitos: ${aceitos}; rejeitados: ${rejeitados}.`
    )

    if (aceitos === 0) {
      throw new Error(
        '[SMTP] O servidor não confirmou a aceitação de nenhum destinatário.'
      )
    }

    return resultado
  } catch (error) {
    // Registra os dados úteis para diagnóstico sem expor credenciais
    // SMTP nem o código de recuperação.
    console.error('[SMTP] Erro ao enviar código de recuperação:', {
      mensagem: error.message,
      codigo: error.code || null,
      comando: error.command || null,
      respostaSMTP: error.responseCode || null
    })

    throw error
  }
}

module.exports = {
  enviarCodigoRedefinicao
}
