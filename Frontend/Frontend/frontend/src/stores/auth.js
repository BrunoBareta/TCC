import { defineStore } from 'pinia'
import authService from 'src/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: authService.getUsuarioLogado()
  }),

  getters: {
    estaLogado: (state) => !!state.usuario,

    tipoUsuario: (state) => state.usuario?.tipo_usuario || null,

    nomeUsuario: (state) => state.usuario?.nome || ''
  },

  actions: {
    async login(email, senha) {
      const response = await authService.login(email, senha)

      this.usuario = response.usuario

      authService.salvarUsuario(response.usuario)

      return response
    },

    logout() {
      this.usuario = null

      authService.logout()
    }
  }
})