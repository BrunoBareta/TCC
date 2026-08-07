const express = require('express')
const router = express.Router()

const chamadoFuncionarioController = require(
  '../controllers/chamadoFuncionarioController'
)

router.post(
  '/chamado/:idChamado/aceitar',
  chamadoFuncionarioController.aceitarChamado
)

router.patch(
  '/chamado/:idChamado/funcionario/:idFuncionario/desistir',
  chamadoFuncionarioController.desistirChamado
)

router.post(
  '/chamado/:idChamado',
  chamadoFuncionarioController.adicionarFuncionario
)

router.get(
  '/chamado/:idChamado/total',
  chamadoFuncionarioController.contarPorChamado
)

router.get(
  '/chamado/:idChamado',
  chamadoFuncionarioController.listarPorChamado
)

router.get(
  '/funcionario/:idFuncionario',
  chamadoFuncionarioController.listarPorFuncionario
)

module.exports = router