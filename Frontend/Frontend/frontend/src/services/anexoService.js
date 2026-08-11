import { api } from 'src/boot/axios'

const enviar = async (
  idChamado,
  arquivos
) => {
  const formData = new FormData()

  arquivos.forEach((arquivo) => {
    formData.append(
      'arquivos',
      arquivo
    )
  })

  const response = await api.post(
    `/anexos/chamado/${idChamado}`,
    formData
  )

  return response.data
}

const listarPorChamado = async (
  idChamado
) => {
  const response = await api.get(
    `/anexos/chamado/${idChamado}`
  )

  return response.data
}

const remover = async (
  idAnexo
) => {
  const response = await api.delete(
    `/anexos/${idAnexo}`
  )

  return response.data
}

export default {
  enviar,
  listarPorChamado,
  remover
}