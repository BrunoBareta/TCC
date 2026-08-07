import { api } from 'src/boot/axios'

const listar = async () => {
  const response = await api.get(
    '/unidades-propriedade'
  )

  return response.data
}

const listarPorPropriedade = async (idPropriedade) => {
  const response = await api.get(
    `/unidades-propriedade/propriedade/${idPropriedade}`
  )

  return response.data
}

const buscarPorId = async (idUnidade) => {
  const response = await api.get(
    `/unidades-propriedade/${idUnidade}`
  )

  return response.data
}

const criar = async (dados) => {
  const response = await api.post(
    '/unidades-propriedade',
    dados
  )

  return response.data
}

const atualizar = async (idUnidade, dados) => {
  const response = await api.put(
    `/unidades-propriedade/${idUnidade}`,
    dados
  )

  return response.data
}

const desativar = async (idUnidade) => {
  const response = await api.patch(
    `/unidades-propriedade/${idUnidade}/desativar`
  )

  return response.data
}

export default {
  listar,
  listarPorPropriedade,
  buscarPorId,
  criar,
  atualizar,
  desativar
}