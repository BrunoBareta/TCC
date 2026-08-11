require('dotenv').config()

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(
    process.env.SMTP_PORT || 587
  ),

  secure:
    String(
      process.env.SMTP_SECURE
    ).toLowerCase() === 'true',

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const enviarCodigoRedefinicao = async (
  email,
  codigo,
  nomeUsuario
) => {
  await transporter.sendMail({
    from:
      `"Avioeste" <${
        process.env.SMTP_FROM ||
        process.env.SMTP_USER
      }>`,

    to: email,

    subject:
      'Código para redefinir sua senha - Avioeste',

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
}

module.exports = {
  enviarCodigoRedefinicao
}