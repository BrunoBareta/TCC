/* =========================
   NORMALIZAR PERFIL
========================= */

function normalizarTipoUsuario(
  tipoUsuario
) {
  const tipo =
    String(
      tipoUsuario || ''
    )
      .trim()
      .toUpperCase()

  /*
    Mantemos compatibilidade
    caso em algum lugar antigo
    tenha sido usado ADMIN.
  */

  if (tipo === 'ADMIN') {
    return 'ADMINISTRADOR'
  }

  return tipo
}

/* =========================
   REDIRECIONAMENTO POR PERFIL
========================= */

export function redirecionarPorPerfil(
  tipoUsuario
) {
  const tipo =
    normalizarTipoUsuario(
      tipoUsuario
    )

  switch (tipo) {
    case 'PRODUTOR':
      return {
        name: 'produtor-dashboard'
      }

    case 'FUNCIONARIO':
      return {
        name: 'tecnico-dashboard'
      }

    case 'ADMINISTRADOR':
      return {
        name: 'admin-dashboard'
      }

    default:
      return {
        name: 'login'
      }
  }
}

/* =========================
   VERIFICAR PERMISSÃO
========================= */

export function usuarioTemPermissao(
  tipoUsuario,
  rolesPermitidas = []
) {
  const tipo =
    normalizarTipoUsuario(
      tipoUsuario
    )

  if (
    !Array.isArray(
      rolesPermitidas
    ) ||
    rolesPermitidas.length === 0
  ) {
    return true
  }

  const rolesNormalizadas =
    rolesPermitidas.map(
      (role) =>
        normalizarTipoUsuario(
          role
        )
    )

  return rolesNormalizadas.includes(
    tipo
  )
}

/* =========================
   BUSCAR USUÁRIO SALVO
========================= */

function buscarUsuarioSalvo() {
  try {
    const usuarioSalvo =
      localStorage.getItem(
        'usuario'
      )

    if (!usuarioSalvo) {
      return null
    }

    return JSON.parse(
      usuarioSalvo
    )
  } catch (error) {
    console.error(
      'Erro ao recuperar usuário salvo:',
      error
    )

    localStorage.removeItem(
      'usuario'
    )

    return null
  }
}

/* =========================
   CONFIGURAR PROTEÇÃO
   DAS ROTAS
========================= */

export function configurarProtecaoDeRotas(
  router
) {
  router.beforeEach(
    (to) => {
      const usuario =
        buscarUsuarioSalvo()

      const requiresAuth =
        to.matched.some(
          (rota) =>
            rota.meta?.requiresAuth ===
            true
        )

      /* =========================
         ROTA PÚBLICA
      ========================== */

      if (!requiresAuth) {
        return true
      }

      /* =========================
         NÃO ESTÁ LOGADO
      ========================== */

      if (!usuario) {
        return {
          name: 'login'
        }
      }

      /* =========================
         ROLES PERMITIDAS
      ========================== */

      const rolesPermitidas =
        to.matched.flatMap(
          (rota) => {
            if (
              Array.isArray(
                rota.meta?.roles
              )
            ) {
              return rota.meta.roles
            }

            return []
          }
        )

      /* =========================
         SEM RESTRIÇÃO DE PERFIL
      ========================== */

      if (
        rolesPermitidas.length ===
        0
      ) {
        return true
      }

      /* =========================
         VERIFICAR PERFIL
      ========================== */

      const permitido =
        usuarioTemPermissao(
          usuario.tipo_usuario,
          rolesPermitidas
        )

      if (permitido) {
        return true
      }

      /* =========================
         NÃO AUTORIZADO
      ========================== */

      const destino =
        redirecionarPorPerfil(
          usuario.tipo_usuario
        )

      /*
        Segurança contra loop:
        nunca redireciona uma rota
        para ela mesma.
      */

      if (
        destino.name ===
        to.name
      ) {
        console.warn(
          'Redirecionamento bloqueado para evitar loop.',
          {
            rota:
              to.name,

            tipo_usuario:
              usuario.tipo_usuario,

            roles:
              rolesPermitidas
          }
        )

        return {
          name: 'login'
        }
      }

      return destino
    }
  )
}