import { api } from 'src/boot/axios'

const listarPorChamado = async (idChamado) => {
  const response = await api.get(
    `/historicos/chamado/${idChamado}`
  )

  return response.data
}

const criar = async (dados) => {
  const response = await api.post('/historicos', dados)

  return response.data
}

export default {
  listarPorChamado,
  criar
}