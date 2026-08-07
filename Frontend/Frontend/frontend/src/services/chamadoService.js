import { api } from 'src/boot/axios'

const listar = async () => {
  const response = await api.get('/chamados')
  return response.data
}

const buscarPorId = async (id) => {
  const response = await api.get(
    `/chamados/${id}`
  )

  return response.data
}

const criar = async (dados) => {
  const response = await api.post(
    '/chamados',
    dados
  )

  return response.data
}

const atualizar = async (
  idChamado,
  dados
) => {
  const response = await api.put(
    `/chamados/${idChamado}`,
    dados
  )

  return response.data
}

const atualizarStatus = async (
  idChamado,
  dados
) => {
  const response = await api.patch(
    `/chamados/${idChamado}/status`,
    dados
  )

  return response.data
}

const cancelar = async (idChamado) => {
  const response = await api.delete(
    `/chamados/${idChamado}`
  )

  return response.data
}

export default {
  listar,
  buscarPorId,
  criar,
  atualizar,
  atualizarStatus,
  cancelar
}