const express = require(
  'express'
)

const router =
  express.Router()

const usuarioController = require(
  '../controllers/usuarioController'
)

const redefinicaoSenhaController = require(
  '../controllers/redefinicaoSenhaController'
)

/* =========================
   USUÁRIOS
========================= */

/*
  Listar todos os usuários
*/
router.get(
  '/usuarios',
  usuarioController.listar
)

/*
  Cadastro específico de técnico.

  Esta rota será usada somente
  pelo Painel Administrativo.
*/
router.post(
  '/usuarios/funcionarios',
  usuarioController.criarFuncionario
)

/*
  Buscar usuário por ID
*/
router.get(
  '/usuarios/:id',
  usuarioController.buscarPorId
)

/*
  Cadastro público.

  Este endpoint continua criando
  somente PRODUTOR.
*/
router.post(
  '/usuarios',
  usuarioController.criar
)

/*
  Atualizar usuário
*/
router.put(
  '/usuarios/:id',
  usuarioController.atualizar
)

/*
  Desativar usuário
*/
router.delete(
  '/usuarios/:id',
  usuarioController.deletar
)

/* =========================
   LOGIN
========================= */

router.post(
  '/login',
  usuarioController.login
)

/* =========================
   REDEFINIÇÃO DE SENHA
========================= */

router.post(
  '/senha/solicitar',
  redefinicaoSenhaController
    .solicitarCodigo
)

router.post(
  '/senha/verificar',
  redefinicaoSenhaController
    .verificarCodigo
)

router.post(
  '/senha/redefinir',
  redefinicaoSenhaController
    .redefinirSenha
)

module.exports =
  router