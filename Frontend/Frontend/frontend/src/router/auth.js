import { useAuthStore } from 'src/stores/auth'

export function configurarProtecaoDeRotas(router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    const precisaLogin = to.meta.requiresAuth === true
    const perfisPermitidos = to.meta.roles || []

    if (precisaLogin && !auth.estaLogado) {
      return {
        path: '/',
        query: {
          redirect: to.fullPath
        }
      }
    }

    if (
      precisaLogin &&
      perfisPermitidos.length > 0 &&
      !perfisPermitidos.includes(auth.tipoUsuario)
    ) {
      return redirecionarPorPerfil(auth.tipoUsuario)
    }

    if (to.path === '/' && auth.estaLogado) {
      return redirecionarPorPerfil(auth.tipoUsuario)
    }

    return true
  })
}

export function redirecionarPorPerfil(tipoUsuario) {
  switch (tipoUsuario) {
    case 'PRODUTOR':
      return '/produtor/dashboard'

    case 'FUNCIONARIO':
    case 'TECNICO':
      return '/tecnico/dashboard'

    case 'ADMINISTRADOR':
    case 'ADMIN':
      return '/tecnico/dashboard'

    default:
      return '/'
  }
}