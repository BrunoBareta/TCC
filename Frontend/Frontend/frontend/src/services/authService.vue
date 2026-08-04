import { api } from 'src/boot/axios'

export async function login(email, senha) {
  const response = await api.post('/login', {
    email,
    senha
  })

  return response.data
}