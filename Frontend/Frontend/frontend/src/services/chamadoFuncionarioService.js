import { api } from 'src/boot/axios'

const aceitar = async (
  idChamado,
  idFuncionario
) => {
  const response = await api.post(
    `/chamado-funcionarios/chamado/${idChamado}/aceitar`,
    {
      id_funcionario: idFuncionario
    }
  )

  return response.data
}

const desistir = async (
  idChamado,
  idFuncionario
) => {
  const response = await api.patch(
    `/chamado-funcionarios/chamado/${idChamado}/funcionario/${idFuncionario}/desistir`
  )

  return response.data
}

const listarPorChamado = async (idChamado) => {
  const response = await api.get(
    `/chamado-funcionarios/chamado/${idChamado}`
  )

  return response.data
}

const listarPorFuncionario = async (
  idFuncionario
) => {
  const response = await api.get(
    `/chamado-funcionarios/funcionario/${idFuncionario}`
  )

  return response.data
}

export default {
  aceitar,
  desistir,
  listarPorChamado,
  listarPorFuncionario
}