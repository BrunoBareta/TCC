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
        path: 'relatorios',
        name: 'produtor-relatorios',
        component: () => import('pages/produtor/RelatoriosPage.vue')
      },
      {
        path: 'perfil',
        name: 'produtor-perfil',
        component: () => import('pages/produtor/PerfilPage.vue')
      }
    ]
  },

  {
    path: '/tecnico',
    component: () => import('layouts/TecnicoLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: ['FUNCIONARIO', 'TECNICO']
    },
    children: [
      {
        path: 'dashboard',
        name: 'tecnico-dashboard',
        component: () => import('pages/tecnico/DashboardPage.vue')
      },
      {
        path: 'fila',
        name: 'tecnico-fila',
        component: () => import('pages/tecnico/FilaChamadosPage.vue')
      },
      {
        path: 'atendimento',
        name: 'tecnico-atendimento',
        component: () => import('pages/tecnico/AtendimentoPage.vue')
      },
      {
        path: 'produtores',
        name: 'tecnico-produtores',
        component: () => import('pages/tecnico/ProdutoresPage.vue')
      },
      {
        path: 'relatorios',
        name: 'tecnico-relatorios',
        component: () => import('pages/tecnico/RelatoriosPage.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes