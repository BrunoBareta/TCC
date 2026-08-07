import { api } from 'src/boot/axios'

const listarPorChamado = async (idChamado) => {
  const response = await api.get(
    `/materiais/chamado/${idChamado}`
  )

  return response.data
}

const criar = async (dados) => {
  const response = await api.post(
    '/materiais',
    dados
  )

  return response.data
}

const atualizar = async (idMaterial, dados) => {
  const response = await api.put(
    `/materiais/${idMaterial}`,
    dados
  )

  return response.data
}

const remover = async (idMaterial) => {
  const response = await api.delete(
    `/materiais/${idMaterial}`
  )

  return response.data
}

export default {
  listarPorChamado,
  criar,
  atualizar,
  remover
}