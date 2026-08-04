import { api } from 'src/boot/axios'

const login = async (email, senha) => {
  const response = await api.post('/login', {
    email,
    senha
  })

  return response.data
}

const logout = () => {
  localStorage.removeItem('usuario')
}

const getUsuarioLogado = () => {
  const usuario = localStorage.getItem('usuario')

  if (!usuario) {
    return null
  }

  try {
    return JSON.parse(usuario)
  } catch {
    localStorage.removeItem('usuario')
    return null
  }
}

const salvarUsuario = (usuario) => {
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export default {
  login,
  logout,
  getUsuarioLogado,
  salvarUsuario
}