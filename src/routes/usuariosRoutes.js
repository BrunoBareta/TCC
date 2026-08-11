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

router.get(
  '/usuarios',
  usuarioController.listar
)

router.get(
  '/usuarios/:id',
  usuarioController.buscarPorId
)

router.post(
  '/usuarios',
  usuarioController.criar
)

router.put(
  '/usuarios/:id',
  usuarioController.atualizar
)

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