import { api } from 'src/boot/axios'

const solicitarCodigo = async (
  email
) => {
  const response = await api.post(
    '/senha/solicitar',
    {
      email
    }
  )

  return response.data
}

const verificarCodigo = async (
  email,
  codigo
) => {
  const response = await api.post(
    '/senha/verificar',
    {
      email,
      codigo
    }
  )

  return response.data
}

const redefinirSenha = async (
  email,
  codigo,
  novaSenha
) => {
  const response = await api.post(
    '/senha/redefinir',
    {
      email,
      codigo,

      nova_senha:
        novaSenha
    }
  )

  return response.data
}

export default {
  solicitarCodigo,
  verificarCodigo,
  redefinirSenha
}