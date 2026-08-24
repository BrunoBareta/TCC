import { api } from 'src/boot/axios'

const listar = async () => {
  const response = await api.get(
    '/usuarios'
  )

  return response.data
}

const buscarPorId = async (
  idUsuario
) => {
  const response = await api.get(
    `/usuarios/${idUsuario}`
  )

  return response.data
}

/* =========================
   CADASTRAR PRODUTOR
========================= */

const criar = async (
  dados
) => {
  const response = await api.post(
    '/usuarios',
    dados
  )

  return response.data
}

/* =========================
   CADASTRAR TÉCNICO
   PAINEL ADMINISTRATIVO
========================= */

const criarFuncionario = async (
  dados
) => {
  const response = await api.post(
    '/usuarios/funcionarios',
    dados
  )

  return response.data
}

/* =========================
   ATUALIZAR USUÁRIO
========================= */

const atualizar = async (
  idUsuario,
  dados
) => {
  const response = await api.put(
    `/usuarios/${idUsuario}`,
    dados
  )

  return response.data
}

/* =========================
   DESATIVAR USUÁRIO
========================= */

const desativar = async (
  idUsuario
) => {
  const response = await api.delete(
    `/usuarios/${idUsuario}`
  )

  return response.data
}

export default {
  listar,
  buscarPorId,
  criar,
  criarFuncionario,
  atualizar,
  desativar
}