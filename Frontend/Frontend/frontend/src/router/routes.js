const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue')
      }
    ]
  },

  // ==========================
  // PRODUTOR
  // ==========================
  {
    path: '/produtor',
    component: () => import('layouts/ProdutorLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: ['PRODUTOR']
    },
    children: [
      {
        path: 'dashboard',
        name: 'produtor-dashboard',
        component: () => import('pages/produtor/DashboardPage.vue')
      },
      {
        path: 'chamados',
        name: 'produtor-chamados',
        component: () => import('pages/produtor/ChamadosPage.vue')
      },
      {
        path: 'chamados/:id',
        name: 'produtor-detalhes-chamado',
        component: () => import('pages/produtor/DetalhesChamadoPage.vue')
      },
      {
        path: 'relatorios',
        name: 'produtor-relatorios',
        component: () => import('pages/produtor/RelatoriosPage.vue')
      },
      {
        path: 'perfil',
        name: 'produtor-perfil',
        component: () => import('pages/produtor/PerfilPage.vue')
      },
      {
        path: 'novo-chamado',
        name: 'produtor-novo-chamado',
        component: () => import('pages/produtor/NovoChamadoPage.vue')
      }
    ]
  },

  // ==========================
  // TÉCNICO
  // ==========================
  {
    path: '/tecnico',
    component: () => import('layouts/TecnicoLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: ['FUNCIONARIO']
    },
    children: [
      {
        path: '',
        redirect: '/tecnico/dashboard'
      },
      {
        path: 'dashboard',
        name: 'tecnico-dashboard',
        component: () =>
          import('pages/tecnico/DashboardTecnicoPage.vue')
      },
      {
        path: 'chamados-pendentes',
        name: 'tecnico-pendentes',
        component: () =>
          import('pages/tecnico/ChamadosPendentesPage.vue')
      },
      {
        path: 'meus-chamados',
        name: 'tecnico-meus-chamados',
        component: () =>
          import('pages/tecnico/MeusChamadosPage.vue')
      },
      {
        path: 'chamados/:id',
        name: 'tecnico-detalhes-chamado',
        component: () =>
          import('pages/tecnico/DetalhesChamadoTecnicoPage.vue')
      },
      {
        path: 'atendimento',
        name: 'tecnico-atendimento',
        component: () =>
          import('pages/tecnico/AtendimentoPage.vue')
      },
      {
        path: 'atendimento/:id',
        name: 'tecnico-atendimento-detalhes',
        component: () =>
          import('pages/tecnico/AtendimentoPage.vue')
      }
    ]
  },

  // ==========================
  // 404
  // ==========================
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes