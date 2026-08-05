import { api } from 'src/boot/axios'

const listar = async () => {
  const response = await api.get('/chamados')
  return response.data
}

const buscarPorId = async (id) => {
  const response = await api.get(`/chamados/${id}`)
  return response.data
}

const criar = async (dados) => {
  const response = await api.post('/chamados', dados)
  return response.data
}

export default {
  listar,
  buscarPorId,
  criar
}