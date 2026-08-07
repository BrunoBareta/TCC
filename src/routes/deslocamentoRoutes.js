const express = require('express')
const router = express.Router()

const deslocamentoController = require(
  '../controllers/deslocamentoController'
)

router.get(
  '/',
  deslocamentoController.listar
)

router.get(
  '/chamado/:idChamado',
  deslocamentoController.buscarPorChamado
)

router.post(
  '/',
  deslocamentoController.criar
)

router.patch(
  '/chamado/:idChamado/finalizar',
  deslocamentoController.finalizar
)

router.get(
  '/:id',
  deslocamentoController.buscarPorId
)

router.put(
  '/:id',
  deslocamentoController.atualizar
)

router.delete(
  '/:id',
  deslocamentoController.deletar
)

module.exports = router