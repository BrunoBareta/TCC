import { api } from 'src/boot/axios'

/* =====================================================
   USUÁRIO LOGADO
===================================================== */

function obterUsuarioLogado() {
  const chaves = [
    'usuario',
    'user',
    'authUser'
  ]

  for (const chave of chaves) {
    try {
      const valor =
        localStorage.getItem(chave)

      if (!valor) {
        continue
      }

      const usuario =
        JSON.parse(valor)

      if (usuario) {
        return usuario
      }
    } catch {
      // Continua procurando
    }
  }

  return null
}

/* =====================================================
   LISTAR
===================================================== */

const listar = async () => {
  const usuario =
    obterUsuarioLogado()

  const tipoUsuario =
    String(
      usuario?.tipo_usuario ||
      usuario?.tipoUsuario ||
      usuario?.role ||
      ''
    )
      .trim()
      .toUpperCase()

  const idUsuario =
    Number(
      usuario?.id_usuario ||
      usuario?.idUsuario ||
      usuario?.id
    )

  /*
    PRODUTOR:
    envia o id_usuario para o backend.

    ADMIN / TÉCNICO:
    continua usando /chamados normalmente.
  */

  if (
    tipoUsuario === 'PRODUTOR' &&
    Number.isInteger(idUsuario) &&
    idUsuario > 0
  ) {
    const response =
      await api.get(
        '/chamados',
        {
          params: {
            id_usuario:
              idUsuario
          }
        }
      )

    return response.data
  }

  const response =
    await api.get('/chamados')

  return response.data
}

/* =====================================================
   LISTAR DIRETAMENTE POR PRODUTOR
===================================================== */

const listarPorUsuario = async (
  idUsuario
) => {
  const response =
    await api.get(
      '/chamados',
      {
        params: {
          id_usuario:
            idUsuario
        }
      }
    )

  return response.data
}

/* =====================================================
   BUSCAR POR ID
===================================================== */

const buscarPorId = async (
  id
) => {
  const response =
    await api.get(
      `/chamados/${id}`
    )

  return response.data
}

/* =====================================================
   CRIAR
===================================================== */

const criar = async (
  dados
) => {
  const response =
    await api.post(
      '/chamados',
      dados
    )

  return response.data
}

/* =====================================================
   ATUALIZAR
===================================================== */

const atualizar = async (
  idChamado,
  dados
) => {
  const response =
    await api.put(
      `/chamados/${idChamado}`,
      dados
    )

  return response.data
}

/* =====================================================
   STATUS
===================================================== */

const atualizarStatus = async (
  idChamado,
  dados
) => {
  const response =
    await api.patch(
      `/chamados/${idChamado}/status`,
      dados
    )

  return response.data
}

/* =====================================================
   CANCELAR
===================================================== */

const cancelar = async (
  idChamado
) => {
  const response =
    await api.delete(
      `/chamados/${idChamado}`
    )

  return response.data
}

export default {
  listar,
  listarPorUsuario,
  buscarPorId,
  criar,
  atualizar,
  atualizarStatus,
  cancelar
}