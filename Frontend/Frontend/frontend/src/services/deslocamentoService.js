import { api } from 'src/boot/axios'

const buscarPorChamado = async (idChamado) => {
  const response = await api.get(
    `/deslocamentos/chamado/${idChamado}`
  )

  return response.data
}

const iniciar = async (dados) => {
  const response = await api.post(
    '/deslocamentos',
    dados
  )

  return response.data
}

const finalizar = async (
  idChamado,
  kmRetorno
) => {
  const response = await api.patch(
    `/deslocamentos/chamado/${idChamado}/finalizar`,
    {
      km_retorno: kmRetorno
    }
  )

  return response.data
}

export default {
  buscarPorChamado,
  iniciar,
  finalizar
}